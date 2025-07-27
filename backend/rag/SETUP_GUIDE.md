# Google Cloud Authentication Setup Guide

## Quick Setup (Automated)

Run the setup script:
```bash
cd backend
python setup_auth.py
```

## Manual Setup

### Step 1: Install Google Cloud CLI

```bash
# Ubuntu/Debian
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Or download from: https://cloud.google.com/sdk/docs/install
```

### Step 2: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name (e.g., "agentic-rag-api")
4. Click "Create"
5. Note your **Project ID**

### Step 3: Enable APIs

In Google Cloud Console → "APIs & Services" → "Library":

Enable these APIs:
- **Document AI API**
- **Firestore API** 
- **Cloud Storage API**
- **Vertex AI API**

### Step 4: Create Service Account

1. Go to "IAM & Admin" → "Service Accounts"
2. Click "Create Service Account"
3. **Name**: `agentic-rag-service`
4. **Description**: `Service account for RAG API`
5. Click "Create and Continue"

### Step 5: Assign Permissions

Add these roles:
- **Document AI User** (`roles/documentai.user`)
- **Firestore User** (`roles/datastore.user`)
- **Storage Object Admin** (`roles/storage.objectAdmin`)
- **Vertex AI User** (`roles/aiplatform.user`)

### Step 6: Download Service Account Key

1. Click on your service account
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON"
5. Download the JSON file
6. Place it in the `backend/` folder

### Step 7: Create Document AI Processor

1. Go to "Document AI" in Google Cloud Console
2. Click "Create Processor"
3. Choose "Document OCR"
4. Set location to "us-central1"
5. Note the **Processor ID**

### Step 8: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the API key

### Step 9: Create .env File

Create `backend/.env` with:

```bash
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account.json

# Gemini API
GEMINI_API_KEY=your-gemini-api-key

# Document AI
DOCUMENT_AI_PROCESSOR_ID=your-processor-id

# Optional: Firebase Storage
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

### Step 10: Test Setup

```bash
cd backend
pip install -r requirements.txt
python start_server.py
```

## Troubleshooting

### Common Issues:

1. **"Permission denied"**: Check service account roles
2. **"API not enabled"**: Enable required APIs
3. **"Invalid credentials"**: Check service account key path
4. **"Processor not found"**: Verify Document AI processor ID

### Verify Setup:

```bash
# Test Google Cloud authentication
gcloud auth list

# Test service account
gcloud iam service-accounts list

# Test APIs
gcloud services list --enabled
``` 