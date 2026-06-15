const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".main-nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}
