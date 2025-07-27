#!/usr/bin/env python3
"""
Startup script for the Agentic RAG API
"""

import os
import sys
import subprocess
import uvicorn
from pathlib import Path

def check_dependencies():
    """Check if all required dependencies are installed"""
    required_packages = [
        'fastapi',
        'uvicorn',
        'google-generativeai',
        'google-cloud-documentai',
        'google-cloud-firestore',
        'rank-bm25',
        'numpy',
        'requests'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print("❌ Missing required packages:")
        for package in missing_packages:
            print(f"   - {package}")
        print("\nInstall missing packages with:")
        print("pip install -r requirements.txt")
        return False
    
    print("✅ All dependencies are installed")
    return True

def check_environment():
    """Check if required environment variables are set"""
    required_vars = [
        'GOOGLE_CLOUD_PROJECT',
        'GEMINI_API_KEY'
    ]
    
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\nSet environment variables:")
        print("export GOOGLE_CLOUD_PROJECT='your-project-id'")
        print("export GEMINI_API_KEY='your-gemini-api-key'")
        print("export GOOGLE_APPLICATION_CREDENTIALS='path/to/service-account.json'")
        return False
    
    print("✅ Environment variables are set")
    return True

def check_files():
    """Check if required files exist"""
    required_files = [
        'server.py',
        'agentic_workflow.py',
        'hybrid_vector_store.py',
        'document_processor.py',
        'models.py'
    ]
    
    missing_files = []
    
    for file in required_files:
        if not Path(file).exists():
            missing_files.append(file)
    
    if missing_files:
        print("❌ Missing required files:")
        for file in missing_files:
            print(f"   - {file}")
        return False
    
    print("✅ All required files are present")
    return True

def main():
    """Main startup function"""
    print("🚀 Starting Agentic RAG API...")
    print("=" * 50)
    
    # Check dependencies
    print("\n📦 Checking dependencies...")
    if not check_dependencies():
        sys.exit(1)
    
    # Check environment
    print("\n🔧 Checking environment...")
    if not check_environment():
        sys.exit(1)
    
    # Check files
    print("\n📁 Checking files...")
    if not check_files():
        sys.exit(1)
    
    print("\n✅ All checks passed!")
    print("🌐 Starting server at http://localhost:8000")
    print("📚 API documentation at http://localhost:8000/docs")
    print("🔍 Health check at http://localhost:8000/health")
    print("\nPress Ctrl+C to stop the server")
    print("=" * 50)
    
    # Start the server
    try:
        uvicorn.run(
            "server:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 