# 🔒 Security & Authentication Architecture - LearnForge AI

## 📋 Document Overview

This document details the security architecture for LearnForge AI, covering authentication mechanisms, authorization models, data protection, and compliance standards.

---

## 🔐 Authentication Strategy

We use a hybrid authentication approach combining **Firebase Auth** for identity management and **JSON Web Tokens (JWT)** for session handling.

### 1. Primary Authentication: Firebase Auth
- **Providers**:
  - Email/Password
  - Google OAuth
  - GitHub OAuth
  - Microsoft OAuth (for institutional login)
- **Benefits**: Handles complexity of identity verification, password resets, and email verification.

### 2. Session Management: JWT
- **Access Tokens**: Short-lived (15-60 min), signed using HS256/RS256.
- **Refresh Tokens**: Long-lived (7-30 days), stored securely, used to rotate access tokens.
- **Flow**:
  1. Client authenticates with Firebase (Client SDK).
  2. Client receives ID Token.
  3. Client exchanges ID Token with Backend (`/v1/auth/login` or `exchange`).
  4. Backend verifies ID Token with Firebase Admin SDK.
  5. Backend issues internal JWT Access + Refresh Tokens.

### 3. Protection Mechanisms
- **Rate Limiting**: Per IP and per User endpoints to prevent brute force (e.g., 5 login attempts/min).
- **MFA (Multi-Factor Auth)**: Optional for Students/Instructors, Mandatory for Admins.

---

## 👮 Authorization System (RBAC)

LearnForge AI implements Role-Based Access Control (RBAC) to enforce permissions.

### User Roles

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **Student** | Standard learner account | View enrolled courses, submit assignments, track progress. |
| **Instructor**| Course creator | Create courses, grade assignments, view student progress (own courses). |
| **Moderator** | Content moderator | Review user reports, moderate forums/reviews. |
| **Admin** | System administrator | Manage users, platform settings, view global analytics. |

### Implementation
- **Middleware**: `DEPENDS(get_current_active_user)` checks token validity.
- **Scopes/Claims**: JWT payload includes `role` and specific permissions scope if needed.
- **Decorator**: `@require_role(["admin", "instructor"])` on API endpoints.

```python
# Authorization Example
@router.post("/courses", response_model=Course)
async def create_course(
    course: CourseCreate,
    current_user: User = Depends(require_role(["instructor", "admin"]))
):
    ...
```

---

## 🛡️ Data Security

### 1. Encryption
- **At Rest**: 
  - Database: Storage encryption (AES-256) provided by Supabase/PostgreSQL.
  - Object Storage: Server-side encryption (SSE-S3).
- **In Transit**:
  - All traffic forced over **HTTPS** (TLS 1.2+).
  - HSTS (HTTP Strict Transport Security) enabled.

### 2. Row Level Security (RLS)
- Implemented directly in the PostgreSQL database via Supabase.
- Ensures a user can *physically* only access rows they are permitted to see, even if API logic fails.
- **Example Policy**:
  ```sql
  CREATE POLICY "Users can only see their own enrollments"
  ON enrollments
  FOR SELECT
  USING (auth.uid() = user_id);
  ```

### 3. Input Validation & Sanitization
- **Backend**: Pydantic models strictly define and validate all incoming data types and constraints.
- **Frontend**: React Hook Form with Zod schemas for client-side validation.
- **Sanitization**: Bleach (Python) or equivalent libraries to sanitize HTML content in course descriptions/forums to prevent XSS.

---

## 🌐 Network Security

### 1. API Gateway / Edge
- **CORS**: Strict Allow-Origin policies whitelist only our frontend domains.
- **WAF**: Cloudflare WAF or similar to block malicious traffic (SQLi, XSS botnets).
- **DDoS Protection**: Basic shielding via standard CDN provider tiers.

### 2. Header Security
- `Content-Security-Policy`: Restricts sources of scripts, styles, and images.
- `X-Frame-Options`: DENY (prevents clickjacking).
- `X-Content-Type-Options`: nosniff.

---

## 📝 Audit & Compliance

### 1. Audit Logging
- **Activity Logs**: All sensitive actions (login, payment, role change, content deletion) are logged to a separate `audit_logs` table or external service.
- **Fields**: `user_id`, `action`, `resource_id`, `ip_address`, `timestamp`, `metadata`.

### 2. Privacy (GDPR/CCPA)
- **Data Export**: Users can request a download of all their data.
- **Right to be Forgotten**: Implementation of "Soft Delete" vs "Hard Delete" strategies to comply with deletion requests while maintaining integrity (e.g., anonymizing contributions).
- **Cookie Consent**: Management of tracking scripts.

### 3. Payment Security (PCI-DSS)
- **Offloading**: We do *not* handle raw credit card numbers.
- **Stripe**: Usage of Stripe Elements/Checkout ensures card data goes directly to Stripe. We only store tokens/customer IDs.

---

## 🚨 Incident Response Hook

1. **Identification**: Alert from Sentry/Monitoring.
2. **Containment**: Revoke compromised tokens, block IPs, or maintenance mode.
3. **Eradication**: Fix vulnerability, patch system.
4. **Recovery**: Restore data from backups if necessary, verify fix.
5. **Lessons Learned**: Post-mortem report.

---

**Document Version**: 1.0  
**Last Updated**: January 8, 2026  
**Status**: Draft
