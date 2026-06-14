const dataEl = document.getElementById("shows-data");
const fallbackData = JSON.parse(dataEl.textContent);
const calendar = document.getElementById("bmc-calendar");
const countEl = document.getElementById("bmc-count");

const ASHLEY_PAIGE_ARTIST = "Ashley Paige & The Soulcial Club";

const ARTIST_PHOTO_ASSETS = {
  "ANDRE LOVETT BAND": [
    "assets/artists/andre-lovett-band.jpg",
    "assets/artists/Andre%20Lovett%20Band.jpg"
  ],
  "DAPPER DANDIES": [
    "assets/artists/dapper-dandies.jpg",
    "assets/artists/Dapper%20Dandies.jpg"
  ],
  "MAURICE CADE & ESS": [
    "assets/artists/maurice-cade-ess.jpg",
    "assets/artists/Maurice%20Cade.jpg"
  ],
  "MOTHER RUCKUS": [
    "assets/artists/mother-ruckus.jpg",
    "assets/artists/Mother%20Ruckus.jpg"
  ],
  "DEEJ FLAVA & MOTHER RUCKUS": [
    "assets/artists/mother-ruckus.jpg",
    "assets/artists/Mother%20Ruckus.jpg"
  ],
  "SUGAR & THE DADDIES": [
    "assets/artists/sugar-and-the-daddies.jpg",
    "assets/artists/Sugar%20and%20the%20Daddies.webp"
  ],
  "WOODY'S RAMPAGE": [
    "assets/artists/woodys-rampage.jpg",
    "assets/artists/Woody%27s%20Rampage.jpg"
  ],
  "WOODYS RAMPAGE": [
    "assets/artists/woodys-rampage.jpg",
    "assets/artists/Woody%27s%20Rampage.jpg"
  ],
  "ASHLEY PAIGE & THE SOULCIAL CLUB": [
    "assets/artists/ashley-paige-soulcial-club.jpg",
    "assets/artists/Ashley%20Paige%20and%20the%20Soulcial%20Club.webp"
  ]
};

function artistKey(artist) {
  return String(artist || "")
    .replaceAll("’", "'")
    .trim()
    .toUpperCase();
}

function applyManagementCorrections(data) {
  (data.shows || []).forEach((day) => {
    if (day.date === "Wednesday • June 10" || day.date === "Wednesday • June 24") {
      (day.shows || []).forEach((show) => {
        if (show.time === "9:00 PM – 11:30 PM") {
          show.artist = ASHLEY_PAIGE_ARTIST;
          show.photo = "";
          show.alt = "";
          show.headliner = true;
        }
      });
    }
  });
  return data;
}

function photoCandidates(show) {
  const candidates = [];
  const existingPhoto = String(show.photo || "").trim();
  const localAssets = ARTIST_PHOTO_ASSETS[artistKey(show.artist)] || [];

  if (existingPhoto) {
    candidates.push(existingPhoto);
  }

  localAssets.forEach((path) => {
    if (path && !candidates.includes(path)) {
      candidates.push(path);
    }
  });

  return candidates;
}

function imageMarkup(show) {
  const candidates = photoCandidates(show);

  if (candidates.length) {
    const fallbackPayload = JSON.stringify(candidates);
    return `<img class="bmc-photo" loading="lazy" src="${escapeAttr(candidates[0])}" data-photo-fallbacks="${escapeAttr(fallbackPayload)}" data-photo-index="0" alt="${escapeAttr(show.alt || show.artist + " promo photo")}" onerror="window.handleBmcImageError(this)">`;
  }

  return `<span class="bmc-photo bmc-photo-placeholder" aria-hidden="true">♪</span>`;
}

function makePlaceholder(artist) {
  const el = document.createElement("span");
  el.className = "bmc-photo bmc-photo-placeholder";
  el.setAttribute("aria-hidden", "true");
  el.textContent = "♪";
  return el;
}

window.handleBmcImageError = function handleBmcImageError(img) {
  let fallbacks = [];

  try {
    fallbacks = JSON.parse(img.dataset.photoFallbacks || "[]");
  } catch (error) {
    fallbacks = [];
  }

  const currentIndex = Number(img.dataset.photoIndex || "0");
  const nextIndex = currentIndex + 1;

  if (nextIndex < fallbacks.length) {
    img.dataset.photoIndex = String(nextIndex);
    img.src = fallbacks[nextIndex];
    return;
  }

  img.replaceWith(makePlaceholder(img.getAttribute("alt") || ""));
};

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function render(data) {
  const days = data.shows || [];
  const eventCount = days.reduce((sum, day) => sum + (day.shows || []).length, 0);
  countEl.textContent = `${days.length} show days • ${eventCount} performances`;

  if (!days.length) {
    calendar.innerHTML = `<p class="bmc-empty">Upcoming shows will be posted here soon.</p>`;
    return;
  }

  calendar.innerHTML = days.map(day => `
    <article class="bmc-day">
      <h2 class="bmc-date">${escapeHtml(day.date)}</h2>
      <div class="bmc-events">
        ${(day.shows || []).map(show => `
          <div class="bmc-event${show.headliner ? " is-headliner" : ""}">
            <div class="bmc-time">${escapeHtml(show.time)}</div>
            <div class="bmc-artist-block">
              ${imageMarkup(show)}
              <div class="bmc-artist">${escapeHtml(show.artist)}</div>
            </div>
          </div>
        `).join("")}
      </div>
    </article>
  `).join("");

  queueHeightUpdate();
}

function sendHeightToParent() {
  const height = Math.ceil(document.documentElement.scrollHeight);
  window.parent?.postMessage({ source: "bmc-upcoming-shows", height }, "*");
}

let heightTimer = null;
function queueHeightUpdate() {
  clearTimeout(heightTimer);
  heightTimer = setTimeout(sendHeightToParent, 60);
}

window.addEventListener("load", queueHeightUpdate);
window.addEventListener("resize", queueHeightUpdate);

if ("ResizeObserver" in window) {
  new ResizeObserver(queueHeightUpdate).observe(document.documentElement);
}

render(applyManagementCorrections(fallbackData));
