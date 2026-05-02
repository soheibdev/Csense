# Condor Training Platform — API Documentation

> **Base URL:** `http://localhost:5000/api`
> **Content-Type:** `application/json`
> **Authentication:** Bearer Token (JWT)

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Admin — Users](#2-admin--users)
3. [Admin — Modules](#3-admin--modules)
4. [Admin — Quizzes](#4-admin--quizzes)
5. [Admin — Final Test](#5-admin--final-test)
6. [Admin — Dashboard Stats](#6-admin--dashboard-stats)
7. [Employee — Modules](#7-employee--modules)
8. [Employee — Progress & Quiz Submission](#8-employee--progress--quiz-submission)
9. [Employee — Final Test](#9-employee--final-test)
10. [Standard Response Format](#10-standard-response-format)
11. [Error Codes](#11-error-codes)

---

## 1. Authentication

All protected endpoints require the header:
```
Authorization: Bearer <accessToken>
```

The access token expires in **15 minutes**. Use `/auth/refresh` to silently renew it.

---

### POST `/auth/login`
**Access:** Public

**Request Body:**
```json
{
  "email": "john.doe@condor.com",
  "password": "securepassword123"
}
```

**Success `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "John Doe",
      "email": "john.doe@condor.com",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "15m"
  }
}
```

**Errors:** `401` Invalid credentials · `403` Account deactivated · `422` Missing fields

---

### POST `/auth/refresh`
**Access:** Public

**Request Body:**
```json
{ "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

**Success `200`:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### POST `/auth/logout`
**Access:** Authenticated (any role)
Header: `Authorization: Bearer <accessToken>`

**Success `200`:**
```json
{ "success": true, "message": "Logged out successfully" }
```

---

### GET `/auth/me`
**Access:** Authenticated (any role)

**Success `200`:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john.doe@condor.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 2. Admin — Users

> All endpoints require `role: "admin"`.

---

### GET `/admin/users`

**Query Params:** `page` (default 1) · `limit` (default 20) · `search` (name or email)

**Success `200`:**
```json
{
  "success": true,
  "users": [
    {
      "_id": "64f1...",
      "name": "John Doe",
      "email": "john.doe@condor.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 42,
  "page": 1,
  "totalPages": 3
}
```

---

### POST `/admin/users`

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@condor.com",
  "password": "StrongPass123",
  "role": "user"
}
```

| Field      | Required | Notes                            |
|------------|----------|----------------------------------|
| `name`     | Yes      | 2–100 characters                 |
| `email`    | Yes      | Must be unique                   |
| `password` | Yes      | Minimum 8 characters             |
| `role`     | No       | `"user"` (default) or `"admin"`  |

**Success `201`:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "64f1...",
    "name": "Jane Smith",
    "email": "jane.smith@condor.com",
    "role": "user",
    "isActive": true
  }
}
```

> Creating a user with `role: "user"` automatically initializes progress records for all existing modules (module 1 unlocked, modules 2–6 locked).

---

### GET `/admin/users/:id`

**Success `200`:** Returns user object.

---

### PUT `/admin/users/:id`

**Request Body (send only changed fields):**
```json
{
  "name": "Updated Name",
  "email": "new@condor.com",
  "password": "NewPassword123",
  "isActive": false
}
```

---

### DELETE `/admin/users/:id`

Permanently deletes the user and all their progress + quiz attempt records.

**Success `200`:**
```json
{ "success": true, "message": "User and all related data deleted" }
```

---

### GET `/admin/users/:id/progress`

**Success `200`:**
```json
{
  "success": true,
  "data": {
    "modules": [
      {
        "moduleId": { "_id": "64f1...", "title": "Security Fundamentals", "number": 1 },
        "moduleNumber": 1,
        "status": "completed",
        "quizScore": 5,
        "quizPercentage": 100,
        "quizPassed": true,
        "attempts": 1,
        "completedAt": "2024-01-16T09:00:00.000Z"
      }
    ],
    "summary": {
      "totalModules": 6,
      "completedModules": 1,
      "allModulesCompleted": false,
      "finalTestPassed": false,
      "finalTestAttempts": 0
    }
  }
}
```

---

## 3. Admin — Modules

> All endpoints require `role: "admin"`.

---

### GET `/admin/modules`

**Success `200`:**
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "_id": "64f1...",
      "number": 1,
      "title": "Security Fundamentals",
      "description": "Introduction to company security policies",
      "content": "<h2>Overview</h2><p>...</p>",
      "images": [
        {
          "_id": "64f1...",
          "url": "https://res.cloudinary.com/...",
          "publicId": "condor/images/abc123",
          "caption": "Security overview diagram"
        }
      ],
      "videoUrl": "https://res.cloudinary.com/.../video.mp4",
      "videoDuration": 90,
      "isActive": true
    }
  ]
}
```

---

### POST `/admin/modules`

**Request Body:**
```json
{
  "number": 1,
  "title": "Security Fundamentals",
  "description": "Introduction to company security policies and procedures",
  "content": "<h2>Overview</h2><p>This module covers...</p>",
  "isActive": true
}
```

| Field         | Required | Notes                        |
|---------------|----------|------------------------------|
| `number`      | Yes      | 1–6, must be unique          |
| `title`       | Yes      | 3–200 characters             |
| `description` | Yes      | Minimum 10 characters        |
| `content`     | Yes      | HTML/rich text, min 20 chars |
| `isActive`    | No       | Default: `true`              |

---

### GET `/admin/modules/:id`
Returns full module object.

---

### PUT `/admin/modules/:id`

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "content": "<p>Updated content...</p>",
  "isActive": false
}
```

---

### DELETE `/admin/modules/:id`
Deletes module, all user progress for this module, and removes Cloudinary files.

---

### POST `/admin/modules/:id/images`
**Content-Type:** `multipart/form-data`

| Field    | Description                               |
|----------|-------------------------------------------|
| `images` | 1–5 image files (jpg, png, webp, max 5MB) |

**Success `200`:**
```json
{
  "success": true,
  "message": "Images uploaded",
  "data": [
    {
      "_id": "64f1...",
      "url": "https://res.cloudinary.com/condor/images/abc123.jpg",
      "publicId": "condor/images/abc123",
      "caption": ""
    }
  ]
}
```

---

### DELETE `/admin/modules/:id/images/:imageId`
Removes one image from the module and deletes it from Cloudinary.

---

### POST `/admin/modules/:id/video`
**Content-Type:** `multipart/form-data`

| Field   | Description                            |
|---------|----------------------------------------|
| `video` | mp4, mov, avi or mkv file, max 200 MB  |

**Success `200`:**
```json
{
  "success": true,
  "message": "Video uploaded",
  "data": {
    "videoUrl": "https://res.cloudinary.com/condor/videos/xyz789.mp4"
  }
}
```

---

## 4. Admin — Quizzes

Nested under modules: `/admin/modules/:moduleId/quiz`

---

### GET `/admin/modules/:moduleId/quiz`

Returns quiz **with correct answers** (admin-only).

**Success `200`:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1...",
    "moduleId": "64f1...",
    "moduleNumber": 1,
    "passingScore": 80,
    "questions": [
      {
        "_id": "64f1...",
        "text": "What is the first step when you receive a suspicious email?",
        "options": [
          "Click the link to verify",
          "Forward it to IT security immediately",
          "Delete it without reading",
          "Reply asking for more information"
        ],
        "correctIndex": 1,
        "explanation": "Always report suspicious emails to the IT security team."
      }
    ]
  }
}
```

---

### POST `/admin/modules/:moduleId/quiz`

Creates or replaces the module quiz (upsert).
Must contain **exactly 5 questions**, each with **exactly 4 options**.

**Request Body:**
```json
{
  "passingScore": 80,
  "questions": [
    {
      "text": "What is the minimum password length at Condor?",
      "options": ["6 characters", "8 characters", "12 characters", "16 characters"],
      "correctIndex": 2,
      "explanation": "Condor policy requires a minimum of 12 characters."
    }
  ]
}
```

> `correctIndex` is 0-based: `0` = first option, `3` = last option.

**Success `200`:**
```json
{ "success": true, "message": "Quiz saved successfully", "data": { ...quiz } }
```

---

## 5. Admin — Final Test

---

### GET `/admin/final-test`
Returns final test **with correct answers**.

---

### POST `/admin/final-test`

Creates the final test. **Can only be called once.** Use PUT to update.
Must contain **exactly 15 questions**.

**Request Body:**
```json
{
  "title": "Condor Security Final Assessment",
  "description": "Covers all 6 modules. Score 70% or above to pass.",
  "passingScore": 70,
  "questions": [
    {
      "text": "Which action is social engineering?",
      "options": [
        "Installing antivirus software",
        "Pretending to be IT to get passwords",
        "Using a VPN",
        "Encrypting files"
      ],
      "correctIndex": 1,
      "explanation": "Social engineering manipulates people to reveal information.",
      "moduleNumber": 2
    }
  ]
}
```

---

### PUT `/admin/final-test`
Updates the final test. Send only changed fields.

---

## 6. Admin — Dashboard Stats

### GET `/admin/stats`

**Success `200`:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 48,
      "activeUsers": 45,
      "inactiveUsers": 3,
      "totalModules": 6,
      "completedAllModules": 12,
      "completionRate": 25
    },
    "quizStats": {
      "totalAttempts": 312,
      "passedAttempts": 280,
      "overallPassRate": 90
    },
    "finalTestStats": {
      "totalAttempts": 18,
      "passedAttempts": 14,
      "passRate": 78
    },
    "moduleBreakdown": [
      {
        "moduleNumber": 1,
        "totalUsers": 45,
        "completedUsers": 40,
        "completionRate": 89,
        "avgScore": 4,
        "avgPercentage": 82
      }
    ],
    "recentUsers": [
      {
        "_id": "64f1...",
        "name": "Alice Martin",
        "email": "alice@condor.com",
        "isActive": true,
        "createdAt": "2024-01-20T09:00:00.000Z"
      }
    ]
  }
}
```

---

## 7. Employee — Modules

> All endpoints require `role: "user"`.

---

### GET `/modules`

Returns all modules with the employee's personal lock/unlock status.

**Success `200`:**
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "_id": "64f1...",
      "number": 1,
      "title": "Security Fundamentals",
      "description": "Introduction to security policies",
      "hasVideo": true,
      "imageCount": 3,
      "status": "completed",
      "quizPassed": true,
      "quizScore": 5,
      "completedAt": "2024-01-16T09:00:00.000Z"
    },
    {
      "_id": "64f2...",
      "number": 2,
      "title": "Password Security",
      "status": "in_progress",
      "quizPassed": false,
      "quizScore": null
    },
    {
      "_id": "64f3...",
      "number": 3,
      "title": "Email & Phishing",
      "status": "locked",
      "quizPassed": false
    }
  ]
}
```

| `status`      | Description                                   |
|---------------|-----------------------------------------------|
| `locked`      | Not yet accessible — complete previous module |
| `in_progress` | Accessible — read content and take quiz       |
| `completed`   | Quiz passed                                   |

---

### GET `/modules/:id`

Returns full module content. Returns `403` if module is locked.

**Success `200`:**
```json
{
  "success": true,
  "data": {
    "module": {
      "_id": "64f1...",
      "number": 1,
      "title": "Security Fundamentals",
      "description": "...",
      "content": "<h2>Welcome</h2><p>This module covers...</p>",
      "images": [
        {
          "_id": "64f1...",
          "url": "https://res.cloudinary.com/condor/images/sec-overview.jpg",
          "caption": "Condor Security Framework"
        }
      ],
      "videoUrl": "https://res.cloudinary.com/condor/videos/module1.mp4",
      "videoDuration": 90
    },
    "progress": {
      "status": "in_progress",
      "quizPassed": false,
      "attempts": 0
    }
  }
}
```

**Error `403`:** Module is locked — complete the previous module first.

---

## 8. Employee — Progress & Quiz Submission

---

### POST `/modules/:id/quiz/submit`

Submit quiz answers for a module. `:id` is the module `_id`.

**Request Body:**
```json
{
  "answers": [1, 2, 0, 3, 2]
}
```

`answers` = array of exactly **5 integers** (0–3), one per question in order.

**Success `200` — Passed:**
```json
{
  "success": true,
  "data": {
    "passed": true,
    "score": 4,
    "percentage": 80,
    "totalQuestions": 5,
    "passingScore": 80,
    "attempts": 1,
    "message": "Congratulations! Module completed. Next module is now unlocked.",
    "details": [
      {
        "questionId": "64f1...",
        "questionText": "What is the first step...",
        "selectedIndex": 1,
        "correctIndex": 1,
        "isCorrect": true,
        "explanation": "Always report suspicious emails."
      }
    ]
  }
}
```

**Success `200` — Failed:**
```json
{
  "success": true,
  "data": {
    "passed": false,
    "score": 2,
    "percentage": 40,
    "totalQuestions": 5,
    "passingScore": 80,
    "attempts": 1,
    "message": "You scored 40%. Passing score is 80%. Please retry.",
    "details": [ ... ]
  }
}
```

**Business Rules:**
- `400` if quiz already passed (cannot retake a passed quiz)
- `403` if module is still locked
- Retry is unlimited until passing
- Passing unlocks the next module automatically

---

### GET `/progress`

Returns the authenticated employee's full progress.

**Success `200`:**
```json
{
  "success": true,
  "data": {
    "modules": [
      {
        "moduleId": {
          "_id": "64f1...",
          "title": "Security Fundamentals",
          "number": 1,
          "description": "..."
        },
        "moduleNumber": 1,
        "status": "completed",
        "quizScore": 5,
        "quizPercentage": 100,
        "quizPassed": true,
        "attempts": 1,
        "completedAt": "2024-01-16T09:00:00.000Z"
      }
    ],
    "quizAttempts": [
      {
        "_id": "64f1...",
        "type": "module",
        "moduleNumber": 1,
        "score": 5,
        "percentage": 100,
        "passed": true,
        "totalQuestions": 5,
        "createdAt": "2024-01-16T09:00:00.000Z"
      }
    ],
    "summary": {
      "totalModules": 6,
      "completedModules": 1,
      "allModulesCompleted": false,
      "finalTestEligible": false,
      "finalTestPassed": false,
      "finalTestAttempts": 0,
      "lastFinalScore": null
    }
  }
}
```

---

## 9. Employee — Final Test

---

### GET `/final-test`

Returns final test questions **without correct answers**.
Returns `403` if not all 6 modules are completed.

**Success `200`:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1...",
    "title": "Condor Security Final Assessment",
    "description": "This test covers all 6 security modules.",
    "totalQuestions": 15,
    "passingScore": 70,
    "questions": [
      {
        "_id": "64f1...",
        "text": "Which of the following is social engineering?",
        "options": [
          "Installing antivirus software",
          "Pretending to be IT to get passwords",
          "Using a VPN",
          "Encrypting files"
        ],
        "moduleNumber": 2
      }
    ]
  }
}
```

**Error `403`:** Complete all 6 modules before taking the final test.

---

### POST `/final-test/submit`

**Request Body:**
```json
{
  "answers": [1, 0, 2, 3, 1, 0, 2, 1, 3, 0, 2, 1, 0, 3, 2]
}
```

`answers` = array of exactly **15 integers** (0–3).

**Success `200` — Passed:**
```json
{
  "success": true,
  "data": {
    "passed": true,
    "score": 12,
    "percentage": 80,
    "totalQuestions": 15,
    "passingScore": 70,
    "attemptId": "64f1...",
    "message": "Congratulations! You passed with 80%. Training complete.",
    "details": [ ... ]
  }
}
```

**Business Rules:**
- Retry is unlimited — every attempt is saved
- `403` if not all 6 modules completed
- `404` if admin has not created the final test yet

---

## 10. Standard Response Format

**Success:**
```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Optional validation error array"]
}
```

---

## 11. Error Codes

| Code  | Meaning                                                                 |
|-------|-------------------------------------------------------------------------|
| `400` | Bad request — wrong data or business rule violation                     |
| `401` | Unauthorized — missing/expired/invalid token                           |
| `403` | Forbidden — access denied (wrong role or locked content)               |
| `404` | Resource not found                                                      |
| `409` | Conflict — duplicate email or resource already exists                  |
| `422` | Validation error — body failed schema validation                        |
| `429` | Too many requests (200/15min global · 15/15min for login)              |
| `500` | Internal server error                                                   |

---

## Token Flow (Quick Reference)

```
1. POST /auth/login            → returns accessToken + refreshToken
2. Store both tokens on client
3. Every API call              → Authorization: Bearer <accessToken>
4. On 401 "Token expired"      → POST /auth/refresh { refreshToken }
5. Replace stored accessToken  → continue
6. On logout                   → POST /auth/logout + delete both tokens
```

---

## GET `/health`  (No auth required)

```json
{
  "success": true,
  "message": "Condor Training API is running",
  "environment": "development",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

---

*Condor Training Platform v1.0.0 — Generated for frontend developers*
