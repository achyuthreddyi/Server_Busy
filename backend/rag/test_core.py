#!/usr/bin/env python3
"""
Core Functionality Test
Tests the main components of the RAG application
"""

import os
import sys

# Set environment variables
os.environ["GOOGLE_CLOUD_PROJECT"] = "server-busy-467111"
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "server-busy-467111-f08bb27a1ee1.json"

def test_imports():
    """Test if all modules can be imported"""
    print("🔍 Testing module imports...")
    
    try:
        from models import DocumentChunk, SearchResult, ChatRequest, ChatResponse
        print("✅ models.py imported successfully")
        
        from firebase_gemini_init import initialize_services
        print("✅ firebase_gemini_init.py imported successfully")
        
        from document_processor import DocumentProcessor
        print("✅ document_processor.py imported successfully")
        
        from hybrid_vector_store import HybridVectorStore
        print("✅ hybrid_vector_store.py imported successfully")
        
        from agentic_workflow import AgenticWorkflow
        print("✅ agentic_workflow.py imported successfully")
        
        return True
        
    except Exception as e:
        print(f"❌ Import error: {e}")
        return False

def test_initialization():
    """Test component initialization"""
    print("\n🔍 Testing component initialization...")
    
    try:
        from firebase_gemini_init import initialize_services
        from document_processor import DocumentProcessor
        from hybrid_vector_store import HybridVectorStore
        from agentic_workflow import AgenticWorkflow
        
        project_id = "server-busy-467111"
        
        # Test Firebase initialization
        db, bucket = initialize_services()
        print("✅ Firebase services initialized")
        
        # Test DocumentProcessor
        doc_processor = DocumentProcessor(project_id)
        print("✅ DocumentProcessor initialized")
        
        # Test HybridVectorStore
        vector_store = HybridVectorStore(project_id)
        print("✅ HybridVectorStore initialized")
        
        # Test AgenticWorkflow
        workflow = AgenticWorkflow(project_id)
        print("✅ AgenticWorkflow initialized")
        
        return True
        
    except Exception as e:
        print(f"❌ Initialization error: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_simple_embedding():
    """Test embedding generation"""
    print("\n🔍 Testing embedding generation...")
    
    try:
        from hybrid_vector_store import HybridVectorStore
        
        project_id = "server-busy-467111"
        vector_store = HybridVectorStore(project_id)
        
        # Test dense embedding
        dense_embedding = vector_store.get_dense_embedding("test text")
        print(f"✅ Dense embedding generated: {len(dense_embedding)} dimensions")
        
        # Test sparse embedding
        sparse_embedding = vector_store.get_sparse_embedding("test text")
        print(f"✅ Sparse embedding generated: {len(sparse_embedding)} dimensions")
        
        return True
        
    except Exception as e:
        print(f"❌ Embedding error: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Run all tests"""
    print("🚀 Starting Core Functionality Tests")
    print("=" * 50)
    
    tests = [
        ("Module Imports", test_imports),
        ("Component Initialization", test_initialization),
        ("Embedding Generation", test_simple_embedding)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n📋 Running: {test_name}")
        if test_func():
            passed += 1
            print(f"✅ {test_name} PASSED")
        else:
            print(f"❌ {test_name} FAILED")
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Core functionality is working.")
        print("\n💡 Next steps:")
        print("   1. Run: python3 simple_ingest.py")
        print("   2. Run: python3 simple_query.py")
    else:
        print("⚠️  Some tests failed. Check the errors above.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 