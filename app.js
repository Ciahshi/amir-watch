// آدرس ورکر کلادفلر خود را در این متغیر قرار دهید
const WORKER_URL = "https://film.siavoshifardin.workers.dev";
let currentAuthMode = 'login';

// تغییر تب ورود / ثبت نام
function switchAuthTab(mode) {
  currentAuthMode = mode;
  const loginTab = document.getElementById('tab-login');
  const registerTab = document.getElementById('tab-register');
  const submitBtn = document.getElementById('auth-submit-btn');

  if (mode === 'login') {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    submitBtn.textContent = 'ورود به حساب';
  } else {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    submitBtn.textContent = 'ساخت حساب';
  }
}

// مدیریت ثبت‌نام و ورود
async function handleAuth(event) {
  event.preventDefault();
  
  const usernameInput = document.getElementById('auth-username').value.trim();
  const passwordInput = document.getElementById('auth-password').value;
  const submitBtn = document.getElementById('auth-submit-btn');

  if (!usernameInput || !passwordInput) {
    alert('لطفاً نام کاربری و رمز عبور را وارد کنید.');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'در حال پردازش...';

  const endpoint = currentAuthMode === 'login' ? '/api/login' : '/api/register';

  try {
    const response = await fetch(`${WORKER_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameInput, password: passwordInput })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || 'خطایی رخ داد.');
      return;
    }

    if (currentAuthMode === 'register') {
      alert('حساب کاربری با موفقیت ساخته شد! اکنون وارد شوید.');
      switchAuthTab('login');
    } else {
      localStorage.setItem('user', JSON.stringify({ username: usernameInput }));
      updateUserUI(usernameInput);
      alert('با موفقیت وارد شدید.');
    }
  } catch (error) {
    alert('خطا در ارتباط با سرور.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = currentAuthMode === 'login' ? 'ورود به حساب' : 'ساخت حساب';
  }
}

// به‌روزرسانی نمایش نام کاربر در بالای صفحه
function updateUserUI(username) {
  const userDisplay = document.getElementById('user-email-display'); // یا المان نمایش کاربر
  if (userDisplay) {
    userDisplay.textContent = username;
  }
}

// خروج از حساب
function logout() {
  localStorage.removeItem('user');
  location.reload();
}

// بررسی وضعیت ورود هنگام بارگذاری صفحه
document.addEventListener('DOMContentLoaded', () => {
  const savedUser = JSON.parse(localStorage.getItem('user'));
  if (savedUser && savedUser.username) {
    updateUserUI(savedUser.username);
  }
});
