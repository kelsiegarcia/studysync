<div align="center">

# 📘 StudySync API  
### A Node.js + Express + MongoDB backend for coordinating study sessions, notes, progress tracking, and automated testing.

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Backend-lightgrey?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![Passport.js](https://img.shields.io/badge/Passport.js-OAuth2-blue?style=for-the-badge&logo=auth0)
![Swagger](https://img.shields.io/badge/Swagger-API_Docs-brightgreen?style=for-the-badge&logo=swagger)
![Jest](https://img.shields.io/badge/Jest-Automated_Tests-red?style=for-the-badge&logo=jest)
![Render](https://img.shields.io/badge/Render-Deployed-blue?style=for-the-badge&logo=render)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

</div>

---

A professionally built backend API for managing collaborative study sessions, user notes, and progress tracking.  
Includes Google OAuth authentication, MongoDB Atlas storage, **Jest automated testing**, and full Swagger API documentation.

---

## 📌 Overview

The StudySync API provides:

- 🔐 **Secure Google Authentication**  
- 📚 **CRUD operations** for Sessions, Notes, Progress, and Users  
- 🗂️ **MongoDB Atlas database** with multiple collections  
- 📄 **Complete Swagger documentation**
- 🧪 **Automated testing with Jest**  
- 🚀 **Live deployment on Render**

This project was developed for **CSE 341 – Web Backend Development**, with code quality and structure suitable for professional environments.

---

## 🛠️ Technologies Used

- Node.js + Express  
- MongoDB Atlas  
- Passport.js (Google OAuth 2.0)  
- Swagger (OpenAPI 2.0)
- Jest (Automated testing)    
- Render for deployment  

---

## 🌐 Live API + Documentation

**Base URL (Render):**  
https://studysync-2sto.onrender.com/


**Swagger UI:**  
https://studysync-2sto.onrender.com/api-docs

Use Swagger to explore all endpoints, test requests, and view schemas.

---

## 🧪 Testing

This project uses **Jest** to perform automated route testing.

The test suite verifies that:

- All major API routes (Sessions, Notes, Progress, Users) respond correctly  
- Protected routes enforce authentication  
- Endpoints return appropriate status codes  
- Swagger route loads successfully  
- Server boots and responds on expected paths  

Jest provides confidence that routes are reachable and responding as intended during development and deployment.
---

## 🗄️ Collections & Data Models

### **Sessions**
Tracks scheduled study sessions.

| Field | Type | Description |
|-------|------|-------------|
| SessionId | string | Unique session identifier |
| topic | string | Subject of the study session |
| time | string | Scheduled time |
| participants | string | Number of participants |

---

### **Notes**
Stores notes connected to study sessions.

| Field | Type | Description |
|-------|------|-------------|
| NotesId | string | Unique note ID |
| SessionId | string | Linked session |
| AuthorID | string | User who created the note |
| Content | string | Note content |
| timestamp | string | Time created |

---

### **Progress**
Tracks user study progress.

| Field | Type |
|-------|------|
| id | string |
| AuthorID | string |
| Topic | string |
| SessionCount | string |
| HostCount | string |
| Streak | string |
| Goals | string |

---

### **Users**
Stores authenticated user information.

| Field | Type |
|-------|------|
| AuthorID | string |
| name | string |
| email | string |
| subjects | string |

---

## 🔐 Authentication Flow (Simple Explanation)

Users log in with **Google OAuth**, and the API creates or retrieves their user profile.  
Authenticated users can then create sessions, notes, and progress records.

> Full OAuth setup config is handled in the backend — no setup required for graders or reviewers.

---

## 📚 Endpoints

### Sessions  
GET /sessions/
GET /sessions/:id
POST /sessions/
PUT /sessions/:id
DELETE /sessions/:id

### Notes  
GET /notes/
GET /notes/:id
POST /notes/
PUT /notes/:id
DELETE /notes/:id

### Progress  
GET /progress/
GET /progress/:id
POST /progress/
PUT /progress/:id
DELETE /progress/:id

### Users  
GET /users/
GET /users/:id
DELETE /users/:id

---

## ✔️ Error Handling & Validation

All endpoints include:

- `try/catch` blocks  
- Validation for invalid MongoDB ObjectIds  
- Consistent response status codes  
- JSON error messages for:  
  - 400 Bad Request  
  - 401 Unauthorized  
  - 404 Not Found  
  - 500 Server Error  

This ensures reliability and predictability for frontend clients.

---

## 👩‍💻 Developer Notes

This project demonstrates:

- API design with REST principles  
- Secure authentication (Google OAuth 2.0)  
- MongoDB CRUD operations  
- Swagger documentation  
- Clean, consistent controller architecture  
- Production deployment  

It serves as both a **CSE 341 project** and a **professional example** of backend development for future employers.

---

## 📄 License

This project is for educational and portfolio use.
