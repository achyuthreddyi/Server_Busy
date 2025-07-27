#!/usr/bin/env python3
"""
Google Cloud Authentication Setup Script
Helps you set up authentication for the Agentic RAG API
"""

import os
import json
import subprocess
import sys
from pathlib import Path

def check_gcloud_installed():
    """Check if gcloud CLI is installed"""
    try:
        result = subprocess.run(['gcloud', '--version'], capture_output=True, text=True)
        return result.returncode == 0
    except FileNotFoundError:
        return False

def setup_gcloud_auth():
    """Set up gcloud authentication"""
    print("Setting up Google Cloud authentication...")
    
    if not check_gcloud_installed():
        print("❌ gcloud CLI not found. Please install it first:")
        print("   https://cloud.google.com/sdk/docs/install")
        return False
    
    try:
        # Authenticate with gcloud
        subprocess.run(['gcloud', 'auth', 'login'], check=True)
        print("✅ Google Cloud authentication successful")
        return True
    except subprocess.CalledProcessError:
        print("❌ Google Cloud authentication failed")
        return False

def create_service_account_key(project_id):
    """Create and download service account key"""
    print(f"Creating service account for project: {project_id}")
    
    service_account_name = "agentic-rag-service"
    service_account_email = f"{service_account_name}@{project_id}.iam.gserviceaccount.com"
    
    try:
        # Create service account
        subprocess.run([
            'gcloud', 'iam', 'service-accounts', 'create', service_account_name,
            '--display-name', 'Agentic RAG Service Account',
            '--project', project_id
        ], check=True)
        print(f"✅ Created service account: {service_account_email}")
        
        # Assign roles
        roles = [
            'roles/documentai.user',
            'roles/datastore.user',
            'roles/storage.objectAdmin',
            'roles/aiplatform.user'
        ]
        
        for role in roles:
            subprocess.run([
                'gcloud', 'projects', 'add-iam-policy-binding', project_id,
                '--member', f'serviceAccount:{service_account_email}',
                '--role', role
            ], check=True)
            print(f"✅ Assigned role: {role}")
        
        # Create and download key
        key_file = f"{service_account_name}-key.json"
        subprocess.run([
            'gcloud', 'iam', 'service-accounts', 'keys', 'create', key_file,
            '--iam-account', service_account_email
        ], check=True)
        
        print(f"✅ Downloaded service account key: {key_file}")
        return key_file
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error creating service account: {e}")
        return None

def enable_apis(project_id):
    """Enable required APIs"""
    print("Enabling required APIs...")
    
    apis = [
        'documentai.googleapis.com',
        'firestore.googleapis.com',
        'storage.googleapis.com',
        'aiplatform.googleapis.com'
    ]
    
    for api in apis:
        try:
            subprocess.run([
                'gcloud', 'services', 'enable', api,
                '--project', project_id
            ], check=True)
            print(f"✅ Enabled API: {api}")
        except subprocess.CalledProcessError:
            print(f"⚠️  API {api} may already be enabled")

def create_document_ai_processor(project_id, location="us-central1"):
    """Create Document AI processor"""
    print("Creating Document AI processor...")
    
    try:
        # List available processors
        result = subprocess.run([
            'gcloud', 'documentai', 'processors', 'list',
            '--location', location,
            '--project', project_id
        ], capture_output=True, text=True, check=True)
        
        print("Available Document AI processors:")
        print(result.stdout)
        
        # Create a document OCR processor
        processor_name = "document-ocr"
        subprocess.run([
            'gcloud', 'documentai', 'processors', 'create', processor_name,
            '--type', 'OCR_PROCESSOR',
            '--location', location,
            '--project', project_id
        ], check=True)
        
        print(f"✅ Created Document AI processor: {processor_name}")
        return processor_name
        
    except subprocess.CalledProcessError as e:
        print(f"⚠️  Document AI processor creation failed: {e}")
        print("You may need to create it manually in the console")
        return "document-ocr"

def create_env_file(project_id, key_file, processor_id):
    """Create .env file with configuration"""
    env_content = f"""# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT={project_id}
GOOGLE_APPLICATION_CREDENTIALS={os.path.abspath(key_file)}

# Gemini API (you need to get this from https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your-gemini-api-key

# Document AI
DOCUMENT_AI_PROCESSOR_ID={processor_id}

# Optional: Firebase Storage
FIREBASE_STORAGE_BUCKET={project_id}.appspot.com
"""
    
    with open('.env', 'w') as f:
        f.write(env_content)
    
    print("✅ Created .env file")
    print("\n⚠️  IMPORTANT: You need to:")
    print("1. Get your Gemini API key from: https://makersuite.google.com/app/apikey")
    print("2. Replace 'your-gemini-api-key' in the .env file")

def main():
    """Main setup function"""
    print("🔧 Google Cloud Authentication Setup")
    print("=" * 50)
    
    # Get project ID
    project_id = input("Enter your Google Cloud Project ID: ").strip()
    if not project_id:
        print("❌ Project ID is required")
        return
    
    # Set up authentication
    if not setup_gcloud_auth():
        return
    
    # Enable APIs
    enable_apis(project_id)
    
    # Create service account
    key_file = create_service_account_key(project_id)
    if not key_file:
        return
    
    # Create Document AI processor
    processor_id = create_document_ai_processor(project_id)
    
    # Create .env file
    create_env_file(project_id, key_file, processor_id)
    
    print("\n🎉 Setup complete!")
    print("\nNext steps:")
    print("1. Get your Gemini API key from: https://makersuite.google.com/app/apikey")
    print("2. Update the .env file with your Gemini API key")
    print("3. Run: pip install -r requirements.txt")
    print("4. Run: python ingest_pdfs.py pdf --user-id user123")

if __name__ == "__main__":
    main() 