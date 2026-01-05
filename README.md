# Recap

AI-powered document search with citations. Upload documents, chat with AI, get accurate answers backed by your content.

![Recap Demo](frontend/public/recap-demo.png)

## Features

- **Context Isolation**: Organize documents into folders for zero-noise retrieval
- **Cited Answers**: Every response links directly to source content
- **Real-time Collaboration**: Share folders with your team
- **Smart Search**: Vector-powered semantic search with LangGraph agents

## Stack

**Backend:** FastAPI • Python 3.12 • LangGraph • ChromaDB • PostgreSQL • Prisma  
**Frontend:** Next.js 15 • React • TypeScript • Tailwind CSS • shadcn/ui  
**AI:** Google Gemini 2.5 Flash

## How It Works

```
┌─────────────┐
│  1. Upload  │  Documents are chunked and embedded
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  2. Store   │  Embeddings → ChromaDB, Metadata → PostgreSQL
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  3. Query   │  Semantic search retrieves relevant chunks
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 4. Generate │  LangGraph agent + Gemini synthesizes answer
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  5. Stream  │  Response streams via SSE with citations
└─────────────┘
```

## Quick Start

### Backend

```bash
git clone https://github.com/dasakash26/Recap.git
cd recap/backend

# Install dependencies
uv sync

# Setup environment
cp .env.example .env
# Edit .env with your credentials
```

`.env` file:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/recap"
SECRET_KEY="your-secret-key"
GOOGLE_API_KEY="your-gemini-api-key"
```

```bash
# Generate Prisma client and run migrations
uv run prisma generate
uv run prisma migrate deploy

# Start server
uv run uvicorn main:app --reload
```

Backend runs at `http://localhost:8000` • API docs at `/docs`

### Frontend

```bash
cd frontend

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with backend URL
```

`.env.local` file:

```bash
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

```bash
# Start dev server
pnpm dev
```

Frontend runs at `http://localhost:3000`

## API Endpoints

**Auth:**

- `POST /user/signup` - Create account
- `POST /user/verify` - Verify OTP
- `POST /user/login` - Login

**Folders:**

- `GET /folder` - List folders
- `POST /folder` - Create folder
- `PUT /folder/{id}` - Update folder
- `DELETE /folder/{id}` - Delete folder
- `POST /folder/{id}/share` - Add collaborators

**Files:**

- `POST /file/upload` - Upload file
- `GET /file/{id}` - Get file details
- `GET /file/status/{id}` - Check processing status
- `DELETE /file/{id}` - Delete file

**Threads:**

- `GET /thread` - List threads
- `POST /thread` - Create thread
- `GET /thread/{id}` - Get thread details
- `POST /thread/{id}/chat` - Chat (SSE stream)
- `DELETE /thread/{id}` - Delete thread

## License

MIT © 2026 Akash Das
