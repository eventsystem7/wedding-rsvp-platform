# Wedding RSVP Platform - Setup & Status

## 📋 סטטוס פרויקט (Project Status)

**תאריך:** 14 באפריל 2026  
**מצב:** ✅ כמעט מוכן להשקה

---

## 🔧 שנתקנו היום (What We Fixed Today)

### ✅ בעיית התחברות (Login Issue)
**הבעיה:** לא היה אפשר להתחבר בשום מייל
**הסיבה:** ה-JWT_SECRET היה עם ערך default ולא secure

**ההצלה:** ✅ עדכנו JWT_SECRET לערך secure

**תוצאה:** ✅ התחברות עובדת עכשיו!

---

## 🚀 איך להריץ את הפרויקט (How to Run)

### 1️⃣ **בפעם הראשונה:**
```bash
cd wedding-project-complete
npm install
```

### 2️⃣ **הגדרות סביבה (.env.local):**
```
DATABASE_URL="postgresql://neondb_owner:npg_TmeHVYo86xpu@ep-late-rain-an5n7jt6-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET="[שנשמר כ-environment variable]"
WHATSAPP_TOKEN="YOUR_WHATSAPP_BUSINESS_ACCOUNT_TOKEN"
WHATSAPP_PHONE_ID="YOUR_PHONE_NUMBER_ID"
```

### 3️⃣ **הריץ את הפרויקט:**
```bash
npm run dev
```

**אתר יופיע ב:** http://localhost:3001

---

## 👤 משתמש בדיקה (Test User)

```
Email: eliya3923@gmail.com
Password: Aa102040A
```

---

## 📁 מבנה הפרויקט (Project Structure)

```
wedding-project-complete/
├── app/
│   ├── api/
│   │   ├── auth/          ← התחברות + רישום
│   │   ├── events/        ← אירועים
│   │   ├── guests/        ← אורחים
│   │   └── vendors/       ← ספקים
│   ├── (auth)/            ← דפי התחברות
│   ├── dashboard/         ← דשבורד
│   ├── events/            ← ניהול אירועים
│   └── vendors/           ← ניהול ספקים
├── lib/
│   ├── auth.ts            ← JWT logic
│   ├── password.ts        ← bcrypt
│   └── prisma.ts          ← database
├── prisma/
│   ├── schema.prisma      ← database schema
│   └── migrations/
└── .env.local             ← סודות (secrets)
```

---

## 🗄️ בסיס הנתונים (Database)

**סוג:** PostgreSQL (Neon)  
**טבלאות:**
- `User` - משתמשים
- `Event` - אירועים
- `Guest` - אורחים
- `Vendor` - ספקים
- `EventVendor` - קשר בין אירוע וספק

**סטטוס:** ✅ מחובר ועובד

---

## ✨ תכונות שנבנו (Features)

### Phase 1 ✅
- ✅ התחברות + רישום (Authentication)
- ✅ ניהול אירועים (Event Management)
- ✅ ניהול אורחים (Guest Management)
- ✅ RSVP system (WhatsApp Integration)
- ✅ דשבורד (Dashboard)

### Phase 2 ✅ (בנינו היום)
- ✅ ניהול ספקים (Vendors)
- ✅ קישור ספקים לאירועים

### Phase 3 ⏳ (הבא)
- [ ] תוכנית ישיבה (Seating Plan)
- [ ] תזכורות WhatsApp
- [ ] עלאות תמונות

---

## 📝 הצעדים הבאים (Next Steps)

1. **בדוק את הפרויקט מקומית:**
   ```bash
   cd wedding-project-complete
   npm run dev
   # ההתחברות צריכה לעבוד עכשיו ✅
   ```

2. **עדכן Vercel עם JWT_SECRET (ל-production):**
   ```bash
   vercel login
   vercel env add JWT_SECRET
   # [הכנס את ה-secret שלך]
   ```

3. **דחוף ל-GitHub:**
   ```bash
   git push origin main
   # Vercel ישמור דחייה + ידיפלוי אוטומטי
   ```

---

## 🆘 אם משהו לא עובד

1. **בדוק ש-npm packages מותקנות:**
   ```bash
   npm install
   ```

2. **בדוק את המסד:**
   ```bash
   npx prisma db push
   ```

3. **נקה את המטמון:**
   ```bash
   rm -rf .next node_modules
   npm install
   npm run dev
   ```

---

## 📞 תמיכה

אם יש בעיה כלשהי, תגיד לי. אני כאן! 💪

---

**עדכון אחרון:** 14 באפריל 2026, 17:09 UTC
