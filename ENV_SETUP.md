# Vercel Environment Variables Setup

כשתכנס ל-Vercel Dashboard:
**Settings → Environment Variables**

הוסף את המשתנים הבאים:

```
DATABASE_URL=<your-neon-postgresq-url>
JWT_SECRET=<any-long-random-string>
WHATSAPP_TOKEN=<your-meta-access-token>
WHATSAPP_PHONE_ID=<your-meta-phone-number-id>
WHATSAPP_VERIFY_TOKEN=my-webhook-token-123
NEXT_PUBLIC_BASE_URL=https://wedding-rsvp-platform-jet.vercel.app
```

**כל מה שצריך:**
1. `DATABASE_URL` - מ-Neon
2. `WHATSAPP_TOKEN` - מ-Meta Business API
3. `WHATSAPP_PHONE_ID` - מ-Meta Business API
4. `WHATSAPP_VERIFY_TOKEN` - בחר את זה בעצמך (כל מחרוזת)
5. `JWT_SECRET` - בחר סתם מחרוזת
6. `NEXT_PUBLIC_BASE_URL` - URL של Vercel (כבר מוגדר)

**לאחר שתוסיף את המשתנים:**
Vercel יעדכן את האתר בעוד כמה שניות.
