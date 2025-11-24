# Agentic conversational RAG
from logging import Logger
from langgraph.graph import MessagesState, StateGraph
from langchain_core.tools import tool
from langchain_core.messages import BaseMessage
from langgraph.graph.state import RunnableConfig
from langgraph.prebuilt import ToolNode
from services.vector_db import VectorDB
from langchain.chat_models import init_chat_model
from .prompts import get_rag_system_prompt

from langgraph.graph import END
from langgraph.prebuilt import tools_condition
from langgraph.checkpoint.memory import MemorySaver


vector_store = VectorDB()
logger = Logger("executor_logger")
llm = init_chat_model("gemini-2.5-flash", model_provider="google_genai")


@tool(response_format="content_and_artifact")
async def retrieve(query: str, config: RunnableConfig):
    """Retrieve information related to query."""

    folder_id = config.get("configurable", {}).get("folder_id")
    filter_metadata = {"folder_id": folder_id} if folder_id else None
    retrieved_docs = await vector_store.query(query, filter_metadata, top_k=5)
    serialized_chunks = []
    for idx, doc in enumerate(retrieved_docs, start=1):
        header = f"> Document {str(idx) + ' ' + doc.metadata.get('source', 'Unknown Source')}\n"
        serialized_chunks.append(header + doc.page_content + "\n")

    logger.info(f"Retrieved {len(retrieved_docs)} documents for query: {query}")

    serialized = "\n\n".join(serialized_chunks)
    return serialized, retrieved_docs


def query_or_respond(state: MessagesState):
    """Generate tool-call for retrieve or respond directly."""
    llm_with_tools = llm.bind_tools([retrieve])
    res = llm_with_tools.invoke(state["messages"])
    return {"messages": [res]}


tools = ToolNode([retrieve])


async def generate(state: MessagesState):
    """Generate answer to the question."""
    # Get generated ToolMessages
    recent_tool_messages = []
    for message in reversed(state["messages"]):
        if message.type == "tool":
            recent_tool_messages.append(message)
        else:
            break
    tool_messages = recent_tool_messages[::-1]

    # Format into prompt
    docs_content = "\n\n".join(doc.content for doc in tool_messages)
    system_message_content = get_rag_system_prompt(docs_content)

    conversation_messages: list[BaseMessage] = [
        (message)
        for message in state["messages"]
        if message.type in ("human", "system")
        or (message.type == "ai" and not message.tool_calls)
    ]

    prompt: list[BaseMessage] = [system_message_content] + conversation_messages

    # Run
    response = await llm.ainvoke(prompt)
    return {"messages": [response]}


agent_builder = StateGraph(MessagesState)

agent_builder.add_node(query_or_respond).add_node(tools).add_node(generate)
agent_builder.set_entry_point("query_or_respond")
agent_builder.add_conditional_edges(
    "query_or_respond",
    tools_condition,
    {
        "tools": "tools",
        END: END,
    },
)
agent_builder.add_edge("tools", "generate").add_edge("generate", END)

memory = MemorySaver()

agent = agent_builder.compile(checkpointer=memory)
