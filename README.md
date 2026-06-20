# MedFlow — Healthcare Clinic Management SaaS

## كيفية تشغيل المشروع محلياً (Run Locally)

### المتطلبات (Requirements)
- Node.js 20+ 
- PostgreSQL (محلي أو سحابي مثل Supabase/Neon/Railway)
- npm أو pnpm

### خطوات التشغيل

```bash
# 1) فك ضغط الملف وادخل المجلد
unzip medflow.zip
cd medflow

# 2) تثبيت الحزم
npm install

# 3) إعداد متغيرات البيئة
cp .env.example .env.local
# افتح .env.local وعدّل DATABASE_URL و AUTH_SECRET على الأقل

# 4) إنشاء قاعدة البيانات وتطبيق الـ schema
npx prisma generate
npx prisma db push

# 5) (اختياري) تعبئة بيانات تجريبية
npx tsx prisma/seed.ts

# 6) تشغيل المشروع
npm run dev
```

افتح المتصفح على: **http://localhost:3000**

### حسابات تجريبية (Demo Accounts) — بعد عمل seed
| الدور | الإيميل | كلمة المرور |
|---|---|---|
| Super Admin | admin@medflow.com | Demo1234 |
| Doctor | doctor@medflow.com | Demo1234 |
| Receptionist | reception@medflow.com | Demo1234 |
| Patient | patient@medflow.com | Demo1234 |

### الحصول على قاعدة بيانات PostgreSQL مجانية بسرعة
أسهل طريقة: اعمل حساب على [Neon.tech](https://neon.tech) أو [Supabase](https://supabase.com) (مجاني)، خد الـ Connection String وحطه في `DATABASE_URL` جوه `.env.local`.

### النشر (Deployment)
أسهل طريقة: ارفع المشروع على GitHub، ثم اربطه بـ [Vercel](https://vercel.com) — هيشتغل تلقائياً. لا تنسَ إضافة كل متغيرات البيئة في إعدادات Vercel.
