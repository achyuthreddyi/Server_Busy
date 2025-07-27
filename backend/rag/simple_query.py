#!/usr/bin/env python3
"""
Simple PDF Query Script
"""

import os
import sys
import argparse

# Set environment variables
os.environ["GOOGLE_CLOUD_PROJECT"] = "server-busy-467111"
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "server-busy-467111-f08bb27a1ee1.json"

def query_pdf(file_id=None, question="What happened to King Tut?"):
    """Query stored PDF files"""
    print("=" * 60)
    print("SIMPLE PDF QUERY")
    print("=" * 60)
    
    try:
        if file_id:
            print(f"🔍 Querying specific file: {file_id}")
        else:
            print("🌐 Querying all available files")
        
        print(f"❓ Question: {question}")
        print("-" * 50)
        
        # Import our modules
        from agentic_workflow import AgenticWorkflow
        from models import ChatRequest
        
        # Initialize workflow
        project_id = "server-busy-467111"
        workflow = AgenticWorkflow(project_id)
        
        # Create chat request
        chat_request = ChatRequest(
            message=question,
            user_id="demo_user",
            class_name="English",
            subject_name="Literature",
            allowed_file_ids=[file_id] if file_id else None,
            max_tokens=1000,
            temperature=0.7
        )
        
        print("🤖 Processing with agentic workflow...")
        
        # Process the request
        response = workflow.process_chat_request(chat_request)
        
        print("\n" + "=" * 60)
        print("📝 RESPONSE:")
        print("=" * 60)
        print(response.response)
        print("\n" + "=" * 60)
        
        # Show metadata
        print("📊 METADATA:")
        print(f"   Retrieval used: {response.metadata.get('retrieval_used', 'Unknown')}")
        print(f"   Chunks retrieved: {response.metadata.get('chunks_retrieved', 0)}")
        print(f"   Allowed files: {response.metadata.get('allowed_files', 'All files')}")
        
        if response.retrieved_chunks:
            print(f"\n🔍 Retrieved chunks:")
            for i, chunk in enumerate(response.retrieved_chunks[:3], 1):
                print(f"   {i}. Score: {chunk.hybrid_score:.3f}")
                print(f"      File: {chunk.file_id}")
                print(f"      Class: {chunk.class_name} - Subject: {chunk.subject_name}")
                print(f"      Content: {chunk.content[:200]}...")
                print()
        
        return response
        
    except Exception as e:
        print(f"❌ Error during query: {e}")
        import traceback
        traceback.print_exc()
        return None

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description="Query stored PDF")
    parser.add_argument("file_id", nargs="?", help="File ID of the stored PDF (optional - searches all files if not provided)")
    parser.add_argument("--question", default="What happened to the boat Wavewalker?", 
                       help="Question to ask about the PDF")
    
    args = parser.parse_args()
    
    print("🚀 Starting PDF Query...")
    response = query_pdf(args.file_id, args.question)
    
    if response:
        print(f"\n✅ Query completed successfully!")
    else:
        print(f"\n❌ Query failed!")

if __name__ == "__main__":
    main() 