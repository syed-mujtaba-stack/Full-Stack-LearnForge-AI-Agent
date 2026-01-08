# 🔌 API Specification - LearnForge AI

## 📋 Document Overview

This document provides complete API specifications for LearnForge AI, including authentication, endpoints, request/response formats, error handling, and rate limiting.

---

## 🌐 API General Information

### Base URLs
- **Production**: `https://api.learnforge.ai`
- **Staging**: `https://api-staging.learnforge.ai`
- **Development**: `http://localhost:8000`

### API Versioning
- Current Version: `v1`
- Full URL: `https://api.learnforge.ai/v1`

### Content Type
- Request: `application/json`
- Response: `application/json`

---

## 🔐 Authentication

### Authentication Methods

#### 1. JWT Bearer Token
```http
Authorization: Bearer <access_token>
```

#### 2. Firebase ID Token
```http
Authorization: Bearer <firebase_id_token>
```

### Authentication Endpoints

#### POST /v1/auth/register
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecureP@ss123",
  "full_name": "John Doe",
  "role": "student"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-v4",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "student",
      "created_at": "2026-01-08T10:30:00Z"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIs...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
      "token_type": "bearer",
      "expires_in": 3600
    }
  }
}
```

#### POST /v1/auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecureP@ss123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": { ...user_object },
    "tokens": { ...tokens_object }
  }
}
```

#### POST /v1/auth/refresh
Refresh access token.

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "access_token": "new_access_token",
    "expires_in": 3600
  }
}
```

#### POST /v1/auth/logout
Invalidate current session.

**Request:**
```http
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

---

## 👤 User Endpoints

### GET /v1/users/me
Get current user profile.

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-v4",
    "email": "user@example.com",
    "full_name": "John Doe",
    "display_name": "JohnD",
    "avatar_url": "https://cdn.learnforge.ai/avatars/...",
    "bio": "Passionate learner...",
    "role": "student",
    "subscription_tier": "premium",
    "total_xp": 1250,
    "current_level": 5,
    "streak_days": 7,
    "created_at": "2026-01-01T00:00:00Z"
  }
}
```

### PATCH /v1/users/me
Update current user profile.

**Request:**
```json
{
  "full_name": "John Smith",
  "bio": "Updated bio",
  "language": "en",
  "timezone": "America/New_York",
  "email_notifications": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": { ...updated_user_object }
}
```

### POST /v1/users/me/avatar
Upload user avatar.

**Request:**
```http
Content-Type: multipart/form-data

file: <image_file>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "avatar_url": "https://cdn.learnforge.ai/avatars/uuid-v4.jpg"
  }
}
```

---

## 📚 Course Endpoints

### GET /v1/courses
Get list of courses with filtering and pagination.

**Query Parameters:**
- `page` (integer, default: 1)
- `per_page` (integer, default: 20, max: 100)
- `category` (string, optional)
- `difficulty` (enum: beginner|intermediate|advanced|expert)
- `is_free` (boolean)
- `search` (string) - Full-text search
- `sort_by` (enum: popular|newest|rating|price)

**Example Request:**
```http
GET /v1/courses?category=programming&difficulty=intermediate&page=1&per_page=20
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "uuid-v4",
        "title": "Advanced Python Programming",
        "slug": "advanced-python-programming",
        "description": "Master advanced Python concepts...",
        "short_description": "Learn advanced Python...",
        "thumbnail_url": "https://cdn.learnforge.ai/...",
        "instructor": {
          "id": "instructor-uuid",
          "full_name": "Dr. Jane Smith",
          "avatar_url": "https://..."
        },
        "category": "Programming",
        "subcategory": "Python",
        "difficulty_level": "intermediate",
        "price": 49.99,
        "currency": "USD",
        "is_free": false,
        "average_rating": 4.7,
        "total_reviews": 1250,
        "total_enrollments": 15000,
        "total_duration_minutes": 1200,
        "has_certificate": true,
        "published_at": "2025-12-01T00:00:00Z"
      }
    ]
  },
  "meta": {
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 150,
      "total_pages": 8
    }
  }
}
```

### GET /v1/courses/{course_id}
Get detailed course information.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-v4",
    "title": "Advanced Python Programming",
    "slug": "advanced-python-programming",
    "description": "Comprehensive course description...",
    "learning_objectives": [
      "Master decorators and metaclasses",
      "Understand async/await patterns",
      "Build scalable applications"
    ],
    "prerequisites": [
      "Basic Python knowledge",
      "OOP concepts"
    ],
    "instructor": { ...instructor_details },
    "curriculum": [
      {
        "module_id": "module-uuid",
        "title": "Module 1: Advanced Functions",
        "description": "Deep dive into functions...",
        "order_index": 1,
        "duration_minutes": 180,
        "lessons": [
          {
            "lesson_id": "lesson-uuid",
            "title": "Decorators Explained",
            "lesson_type": "video",
            "duration_minutes": 25,
            "is_preview": true,
            "order_index": 1
          }
        ]
      }
    ],
    "statistics": {
      "total_modules": 8,
      "total_lessons": 65,
      "total_duration_minutes": 1200,
      "total_enrollments": 15000,
      "average_rating": 4.7,
      "completion_rate": 68
    }
  }
}
```

### POST /v1/courses
Create a new course (Instructor only).

**Request:**
```json
{
  "title": "Machine Learning Fundamentals",
  "description": "Learn ML basics...",
  "category": "Data Science",
  "difficulty_level": "beginner",
  "price": 79.99,
  "is_free": false
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": { ...created_course_object }
}
```

### PATCH /v1/courses/{course_id}
Update course details.

**Request:**
```json
{
  "title": "Updated Title",
  "price": 59.99,
  "status": "published"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": { ...updated_course_object }
}
```

---

## 📖 Enrollment Endpoints

### POST /v1/enrollments
Enroll in a course.

**Request:**
```json
{
  "course_id": "course-uuid",
  "payment_id": "stripe_payment_id" // Optional, for paid courses
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "enrollment_id": "enrollment-uuid",
    "course_id": "course-uuid",
    "user_id": "user-uuid",
    "enrolled_at": "2026-01-08T10:30:00Z",
    "status": "active",
    "progress_percentage": 0
  }
}
```

### GET /v1/enrollments
Get user's enrollments.

**Query Parameters:**
- `status` (enum: active|completed|expired|dropped)
- `page`, `per_page`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "enrollment_id": "uuid",
        "course": { ...course_summary },
        "progress_percentage": 45,
        "completed_lessons": 12,
        "total_lessons": 35,
        "total_time_spent_minutes": 420,
        "last_accessed_at": "2026-01-08T10:00:00Z",
        "status": "active"
      }
    ]
  }
}
```

### GET /v1/enrollments/{enrollment_id}/progress
Get detailed progress for an enrollment.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "enrollment_id": "uuid",
    "course_id": "uuid",
    "progress_percentage": 45,
    "modules": [
      {
        "module_id": "uuid",
        "title": "Module 1",
        "completed": true,
        "lessons": [
          {
            "lesson_id": "uuid",
            "title": "Lesson 1.1",
            "status": "completed",
            "progress_percentage": 100,
            "completed_at": "2026-01-05T14:30:00Z"
          }
        ]
      }
    ]
  }
}
```

---

## 📝 Assessment Endpoints

### GET /v1/assessments/{assessment_id}
Get assessment details.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Python Basics Quiz",
    "description": "Test your Python knowledge",
    "assessment_type": "quiz",
    "time_limit_minutes": 30,
    "total_points": 100,
    "passing_percentage": 70,
    "max_attempts": 3,
    "questions": [
      {
        "id": "question-uuid",
        "question_text": "What is a decorator?",
        "question_type": "multiple_choice",
        "points": 5,
        "options": [
          {"id": 1, "text": "A function wrapper"},
          {"id": 2, "text": "A design pattern"},
          {"id": 3, "text": "A class method"},
          {"id": 4, "text": "None of the above"}
        ]
      }
    ]
  }
}
```

### POST /v1/assessments/{assessment_id}/attempts
Start a new assessment attempt.

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user_assessment_id": "uuid",
    "assessment_id": "uuid",
    "attempt_number": 1,
    "started_at": "2026-01-08T10:30:00Z",
    "expires_at": "2026-01-08T11:00:00Z",
    "status": "in_progress"
  }
}
```

### POST /v1/assessments/attempts/{user_assessment_id}/submit
Submit assessment answers.

**Request:**
```json
{
  "answers": [
    {
      "question_id": "question-uuid",
      "answer_text": "A function wrapper",
      "selected_option_id": 1
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user_assessment_id": "uuid",
    "status": "graded",
    "points_earned": 85,
    "percentage_score": 85,
    "passed": true,
    "submitted_at": "2026-01-08T10:45:00Z",
    "time_taken_seconds": 900,
    "results": [
      {
        "question_id": "uuid",
        "is_correct": true,
        "points_awarded": 5,
        "correct_answer": "A function wrapper"
      }
    ]
  }
}
```

---

## 🤖 AI Tutor Endpoints

### POST /v1/ai/conversations
Start a new AI conversation.

**Request:**
```json
{
  "conversation_type": "general",
  "course_id": "course-uuid", // Optional
  "initial_message": "Explain Python decorators"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "conversation_id": "uuid",
    "conversation_type": "general",
    "created_at": "2026-01-08T10:30:00Z"
  }
}
```

### POST /v1/ai/conversations/{conversation_id}/messages
Send a message to AI tutor.

**Request:**
```json
{
  "message": "Can you explain this with an example?"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message_id": "uuid",
    "role": "assistant",
    "content": "Of course! Here's an example of a Python decorator...",
    "tokens_used": 150,
    "model_used": "gpt-4-turbo",
    "created_at": "2026-01-08T10:30:05Z"
  }
}
```

### POST /v1/ai/code-help
Get AI assistance for code debugging.

**Request:**
```json
{
  "code": "def my_function():\n    print('Hello')\n    return None",
  "language": "python",
  "problem_description": "This function doesn't seem to work"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "analysis": "The function works correctly...",
    "suggestions": [
      "Consider adding docstring",
      "Use more descriptive name"
    ],
    "corrected_code": "def greet_user():\n    \"\"\"Print greeting\"\"\"\n    print('Hello')\n    return None"
  }
}
```

---

## 🎮 Gamification Endpoints

### GET /v1/achievements
Get available achievements.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "id": "uuid",
        "name": "First Course Complete",
        "description": "Complete your first course",
        "icon_url": "https://...",
        "achievement_type": "course_completion",
        "xp_reward": 100,
        "badge_tier": "bronze",
        "user_earned": false
      }
    ]
  }
}
```

### GET /v1/users/me/achievements
Get user's earned achievements.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "achievement": { ...achievement_object },
        "earned_at": "2026-01-05T10:00:00Z"
      }
    ],
    "total_xp": 1250,
    "current_level": 5
  }
}
```

### GET /v1/leaderboard
Get leaderboard rankings.

**Query Parameters:**
- `timeframe` (enum: daily|weekly|monthly|all_time)
- `limit` (integer, max: 100)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "rankings": [
      {
        "rank": 1,
        "user": {
          "id": "uuid",
          "display_name": "JohnD",
          "avatar_url": "https://..."
        },
        "total_xp": 15000,
        "level": 25,
        "courses_completed": 45
      }
    ],
    "current_user_rank": 142
  }
}
```

---

## 📊 Analytics Endpoints

### GET /v1/analytics/dashboard
Get user analytics dashboard data.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_courses_enrolled": 5,
      "courses_in_progress": 3,
      "courses_completed": 2,
      "total_learning_time_minutes": 1250,
      "current_streak_days": 7,
      "total_xp": 2500
    },
    "recent_activity": [
      {
        "type": "lesson_completed",
        "course_title": "Python Basics",
        "lesson_title": "Variables and Types",
        "timestamp": "2026-01-08T09:00:00Z"
      }
    ],
    "progress_by_category": [
      {
        "category": "Programming",
        "courses_enrolled": 3,
        "completion_percentage": 45
      }
    ]
  }
}
```

---

## ❌ Error Responses

### Standard Error Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### HTTP Status Codes

- `200 OK` - Successful GET, PATCH, DELETE
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE with no response body
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (duplicate)
- `422 Unprocessable Entity` - Validation errors
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Service temporarily unavailable

### Error Codes

```typescript
enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  DUPLICATE_RESOURCE = "DUPLICATE_RESOURCE",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE"
}
```

---

## 🔒 Rate Limiting

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1641643200
```

### Rate Limits by Tier

| Tier | Requests per Minute | Requests per Hour |
|------|---------------------|-------------------|
| Free | 30 | 500 |
| Basic | 60 | 1,500 |
| Premium | 120 | 5,000 |
| Enterprise | Custom | Custom |

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retry_after": 60
  }
}
```

---

## 📡 WebSocket Events

### Connection URL
```
wss://api.learnforge.ai/ws?token=<access_token>
```

### Events

#### course:progress_update
```json
{
  "event": "course:progress_update",
  "data": {
    "enrollment_id": "uuid",
    "progress_percentage": 47,
    "completed_lessons": 13
  }
}
```

#### notification:new
```json
{
  "event": "notification:new",
  "data": {
    "notification_id": "uuid",
    "type": "achievement_earned",
    "title": "New Achievement!",
    "message": "You earned 'Course Master' badge"
  }
}
```

---

## 🔐 Security Headers

All API responses include security headers:

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

---

**Document Version**: 1.0  
**Last Updated**: January 8, 2026  
**Status**: Draft
