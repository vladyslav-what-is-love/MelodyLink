document.addEventListener("DOMContentLoaded", () => {
  // Отримати ідентифікатор з параметрів URL
  const urlParams = new URLSearchParams(window.location.search);
  const profileId = urlParams.get("id");

  // Отримати дані профілю з сервера
  fetch(`/profile?id=${profileId}`)
    .then((response) => response.json())
    .then((data) => {
      // Вивести дані профілю
      displayProfile(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

function displayProfile(profileData) {
  const profileContainer = document.getElementById("profile-container");

  // Створити HTML-елементи для відображення даних профілю
  const nameElement = document.createElement("h2");
  nameElement.textContent = `${profileData.first_name} ${profileData.last_name}`;

  const emailElement = document.createElement("p");
  emailElement.textContent = `Email: ${profileData.email}`;

  // Додати HTML-елементи до контейнера профілю
  profileContainer.appendChild(nameElement);
  profileContainer.appendChild(emailElement);

  // Додатково виведіть інші дані профілю за необхідністю, наприклад, вік, місце роботи тощо
}
