# 📚 Learning Progress Tracker Dashboard

A full-stack MERN application for tracking student learning progress with role-based access control.

---

## 🚀 Features

### Student
- Create & manage learning goals with progress tracking
- Study timer (start/stop) + manual session logging
- Analytics: Weekly bar chart, monthly line chart, subject doughnut chart
- View tutor feedback with star ratings
- Download PDF progress report

### Tutor
- View all students with last activity status
- Submit feedback with star rating
- View student progress statistics

### Admin
- Platform-wide analytics dashboard
- User management (block/unblock/delete)
- Search and filter users by role

### Core Features
- JWT authentication with protected routes
- Role-based access control
- Dark mode toggle
- Responsive design
- Email reminders (inactive 3+ days)
- Pagination & search/filter

---

## 🏗️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, Tailwind CSS, React Router, Axios, Chart.js |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| Extras | node-cron, nodemailer |

---

## 📁 Project Structure

```
learning-tracker/
├── backend/
│   ├── config/          # DB config
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # Cron jobs, email, seeder
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/  # Reusable components
        │   ├── common/
        │   └── layout/  # Sidebar layout
        ├── context/     # Auth, Theme context
        ├── hooks/       # useTimer
        ├── pages/       # Page components
        │   ├── auth/    # Login, Register
        │   ├── student/ # Dashboard, Goals, Sessions, Analytics, Feedback
        │   ├── tutor/   # Dashboard
        │   └── admin/   # Dashboard, Users
        ├── services/    # API service layer
        └── utils/       # PDF generator
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

Edit `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/learning-tracker
JWT_SECRET=your_secret_key_here_make_it_long
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173

# Optional - for email reminders
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Seed Database

```bash
cd backend
npm run seed
```

### 4. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

App runs at: **http://localhost:5173**
API runs at: **http://localhost:5000**

---

## 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@tracker.com | admin123 |
| Tutor | tutor@tracker.com | tutor123 |
| Student | student@tracker.com | student123 |

---

## 🌐 API Reference

### Authentication
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - Login
GET  /api/auth/me          - Get current user
```

### Goals (Student only)
```
GET    /api/goals           - List goals (paginated, searchable)
POST   /api/goals           - Create goal
PUT    /api/goals/:id       - Update goal
DELETE /api/goals/:id       - Delete goal
```

### Study Sessions (Student only)
```
GET  /api/study-sessions            - List sessions
POST /api/study-sessions            - Log session
GET  /api/study-sessions/analytics  - Get analytics data
```

### Feedback
```
GET  /api/feedback                          - Get feedback (role-filtered)
POST /api/feedback                          - Submit feedback (tutor)
GET  /api/feedback/students                 - List students (tutor)
GET  /api/feedback/students/:id/stats       - Student stats (tutor)
```

### Admin
```
GET    /api/admin/users          - List all users
PUT    /api/admin/users/:id/block - Toggle block user
DELETE /api/admin/users/:id      - Delete user
GET    /api/admin/analytics      - Platform analytics
```

---

## 🗄️ Database Schemas

### User
```js
{ name, email, password, role: [student|tutor|admin], isBlocked, lastActivity }
```

### Goal
```js
{ studentId, title, description, subject, targetDate, progress: 0-100, status: [active|completed|paused] }
```

### StudySession
```js
{ studentId, date, duration (minutes), subject, notes }
```

### Feedback
```js
{ tutorId, studentId, comment, rating: 1-5 }
```

---

## 🚀 Production Deployment

### Backend (Railway/Render)
1. Set all env vars in hosting dashboard
2. Set `NODE_ENV=production`
3. Use MongoDB Atlas connection string

### Frontend (Vercel/Netlify)
1. Set `VITE_API_URL` if not using proxy
2. Update `vite.config.js` proxy or use full API URL in services

---

## 🔒 Security Features
- Rate limiting (100 req/15min)
- Helmet security headers
- CORS configured
- JWT token validation
- Password hashing (bcrypt)
- Role-based authorization middleware
- Input validation

---

## 📧 Email Reminders
Configured via cron job (daily 9 AM) — sends email to students inactive for 3+ days.
Configure `EMAIL_*` env vars to enable.
