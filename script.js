const dataEl = document.getElementById("shows-data");
const fallbackData = JSON.parse(dataEl.textContent);
const calendar = document.getElementById("bmc-calendar");
const countEl = document.getElementById("bmc-count");

const ASHLEY_PAIGE_ARTIST = "Ashley Paige & The Soulcial Club";

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

function imageMarkup(show) {
  if (show.photo) {
    return `<img class="bmc-photo" loading="lazy" src="${escapeAttr(show.photo)}" alt="${escapeAttr(show.alt || show.artist + " promo photo")}" onerror="this.replaceWith(makePlaceholder('${escapeAttr(show.artist)}'))">`;
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