import requests
import json
from typing import Dict, Any

class AgenticRAGClient:
    """Client for the simplified Agentic RAG API"""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.session = requests.Session()
    
    def health_check(self) -> Dict[str, Any]:
        """Check API health"""
        response = self.session.get(f"{self.base_url}/health")
        return response.json()
    
    def chat_completion(
        self, 
        message: str, 
        user_id: str,
        class_name: str,
        subject_name: str,
        allowed_file_ids: list,
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> Dict[str, Any]:
        """Send a message and get a response with agentic retrieval"""
        payload = {
            "message": message,
            "user_id": user_id,
            "class_name": class_name,
            "subject_name": subject_name,
            "allowed_file_ids": allowed_file_ids,
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        
        response = self.session.post(
            f"{self.base_url}/chat/completion",
            json=payload
        )
        return response.json()
    
    def upload_pdf(
        self, 
        file_path: str, 
        title: str, 
        class_name: str, 
        subject_name: str, 
        user_id: str = "default"
    ) -> Dict[str, Any]:
        """Upload and process a PDF file"""
        with open(file_path, 'rb') as f:
            files = {'file': f}
            data = {
                'title': title,
                'class_name': class_name,
                'subject_name': subject_name,
                'user_id': user_id
            }
            
            response = self.session.post(
                f"{self.base_url}/upload-pdf",
                files=files,
                data=data
            )
            return response.json()
    
    def get_file_chunks(self, file_id: str) -> Dict[str, Any]:
        """Get chunks for a specific file"""
        response = self.session.get(f"{self.base_url}/files/{file_id}/chunks")
        return response.json()
    
    def delete_file(self, file_id: str) -> Dict[str, Any]:
        """Delete a file and all its chunks"""
        response = self.session.delete(f"{self.base_url}/files/{file_id}")
        return response.json()

def main():
    """Example usage of the Agentic RAG client"""
    client = AgenticRAGClient()
    
    # Check API health
    print("🔍 Checking API health...")
    health = client.health_check()
    print(f"Health: {health}")
    
    # Upload a PDF file
    print("\n📄 Uploading PDF file...")
    try:
        upload_result = client.upload_pdf(
            file_path="sample.pdf",  # Replace with your PDF file
            title="Calculus Textbook",
            class_name="12th Grade",
            subject_name="Mathematics",
            user_id="teacher123"
        )
        print(f"✅ PDF uploaded: {upload_result}")
        
        file_id = upload_result["file_id"]
        allowed_files = [file_id]
        
        # Ask questions about the uploaded content
        print("\n❓ Asking questions about the uploaded content...")
        
        questions = [
            "What is calculus?",
            "Explain derivatives",
            "How does integration work?",
            "What are the fundamental theorems of calculus?"
        ]
        
        for i, question in enumerate(questions, 1):
            print(f"\n🔢 Question {i}: {question}")
            
            response = client.chat_completion(
                message=question,
                user_id="student123",
                class_name="12th Grade",
                subject_name="Mathematics",
                allowed_file_ids=allowed_files
            )
            
            print(f"🤖 Answer: {response['response'][:200]}...")
            print(f"📊 Retrieved chunks: {len(response['retrieved_chunks'])}")
            print(f"🔍 Retrieval used: {response['metadata']['retrieval_used']}")
            
            # Show chunk details
            for j, chunk in enumerate(response['retrieved_chunks'][:2], 1):
                print(f"  Chunk {j}: Score {chunk['hybrid_score']:.3f}")
        
        # Get file chunks
        print(f"\n📚 Getting chunks for file {file_id}...")
        chunks = client.get_file_chunks(file_id)
        print(f"Total chunks: {chunks['total_chunks']}")
        
        # Clean up (optional)
        # print(f"\n🗑️ Deleting file {file_id}...")
        # delete_result = client.delete_file(file_id)
        # print(f"Delete result: {delete_result}")
        
    except FileNotFoundError:
        print("❌ PDF file not found. Please upload a PDF file first.")
        print("Example usage without file upload:")
        
        # Example with mock file IDs
        mock_file_ids = ["mock-file-1", "mock-file-2"]
        
        response = client.chat_completion(
            message="What is mathematics?",
            user_id="student123",
            class_name="10th Grade",
            subject_name="Mathematics",
            allowed_file_ids=mock_file_ids
        )
        
        print(f"🤖 Example response: {response['response'][:200]}...")

if __name__ == "__main__":
    main() 