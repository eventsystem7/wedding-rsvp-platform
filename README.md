# Wedding RSVP System - README

## 🎉 Overview
A modern wedding RSVP management system built with Next.js, featuring WhatsApp integration for guest invitations and real-time response tracking.

## ✨ Features

### Core Functionality
- **User Authentication** - Secure registration and login with JWT
- **Event Management** - Create and manage multiple wedding events
- **Guest Management** - Upload guest lists via CSV
- **WhatsApp Integration** - Send invitations directly via WhatsApp
- **Real-time RSVP Tracking** - Live statistics dashboard
- **Mobile-First Design** - Fully responsive interface

### Technical Stack
- **Frontend:** Next.js 16 + React 19 + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** Prisma ORM + SQLite (dev) / PostgreSQL (production)
- **Authentication:** JWT + bcrypt
- **CSV Parsing:** PapaParse
- **HTTP Client:** Axios

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
# Open http://localhost:3000
```

### Environment Variables
Create `.env.local`:
```
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-secret-key-change-in-production"
WHATSAPP_TOKEN="your-whatsapp-business-api-token"
WHATSAPP_PHONE_ID="your-phone-number-id"
WHATSAPP_VERIFY_TOKEN="your-webhook-verify-token"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### Database Setup
```bash
npx prisma migrate dev --name init
```

## 📱 Pages

| Page | Purpose |
|------|---------|
| `/` | Landing page with login/register options |
| `/register` | User registration |
| `/login` | User login |
| `/dashboard` | View and create events |
| `/events/[id]` | Manage guests, send WhatsApp, view stats |

## 🔌 API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | User login |
| `/api/auth/me` | GET | Get current user |
| `/api/events` | GET/POST | List/create events |
| `/api/guests` | GET/POST | List/add guests |
| `/api/rsvp` | POST | Update RSVP status |
| `/api/whatsapp/send` | POST | Send WhatsApp messages |
| `/api/whatsapp/webhook` | GET/POST | WhatsApp webhook |

## 📊 Database Schema

### User
- id, email, password, name, createdAt, updatedAt

### Event
- id, userId, groomName, brideName, eventDate, eventLocation, createdAt, updatedAt

### Guest
- id, eventId, name, phone, email, status (pending/confirmed/declined), sentAt, respondedAt, createdAt, updatedAt

## 🎯 Workflow

1. **Register** → Create account
2. **Create Event** → Add wedding details
3. **Upload Guests** → CSV import with name, phone, email
4. **Send WhatsApp** → Automated invitations to all guests
5. **Track Responses** → Real-time dashboard with stats
6. **Manage RSVPs** → View confirmations/declines

## 🔐 Security

- Passwords hashed with bcrypt
- JWT token-based authentication
- Protected API routes with token verification
- Environment variables for sensitive data
- CORS-ready for future integrations

## 📈 Deployment

See `DEPLOYMENT.md` for production setup on Vercel.

## 🛠️ Development

### Build
```bash
npm run build
npm start
```

### Lint
```bash
npm run lint
```

### Database
```bash
npx prisma studio  # Visual database explorer
npx prisma migrate dev  # Create migrations
```

## 📝 License
ISC

## 🤝 Support
For issues or questions, check the deployment guide or contact support.
