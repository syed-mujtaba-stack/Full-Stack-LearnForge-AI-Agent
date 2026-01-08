# 🎓 EduGenius AI

> **The Next Generation of Intelligent Learning**

[![Status](https://img.shields.io/badge/Status-Planning-blue)]()
[![Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20FastAPI%20%7C%20Supabase-4F46E5)]()

**EduGenius AI** is a reimagined, full-stack educational platform designed to provide personalized, AI-driven learning experiences. Built on a modern foundation of Next.js 15 and FastAPI, it leverages advanced AI to act as a 24/7 tutor, curriculum designer, and career mentor.

---

## 📚 Documentation

The complete project planning and architectural specifications are available in the `docs/` directory:

| Document | Description |
|----------|-------------|
| **[🎯 Master Plan](docs/01-master-plan.md)** | Project vision, goals, and development phases. |
| **[🏛️ Architecture](docs/02-technical-architecture.md)** | System design, component diagrams, and tech stack deep dive. |
| **[🗄️ Database](docs/03-database-schema.md)** | Complete PostgreSQL schema, relationships, and RLS policies. |
| **[🔌 API Spec](docs/04-api-specification.md)** | detailed API endpoints, authentication flows, and response formats. |
| **[🚀 Deployment](docs/05-deployment-strategy.md)** | CI/CD pipelines, Docker strategy, and infrastructure setup. |
| **[🔒 Security](docs/06-security-auth.md)** | Authentication architecture, RBAC, and data protection concepts. |
| **[🤖 AI Strategy](docs/07-ai-ml-integration.md)** | LLM provider strategy, RAG pipeline, and AI feature specs. |
| **[🎨 UI/UX](docs/08-ui-ux-guidelines.md)** | Design system, color palette, typography, and accessibility standards. |

---

## 🛠️ Technology Stack

### Frontend (Client)
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + Shadcn/UI
- **State**: TanStack Query + Zustand

### Backend (Server)
- **Framework**: FastAPI (Python 3.12+)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Firebase Auth + JWT
- **AI**: OpenAI / Google Gemini (via LangChain)

---

## 🚀 Getting Started

*Note: The project is currently in the planning phase. Actual code usage will begin in Phase 1.*

### Prerequisites
- Node.js 20+
- Python 3.12+
- Docker

### Setup (Future)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/edugenius-ai.git

# 2. Install Client Dependencies
cd client
npm install

# 3. Install Server Dependencies
cd ../server
pip install -r requirements.txt
```

---

## 🔮 Roadmap

- [x] **Planning Phase**: Complete architectural design and specifications.
- [ ] **Phase 1**: Core Infrastructure (Auth, Database, Base API).
- [ ] **Phase 2**: Course Management System.
- [ ] **Phase 3**: AI Tutor & Personalized Learning.
- [ ] **Phase 4**: Gamification & Social Features.
- [ ] **Launch**: Production release.

---

## 📄 License

This project is licensed under the MIT License.
