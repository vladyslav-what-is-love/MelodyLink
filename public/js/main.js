var buttons = document.getElementsByClassName("filter-button");
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    this.classList.toggle("active");
  });
}
