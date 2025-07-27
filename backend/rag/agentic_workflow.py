import os
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from models import ChatRequest, ChatResponse, SearchResult
from hybrid_vector_store import HybridVectorStore
from document_processor import DocumentProcessor
import uuid
from datetime import datetime

class AgenticWorkflow:
    """Agentic workflow for retrieval and generation"""
    
    def __init__(self, project_id: str):
        self.project_id = project_id
        self.vector_store = HybridVectorStore(project_id)
        self.document_processor = DocumentProcessor(project_id)
        
        # Initialize Gemini model for generation
        self.model = genai.GenerativeModel("gemini-2.0-flash-exp")
        
        # System prompt for agentic behavior
        self.system_prompt = """You are an intelligent AI assistant with access to a knowledge base. 
        Your task is to:
        1. Analyze the user's query
        2. Decide whether to retrieve information from the knowledge base
        3. If retrieval is needed, use the search tool to find relevant information
        4. Generate a comprehensive response using the retrieved context
        
        Always be helpful, accurate, and cite your sources when possible."""
    
    def should_retrieve(self, query: str) -> bool:
        """Decide whether to retrieve information based on the query"""
        try:
            # Simple heuristic-based decision
            retrieval_keywords = [
                "what", "how", "explain", "describe", "tell me about",
                "information", "details", "facts", "definition", "meaning",
                "compare", "difference", "similar", "example", "instance"
            ]
            
            query_lower = query.lower()
            
            # Check for retrieval keywords
            has_retrieval_keywords = any(keyword in query_lower for keyword in retrieval_keywords)
            
            # Check if query is asking for specific information
            is_informational = len(query.split()) > 2
            
            return has_retrieval_keywords or is_informational
            
        except Exception as e:
            print(f"Error in should_retrieve: {e}")
            return True  # Default to retrieval
    
    def search_knowledge_base(
        self, 
        query: str, 
        class_name: str,
        subject_name: str,
        allowed_file_ids: Optional[List[str]] = None,
        top_k: int = 5
    ) -> List[SearchResult]:
        """Search the knowledge base for relevant information"""
        try:
            results = self.vector_store.hybrid_search(
                query=query,
                class_name=class_name,
                subject_name=subject_name,
                allowed_file_ids=allowed_file_ids,
                top_k=top_k
            )
            
            print(f"🔍 Retrieved {len(results)} chunks for query: {query}")
            return results
            
        except Exception as e:
            print(f"❌ Error searching knowledge base: {e}")
            return []
    
    def generate_response_with_context(
        self, 
        query: str, 
        search_results: List[SearchResult],
        class_name: str,
        subject_name: str,
        max_tokens: int = 1000,
        temperature: float = 0.7
    ) -> str:
        """Generate response using retrieved context"""
        try:
            # Build context from search results
            if search_results:
                context_parts = [f"Context from {class_name} - {subject_name}:"]
                for i, result in enumerate(search_results, 1):
                    context_parts.append(f"\n{i}. Content: {result.content[:500]}...")
                    context_parts.append(f"   Hybrid Score: {result.hybrid_score:.3f}")
                context = "\n".join(context_parts)
            else:
                context = "No relevant information found in the knowledge base."
            
            # Build prompt
            prompt = f"""System: {self.system_prompt}

Context: {context}

User Query: {query}

Please provide a comprehensive response based on the context provided. If the context doesn't contain relevant information, say so and provide general guidance."""

            # Generate response
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=temperature,
                    max_output_tokens=max_tokens
                )
            )
            
            return response.text
            
        except Exception as e:
            print(f"❌ Error generating response: {e}")
            return f"I apologize, but I encountered an error while generating a response. Please try again. Error: {str(e)}"
    
    def process_chat_request(self, request: ChatRequest) -> ChatResponse:
        """Process chat request with agentic workflow"""
        try:
            print(f"🤖 Processing chat request: {request.message}")
            
            # Step 1: Decide whether to retrieve
            should_retrieve = self.should_retrieve(request.message)
            
            retrieved_chunks = []
            response_text = ""
            
            if should_retrieve:
                print("🔍 Retrieval needed, searching knowledge base...")
                
                # Step 2: Search knowledge base
                retrieved_chunks = self.search_knowledge_base(
                    query=request.message,
                    class_name=request.class_name,
                    subject_name=request.subject_name,
                    allowed_file_ids=request.allowed_file_ids,
                    top_k=5
                )
                
                # Step 3: Generate response with context
                response_text = self.generate_response_with_context(
                    query=request.message,
                    search_results=retrieved_chunks,
                    class_name=request.class_name,
                    subject_name=request.subject_name,
                    max_tokens=request.max_tokens,
                    temperature=request.temperature
                )
            else:
                print("💭 No retrieval needed, generating direct response...")
                
                # Generate response without retrieval
                response_text = self.generate_response_with_context(
                    query=request.message,
                    search_results=[],
                    class_name=request.class_name,
                    subject_name=request.subject_name,
                    max_tokens=request.max_tokens,
                    temperature=request.temperature
                )
            
            # Create response
            chat_response = ChatResponse(
                response=response_text,
                retrieved_chunks=retrieved_chunks,
                metadata={
                    "retrieval_used": should_retrieve,
                    "chunks_retrieved": len(retrieved_chunks),
                    "class_name": request.class_name,
                    "subject_name": request.subject_name,
                    "allowed_files": request.allowed_file_ids,
                    "temperature": request.temperature,
                    "max_tokens": request.max_tokens
                }
            )
            
            return chat_response
            
        except Exception as e:
            print(f"❌ Error in agentic workflow: {e}")
            return ChatResponse(
                response=f"I apologize, but I encountered an error. Please try again. Error: {str(e)}",
                retrieved_chunks=[],
                metadata={"error": str(e)}
            )
    
    def process_pdf_upload(
        self,
        file_content: bytes,
        title: str,
        class_name: str,
        subject_name: str,
        user_id: str = "default"
    ) -> Dict[str, Any]:
        """Process PDF upload with Document AI and store chunks"""
        try:
            print(f"📄 Processing PDF: {title}")
            
            # Step 1: Process PDF with Document AI
            processing_result = self.document_processor.process_pdf_file(
                file_content=file_content,
                title=title,
                class_name=class_name,
                subject_name=subject_name,
                user_id=user_id
            )
            
            # Step 2: Store chunks with embeddings
            chunk_ids = self.vector_store.store_chunks(processing_result["chunks"])
            
            print(f"✅ Stored {len(chunk_ids)} chunks for file: {processing_result['file_id']}")
            
            return {
                "file_id": processing_result["file_id"],
                "document_id": processing_result["document_id"],
                "title": processing_result["title"],
                "class_name": processing_result["class_name"],
                "subject_name": processing_result["subject_name"],
                "total_chunks": processing_result["total_chunks"],
                "chunk_ids": chunk_ids,
                "message": "PDF processed and stored successfully"
            }
            
        except Exception as e:
            print(f"❌ Error processing PDF upload: {e}")
            raise
    
    def get_file_chunks(self, file_id: str) -> List[Dict[str, Any]]:
        """Get chunks for a specific file"""
        try:
            chunks = self.vector_store.get_chunks_by_file_id(file_id)
            return [chunk.to_dict() for chunk in chunks]
        except Exception as e:
            print(f"❌ Error getting file chunks: {e}")
            return []
    
    def delete_file(self, file_id: str) -> bool:
        """Delete all chunks for a specific file"""
        try:
            success = self.vector_store.delete_chunks_by_file_id(file_id)
            return success
        except Exception as e:
            print(f"❌ Error deleting file: {e}")
            return False 