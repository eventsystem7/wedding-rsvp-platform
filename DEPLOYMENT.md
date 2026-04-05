# Wedding RSVP - Deployment Guide

## Prerequisites
- Vercel account (free tier works)
- GitHub account with the repo pushed
- WhatsApp Business Account credentials

## Steps to Deploy

### 1. Push to GitHub
```bash
cd /home/ubuntu/.openclaw/workspace/wedding-rsvp
git remote add origin https://github.com/YOUR_USERNAME/wedding-rsvp.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select "Next.js" as the framework
4. Configure environment variables:
   - `DATABASE_URL`: `file:./prisma/dev.db` (or use a cloud DB like Neon)
   - `JWT_SECRET`: Generate a strong secret
   - `WHATSAPP_TOKEN`: Your WhatsApp Business API token
   - `WHATSAPP_PHONE_ID`: Your phone number ID
   - `WHATSAPP_VERIFY_TOKEN`: Your webhook verify token
   - `NEXT_PUBLIC_BASE_URL`: Your Vercel deployment URL

### 3. Database Setup
For production, use a cloud database instead of SQLite:
- **Option A:** Neon (PostgreSQL) - Free tier available
- **Option B:** PlanetScale (MySQL) - Free tier available

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // or "mysql"
  url      = env("DATABASE_URL")
}
```

### 4. Run Migrations
After deployment, run:
```bash
npx prisma migrate deploy
```

### 5. Configure WhatsApp Webhook
In Meta Business Manager:
1. Go to WhatsApp > Configuration
2. Set Webhook URL: `https://your-vercel-url.vercel.app/api/whatsapp/webhook`
3. Set Verify Token: (use the same as `WHATSAPP_VERIFY_TOKEN`)
4. Subscribe to `messages` and `message_status` events

## Testing
- Register a test account
- Create a test event
- Upload test guests
- Send WhatsApp messages (requires WhatsApp Business Account)

## Monitoring
- Check Vercel logs: https://vercel.com/dashboard
- Monitor database performance
- Track WhatsApp API usage
