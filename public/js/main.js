/*document.addEventListener("DOMContentLoaded", () => {
  const musiciansButton = document.getElementById("musicians-button");
  const organizersButton = document.getElementById("organizers-button");
  const musiciansList = document.getElementById("musicians-list");

  musiciansButton.addEventListener("click", () => {
    // Очистити список музикантів
    musiciansList.innerHTML = "";

    // Виконати AJAX-запит до сервера для отримання списку музикантів
    fetch("/musicians")
      .then((response) => response.json())
      .then((data) => {
        // Обробка отриманих даних
        const musiciansList = document.getElementById("musicians-list");
        data.forEach((item) => {
          const musicianItem = document.createElement("div");
          musicianItem.innerHTML = item.musician.musicianId;
          musiciansList.appendChild(musicianItem);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  /*organizersButton.addEventListener("click", () => {
    // Очистити список музикантів
    musiciansList.innerHTML = "";

    // Виконати AJAX-запит до сервера для отримання списку організаторів

    fetch("/organizers")
      .then((response) => response.json())
      .then((data) => {
        // Обробка отриманих даних
        const musiciansList = document.getElementById("musicians-list");
        data.forEach((item) => {
          const organizerItem = document.createElement("div");
          organizerItem.innerHTML = `Name: ${item.user.firstName} ${item.user.lastName}, Company: ${item.organizer.company}, Organizer ID: ${item.organizer.organizer_id}`;
          musiciansList.appendChild(organizerItem);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
  organizersButton.addEventListener("click", () => {
    // Очистити список музикантів
    musiciansList.innerHTML = "";

    // Виконати AJAX-запит до сервера для отримання списку організаторів

    fetch("/organizers")
      .then((response) => response.json())
      .then((data) => {
        // Обробка отриманих даних
        musiciansList.innerHTML = ""; // Очищаємо список перед додаванням нових даних
        data.forEach((item) => {
          const organizerItem = document.createElement("div");
          const name = `${item.user.firstName} ${item.user.lastName}`;
          const company = item.organizer.company;

          organizerItem.innerHTML = `
            <div class="organizer-row">
              <div class="name">${name}</div>
              <div class="company">${company}</div>
            </div>
          `;

          musiciansList.appendChild(organizerItem);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});*/

document.addEventListener("DOMContentLoaded", () => {
  const musiciansButton = document.getElementById("musicians-button");
  const organizersButton = document.getElementById("organizers-button");
  const musiciansList = document.getElementById("musicians-list");

  musiciansButton.addEventListener("click", () => {
    // Очистити список музикантів
    musiciansList.innerHTML = "";

    // Виконати AJAX-запит до сервера для отримання списку музикантів
    fetch("/musicians")
      .then((response) => response.json())
      .then((data) => {
        /*data.forEach((item) => {
          const musicianItem = document.createElement("div");
          musicianItem.classList.add("musician-row"); // Додати клас musician-row до елементу
          const name = `${item.first_name} ${item.last_name}`;
          musicianItem.innerHTML = name;
          musiciansList.appendChild(musicianItem);
        });*/

        data.forEach((item) => {
          const musicianItem = document.createElement("div");
          musicianItem.classList.add("musician-row");
          musicianItem.setAttribute("id", "experience-id"); // Додати ідентифікатор до елементу musicianItem

          const name = document.createElement("div");
          name.classList.add("musician-name");
          name.textContent = `${item.first_name} ${item.last_name}`;

          const experience = document.createElement("div");
          experience.textContent = `Років досвіду: ${item.experience}`;

          musicianItem.appendChild(name);
          musicianItem.appendChild(experience);

          musiciansList.appendChild(musicianItem);
        });

        // Обробка отриманих даних
        /*data.forEach((item) => {
          const musicianItem = document.createElement("div");
          const name = `${item.first_name} ${item.last_name}`; // Отримати ім'я і прізвище з об'єкту даних
          musicianItem.innerHTML = name; // Встановити ім'я і прізвище як вміст елементу
          musiciansList.appendChild(musicianItem);
        });*/
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  organizersButton.addEventListener("click", () => {
    // Очистити список музикантів
    musiciansList.innerHTML = "";

    // Виконати AJAX-запит до сервера для отримання списку організаторів

    fetch("/organizers")
      .then((response) => response.json())
      .then((data) => {
        // Обробка отриманих даних
        musiciansList.innerHTML = ""; // Очищаємо список перед додаванням нових даних
        data.forEach((item) => {
          const organizerItem = document.createElement("div");
          const name = `${item.user.firstName} ${item.user.lastName}`;
          const company = item.organizer.company;

          organizerItem.innerHTML = `
              <div class="organizer-row">
                <div class="name">${name}</div>
                <div class="company">${company}</div>
              </div>
            `;

          musiciansList.appendChild(organizerItem);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

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
var buttons = document.getElementsByClassName("filter-button");
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    this.classList.toggle("active");
  });
}
