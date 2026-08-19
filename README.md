# امیر واچ — Amir Watch

نسخه استاتیک سایت تماشای فیلم با دوست، بدون Cloudflare D1 / R2 / Durable Objects.

## معماری
- Frontend: HTML/CSS/JavaScript
- Deploy: GitHub Pages یا Cloudflare Pages
- Auth + Database + Storage + Realtime: Supabase Free
- همگام‌سازی دونفره: Supabase Realtime Broadcast

## نکته رایگان
در پلن رایگان Supabase سقف فایل Storage برابر 50MB است. لینک مستقیم فیلم محدودیت ذخیره‌سازی ندارد، ولی خود سرور فیلم باید لینک مستقیم و قابل پخش داشته باشد.

## راه‌اندازی Supabase
1. یک پروژه Free در Supabase بساز.
2. SQL داخل `supabase/schema.sql` را در SQL Editor اجرا کن.
3. در Project Settings > API، `Project URL` و `anon public key` را بردار.
4. فایل `public/config.js` را باز کن و دو مقدار را وارد کن.
5. در Authentication > Providers > Email، ورود با ایمیل و رمز عبور را فعال کن. در صورت نیاز تأیید ایمیل را خاموش کن تا ثبت‌نام فوری باشد.

## تست محلی
به دلیل استفاده از ES/Storage و Auth، بهتر است با یک سرور محلی اجرا شود. مثال:

```bash
npx serve public
```

یا با هر وب‌سرور استاتیک دیگر.

## GitHub Pages
کل محتوای پوشه `public` را در شاخه‌ای که GitHub Pages منتشر می‌کند قرار بده. چون لینک اشتراک به صورت `?room=...` است، به routing سرور نیاز ندارد.

## Cloudflare Pages
پوشه `public` را به عنوان خروجی استاتیک منتشر کن؛ هیچ Worker لازم نیست.

## محدودیت مهم
برای لینک مستقیم، سرور مقصد باید فایل ویدئو را مستقیماً سرو کند و Range Request/CORS مناسب داشته باشد. لینک صفحه YouTube یا صفحه دانلود معمولاً قابل پخش در `<video>` نیست.
