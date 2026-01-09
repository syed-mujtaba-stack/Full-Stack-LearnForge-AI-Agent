# 🐍 EduGenius AI - Backend (Server)

> **FastAPI High-Performance Intelligent Engine**

This is the Python-based backend for EduGenius AI, built with FastAPI for speed, scalability, and developer experience.

## 🚀 Getting Started

### Prerequisites
- Python 3.12+
- Virtual Environment (recommended)

### Installation

```bash
# 1. Create a virtual environment
python -m venv venv

# 2. Activate the environment
# Windows:
venv\Scripts\activate
# Unix/macOS:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt
```

### Running the Server

```bash
uvicorn app.main:app --reload
```

The API will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000).
Interactive Swagger docs at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

## 🛠️ Features
- **FastAPI Core**: Asynchronous API endpoints with automatic Pydantic validation.
- **Supabase Integration**: Direct PostgreSQL access and Storage management.
- **Firebase Auth**: Secure JWT-based authentication via Firebase Admin SDK.
- **Modular Architecture**: Clean separation of models, schemas, services, and endpoints.
