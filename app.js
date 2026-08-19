// آدرس ورکر کلادفلر خود را در این متغیر قرار دهید
const WORKER_URL = "https://film.siavoshifardin.workers.dev";

// تابع ثبت‌نام
async function registerUser(username, password) {
  try {
    const response = await fetch(`${WORKER_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error); // نمایش پیام تکراری بودن نام کاربری
      return false;
    }

    alert(data.message);
    return true;
  } catch (error) {
    alert("خطا در برقراری ارتباط با سرور");
  }
}

// تابع ورود
async function loginUser(username, password) {
  try {
    const response = await fetch(`${WORKER_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error);
      return false;
    }

    localStorage.setItem("currentUser", JSON.stringify(data.user));
    alert("با موفقیت وارد شدید!");
    return true;
  } catch (error) {
    alert("خطا در برقراری ارتباط با سرور");
  }
}
