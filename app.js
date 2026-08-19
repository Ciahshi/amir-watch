// حتماً آدرس ورکر خودتان را در خط زیر جایگزین کنید
const WORKER_URL = "https://film.siavoshifardin.workers.dev";

let currentMode = 'login';

function switchAuthTab(mode) {
    currentMode = mode;
    const loginTab = document.getElementById('tab-login');
    const registerTab = document.getElementById('tab-register');
    const submitBtn = document.getElementById('auth-submit-btn');

    if (mode === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        submitBtn.textContent = 'ورود';
    } else {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        submitBtn.textContent = 'ساخت حساب';
    }
}

async function handleAuth(event) {
    event.preventDefault();
    
    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value;
    const submitBtn = document.getElementById('auth-submit-btn');

    if (!usernameInput || !passwordInput) {
        alert('لطفاً نام کاربری و رمز عبور را وارد کنید.');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'در حال پردازش...';

    const endpoint = currentMode === 'login' ? '/api/login' : '/api/register';

    try {
        const response = await fetch(`${WORKER_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usernameInput, password: passwordInput })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || 'خطایی رخ داد.');
            submitBtn.disabled = false;
            submitBtn.textContent = currentMode === 'login' ? 'ورود' : 'ساخت حساب';
            return;
        }

        if (currentMode === 'register') {
            alert('حساب شما با موفقیت ساخته شد! حالا می‌توانید وارد شوید.');
            switchAuthTab('login');
        } else {
            localStorage.setItem('currentUser', usernameInput);
            alert('با موفقیت وارد شدید!');
            updateUIBasedOnLogin();
        }
    } catch (error) {
        alert('خطا در ارتباط با سرور.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = currentMode === 'login' ? 'ورود' : 'ساخت حساب';
    }
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    location.reload();
}

function updateUIBasedOnLogin() {
    const savedUser = localStorage.getItem('currentUser');
    const authSection = document.getElementById('auth-section');
    const userDisplay = document.getElementById('user-display');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (savedUser) {
        if(authSection) authSection.style.display = 'none';
        if(userDisplay) userDisplay.textContent = savedUser;
        if(logoutBtn) logoutBtn.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateUIBasedOnLogin();
});
