# TLDR_bot

Retrieval-augmented chatbot focused on summarizing long-form documents. The repo currently hosts the FastAPI backend, ingestion pipeline, and local Chroma vector store setup.

## Current Capabilities

- OTP-based signup, email verification, login, and session management routes with request rate limiting.
- Folder CRUD flows: creation, listing, collaborator addition, and file listing with access checks.
- File upload endpoint writing to local temp storage, persisting metadata via Prisma, and dispatching background ingestion tasks.
- Asynchronous document ingestion that chunks files, filters metadata, embeds with HuggingFace, and stores vectors in a local Chroma collection through a singleton `VectorDB` service.
- Prisma data models for users, folders, files, chat threads, and messages backed by PostgreSQL.

## Project Layout

- `backend/main.py` starts the FastAPI app, connects Prisma, and mounts user, folder, and file routers.
- `backend/routes/` contains HTTP handlers and request models.
- `backend/data_pipeline/ingest.py` implements the load → split → embed → index workflow.
- `backend/services/vector_db.py` configures the Chroma client and exposes async `add_documents`/`query` helpers.
- `backend/prisma/` holds the Prisma schema and migrations.
- `core/RAG.ipynb` captures LangGraph experiments and prototyping notes.

Uploaded files are written to `backend/data_pipeline/temp/<user-id>` and ingested vectors persist under `backend/data_pipeline/chroma_db`.

## Roadmap

- [x] User authentication and authorization flows with OTP.
- [x] Folder management APIs (create/list/add-user/get-files) with rate limiting.
- [x] File upload + background ingestion with chunking, embedding, and vector storage.
- [x] Singleton async Chroma vector database service with metadata-aware document inserts.
- [X] Retrieval API exposing semantic search over stored chunks.
- [X] Chat route that orchestrates retrieval + LLM generation.
- [ ] LangGraph agent wiring for multi-step reasoning and tool use.
- [X] Conversation memory persisted to `Thread`/`Message` tables.
- [ ] Reranking, BM25/Elastic fallback, and response refinement.
- [ ] Front-end or UI surface for the chatbot experience.

Track open questions and testing gaps in issues or `core/RAG.ipynb` as experiments continue.
