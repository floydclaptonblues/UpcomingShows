const dataEl = document.getElementById("shows-data");
const calendar = document.getElementById("bmc-calendar");

let fallbackData = { shows: [] };

try {
  fallbackData = JSON.parse(dataEl?.textContent || "{\"shows\":[]}");
} catch (error) {
  fallbackData = { shows: [] };
}

const ASHLEY_PAIGE_ARTIST = "Ashley Paige & The Soulcial Club";
const T_MARIE_BAYOU_JUJU_ARTIST = "T Marie & Bayou JuJu";
const T_MARIE_BAYOU_JUJU_PHOTO = "assets/artists/IMG_20260616_235511.png";
const LOUISIANA_PARISH_LINE_ARTIST = "Louisiana Parish Line";
const LOUISIANA_PARISH_LINE_PHOTO = "assets/artists/Louisiana%20Parish%20Line.png";

const MONTH_INDEX = {
  JANUARY: 0,
  FEBRUARY: 1,
  MARCH: 2,
  APRIL: 3,
  MAY: 4,
  JUNE: 5,
  JULY: 6,
  AUGUST: 7,
  SEPTEMBER: 8,
  OCTOBER: 9,
  NOVEMBER: 10,
  DECEMBER: 11
};

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
    "assets/artists/Maurice%20Cade%20%26%20ESS%20Sunday%206pm.jpg",
    "assets/artists/maurice-cade-ess.jpg",
    "assets/artists/Maurice%20Cade.jpg"
  ],
  "MOTHER RUCKUS": [
    "assets/artists/Mother%20Ruckus.png",
    "assets/artists/mother-ruckus.jpg",
    "assets/artists/Mother%20Ruckus.jpg"
  ],
  "DEEJ FLAVA & MOTHER RUCKUS": [
    "assets/artists/Mother%20Ruckus.png",
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
  "T MARIE & BAYOU JUJU": [
    T_MARIE_BAYOU_JUJU_PHOTO
  ],
  "LOUISIANA PARISH LINE": [
    LOUISIANA_PARISH_LINE_PHOTO,
    "assets/artists/14FA40D0-F6EC-48BB-9A69-08C469C16B73.PNG"
  ],
  "PARISH LINE": [
    LOUISIANA_PARISH_LINE_PHOTO,
    "assets/artists/14FA40D0-F6EC-48BB-9A69-08C469C16B73.PNG"
  ],
  "ASHLEY PAIGE & THE SOULCIAL CLUB": [
    "assets/artists/Ashley%20Paige%20and%20the%20Soulcial%20Club.jpeg",
    "assets/artists/ashley-paige-soulcial-club.jpg",
    "assets/artists/Ashley%20Paige%20and%20the%20Soulcial%20Club.webp"
  ],
  "ASHLEY PAIGE & SOULCIAL CLUB": [
    "assets/artists/Ashley%20Paige%20and%20the%20Soulcial%20Club.jpeg",
    "assets/artists/ashley-paige-soulcial-club.jpg",
    "assets/artists/Ashley%20Paige%20and%20the%20Soulcial%20Club.webp"
  ],
  "FUNKY SOLES": [
    "assets/artists/Funky%20Soles%20Featuring%20Tahj%20Derosier.png"
  ],
  "FUNKY SOLES FEATURING TAHJ DEROSIER": [
    "assets/artists/Funky%20Soles%20Featuring%20Tahj%20Derosier.png"
  ],
  "ADO SOUL & THE TRIBE": [
    "assets/artists/Ado%20Soul%20Tribe.png"
  ],
  "ADO SOUL TRIBE": [
    "assets/artists/Ado%20Soul%20Tribe.png"
  ],
  "YUNG DEX BRASS BAND": [
    "assets/artists/Yung%20Dex%20Ya%20Feel%20Me%20Brass%20Band.png"
  ],
  "YUNG DEX YA FEEL ME BRASS BAND": [
    "assets/artists/Yung%20Dex%20Ya%20Feel%20Me%20Brass%20Band.png"
  ],
  "GABE STILLMAN BAND": [
    "assets/artists/Gabe%20Stillman.png"
  ],
  "GABE STILLMAN": [
    "assets/artists/Gabe%20Stillman.png"
  ],
  "THEE PLAYMATEZ": [
    "assets/artists/Thee%20PlayMateZ.png"
  ],
  "THEEPLAYMATEZ": [
    "assets/artists/Thee%20PlayMateZ.png"
  ],
  "THEE FONK": [
    "assets/artists/Thee%20PlayMateZ.png"
  ],
  "THEE FONK JAM": [
    "assets/artists/Thee%20PlayMateZ.png"
  ],
  "THEE FONK JAM FEAT. TAMARIET": [
    "assets/artists/Thee%20PlayMateZ.png"
  ],
  "THEE FONK JAM FEAT TAMARIET": [
    "assets/artists/Thee%20PlayMateZ.png"
  ],
  "KIM IN THE WIND": [
    "assets/artists/kim-in-the-wind.webp"
  ],
  "KIM IN THE WIND BAND": [
    "assets/artists/kim-in-the-wind.webp"
  ],
  "BIG MIKE & THE R&B KINGS": [
    "assets/artists/big-mike-rb-kings.webp"
  ],
  "BIG MIKE & R&B KINGS": [
    "assets/artists/big-mike-rb-kings.webp"
  ],
  "KAT KILEY EXPERIENCE": [
    "assets/artists/kat-kiley-experience.webp"
  ],
  "SIERRA GREEN": [
    "assets/artists/sierra-green.jpg"
  ],
  "SIERRA & GREEN NOTES": [
    "assets/artists/sierra-green.jpg"
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

    if (day.date === "Wednesday • June 24") {
      (day.shows || []).forEach((show) => {
        if (show.time === "6:00 PM – 8:30 PM") {
          show.artist = LOUISIANA_PARISH_LINE_ARTIST;
          show.photo = LOUISIANA_PARISH_LINE_PHOTO;
          show.alt = "Louisiana Parish Line promo poster";
          show.headliner = false;
        }
      });
    }

    if (day.date === "Saturday • June 20") {
      (day.shows || []).forEach((show) => {
        if (show.time === "6:00 PM – 8:30 PM" && artistKey(show.artist).includes("T MARIE")) {
          show.artist = T_MARIE_BAYOU_JUJU_ARTIST;
          show.photo = T_MARIE_BAYOU_JUJU_PHOTO;
          show.alt = "T Marie & Bayou JuJu promo photo";
        }
      });
    }
  });
  return data;
}

function dateKey(year, monthIndex, day) {
  return (year * 10000) + ((monthIndex + 1) * 100) + day;
}

function scheduleYear(data) {
  const yearMatch = String(data.month || data.subtitle || "").match(/\b(20\d{2})\b/);
  if (yearMatch) {
    return Number(yearMatch[1]);
  }

  return Number(new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric"
  }).format(new Date()));
}

function todayKeyForVenue() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "numeric",
    day: "numeric"
  }).formatToParts(new Date());

  const values = Object.fromEntries(parts.map((part) => [part.type, Number(part.value)]));
  return dateKey(values.year, values.month - 1, values.day);
}

function showDayKey(day, data) {
  const match = String(day.date || "").match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})\b/i);
  if (!match) {
    return null;
  }

  const monthIndex = MONTH_INDEX[match[1].toUpperCase()];
  const dayNumber = Number(match[2]);

  if (!Number.isFinite(monthIndex) || !Number.isFinite(dayNumber)) {
    return null;
  }

  return dateKey(scheduleYear(data), monthIndex, dayNumber);
}

function filterExpiredShowDays(data) {
  const todayKey = todayKeyForVenue();
  const sourceDays = data.shows || [];
  const upcomingDays = sourceDays.filter((day) => {
    const key = showDayKey(day, data);
    return key === null || key >= todayKey;
  });

  return {
    ...data,
    shows: upcomingDays,
    hiddenPastShowDays: sourceDays.length - upcomingDays.length
  };
}

function photoCandidates(show) {
  const candidates = [];
  const existingPhoto = String(show.photo || "").trim();
  const localAssets = ARTIST_PHOTO_ASSETS[artistKey(show.artist)] || [];

  localAssets.forEach((path) => {
    if (path && !candidates.includes(path)) {
      candidates.push(path);
    }
  });

  if (existingPhoto && !candidates.includes(existingPhoto)) {
    candidates.push(existingPhoto);
  }

  return candidates;
}

function imageMarkup(show) {
  const candidates = photoCandidates(show);

  if (candidates.length) {
    const fallbackPayload = JSON.stringify(candidates);
    const altText = show.alt || `${show.artist} promo photo`;
    return `<img class="bmc-photo" loading="lazy" src="${escapeAttr(candidates[0])}" data-photo-fallbacks="${escapeAttr(fallbackPayload)}" data-photo-index="0" alt="${escapeAttr(altText)}" onerror="window.handleBmcImageError(this)">`;
  }

  return `<span class="bmc-photo bmc-photo-placeholder" aria-hidden="true">♪</span>`;
}

function makePlaceholder() {
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

  img.replaceWith(makePlaceholder());
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
  const activeData = filterExpiredShowDays(data);
  const days = activeData.shows || [];

  if (!days.length) {
    calendar.innerHTML = `<p class="bmc-empty">Upcoming shows will be posted here soon.</p>`;
    queueHeightUpdate();
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

async function loadScheduleData() {
  try {
    const response = await fetch("./shows.json?v=202607-calendar", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`shows.json returned ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn("Using embedded fallback schedule data.", error);
    return fallbackData;
  }
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

async function boot() {
  try {
    const data = await loadScheduleData();
    render(applyManagementCorrections(data));
  } catch (error) {
    console.error(error);
    calendar.innerHTML = `<p class="bmc-empty">Upcoming shows will be posted here soon.</p>`;
    queueHeightUpdate();
  }
}

boot();