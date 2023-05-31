document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("login-form")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Заборона перезавантаження сторінки

      // Отримання значень полів "Телефон" і "Пароль"
      var phone = document.getElementById("phone-input").value;
      var password = document.getElementById("password-input").value;

      // Виконати перенаправлення на сторінку login.html
      window.location.href = "login.html";
    });
});
