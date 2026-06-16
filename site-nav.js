const BMC_LINKS = {
  home: "https://balconymusicclub.com/",
  shows: "https://shows.balconymusicclub.com/",
  host: "https://balconymusicclub.com/host-your-event",
  store: "https://balconymusicclub.com/store",
  jazzycat: "https://floydclaptonblues.github.io/JazzyCatBotAI/",
  instagram: "https://www.instagram.com/balconymusicclub_504",
  youtube: "https://youtube.com/@officialbmcneworleans504?si=xQkUAVLCyHDpRHFb",
  facebook: "https://www.facebook.com/share/1TirbYYtqN/?mibextid=wwXIfr",
  app: "https://app.balconymusicclub.com/"
};

const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".main-nav");
const brand = document.querySelector(".brand");

function applyLink(el, href, target) {
  if (!el || !href) return;
  el.href = href;
  el.target = target;
  if (target === "_blank") {
    el.rel = "noopener noreferrer";
  }
}

function normalizeBannerLinks() {
  applyLink(brand, BMC_LINKS.home, "_top");

  document.querySelectorAll(".main-nav a").forEach((link) => {
    const label = (link.textContent || "").trim().toLowerCase();
    if (label === "home") applyLink(link, BMC_LINKS.home, "_top");
    if (label === "shows") applyLink(link, BMC_LINKS.shows, "_top");
    if (label === "host your event") applyLink(link, BMC_LINKS.host, "_top");
    if (label === "store") applyLink(link, BMC_LINKS.store, "_top");
    if (label === "ask jazzycat") applyLink(link, BMC_LINKS.jazzycat, "_top");
  });

  document.querySelectorAll(".header-socials a").forEach((link) => {
    const label = (link.textContent || link.getAttribute("aria-label") || link.title || "").trim().toLowerCase();
    if (label === "ig" || label === "instagram") applyLink(link, BMC_LINKS.instagram, "_blank");
    if (label === "yt" || label === "youtube") applyLink(link, BMC_LINKS.youtube, "_blank");
    if (label === "fb" || label === "facebook") applyLink(link, BMC_LINKS.facebook, "_blank");
    if (label === "app" || label === "bmc app") applyLink(link, BMC_LINKS.app, "_blank");
  });
}

normalizeBannerLinks();

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
