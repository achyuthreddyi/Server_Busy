from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import uuid
from datetime import datetime

from models import ChatRequest, ChatResponse, PDFUploadRequest
from agentic_workflow import AgenticWorkflow

# Initialize FastAPI app
app = FastAPI(
    title="Agentic RAG API",
    description="A simplified RAG API with agentic workflows using Gemini and Document AI",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Agentic Workflow
project_id = os.environ.get("GOOGLE_CLOUD_PROJECT", "your-project-id")
workflow = AgenticWorkflow(project_id)

# Pydantic models for API requests
class ChatRequestModel(BaseModel):
    message: str
    user_id: str
    class_name: str
    subject_name: str
    allowed_file_ids: List[str]
    max_tokens: int = 1000
    temperature: float = 0.7

class PDFUploadResponse(BaseModel):
    file_id: str
    document_id: str
    title: str
    class_name: str
    subject_name: str
    total_chunks: int
    message: str

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "Agentic RAG API with Gemini and Document AI"
    }

# Chat completion endpoint
@app.post("/chat/completion", response_model=Dict[str, Any])
async def chat_completion(request: ChatRequestModel):
    """
    Main chat completion endpoint with agentic retrieval and generation
    """
    try:
        # Convert to internal model
        chat_request = ChatRequest(
            message=request.message,
            user_id=request.user_id,
            class_name=request.class_name,
            subject_name=request.subject_name,
            allowed_file_ids=request.allowed_file_ids,
            max_tokens=request.max_tokens,
            temperature=request.temperature
        )
        
        # Process with agentic workflow
        response = workflow.process_chat_request(chat_request)
        
        return response.to_dict()
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat completion failed: {str(e)}")

# PDF upload endpoint
@app.post("/upload-pdf", response_model=PDFUploadResponse)
async def upload_pdf(
    file: UploadFile = File(...),
    title: str = Form(...),
    class_name: str = Form(...),
    subject_name: str = Form(...),
    user_id: str = Form("default")
):
    """Upload and process a PDF file using Document AI"""
    try:
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
        # Read file content
        file_content = await file.read()
        
        # Process PDF with agentic workflow
        result = workflow.process_pdf_upload(
            file_content=file_content,
            title=title,
            class_name=class_name,
            subject_name=subject_name,
            user_id=user_id
        )
        
        return PDFUploadResponse(
            file_id=result["file_id"],
            document_id=result["document_id"],
            title=result["title"],
            class_name=result["class_name"],
            subject_name=result["subject_name"],
            total_chunks=result["total_chunks"],
            message=result["message"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload and process PDF: {str(e)}")

# Get file chunks endpoint
@app.get("/files/{file_id}/chunks")
async def get_file_chunks(file_id: str):
    """Get all chunks for a specific file"""
    try:
        chunks = workflow.get_file_chunks(file_id)
        return {
            "file_id": file_id,
            "chunks": chunks,
            "total_chunks": len(chunks)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get file chunks: {str(e)}")

# Delete file endpoint
@app.delete("/files/{file_id}")
async def delete_file(file_id: str):
    """Delete all chunks for a specific file"""
    try:
        success = workflow.delete_file(file_id)
        if not success:
            raise HTTPException(status_code=404, detail="File not found")
        
        return {"message": "File deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete file: {str(e)}")

# Get API info
@app.get("/")
async def root():
    """API information"""
    return {
        "service": "Agentic RAG API with Gemini and Document AI",
        "version": "1.0.0",
        "features": [
            "Gemini LLM and Embeddings",
            "Document AI PDF Processing",
            "Hybrid Vector Search (Dense + BM25)",
            "Agentic Workflow with Tool Calling",
            "Class/Subject Filtering"
        ],
        "endpoints": {
            "chat_completion": "/chat/completion",
            "upload_pdf": "/upload-pdf",
            "get_file_chunks": "/files/{file_id}/chunks",
            "delete_file": "/files/{file_id}",
            "health_check": "/health"
        },
        "usage": {
            "chat_completion": {
                "method": "POST",
                "url": "/chat/completion",
                "body": {
                    "message": "What is calculus?",
                    "user_id": "user123",
                    "class_name": "12th Grade",
                    "subject_name": "Mathematics",
                    "allowed_file_ids": ["file-uuid-1", "file-uuid-2"]
                }
            },
            "upload_pdf": {
                "method": "POST",
                "url": "/upload-pdf",
                "form_data": {
                    "file": "PDF file",
                    "title": "Calculus Textbook",
                    "class_name": "12th Grade",
                    "subject_name": "Mathematics",
                    "user_id": "teacher123"
                }
            }
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 