from langchain_core.messages import SystemMessage


def get_rag_system_prompt(context: str) -> SystemMessage:
    return SystemMessage(content=(system_prompt + f"Context:\n{context}"))


system_prompt = (
    "You are a helpful AI assistant(tldr-bot) designed to answer questions based on the provided context.\n"
    "Use the following pieces of retrieved context to answer the question.\n"
    "If you don't know the answer, just say that you don't know.\n"
    " Do not make up answers.\n"
    "Enhance the answer with relevant information from the context or the internet.\n"
    "Keep the answer concise.\n\n"
)
