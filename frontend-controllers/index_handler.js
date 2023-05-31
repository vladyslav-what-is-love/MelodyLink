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

  var buttons = document.getElementsByClassName("filter-button");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      this.classList.toggle("active");
    });
  }
});
