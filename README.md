# 🤖 Branky S.T.E.M. Labs — v3 (Next.js + Express)

Complete MERN-stack landing page + admin panel for Branky STEM Labs summer camps.

## 🗂️ Structure
```
branky-stemlab-v3/
├── frontend/               → Next.js app (Pages Router)
│   ├── pages/
│   │   ├── index.js        → Public landing page
│   │   └── admin/
│   │       ├── login.js    → Admin login
│   │       └── dashboard.js→ Admin dashboard
│   ├── styles/             → CSS Modules (brand colors)
│   └── public/             → Logo + fonts
├── backend/
│   └── index.js            → Express API (auth + registrations)
└── package.json            → Root scripts
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd branky-stemlab-v3
npm run install:all

```

### 2. Start Everything
```bash
npm run dev

```
- **Landing Page** → http://localhost:3000
- **Admin Login** → http://localhost:3000/admin/login
- **API** → http://localhost:5000

## 🔑 Admin Credentials
| Username | Password | Role |
|---------|----------|------|
| `admin` | `admin@123` | Super Admin |
| `manager` | `branky@2025` | Manager |

## 📡 API Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/register | ❌ | Submit registration |
| POST | /api/admin/login | ❌ | Admin login |
| GET | /api/admin/stats | ✅ | Dashboard stats |
| GET | /api/admin/registrations | ✅ | List registrations |
| PATCH | /api/admin/registrations/:id/status | ✅ | Update status |
| DELETE | /api/admin/registrations/:id | ✅ | Delete |
| POST | /api/admin/seed | ✅ Super Admin | Seed demo data |

## ✨ Features
### Landing Page (Next.js)
- Animated hero + countdown timer
- Flip-card program showcase
- 6-day curriculum accordion with YouTube video links
- Registration modal (student, parent, school, state, city)
- Stats, timeline, FAQ, CTA, Footer

### Admin Panel
- **Login page** — JWT authentication, demo credential hints
- **Overview tab** — 4 stat cards, 7-day bar chart, program breakdown, state map, quick actions
- **Registrations tab** — Full data table, search, filter by program/status, pagination, status update, delete
- **Analytics tab** — Visual charts, status breakdown, program popularity
- **Detail drawer** — Click any row to see full registration details + actions

## 🔧 Connect MongoDB (Production)
```bash
cd backend && npm install mongoose
```
Replace the in-memory arrays in `backend/index.js` with Mongoose models.
