# Recap

Chat with your documents. Upload PDFs, ask questions, get answers with citations.

## What it does

Upload documents → ask questions → get answers pulled from your actual content. Supports folders for organization and real-time collaboration. Built with FastAPI, LangGraph, and Gemini 2.5 Flash.

## Stack

FastAPI • Python 3.12 • LangGraph • ChromaDB • PostgreSQL • Prisma • Next.js

## Setup

```bash
git clone https://github.com/dasakash26/Recap.git
cd Recap/backend
uv sync
```

Create `.env`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/recap
SECRET_KEY=your-secret-key
GOOGLE_API_KEY=your-gemini-key
```

```bash
uv run prisma generate
uv run prisma migrate deploy
uv run uvicorn main:app --reload
```

Server runs at `localhost:8000`. Docs at `/docs`.

## How it works

```
Upload → chunk → embed → ChromaDB
Query → retrieve relevant chunks → Gemini generates answer → stream via SSE
```

Files process async. Agent decides when to retrieve. Everything persists to Postgres.

## API

**Auth:** `/user/signup`, `/user/verify`, `/user/login`  
**Folders:** `/folder` (CRUD + add collaborators)  
**Files:** `/file/upload`, `/file/status/{id}`  
**Threads:** `/thread` (CRUD), `/thread/{id}/chat` (SSE)

## Status

**Working:** Auth, folders, file uploads, vector search, chat with streaming, citations  
**Building:** Folder UI, file upload UI, thread switcher  
**Next:** Hybrid search, reranking, tests, Docker

MIT License
