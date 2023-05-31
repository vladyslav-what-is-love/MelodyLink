document.addEventListener("DOMContentLoaded", () => {
  // Обробник події для подання форми на сторінці логіну
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

document.addEventListener("DOMContentLoaded", function () {
  const entityInput = document.getElementById("entity-input");
  const additionalField = document.getElementById("experience-field");

  entityInput.addEventListener("change", function () {
    const selectedValue = this.value;

    if (selectedValue === "musician") {
      additionalField.style.display = "block";
    } else {
      additionalField.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const companyInput = document.getElementById("entity-input");
  const additionalField = document.getElementById("company-field");

  companyInput.addEventListener("change", function () {
    const selectedValue = this.value;

    if (selectedValue === "organizer") {
      additionalField.style.display = "block";
    } else {
      additionalField.style.display = "none";
    }
  });
});
