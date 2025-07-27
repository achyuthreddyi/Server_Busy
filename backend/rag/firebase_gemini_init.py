# firebase_gemini_init.py
import os
import firebase_admin
from firebase_admin import credentials, firestore, storage
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def initialize_services():
    """
    Initializes Firebase Admin SDK (Firestore + Storage) and Gemini API client.
    Returns:
        db: Firestore client
        bucket: Firebase Storage bucket
    """
    # Initialize Firebase only once
    if not firebase_admin._apps:
        cred_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
        if not cred_path:
            raise ValueError("GOOGLE_APPLICATION_CREDENTIALS not set in environment")
        bucket_name = os.environ.get("FIREBASE_STORAGE_BUCKET")
        if not bucket_name:
            raise ValueError("FIREBASE_STORAGE_BUCKET not set in environment")
        
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred, {
            'storageBucket': bucket_name
        })

    # Initialize Firestore and Storage clients
    db = firestore.client()
    bucket = storage.bucket()

    # Configure Gemini API
    gemini_api_key = os.environ.get("GEMINI_API_KEY")
    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY not set in environment")
    genai.configure(api_key=gemini_api_key)

    return db, bucket
