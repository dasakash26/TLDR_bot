# Agentic conversational RAG
from logging import Logger
from langgraph.graph import MessagesState
from langchain_core.tools import tool
from langchain_core.messages import BaseMessage
from langgraph.graph.state import RunnableConfig
from langgraph.prebuilt import ToolNode
from services.vector_db import VectorDB
from langchain.chat_models import init_chat_model
from prompts import get_rag_system_prompt

vector_store = VectorDB()
logger = Logger("executor_logger")
llm = init_chat_model("gemini-2.5-flash", model_provider="google_genai")


@tool(response_format="content_and_artifact")
async def retrieve(query: str, config: RunnableConfig):
    """Retrieve information related to query."""

    folder_id = config.get("folder_id")
    retrieved_docs = await vector_store.query(query, {folder_id}, top_k=5)
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


def generate(state: MessagesState):
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
    response = llm.predict_messages(prompt)
    return {"messages": [response]}
