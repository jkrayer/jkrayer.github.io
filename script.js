// Close mobile navigation menu when a navigation link is clicked
document.addEventListener("DOMContentLoaded", function () {
  const navigation = document.querySelector(".root-navigation");
  const navigationCheckbox = document.getElementById("root-navigation-check");

  navigation.addEventListener("click", (e) => {
    console.log(e.target);
    if (Array.from(e.target.classList).includes("root-navigation-link")) {
      // Uncheck the navigation checkbox to close the menu
      navigationCheckbox.checked = false;
    }
  });
});
