// Виконайте AJAX-запит до сервера для отримання списку музикантів
/*fetch("/musicians")
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
  });*/
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
});
