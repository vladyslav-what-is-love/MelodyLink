document.addEventListener("DOMContentLoaded", () => {
  const musiciansButton = document.getElementById("musicians-button");
  const organizersButton = document.getElementById("organizers-button");
  const musiciansList = document.getElementById("musicians-list");

  musiciansButton.addEventListener("click", () => {
    // Очистити список музикантів
    musiciansList.innerHTML = "";

    // Отримати обрані міста
    const selectedCities = Array.from(
      document.querySelectorAll(".filter-button.active")
    ).map((button) => button.getAttribute("data-city"));

    // Отримати всіх музикантів з сервера
    fetch("/musicians")
      .then((response) => response.json())
      .then((data) => {
        // Фільтрувати музикантів за обраними містами
        const filteredMusicians =
          selectedCities.length > 0
            ? data.filter((musician) =>
                selectedCities.includes(musician.location)
              )
            : data;

        // Додати відфільтрованих музикантів до списку
        filteredMusicians.forEach((item) => {
          const musicianItem = document.createElement("div");
          musicianItem.classList.add("musician-row");
          musicianItem.setAttribute("id", item.user_id);
          console.log(item.user_id); // Додати ідентифікатор до елементу musicianItem
          musicianItem.setAttribute("data-city", item.location); // Додати атрибут з містом

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
    fetch(`/musicians/genres?genre=${selectedGenre}`);
  });

  musiciansList.addEventListener("click", (event) => {
    const musicianRow = event.target.closest(".musician-row");
    if (musicianRow) {
      const musicianId = musicianRow.getAttribute("id");
      console.log(musicianId); // Отримати ідентифікатор музиканта
      const musicianType = "musician"; // Тип користувача (в даному випадку - музикант)

      // Формування посилання на сторінку профілю з використанням ідентифікатора та типу користувача
      const profileLink = `/profile.html?id=${musicianId}&type=${musicianType}`;

      window.location.href = profileLink; // Перенаправити на сторінку профілю з використанням посилання
    }
  });

  organizersButton.addEventListener("click", () => {
    // Очистити список організаторів
    musiciansList.innerHTML = "";

    // Отримати обрані міста
    const selectedCities = Array.from(
      document.querySelectorAll(".filter-button.active")
    ).map((button) => button.getAttribute("data-city"));

    // Отримати всіх організаторів з сервера
    fetch("/organizers")
      .then((response) => response.json())
      .then((data) => {
        // Фільтрувати організаторів за обраними містами
        const filteredOrganizers =
          selectedCities.length > 0
            ? data.filter((item) => selectedCities.includes(item.location))
            : data;

        console.log(selectedCities);
        // Додати відфільтрованих організаторів до списку
        filteredOrganizers.forEach((item) => {
          const organizerItem = document.createElement("div");
          const name = `${item.first_name} ${item.last_name}`;
          const company = item.company;
          organizerItem.setAttribute("data-city", item.location);

          organizerItem.innerHTML = `
            <div class="organizer-row">
              <div class="name">${name}</div>
              <div class="company">${company}</div>
            </div>
          `;

          musiciansList.appendChild(organizerItem);
        });

        console.log(filteredOrganizers.length);
        // Перевірити, чи список не порожній
        if (filteredOrganizers.length === 0) {
          const noResultsItem = document.createElement("div");
          noResultsItem.innerHTML = "Немає результатів";
          musiciansList.appendChild(noResultsItem);
        }

        // Викликати функцію фільтрації організаторів після додавання їх до списку
        filterOrganizersByCities(selectedCities);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  var buttons = document.getElementsByClassName("filter-button");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      this.classList.toggle("active");

      // Отримати обрані міста після зміни стану кнопки
      const selectedCities = Array.from(
        document.querySelectorAll(".filter-button.active")
      ).map((button) => button.getAttribute("data-city"));

      // Викликати функцію фільтрації після зміни обраних міст
      filterByCities(selectedCities);
    });
  }

  // Функція фільтрації музикантів і організаторів за обраними містами
  // Функція фільтрації музикантів і організаторів за обраними містами
  function filterByCities(selectedCities) {
    const musicianRows = musiciansList.getElementsByClassName("musician-row");
    const organizerRows = musiciansList.getElementsByClassName("organizer-row");

    // Показати або приховати музикантів в залежності від обраних міст
    for (let i = 0; i < musicianRows.length; i++) {
      const musicianRow = musicianRows[i];
      const city = musicianRow.getAttribute("data-city");

      if (selectedCities.length === 0 || selectedCities.includes(city)) {
        musicianRow.style.display = "block";
      } else {
        musicianRow.style.display = "none";
      }
    }

    // Показати або приховати організаторів в залежності від обраних міст
    for (let i = 0; i < organizerRows.length; i++) {
      const organizerRow = organizerRows[i];
      const city = organizerRow.getAttribute("data-city");

      if (selectedCities.length === 0 || selectedCities.includes(city)) {
        organizerRow.style.display = "block";
      } else {
        organizerRow.style.display = "none";
      }
    }
  }
  function filterOrganizersByCities(selectedCities) {
    const organizerRows = musiciansList.getElementsByClassName("organizer-row");

    // Показати або приховати організаторів в залежності від обраних міст
    for (let i = 0; i < organizerRows.length; i++) {
      const organizerRow = organizerRows[i];
      const city = organizerRow.getAttribute("data-city");

      if (selectedCities.length === 0 || selectedCities.includes(city)) {
        organizerRow.style.display = "block";
      } else {
        organizerRow.style.display = "none";
      }
    }
  }
});
// Отримання всіх жанрів з сервера

// Отримання всіх жанрів з сервера
function getAllGenres() {
  fetch("/genres") // Виконуємо GET-запит на маршрут "/genres"
    .then((response) => response.json())
    .then((data) => {
      const genresContainer = document.querySelector(".filter-genres"); // Контейнер для жанрів на сторінці
      genresContainer.innerHTML = ""; // Очищуємо контейнер перед додаванням жанрів

      // Додаємо кожен жанр до контейнера
      data.forEach((genre) => {
        const genreButton = document.createElement("button");
        genreButton.classList.add("filter-button");
        genreButton.textContent = genre.genre; // Зміна - встановлюємо назву жанру
        genreButton.addEventListener("click", handleGenreFilter); // Додаємо обробник події для фільтрації по жанру
        genresContainer.appendChild(genreButton);
      });
    })
    .catch((error) => console.log(error));
}

// Виклик функції для отримання всіх жанрів при завантаженні сторінки
getAllGenres();

function handleGenreFilter(event) {
  const selectedGenre = event.target.textContent;
  event.target.classList.toggle("active");
}
function getAllInstruments() {
  fetch("/instruments") // Виконуємо GET-запит на маршрут "/instruments"
    .then((response) => response.json())
    .then((data) => {
      const instrumentsContainer = document.querySelector(
        ".filter-instruments"
      ); // Контейнер для інструментів на сторінці
      instrumentsContainer.innerHTML = ""; // Очищуємо контейнер перед додаванням інструментів

      // Додаємо кожен інструмент до контейнера
      data.forEach((instrument) => {
        const instrumentButton = document.createElement("button");
        instrumentButton.classList.add("filter-button");
        instrumentButton.textContent = instrument.instrument; // Встановлюємо назву інструменту
        instrumentButton.addEventListener("click", handleInstrumentFilter); // Додаємо обробник події для фільтрації по інструменту
        instrumentsContainer.appendChild(instrumentButton);
      });
    })
    .catch((error) => console.log(error));
}

// Обробник події для фільтрації по інструменту
function handleInstrumentFilter(event) {
  const selectedInstrument = event.target.textContent;
  event.target.classList.toggle("active");
}

// Виклик функції для отримання всіх інструментів при завантаженні сторінки
getAllInstruments();

function handleInstrumentFilter(event) {
  const selectedInstrument = event.target.textContent;
  // Виконуємо фільтрацію або виконуємо додаткові дії відповідно до вибраного інструменту
  // ...
}
