import os
from typing import List, Dict, Any
from models import DocumentChunk
import uuid
from datetime import datetime
from unstructured.partition.auto import partition
from unstructured.documents.elements import Text

class DocumentProcessor:
    """Document processor using Unstructured.io for PDF parsing"""
    
    def __init__(self, project_id: str):
        self.project_id = project_id
    
    def process_pdf_with_unstructured(self, file_content: bytes) -> str:
        """Process PDF using Unstructured.io"""
        # Write temporary file for unstructured to process
        temp_file = f"temp_{uuid.uuid4()}.pdf"
        
        try:
            with open(temp_file, 'wb') as f:
                f.write(file_content)
            
            # Process with unstructured
            elements = partition(temp_file)
            
            # Extract text from elements
            text_parts = []
            for element in elements:
                if isinstance(element, Text):
                    text_parts.append(str(element))
            
            full_text = "\n".join(text_parts)
            return full_text
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file):
                os.remove(temp_file)
    
    def create_chunks_with_overlap(
        self, 
        text: str, 
        chunk_size: int = 3000, 
        overlap: int = 300
    ) -> List[str]:
        """Create text chunks with specified size and overlap"""
        chunks = []
        start = 0
        text_len = len(text)
        
        while start < text_len:
            end = start + chunk_size
            chunk = text[start:end]
            
            # Only add non-empty chunks
            if chunk.strip():
                chunks.append(chunk)
            
            if end >= text_len:
                break
            
            # Move start position with overlap
            start = end - overlap
        
        return chunks
    
    def process_pdf_file(
        self,
        file_content: bytes,
        title: str,
        class_name: str,
        subject_name: str,
        user_id: str = "default"
    ) -> Dict[str, Any]:
        """Process a PDF file and return chunks"""
        # Generate file ID
        file_id = str(uuid.uuid4())
        document_id = str(uuid.uuid4())
        
        # Process with Unstructured.io
        full_text = self.process_pdf_with_unstructured(file_content)
        
        # Create chunks with overlap
        text_chunks = self.create_chunks_with_overlap(full_text, 3000, 300)
        
        # Create DocumentChunk objects
        chunks = []
        for i, chunk_text in enumerate(text_chunks):
            chunk = DocumentChunk(
                id=str(uuid.uuid4()),
                document_id=document_id,
                content=chunk_text,
                chunk_index=i,
                class_name=class_name,
                subject_name=subject_name,
                file_id=file_id,
                metadata={
                    "title": title,
                    "user_id": user_id,
                    "total_chunks": len(text_chunks),
                    "chunk_size": 3000,
                    "overlap": 300,
                    "processor": "unstructured",
                    "mime_type": "application/pdf"
                }
            )
            chunks.append(chunk)
        
        return {
            "file_id": file_id,
            "document_id": document_id,
            "title": title,
            "class_name": class_name,
            "subject_name": subject_name,
            "chunks": chunks,
            "total_chunks": len(chunks),
            "total_text_length": len(full_text)
        }
    
    def get_processor_info(self) -> Dict[str, Any]:
        """Get processor information"""
        return {
            "name": "unstructured",
            "type": "PDF_PROCESSOR",
            "state": "ENABLED",
            "display_name": "Unstructured.io PDF Processor",
            "location": "local"
        } 