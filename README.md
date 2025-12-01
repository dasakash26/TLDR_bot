# Recap: Agentic RAG Chat System

An intelligent, retrieval-augmented conversational AI system designed to answer questions from uploaded documents. Built with FastAPI, LangGraph, and ChromaDB, Recap provides folder-based document organization, semantic search, and streaming chat responses powered by Google's Gemini 2.5 Flash.

## Features

### Authentication & User Management

The system implements a complete authentication flow with OTP-based email verification. Users can sign up with email and password, verify their accounts via one-time passwords, and authenticate using JWT tokens. All endpoints include rate limiting to prevent abuse, and passwords are securely hashed using bcrypt.

### Folder & Collaboration Management

Users can create folders to organize their documents and invite collaborators to work together. The system enforces permission-based access control, ensuring users can only access folders they own or have been invited to. Folders support multi-user collaboration with granular permission checks on all operations.

### Document Upload & Processing

The file upload system accepts multiple documents and processes them asynchronously in the background. Documents are automatically chunked using recursive character splitting, embedded with HuggingFace models, and stored in a vector database. The system tracks processing status through states (PENDING, PROCESSING, COMPLETED, FAILED) and maintains chunk-level metadata for precise retrieval.

### Conversational AI (RAG)

The core of the system is a LangGraph-based agent that orchestrates retrieval and generation. The agent architecture includes three main components:

- **query_or_respond** node: Analyzes user queries to determine if document retrieval is needed
- **retrieve** tool: Performs semantic search across stored documents with folder-based filtering
- **generate** node: Creates context-aware responses using retrieved information

Conversations are streamed to clients using Server-Sent Events (SSE), providing real-time response updates. The system maintains conversation memory using LangGraph's built-in checkpointing mechanism and persists all messages to PostgreSQL for history.

### Thread Management

Users can create conversation threads within folders to organize different topics or questions. Each thread maintains its own message history and can be renamed or deleted. The system enforces permission checks to ensure only authorized users can access or modify threads.

### Database & Persistence

All data is persisted to PostgreSQL through Prisma ORM, which provides type-safe database access and automated migrations. The schema includes models for users, folders, files, file chunks, threads, and messages, with appropriate foreign key relationships and cascade behaviors.

## Architecture

The system follows a layered architecture separating concerns between API routes, business logic services, and data access:

- FastAPI handles HTTP requests and response formatting
- Route handlers validate input and enforce authentication
- Service layer manages business logic and database operations
- LangGraph agent orchestrates AI operations
- ChromaDB provides vector similarity search
- Prisma ORM handles database persistence

Data flows from user uploads through the ingestion pipeline into vector storage, then back out through the retrieval system during chat interactions. The agent layer sits between the API and the AI components, managing tool calls and response generation.

## Project Structure

```
Recap/
├── backend/
│   ├── main.py                      # FastAPI application entry point
│   ├── pyproject.toml              # Python dependencies and project metadata
│   │
│   ├── routes/                     # HTTP endpoint handlers
│   │   ├── user_routes.py         # Authentication endpoints
│   │   ├── folder_routes.py       # Folder management endpoints
│   │   ├── file_routes.py         # File upload and status endpoints
│   │   └── thread_routes.py       # Chat thread and messaging endpoints
│   │
│   ├── agent/                      # LangGraph RAG agent implementation
│   │   ├── executor.py            # Agent graph definition and nodes
│   │   └── prompts.py             # System prompt templates
│   │
│   ├── services/                   # Business logic services
│   │   ├── db_service.py          # Database client singleton
│   │   └── vector_db.py           # Vector database wrapper
│   │
│   ├── tools/                      # Shared utilities
│   │   ├── auth.py                # JWT and password utilities
│   │   ├── otp_gen.py             # OTP generation logic
│   │   └── rag_tool.py            # RAG helper functions
│   │
│   ├── data_pipeline/              # Document processing pipeline
│   │   ├── ingest.py              # Document chunking and embedding
│   │   ├── retrieval.py           # Search utilities
│   │   ├── chroma_db/             # Vector store persistence directory
│   │   ├── sources/               # Source document storage
│   │   └── temp/                  # Temporary upload staging
│   │
│   ├── prisma/                     # Database schema and migrations
│   │   ├── schema.prisma          # Data model definitions
│   │   └── migrations/            # Version-controlled schema changes
│   │
│   └── generated/                  # Auto-generated Prisma client code
│
├── frontend/                   # Next.js Frontend application
│   ├── app/                   # App router pages
│   ├── components/            # React components
│   ├── lib/                   # Utility functions
│   └── types/                 # TypeScript definitions
│
├── core/
│   └── RAG.ipynb                   # Research and prototyping notebook
│
└── README.md
```

## Technology Stack

**Backend Framework:** FastAPI with Python 3.12+  
**AI/ML:** LangGraph for agent orchestration, LangChain for RAG components, Google Gemini 2.5 Flash for generation  
**Embeddings:** HuggingFace Sentence Transformers (all-MiniLM-L6-v2)  
**Vector Database:** ChromaDB with local persistence  
**Primary Database:** PostgreSQL with Prisma ORM  
**Authentication:** JWT tokens via python-jose, bcrypt for password hashing  
**Rate Limiting:** SlowAPI middleware  
**Document Processing:** Unstructured library with LangChain text splitters

## Installation

### Requirements

- Python 3.12 or higher
- PostgreSQL database instance
- Google AI API key for Gemini access

### Setup Steps

Clone the repository and navigate to the backend directory:

```bash
git clone https://github.com/dasakash26/Recap.git
cd Recap/backend
```

Install dependencies using uv or pip:

```bash
uv sync
```

Create a `.env` file in the backend directory with the following variables:

```
DATABASE_URL=postgresql://user:password@localhost:5432/recap
SECRET_KEY=your-secret-key-here
GOOGLE_API_KEY=your-gemini-api-key
```

Generate the Prisma client and run migrations:

```bash
uv run prisma generate
uv run prisma migrate deploy
```

Start the development server:

```bash
uv run uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`. Documentation is accessible at `http://127.0.0.1:8000/docs`.

## API Reference

### User Endpoints

**POST /user/signup**  
Create a new user account. Requires email and password. Sends verification OTP to email.

**POST /user/verify**  
Verify email address using OTP sent during signup.

**POST /user/login**  
Authenticate and receive JWT access token. Requires verified email.

**GET /user/me**  
Retrieve current authenticated user information.

**POST /user/logout**  
Invalidate current session token.

### Folder Endpoints

**POST /folder**  
Create a new document folder.

**GET /folder**  
List all folders accessible to current user (owned or shared).

**POST /folder/{folder_id}/add_user**  
Add a collaborator to folder by email.

**DELETE /folder/{folder_id}**  
Delete folder and all associated files and threads.

**GET /folder/{folder_id}/files**  
List all files uploaded to the folder.

### File Endpoints

**POST /file/upload**  
Upload one or more files to a folder. Initiates background processing.

**GET /file/status/{file_id}**  
Check processing status of an uploaded file.

### Thread Endpoints

**POST /thread**  
Create a new conversation thread in a folder.

**GET /thread/all**  
List all threads in a specified folder.

**GET /thread/{thread_id}**  
Retrieve thread details including full message history.

**PUT /thread/{thread_id}**  
Update thread name.

**DELETE /thread/{thread_id}**  
Delete thread and all associated messages.

**POST /thread/{thread_id}/chat**  
Send a message and receive streaming AI response via Server-Sent Events.

## How It Works

### Document Ingestion

When a user uploads a file, the system saves it to temporary storage and creates a database record with PENDING status. A background task then:

1. Loads the document using the Unstructured library
2. Splits content into chunks (1000 characters with 200 character overlap)
3. Generates embeddings using the HuggingFace model
4. Stores vectors in ChromaDB with folder_id metadata
5. Creates FileChunk records linking chunks to the file
6. Updates file status to COMPLETED

This allows users to immediately continue working while documents process in the background.

### Chat Interaction

When a user sends a message to a thread, the system saves it to the database and invokes the LangGraph agent. The agent follows this flow:

1. **Query Analysis:** The query_or_respond node examines the message to determine if retrieval is needed
2. **Document Retrieval:** If retrieval is triggered, the retrieve tool searches ChromaDB for relevant chunks, filtered to the folder scope
3. **Response Generation:** The generate node combines retrieved context with conversation history to produce a response
4. **Streaming:** Response chunks are streamed to the client via SSE as they are generated
5. **Persistence:** The complete AI response is saved to the database once generation completes

### Memory and Context

The system maintains conversation state through two mechanisms:

- **Short-term memory:** LangGraph's MemorySaver checkpointer keeps the last several conversation turns in memory for context
- **Long-term persistence:** All messages are stored in PostgreSQL, allowing full conversation history retrieval

Retrieval operations are scoped to the folder containing the thread, ensuring users only access documents they have permission to view.

## Development Roadmap

### Completed Features

- User authentication with OTP verification
- Folder-based document organization with collaboration
- Asynchronous file upload and processing pipeline
- Vector database integration with ChromaDB
- LangGraph agent with conditional retrieval
- Server-Sent Events streaming for real-time chat
- Thread and message persistence
- Folder-scoped semantic search
- Conversation memory and history

### Upcoming Features

**Phase 1: Frontend Development**

- [x] Set up Next.js project structure with TypeScript
- [x] Implement authentication UI (login, signup, verification)
- [ ] Build folder management dashboard
- [ ] Create file upload interface with drag-and-drop
- [x] Design chat interface with message history
- [x] Add real-time SSE integration for streaming responses
- [ ] Implement thread switcher and conversation management
- [ ] Add loading states and error handling
- [x] Responsive design for mobile and desktop

**Phase 2: Enhanced Search & Retrieval**

- [ ] Integrate BM25 for keyword-based search
- [ ] Implement hybrid search scoring mechanism
- [ ] Add cross-encoder reranking for top results
- [x] Build source citation tracking system
- [x] Display document references in chat responses
- [ ] Add relevance score visualization
- [ ] Implement search result highlighting

**Phase 3: Advanced RAG Capabilities**

- [ ] Multi-document summarization endpoint
- [ ] Document comparison and difference analysis
- [ ] Query expansion and reformulation
- [ ] Conversation export (PDF, Markdown, JSON)
- [ ] Custom prompt templates per folder
- [ ] Support for multiple LLM providers
- [ ] Token usage tracking and cost estimation

**Phase 4: Performance & Scalability**

- [ ] Redis integration for embedding cache
- [ ] Implement batch embedding generation
- [ ] Add database connection pooling
- [ ] Optimize chunk retrieval queries
- [ ] Add pagination for large result sets
- [ ] Implement lazy loading for message history
- [ ] Background job queue for file processing

**Phase 5: Observability & Testing**

- [ ] Structured JSON logging with correlation IDs
- [ ] Prometheus metrics endpoints
- [ ] OpenTelemetry tracing integration
- [ ] Unit tests for all route handlers
- [ ] Integration tests for RAG pipeline
- [ ] Load testing with locust or k6
- [ ] Error monitoring with Sentry
- [ ] API documentation with examples

**Phase 6: Production Readiness**

- [ ] Docker multi-stage build configuration
- [ ] Docker Compose for local development
- [ ] Kubernetes deployment manifests
- [ ] Helm charts for easy deployment
- [ ] GitHub Actions CI/CD pipeline
- [ ] Automated database migrations in CI
- [ ] Environment-specific configuration management
- [ ] Health check and readiness probes
- [ ] Backup and disaster recovery procedures

**Future Ideas**

- [ ] Document versioning system
- [ ] Scheduled summary digests via email
- [ ] Webhook notifications for events
- [ ] API rate limiting tiers
- [ ] Team workspaces and organizations
- [ ] SSO integration (Google, GitHub)
- [ ] Mobile app (React Native)
- [ ] Browser extension for quick uploads

## Security

The application implements several security measures:

- JWT-based stateless authentication
- Bcrypt password hashing with cost factor 12
- Request rate limiting on all endpoints
- Permission-based access control for folders and threads
- SQL injection prevention through Prisma's query builder
- Input validation using Pydantic models
- CORS configuration for production deployments

## Contributing

Contributions are welcome. Please open an issue to discuss proposed changes before submitting a pull request. Follow the existing code style and include tests for new functionality.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

**Project Status:** The backend API is production-ready with full RAG chat capabilities. Frontend development is in active progress with core features (Auth, Chat, Citations) implemented.
