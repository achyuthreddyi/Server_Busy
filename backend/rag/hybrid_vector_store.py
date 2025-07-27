import os
import numpy as np
from typing import List, Dict, Any, Optional
from google.cloud import firestore
import google.generativeai as genai
from models import DocumentChunk, SearchResult
from firebase_gemini_init import initialize_services
from rank_bm25 import BM25Okapi
import uuid
from datetime import datetime
import json

class HybridVectorStore:
    """Hybrid vector store using Gemini embeddings and BM25"""
    
    def __init__(self, project_id: str):
        self.project_id = project_id
        self.db, self.bucket = initialize_services()
        
        # Initialize Gemini for embeddings - use the module directly
        self.embedding_model = None  # We'll use genai.embed_content directly
        
        # Collection names
        self.chunks_collection = "chunks"
        self.embeddings_collection = "embeddings"
        
        # BM25 index for sparse retrieval
        self.bm25_index = None
        self.bm25_documents = []
        self.bm25_document_ids = []
        
    def get_dense_embedding(self, text: str) -> List[float]:
        """Generate dense embedding using Gemini"""
        try:
            # Use genai.embed_content directly
            result = genai.embed_content(
                model="embedding-001",
                content=text,
                task_type="retrieval_document"
            )
            return result['embedding']
        except Exception as e:
            print(f"Error generating dense embedding: {e}")
            return self._simple_embedding(text)
    
    def get_sparse_embedding(self, text: str) -> List[float]:
        """Generate sparse embedding using TF-IDF approach"""
        try:
            # Simple TF-IDF based sparse embedding
            words = text.lower().split()
            word_freq = {}
            for word in words:
                if word.isalnum() and len(word) > 2:  # Filter meaningful words
                    word_freq[word] = word_freq.get(word, 0) + 1
            
            # Create sparse vector (simplified)
            max_features = 1000
            sparse_vector = [0.0] * max_features
            
            # Simple hash-based feature mapping
            for word, freq in word_freq.items():
                hash_val = hash(word) % max_features
                sparse_vector[hash_val] = freq
            
            return sparse_vector
        except Exception as e:
            print(f"Error generating sparse embedding: {e}")
            return [0.0] * 1000
    
    def _simple_embedding(self, text: str) -> List[float]:
        """Simple fallback embedding function"""
        import hashlib
        hash_obj = hashlib.md5(text.encode())
        hash_hex = hash_obj.hexdigest()
        embedding = []
        for i in range(0, len(hash_hex), 2):
            if len(embedding) >= 768:
                break
            embedding.append(float(int(hash_hex[i:i+2], 16)) / 255.0)
        while len(embedding) < 768:
            embedding.append(0.0)
        return embedding[:768]
    
    def store_chunk(self, chunk: DocumentChunk) -> str:
        """Store document chunk with both dense and sparse embeddings"""
        try:
            # Generate embeddings
            chunk.dense_embedding = self.get_dense_embedding(chunk.content)
            chunk.sparse_embedding = self.get_sparse_embedding(chunk.content)
            
            # Store chunk
            chunk_ref = self.db.collection(self.chunks_collection).document(chunk.id)
            chunk_ref.set(chunk.to_dict())
            
            # Store embeddings separately for efficient querying
            embedding_doc = {
                "chunk_id": chunk.id,
                "document_id": chunk.document_id,
                "dense_embedding": chunk.dense_embedding,
                "sparse_embedding": chunk.sparse_embedding,
                "content": chunk.content,
                "class_name": chunk.class_name,
                "subject_name": chunk.subject_name,
                "file_id": chunk.file_id,
                "chunk_index": chunk.chunk_index,
                "metadata": chunk.metadata,
                "user_id": chunk.metadata.get("user_id", "default"),
                "created_at": chunk.created_at.isoformat()
            }
            
            embedding_ref = self.db.collection(self.embeddings_collection).document(chunk.id)
            embedding_ref.set(embedding_doc)
            
            print(f"✅ Stored chunk {chunk.id} with hybrid embeddings")
            return chunk.id
            
        except Exception as e:
            print(f"❌ Error storing chunk: {e}")
            raise
    
    def store_chunks(self, chunks: List[DocumentChunk]) -> List[str]:
        """Store multiple chunks and update BM25 index"""
        try:
            chunk_ids = []
            documents = []
            document_ids = []
            
            for chunk in chunks:
                chunk_id = self.store_chunk(chunk)
                chunk_ids.append(chunk_id)
                
                # Add to BM25 documents
                documents.append(chunk.content)
                document_ids.append(chunk.id)
            
            # Update BM25 index
            self._update_bm25_index(documents, document_ids)
            
            return chunk_ids
            
        except Exception as e:
            print(f"❌ Error storing chunks: {e}")
            raise
    
    def _update_bm25_index(self, documents: List[str], document_ids: List[str]):
        """Update BM25 index with new documents"""
        try:
            # Tokenize documents for BM25
            tokenized_docs = [doc.lower().split() for doc in documents]
            
            # Create or update BM25 index
            if self.bm25_index is None:
                self.bm25_index = BM25Okapi(tokenized_docs)
            else:
                # Add new documents to existing index
                for doc in tokenized_docs:
                    self.bm25_index.add_doc(doc)
            
            self.bm25_documents.extend(documents)
            self.bm25_document_ids.extend(document_ids)
            
        except Exception as e:
            print(f"❌ Error updating BM25 index: {e}")
    
    def _load_bm25_index(self):
        """Load BM25 index from stored documents"""
        try:
            embeddings_ref = self.db.collection(self.embeddings_collection)
            embeddings_docs = embeddings_ref.stream()
            
            documents = []
            document_ids = []
            
            for doc in embeddings_docs:
                doc_data = doc.to_dict()
                documents.append(doc_data["content"])
                document_ids.append(doc_data["chunk_id"])
            
            if documents:
                tokenized_docs = [doc.lower().split() for doc in documents]
                self.bm25_index = BM25Okapi(tokenized_docs)
                self.bm25_documents = documents
                self.bm25_document_ids = document_ids
            
        except Exception as e:
            print(f"❌ Error loading BM25 index: {e}")
    
    def hybrid_search(
        self, 
        query: str, 
        class_name: Optional[str] = None,
        subject_name: Optional[str] = None,
        allowed_file_ids: Optional[List[str]] = None,
        top_k: int = 5, 
        user_id: Optional[str] = None,
        dense_weight: float = 0.7,
        sparse_weight: float = 0.3
    ) -> List[SearchResult]:
        """Hybrid search combining dense and sparse retrieval"""
        try:
            # Generate query embeddings
            query_dense_embedding = self.get_dense_embedding(query)
            query_sparse_embedding = self.get_sparse_embedding(query)
            
            # Load BM25 index if not loaded
            if self.bm25_index is None:
                self._load_bm25_index()
            
            # Get embeddings from Firestore with filters
            embeddings_ref = self.db.collection(self.embeddings_collection)
            
            # Apply filters
            if user_id:
                embeddings_ref = embeddings_ref.where("user_id", "==", user_id)
            if class_name:
                embeddings_ref = embeddings_ref.where("class_name", "==", class_name)
            if subject_name:
                embeddings_ref = embeddings_ref.where("subject_name", "==", subject_name)
            if allowed_file_ids:
                embeddings_ref = embeddings_ref.where("file_id", "in", allowed_file_ids)
            
            embeddings_docs = embeddings_ref.stream()
            
            # Calculate similarities
            similarities = []
            for doc in embeddings_docs:
                doc_data = doc.to_dict()
                chunk_id = doc_data["chunk_id"]
                
                # Dense similarity
                doc_dense_embedding = doc_data.get("dense_embedding", [])
                dense_similarity = 0.0
                if doc_dense_embedding:
                    dense_similarity = self._cosine_similarity(query_dense_embedding, doc_dense_embedding)
                
                # Sparse similarity (BM25)
                sparse_similarity = 0.0
                if self.bm25_index and chunk_id in self.bm25_document_ids:
                    doc_index = self.bm25_document_ids.index(chunk_id)
                    sparse_scores = self.bm25_index.get_scores(query.lower().split())
                    if doc_index < len(sparse_scores):
                        sparse_similarity = sparse_scores[doc_index]
                
                # Normalize sparse similarity
                if sparse_similarity > 0:
                    sparse_similarity = (sparse_similarity - min(sparse_similarity, 0)) / (max(sparse_similarity, 1) - min(sparse_similarity, 0))
                
                # Hybrid score
                hybrid_score = (dense_weight * dense_similarity) + (sparse_weight * sparse_similarity)
                
                similarities.append({
                    "chunk_id": chunk_id,
                    "document_id": doc_data["document_id"],
                    "content": doc_data["content"],
                    "class_name": doc_data["class_name"],
                    "subject_name": doc_data["subject_name"],
                    "file_id": doc_data["file_id"],
                    "dense_score": dense_similarity,
                    "sparse_score": sparse_similarity,
                    "hybrid_score": hybrid_score,
                    "metadata": doc_data.get("metadata", {})
                })
            
            # Sort by hybrid score and return top_k results
            similarities.sort(key=lambda x: x["hybrid_score"], reverse=True)
            top_results = similarities[:top_k]
            
            # Convert to SearchResult objects
            search_results = []
            for result in top_results:
                search_result = SearchResult(
                    chunk_id=result["chunk_id"],
                    document_id=result["document_id"],
                    content=result["content"],
                    class_name=result["class_name"],
                    subject_name=result["subject_name"],
                    file_id=result["file_id"],
                    dense_score=result["dense_score"],
                    sparse_score=result["sparse_score"],
                    hybrid_score=result["hybrid_score"],
                    metadata=result["metadata"]
                )
                search_results.append(search_result)
            
            return search_results
            
        except Exception as e:
            print(f"❌ Error in hybrid search: {e}")
            return []
    
    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors"""
        try:
            vec1 = np.array(vec1)
            vec2 = np.array(vec2)
            
            # Normalize vectors
            norm1 = np.linalg.norm(vec1)
            norm2 = np.linalg.norm(vec2)
            
            if norm1 == 0 or norm2 == 0:
                return 0.0
            
            # Calculate cosine similarity
            similarity = np.dot(vec1, vec2) / (norm1 * norm2)
            return float(similarity)
        except Exception as e:
            print(f"Error calculating cosine similarity: {e}")
            return 0.0
    
    def get_chunks_by_file_id(self, file_id: str) -> List[DocumentChunk]:
        """Get all chunks for a specific file"""
        try:
            chunks_ref = self.db.collection(self.chunks_collection).where("file_id", "==", file_id)
            chunks = chunks_ref.stream()
            
            document_chunks = []
            for chunk in chunks:
                data = chunk.to_dict()
                document_chunk = DocumentChunk(
                    id=data["id"],
                    document_id=data["document_id"],
                    content=data["content"],
                    chunk_index=data["chunk_index"],
                    class_name=data["class_name"],
                    subject_name=data["subject_name"],
                    file_id=data["file_id"],
                    dense_embedding=data.get("dense_embedding", []),
                    sparse_embedding=data.get("sparse_embedding", []),
                    metadata=data.get("metadata", {}),
                    created_at=datetime.fromisoformat(data["created_at"])
                )
                document_chunks.append(document_chunk)
            
            return document_chunks
        except Exception as e:
            print(f"❌ Error retrieving chunks: {e}")
            return []
    
    def delete_chunks_by_file_id(self, file_id: str) -> bool:
        """Delete all chunks for a specific file"""
        try:
            # Delete chunks
            chunks_ref = self.db.collection(self.chunks_collection).where("file_id", "==", file_id)
            chunks = chunks_ref.stream()
            for chunk in chunks:
                chunk.reference.delete()
            
            # Delete embeddings
            embeddings_ref = self.db.collection(self.embeddings_collection).where("file_id", "==", file_id)
            embeddings = embeddings_ref.stream()
            for embedding in embeddings:
                embedding.reference.delete()
            
            print(f"✅ Deleted all chunks for file {file_id}")
            return True
        except Exception as e:
            print(f"❌ Error deleting chunks: {e}")
            return False 