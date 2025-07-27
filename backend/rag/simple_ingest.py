#!/usr/bin/env python3
"""
Simple PDF Ingestion Script
"""

import os
import sys
from pathlib import Path

# Set environment variables
os.environ["GOOGLE_CLOUD_PROJECT"] = "server-busy-467111"
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "server-busy-467111-f08bb27a1ee1.json"

def ingest_pdf(pdf_path, title, class_name, subject_name, user_id="default"):
    """Ingest a single PDF file"""
    print("=" * 60)
    print("SIMPLE PDF INGESTION")
    print("=" * 60)
    
    try:
        # Check if file exists
        if not os.path.exists(pdf_path):
            print(f"❌ File not found: {pdf_path}")
            return None
        
        # Read PDF file
        with open(pdf_path, 'rb') as f:
            file_content = f.read()
        
        print(f"📄 Processing PDF: {pdf_path}")
        print(f"📊 File size: {len(file_content)} bytes")
        print(f"📚 Class: {class_name}")
        print(f"📖 Subject: {subject_name}")
        print(f"👤 User ID: {user_id}")
        
        # Import our modules
        from document_processor import DocumentProcessor
        from hybrid_vector_store import HybridVectorStore
        
        # Initialize components
        project_id = "server-busy-467111"
        document_processor = DocumentProcessor(project_id)
        vector_store = HybridVectorStore(project_id)
        
        print("🔄 Processing PDF with Unstructured.io...")
        
        # Process PDF
        result = document_processor.process_pdf_file(
            file_content=file_content,
            title=title,
            class_name=class_name,
            subject_name=subject_name,
            user_id=user_id
        )
        
        print(f"✅ Processing completed!")
        print(f"📝 Total chunks: {len(result['chunks'])}")
        print(f"📏 Total text length: {result['total_text_length']}")
        print(f"🆔 File ID: {result['file_id']}")
        
        # Store chunks in database
        print("💾 Storing chunks in database...")
        chunk_ids = vector_store.store_chunks(result["chunks"])
        
        print(f"✅ Successfully stored {len(chunk_ids)} chunks")
        
        print("=" * 60)
        print("✅ INGESTION COMPLETED SUCCESSFULLY!")
        print(f"🆔 File ID: {result['file_id']}")
        print(f"📊 Chunks stored: {len(chunk_ids)}")
        print("=" * 60)
        
        return result['file_id']
        
    except Exception as e:
        print(f"❌ Error during ingestion: {e}")
        import traceback
        traceback.print_exc()
        return None

def main():
    """Main function"""
    # Hardcoded values for Wavewalker demo
    pdf_path = "pdf/kehb101.pdf"
    title = "English Chapter - Wavewalker Story"
    class_name = "English"
    subject_name = "Literature"
    user_id = "demo_user"
    
    print("🚀 Starting PDF Ingestion...")
    file_id = ingest_pdf(pdf_path, title, class_name, subject_name, user_id)
    
    if file_id:
        print(f"\n✅ Success! File ID: {file_id}")
        print(f"💡 You can now query this file using the file ID: {file_id}")
        print(f"💡 Run: python3 simple_query.py {file_id}")
    else:
        print("\n❌ Ingestion failed!")

if __name__ == "__main__":
    main() 