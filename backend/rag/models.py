from datetime import datetime
from typing import List, Dict, Optional, Any
from dataclasses import dataclass, field
from enum import Enum
import uuid

class DocumentType(Enum):
    PDF = "pdf"

@dataclass
class DocumentChunk:
    """Represents a chunk of a document with embeddings"""
    id: str
    document_id: str
    content: str
    chunk_index: int
    class_name: str
    subject_name: str
    file_id: str
    dense_embedding: List[float] = field(default_factory=list)
    sparse_embedding: List[float] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.utcnow)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "document_id": self.document_id,
            "content": self.content,
            "chunk_index": self.chunk_index,
            "class_name": self.class_name,
            "subject_name": self.subject_name,
            "file_id": self.file_id,
            "dense_embedding": self.dense_embedding,
            "sparse_embedding": self.sparse_embedding,
            "metadata": self.metadata,
            "created_at": self.created_at.isoformat()
        }

@dataclass
class SearchResult:
    """Represents a search result from the knowledge base"""
    chunk_id: str
    document_id: str
    content: str
    class_name: str
    subject_name: str
    file_id: str
    dense_score: float
    sparse_score: float
    hybrid_score: float
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "chunk_id": self.chunk_id,
            "document_id": self.document_id,
            "content": self.content,
            "class_name": self.class_name,
            "subject_name": self.subject_name,
            "file_id": self.file_id,
            "dense_score": self.dense_score,
            "sparse_score": self.sparse_score,
            "hybrid_score": self.hybrid_score,
            "metadata": self.metadata
        }

@dataclass
class ChatRequest:
    """Request model for chat completion with retrieval"""
    message: str
    user_id: str
    class_name: str
    subject_name: str
    allowed_file_ids: Optional[List[str]] = None
    max_tokens: int = 1000
    temperature: float = 0.7
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "message": self.message,
            "user_id": self.user_id,
            "class_name": self.class_name,
            "subject_name": self.subject_name,
            "allowed_file_ids": self.allowed_file_ids,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature
        }

@dataclass
class ChatResponse:
    """Response model for chat completion"""
    response: str
    retrieved_chunks: List[SearchResult] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "response": self.response,
            "retrieved_chunks": [chunk.to_dict() for chunk in self.retrieved_chunks],
            "metadata": self.metadata
        }

@dataclass
class PDFUploadRequest:
    """Request model for PDF upload and processing"""
    file_content: bytes
    title: str
    class_name: str
    subject_name: str
    user_id: str = "default"
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "title": self.title,
            "class_name": self.class_name,
            "subject_name": self.subject_name,
            "user_id": self.user_id
        }
