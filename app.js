// آدرس ورکر کلادفلر خودت رو دقیقاً اینجا بذار
const WORKER_URL = "https://film.siavoshifardin.workers.dev";

let authTabMode = 'login';

function showToast(msg) {
  const t = document.getElementById('toast');
  if (t) {
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  } else {
    alert(msg);
  }
}

function renderNav() {
  const nav = document.getElementById('userNav');
  if (!nav) return;
  
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (user) {
    nav.innerHTML = `
      <span style="color:#fff; margin-left:12px; font-size:0.9rem;">${user}</span>
      <button onclick="logout()" style="background:#e53e3e; color:#fff; border:none; padding:6px 14px; border-radius:6px; cursor:pointer; font-family:inherit;">خروج</button>
    `;
  } else {
    nav.innerHTML = `<a href="#login" onclick="renderAuth()" style="color:#fff; text-decoration:none; font-size:0.9rem;">ورود / ثبت‌نام</a>`;
  }
}

function renderAuth() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="auth-card">
      <div class="auth-tabs">
        <button type="button" class="auth-tab ${authTabMode === 'login' ? 'active' : ''}" onclick="switchTab('login')">ورود</button>
        <button type="button" class="auth-tab ${authTabMode === 'register' ? 'active' : ''}" onclick="switchTab('register')">ثبت‌نام</button>
      </div>

      <form onsubmit="handleAuth(event)">
        <div class="form-group">
          <label>نام کاربری</label>
          <input type="text" id="username" required placeholder="نام کاربری خود را وارد کنید" autocomplete="username">
        </div>

        <div class="form-group">
          <label>رمز عبور</label>
          <input type="password" id="password" required placeholder="••••••••" autocomplete="current-password">
        </div>

        <button type="submit" id="submit-btn" class="btn-primary">
          ${authTabMode === 'login' ? 'ورود' : 'ساخت حساب'}
        </button>
      </form>
      <p class="auth-note">اطلاعات شما به‌صورت امن ذخیره می‌شود.</p>
    </div>
  `;
}

function switchTab(mode) {
  authTabMode = mode;
  renderAuth();
}

async function handleAuth(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const btn = document.getElementById('submit-btn');

  if (!username || !password) {
    showToast('لطفاً نام کاربری و رمز عبور را وارد کنید.');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'در حال ارتباط...';

  const endpoint = authTabMode === 'login' ? '/api/login' : '/api/register';

  try {
    const res = await fetch(`${WORKER_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (!res.ok) {
      showToast(data.error || 'خطایی رخ داد.');
      btn.disabled = false;
      btn.textContent = authTabMode === 'login' ? 'ورود' : 'ساخت حساب';
      return;
    }

    if (authTabMode === 'register') {
      showToast('حساب ساخته شد! حالا وارد شوید.');
      switchTab('login');
    } else {
      localStorage.setItem('currentUser', JSON.stringify(username));
      showToast('با موفقیت وارد شدید.');
      renderNav();
      renderRooms();
    }
  } catch (err) {
    showToast('خطا در ارتباط با سرور کلادفلر.');
    btn.disabled = false;
    btn.textContent = authTabMode === 'login' ? 'ورود' : 'ساخت حساب';
  }
}

function logout() {
  localStorage.removeItem('currentUser');
  renderNav();
  renderAuth();
  showToast('از حساب خارج شدید.');
}

function renderRooms() {
  const app = document.getElementById('app');
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (!user) {
    renderAuth();
    return;
  }
  app.innerHTML = `
    <div style="text-align:center; padding:50px 20px; color:#fff;">
      <h2>خوش آمدید، ${user} 👋</h2>
      <p style="color:#a0aec0; margin-top:10px;">ورود با موفقیت انجام شد و به کلادفلر متصل هستید.</p>
    </div>
  `;
}

function init() {
  renderNav();
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (user) {
    renderRooms();
  } else {
    renderAuth();
  }
}

// اجرا به محض بارگذاری کامل صفحه
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
