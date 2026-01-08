# 🚀 Deployment & DevOps Strategy - LearnForge AI

## 📋 Document Overview

This document outlines the deployment pipeline, infrastructure management, monitoring, and scaling strategies for LearnForge AI, utilizing a modern CI/CD approach.

---

## 🏗️ Infrastructure Overview

LearnForge AI employs a multi-cloud strategy to leverage the best services for each component while maintaining cost-effectiveness and scalability.

| Component | Provider | Service | Justification |
|-----------|----------|---------|---------------|
| **Frontend** | Vercel | Next.js Edge | Built-in optimization, global edge network, zero-config deployments. |
| **Backend** | Railway / Render | Docker Containers | Easy auto-scaling, straightforward deployment, excellent developer experience. |
| **Database** | Supabase | Managed PostgreSQL | Built-in auth, real-time features, backups, RLS security. |
| **Cache/Queue** | Upstash / Redis Cloud | Serverless Redis | Pay-per-request model, high availability, low latency. |
| **Storage** | AWS S3 / Cloudflare R2 | Object Storage | Scalable, cheap storage for user-generated content and media. |
| **AI Workloads**| Provider APIs | OpenAI / Anthropic | Offloading compute-intensive inference to specialized providers. |

---

## 🔄 CI/CD Pipeline (GitHub Actions)

We use GitHub Actions for all automation, ensuring every commit is vetted before reaching production.

### Workflow: `ci-cd.yml`

This workflow triggers on pushes to `main` and Pull Requests.

#### 1. **Quality Check (Parallel Jobs)**
- **Linting**: Run `eslint` (frontend) and `flake8`/`black` (backend) to enforce code style.
- **Type Checking**: Run `tsc` (frontend) and `mypy` (backend) for static type safety.
- **Unit Tests**: Run `jest` (frontend) and `pytest` (backend) with coverage reports.
  - *Gate*: Fails if coverage < 80%.

#### 2. **Build & Measure**
- **Frontend Build**: `next build` to check for build errors and bundle size.
  - *Action*: `Size Limit` to warn on large bundle increases.
- **Backend Build**: Build specific Docker image to ensure containerizability.

#### 3. **Deployment (Only on push to `main`)**
- **Frontend**: Automatically deployed via Vercel GitHub integration.
- **Backend**:
  - Build Docker image.
  - Push to container registry (GHCR).
  - Trigger Railway/Render deployment webhook.
- **Database**: Run Alembic migrations (via release command or GitHub Action).

---

## 🐳 Docker Strategy (Backend)

We use a multi-stage build process to keep production images lightweight and secure.

```dockerfile
# Stage 1: Builder
FROM python:3.12-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Production
FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY ./app ./app
ENV PATH=/root/.local/bin:$PATH
ENV PYTHONPATH=/app

# Run as non-root user for security
RUN useradd -m myuser
USER myuser

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 🧪 Environments

| Environment | URL | Branch | Purpose | Database |
|-------------|-----|--------|---------|----------|
| **Development** | `localhost:3000` | Feature Branches | Local development | Local Postgres / Dev DB |
| **Preview** | `git-branch.vercel.app` | Pull Requests | Testing changes in isolation | Staging DB |
| **Staging** | `staging.learnforge.ai` | `develop` | Pre-production testing | Staging DB |
| **Production** | `learnforge.ai` | `main` | Live user traffic | Production DB |

---

## 📈 Monitoring & Observability Stack

### 1. Application Performance Monitoring (APM)
- **Sentry**: Captures unhandled exceptions (frontend & backend) and performance transactions.
- **Loguru (Backend)**: Structured logging (JSON format in production).
- **Vercel Analytics**: Real user monitoring (RUM) for frontend Web Vitals.

### 2. Infrastructure Monitoring
- **Railway/Render Metrics**: CPU, RAM usage of backend containers.
- **Supabase Dashboard**: Database health, connection pool status, storage usage.

### 3. Alerting
- **Slack/Discord Integration**: Receive notifications for:
  - Failed CI/CD pipelines.
  - New Sentry issues (high priority).
  - Server downtime or high latency.

---

## 🛡️ Backup & Disaster Recovery

### Database
- **Daily Backups**: Automated by Supabase (7-day retention).
- **Point-in-Time Recovery (PITR)**: Enabled for critical data restoration.

### Configuration
- **Infrastructure as Code**: Not strictly applicable for PaaS, but `env` vars and config files stored securely.
- **Secrets Management**:
  - GitHub Secrets for CI/CD keys.
  - Vercel/Railway Environment Variables for runtime secrets.

---

## 🚀 Scaling Strategy

### Frontend
- **Static Hosting**: Vercel handles scaling automatically via global CDN.
- **Edge Functions**: Used for middleware and simple API logic to reduce backend load.

### Backend
- **Horizontal Scaling**: Increase number of container instances based on CPU/RAM usage.
- **Load Balancing**: Managed by the PaaS provider (Railway/Render).

### Database
- **Connection Pooling**: Use Supavisor (Supabase) to handle high concurrent connections.
- **Read Replicas**: Provision read replicas if read-heavy traffic significantly increases.
- **Caching**: Aggressively cache public API responses in Redis to offload DB.

---

## ✅ Deployment Checklist (Pre-Launch)

1. [ ] **Environment Variables**: Verify all secrets are set in Prod environments.
2. [ ] **Domain Verification**: Ensure DNS records (A, CNAME, TXT) are propagated.
3. [ ] **SSL Certificates**: Verify HTTPS is active and valid.
4. [ ] **Database Migrations**: Confirm production DB schema is up-to-date.
5. [ ] **Smoke Tests**: Run critical path tests on the production URL.
6. [ ] **Monitoring**: Confirm Sentry and Analytics are receiving data.

---

**Document Version**: 1.0
**Last Updated**: January 8, 2026
**Status**: Draft
