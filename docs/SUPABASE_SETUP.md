# Supabase Setup Guide — طلباتنا

## 1. إنشاء المشروع

- اذهب إلى [supabase.com](https://supabase.com) → New Project
- اختر المنطقة الأقرب لمصر (Europe West)
- احفظ رابط المشروع (Project URL) ومفتاح anon (anon key)

## 2. متغيرات البيئة

انسخ ملف `.env.example` إلى `.env` واملأ القيم:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. تشغيل قاعدة البيانات

- اذهب إلى Supabase Dashboard → SQL Editor
- انسخ وشغّل `docs/DATABASE_SCHEMA.sql`
- ثم شغّل `docs/RLS_POLICIES.sql`

## 4. تفعيل Real-time

- Dashboard → Database → Replication
- فعّل Real-time للجداول: `orders`, `order_status_history`, `courier_stats`

## 5. إعدادات المصادقة

- Dashboard → Authentication → Settings
- فعّل Email provider
- أوقف تأكيد البريد الإلكتروني أثناء التطوير

## 6. Storage Bucket

- Dashboard → Storage → New bucket
- الاسم: `avatars`
- عام (Public): نعم

## 7. تشغيل التطبيق

```bash
npm install
npm run dev
```

## 8. بيانات تجريبية (اختياري)

لإنشاء مستخدمين تجريبيين:

1. سجّل حساب عميل عبر التطبيق (role = client)
2. سجّل حساب مندوب عبر التطبيق (role = courier)
3. استخدم بيانات الدخول التجريبية المعروضة في صفحة المصادقة