# Server Busy - AI Teacher Companion

A comprehensive AI-powered teaching assistant platform designed to support educators in multi-grade classrooms with intelligent content generation, real-time assistance, and performance analytics.

## 🎯 Overview

Server Busy is an innovative AI Teacher Companion that leverages Google Cloud AI Studio, Gemini, Vertex AI, and Firebase to create a seamless teaching experience. The platform helps teachers reduce administrative burden, generate personalized content, and track student progress through an intuitive interface.

## 🚀 Key Features

### 📊 Dashboard & Class Management
- **Class Overview**: View all classes with key metrics including attendance, performance, and student counts
- **Quick Actions**: Access common tasks like taking attendance, viewing analytics, and scheduling
- **Search & Filter**: Easily find specific classes or students
- **Real-time Stats**: Monitor class performance and attendance at a glance

### 🎓 Take Class Workflow
The platform follows a structured workflow for class preparation and delivery:

1. **Quick View**: Overview of class details, lesson plans, and student information
2. **Live Assist**: Real-time AI assistance during class with contextual support
3. **AI Audit**: Post-class analysis and insights for continuous improvement

### 🤖 AI-Powered Features
- **Content Generation**: Create lesson plans, worksheets, and assessments tailored to different grade levels
- **Real-time Assistance**: Get instant help during class with AI-powered suggestions
- **Performance Analytics**: Track student progress and identify learning gaps
- **Multilingual Support**: Generate content in multiple languages for diverse classrooms

### 📚 Knowledge Base
- **Document Processing**: Upload and process PDF documents for AI reference
- **RAG Integration**: Retrieve relevant information from uploaded materials
- **Smart Search**: Find specific content across all uploaded documents

## 🏗️ Architecture

### Frontend (Next.js 15 + TypeScript)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Key Components**:
  - Dashboard with class management
  - Take Class workflow (Quick View → Live Assist → AI Audit)
  - Knowledge Base with document processing
  - Lesson Planner with AI assistance

### Backend (FastAPI + Python)
- **Framework**: FastAPI with Uvicorn
- **AI Services**: Google Cloud AI Platform, Gemini, Vertex AI
- **Database**: Firebase Firestore
- **Storage**: Google Cloud Storage
- **Key Features**:
  - Agentic RAG workflow
  - PDF document processing
  - Real-time chat completion
  - Multi-modal AI assistance

## 🛠️ Technology Stack

### Frontend
- **React 19.1.0** - UI framework
- **Next.js 15.4.4** - Full-stack framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **ESLint** - Code quality

### Backend
- **FastAPI 0.104.1** - API framework
- **Uvicorn** - ASGI server
- **Google Cloud AI Platform** - AI/ML services
- **Google Generative AI** - Gemini integration
- **Firebase Admin** - Authentication & database
- **PyPDF2** - PDF processing
- **Unstructured** - Document parsing

## 📁 Project Structure

```
Server_Busy/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── dashboard/   # Class management
│   │   │   ├── ai-audit/    # Post-class analysis
│   │   │   ├── knowledge-base/ # Document management
│   │   │   └── lesson-planner/ # Lesson planning
│   │   ├── components/      # Reusable UI components
│   │   └── lib/            # Utility functions
│   └── package.json
├── backend/                 # FastAPI backend
│   ├── rag/               # AI/RAG functionality
│   │   ├── server.py      # Main API server
│   │   ├── agentic_workflow.py # AI workflow logic
│   │   ├── models.py      # Data models
│   │   └── requirements.txt
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Google Cloud Platform account
- Firebase project

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend/rag
pip install -r requirements.txt
python server.py
```

### Environment Configuration
Create `.env` files with your Google Cloud and Firebase credentials:

```env
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
FIREBASE_PROJECT_ID=your-firebase-project
```

## 🎯 User Flow

### 1. Dashboard Access
- Teachers land on the dashboard showing all their classes
- View key metrics: total classes, students, attendance, performance
- Quick access to common actions

### 2. Class Preparation
- Select a class to enter "Take Class" mode
- **Quick View**: Review class details, lesson plans, student roster
- **Live Assist**: Enable AI assistance for real-time support during class

### 3. AI Audit & Analysis
- Post-class analysis with engagement scoring
- Key insights and recommendations
- Performance tracking over time

### 4. Knowledge Management
- Upload curriculum documents (PDFs)
- AI-powered document processing and indexing
- Smart search across all materials

## 🔧 Development

### Running in Development
```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend/rag
uvicorn server:app --reload
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build
npm start

# Backend
cd backend/rag
uvicorn server:app --host 0.0.0.0 --port 8000
```

## 📊 API Endpoints

### Core Endpoints
- `GET /health` - Health check
- `POST /chat/completion` - AI chat completion
- `POST /upload-pdf` - Document upload and processing
- `GET /files/{file_id}/chunks` - Retrieve document chunks
- `DELETE /files/{file_id}` - Delete uploaded documents

### Frontend Routes
- `/dashboard` - Main dashboard
- `/dashboard/[classId]` - Class details
- `/dashboard/[classId]/take-class` - Take class workflow
- `/ai-audit` - Post-class analysis
- `/knowledge-base` - Document management
- `/lesson-planner` - Lesson planning tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Cloud AI Platform for AI/ML capabilities
- Firebase for backend services
- Next.js team for the excellent framework
- FastAPI for the high-performance API framework

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.

## 📸 Screenshots

### Application Flow Demo

The following screenshots demonstrate the complete user workflow from dashboard to AI audit:

#### 1. Dashboard Overview
![Dashboard](ss/Screenshot%202025-07-27%20121234.png)
*Main dashboard showing class overview, metrics, and quick actions*

#### 2. Class Metrics & Details
![Class Metrics](ss/Screenshot%202025-07-27%20121310.png)
*Detailed class view with student information and performance metrics*

#### 3. Quick View Mode
![Quick View](ss/Screenshot%202025-07-27%20121800.png)
*Quick view interface for class preparation and lesson overview*

#### 4. Live Assist Interface
![Live Assist](ss/Screenshot%202025-07-27%20121500.png)
*Real-time AI assistance during class with contextual support*

#### 5. Knowledge Base
![AI Audit](ss/Screenshot%202025-07-27%20121618.png)
*Post-class analysis with engagement scoring and insights*

#### 6. AI Audit Analysis
![Knowledge Base](ss/Screenshot%202025-07-27%20121403.png)
*Document management and AI-powered knowledge retrieval*

---

**Built with ❤️ for educators worldwide**