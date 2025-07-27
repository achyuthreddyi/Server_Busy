#!/usr/bin/env python3
"""
PDF Directory Ingestion Script
Ingests all PDF files from a directory into cloud storage and creates vector embeddings
"""

import os
import sys
import glob
from pathlib import Path
from typing import List, Dict, Any
import argparse
from datetime import datetime

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from document_processor import DocumentProcessor
from hybrid_vector_store import HybridVectorStore
from models import DocumentChunk

class PDFIngestionPipeline:
    """Pipeline for ingesting PDF files from a directory"""
    
    def __init__(self, project_id: str):
        self.project_id = project_id
        self.document_processor = DocumentProcessor(project_id)
        self.vector_store = HybridVectorStore(project_id)
        
        # Statistics
        self.stats = {
            "total_files": 0,
            "processed_files": 0,
            "failed_files": 0,
            "total_chunks": 0,
            "start_time": None,
            "end_time": None
        }
    
    def get_pdf_files(self, directory: str) -> List[str]:
        """Get all PDF files from directory"""
        pdf_pattern = os.path.join(directory, "**/*.pdf")
        pdf_files = glob.glob(pdf_pattern, recursive=True)
        return sorted(pdf_files)
    
    def extract_metadata_from_path(self, file_path: str) -> Dict[str, str]:
        """Extract class and subject from file path structure"""
        path_parts = Path(file_path).parts
        
        # Default values
        class_name = "Unknown"
        subject_name = "Unknown"
        
        # Try to extract from path structure
        # Expected structure: /path/to/class_name/subject_name/filename.pdf
        if len(path_parts) >= 3:
            # Look for class name patterns
            for part in path_parts:
                if any(keyword in part.lower() for keyword in ['grade', 'class', 'year']):
                    class_name = part
                    break
            
            # Look for subject name patterns
            for part in path_parts:
                if any(keyword in part.lower() for keyword in ['math', 'science', 'physics', 'chemistry', 'biology', 'english', 'history', 'geography']):
                    subject_name = part
                    break
        
        return {
            "class_name": class_name,
            "subject_name": subject_name
        }
    
    def process_single_pdf(self, file_path: str, user_id: str = "default") -> Dict[str, Any]:
        """Process a single PDF file"""
        try:
            print(f"Processing: {file_path}")
            
            # Read file content
            with open(file_path, 'rb') as f:
                file_content = f.read()
            
            # Extract metadata from path
            metadata = self.extract_metadata_from_path(file_path)
            class_name = metadata["class_name"]
            subject_name = metadata["subject_name"]
            
            # Use filename as title
            title = Path(file_path).stem
            
            # Process PDF
            result = self.document_processor.process_pdf_file(
                file_content=file_content,
                title=title,
                class_name=class_name,
                subject_name=subject_name,
                user_id=user_id
            )
            
            # Store chunks with embeddings
            chunk_ids = self.vector_store.store_chunks(result["chunks"])
            
            print(f"  ✅ Processed: {title}")
            print(f"     Class: {class_name}, Subject: {subject_name}")
            print(f"     Chunks: {len(chunk_ids)}, File ID: {result['file_id']}")
            
            return {
                "success": True,
                "file_path": file_path,
                "file_id": result["file_id"],
                "title": title,
                "class_name": class_name,
                "subject_name": subject_name,
                "chunks_count": len(chunk_ids),
                "total_text_length": result["total_text_length"]
            }
            
        except Exception as e:
            print(f"  ❌ Failed: {file_path} - {str(e)}")
            return {
                "success": False,
                "file_path": file_path,
                "error": str(e)
            }
    
    def ingest_directory(self, directory: str, user_id: str = "default") -> Dict[str, Any]:
        """Ingest all PDF files from a directory"""
        print(f"Starting PDF ingestion from: {directory}")
        print("=" * 60)
        
        # Get all PDF files
        pdf_files = self.get_pdf_files(directory)
        self.stats["total_files"] = len(pdf_files)
        self.stats["start_time"] = datetime.now()
        
        if not pdf_files:
            print("No PDF files found in directory")
            return self.stats
        
        print(f"Found {len(pdf_files)} PDF files")
        print()
        
        # Process each file
        results = []
        for i, file_path in enumerate(pdf_files, 1):
            print(f"[{i}/{len(pdf_files)}] ", end="")
            result = self.process_single_pdf(file_path, user_id)
            results.append(result)
            
            if result["success"]:
                self.stats["processed_files"] += 1
                self.stats["total_chunks"] += result["chunks_count"]
            else:
                self.stats["failed_files"] += 1
        
        self.stats["end_time"] = datetime.now()
        
        # Print summary
        self.print_summary(results)
        
        return self.stats
    
    def print_summary(self, results: List[Dict[str, Any]]):
        """Print ingestion summary"""
        print("\n" + "=" * 60)
        print("INGESTION SUMMARY")
        print("=" * 60)
        
        duration = self.stats["end_time"] - self.stats["start_time"]
        
        print(f"Total files: {self.stats['total_files']}")
        print(f"Processed: {self.stats['processed_files']}")
        print(f"Failed: {self.stats['failed_files']}")
        print(f"Total chunks: {self.stats['total_chunks']}")
        print(f"Duration: {duration}")
        
        # Group by class and subject
        class_subject_stats = {}
        for result in results:
            if result["success"]:
                key = f"{result['class_name']} - {result['subject_name']}"
                if key not in class_subject_stats:
                    class_subject_stats[key] = {"files": 0, "chunks": 0}
                class_subject_stats[key]["files"] += 1
                class_subject_stats[key]["chunks"] += result["chunks_count"]
        
        if class_subject_stats:
            print("\nBy Class/Subject:")
            for key, stats in class_subject_stats.items():
                print(f"  {key}: {stats['files']} files, {stats['chunks']} chunks")
        
        # Failed files
        failed_files = [r for r in results if not r["success"]]
        if failed_files:
            print("\nFailed files:")
            for result in failed_files:
                print(f"  {result['file_path']}: {result['error']}")

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description="Ingest PDF files from directory")
    parser.add_argument("directory", help="Directory containing PDF files")
    parser.add_argument("--user-id", default="default", help="User ID for the files")
    parser.add_argument("--project-id", help="Google Cloud Project ID")
    
    args = parser.parse_args()
    
    # Check if directory exists
    if not os.path.exists(args.directory):
        print(f"Error: Directory '{args.directory}' does not exist")
        sys.exit(1)
    
    # Get project ID
    project_id = args.project_id or os.environ.get("GOOGLE_CLOUD_PROJECT")
    if not project_id:
        print("Error: Google Cloud Project ID not provided")
        print("Set GOOGLE_CLOUD_PROJECT environment variable or use --project-id")
        sys.exit(1)
    
    # Check environment variables
    required_vars = ["GOOGLE_APPLICATION_CREDENTIALS", "GEMINI_API_KEY"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print("Error: Missing required environment variables:")
        for var in missing_vars:
            print(f"  - {var}")
        sys.exit(1)
    
    # Create and run pipeline
    pipeline = PDFIngestionPipeline(project_id)
    stats = pipeline.ingest_directory(args.directory, args.user_id)
    
    print(f"\nIngestion completed with {stats['processed_files']} files processed")

if __name__ == "__main__":
    main() 