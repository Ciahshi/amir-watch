# امیر واچ — Amir Watch

سایت استاتیک برای تماشای ویدئو به‌صورت شخصی یا همزمان با دوست، با Supabase برای Auth، Database، Storage و Realtime.

## ساختار GitHub Pages

فایل‌های `index.html`, `app.js`, `style.css`, `config.js` باید مستقیماً در ریشه branch منتشرشده باشند.

## راه‌اندازی Supabase

1. فایل `supabase/schema.sql` را کامل در SQL Editor پروژه Supabase اجرا کنید.
2. در Authentication > Providers > Email، ورود ایمیلی را فعال کنید.
3. در صورت تمایل برای ثبت‌نام فوری، Email Confirmation را غیرفعال کنید.
4. سایت را روی GitHub Pages با Source = `Deploy from a branch`، Branch = `main` و Folder = `/ (root)` منتشر کنید.

## کلیدها

`config.js` از Project URL و Publishable key استفاده می‌کند. Publishable key برای مرورگر قابل انتشار است، اما Secret/Service Role key نباید در سایت یا GitHub قرار گیرد.

## محدودیت آپلود

در پلن Free فعلی Supabase، حداکثر اندازه هر فایل 50MB است. برای ویدئوهای بزرگ‌تر از لینک مستقیم استفاده کنید یا Storage را ارتقا دهید.
