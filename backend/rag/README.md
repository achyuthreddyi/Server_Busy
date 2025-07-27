# RAG Application Backend

A simple RAG (Retrieval-Augmented Generation) application using Google Gemini AI, Firestore, and Unstructured.io for PDF processing.

## 🚀 Core Features

### 1. PDF Ingestion
- Process PDF files using Unstructured.io
- Create document chunks (3000 chars, 300 overlap)
- Generate hybrid embeddings (dense + sparse)
- Store in Firestore with metadata

### 2. Intelligent Querying
- Agentic workflow for retrieval decisions
- Hybrid search (dense + sparse embeddings)
- Query specific files or search all files
- Context-aware responses

## 📁 Project Structure

```
backend/
├── README.md                    # This file
├── requirements.txt             # Python dependencies
├── models.py                    # Data models and schemas
├── firebase_gemini_init.py     # Firebase and Gemini initialization
├── document_processor.py        # PDF processing with Unstructured.io
├── hybrid_vector_store.py       # Hybrid vector search implementation
├── agentic_workflow.py          # Agentic RAG workflow
├── server.py                    # FastAPI server
├── start_server.py              # Server startup script
├── client_example.py            # Example client usage
├── ingest_pdfs.py               # Batch PDF ingestion script
├── simple_ingest.py             # Simple single PDF ingestion
├── simple_query.py              # Simple query script
├── setup_auth.py                # Google Cloud authentication setup
├── SETUP_GUIDE.md               # Manual setup guide
└── pdf/                         # PDF files directory
    └── kehb101.pdf             # English chapter file
```

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set Up Authentication
```bash
python3 setup_auth.py
```

### 3. Ingest a PDF
```bash
python3 simple_ingest.py
```

### 4. Query the PDF
```bash
# Query specific file
python3 simple_query.py YOUR_FILE_ID

# Query all files
python3 simple_query.py
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file:
```
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
```

### Google Cloud Setup
- Enable Firestore API
- Enable Vertex AI API
- Create service account with appropriate permissions
- Download service account key

## 📊 API Endpoints

### FastAPI Server
```bash
python3 start_server.py
```

Available endpoints:
- `POST /upload-pdf` - Upload and process PDF
- `POST /chat/completion` - Chat with RAG system
- `GET /files/{file_id}/chunks` - Get file chunks
- `DELETE /files/{file_id}` - Delete file

## 🧪 Testing

### Simple Test Scripts
- `simple_ingest.py` - Test PDF ingestion
- `simple_query.py` - Test querying

### Example Usage
```bash
# Ingest PDF
python3 simple_ingest.py

# Query with file ID
python3 simple_query.py abc123-def456

# Query all files
python3 simple_query.py

# Custom question
python3 simple_query.py --question "What happened to King Tut?"
```

## 🔍 Features

### Hybrid Search
- **Dense Embeddings**: Gemini embedding-001 model
- **Sparse Embeddings**: TF-IDF with BM25
- **Combined Scoring**: Weighted hybrid approach

### Agentic Workflow
- Intelligent retrieval decisions
- Context-aware responses
- Metadata tracking

### PDF Processing
- Unstructured.io for text extraction
- Automatic chunking (3000 chars, 300 overlap)
- Metadata preservation

## 🚨 Troubleshooting

### Common Issues
1. **Authentication**: Ensure service account key is properly set
2. **Dependencies**: Install all requirements
3. **Firestore**: Enable Firestore API in Google Cloud
4. **PDF Processing**: Ensure PDF files are readable

### Debug Mode
Use the simple scripts for debugging:
```bash
python3 simple_ingest.py  # Test ingestion
python3 simple_query.py   # Test querying
```

## 📈 Performance

- **Chunking**: 3000 characters with 300 overlap
- **Embeddings**: 768-dimensional dense vectors
- **Search**: Hybrid scoring with configurable weights
- **Storage**: Firestore for scalable document storage

## 🔒 Security

- Service account authentication
- Environment variable configuration
- No hardcoded credentials
- Secure API endpoints

## 📝 License

This project is for educational and research purposes. 