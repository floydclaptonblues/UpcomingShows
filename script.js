const dataEl = document.getElementById("shows-data");
const fallbackData = JSON.parse(dataEl.textContent);
const calendar = document.getElementById("bmc-calendar");
const countEl = document.getElementById("bmc-count");

const ASHLEY_PAIGE_ARTIST = "Ashley Paige & The Soulcial Club";
const ASHLEY_PAIGE_FLYER = "data:image/jpeg;base64,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';

function applyManagementCorrections(data) {
  (data.shows || []).forEach(day => {
    if (day.date === "Wednesday • June 10" || day.date === "Wednesday • June 24") {
      (day.shows || []).forEach(show => {
        if (show.time === "9:00 PM – 11:30 PM") {
          show.artist = ASHLEY_PAIGE_ARTIST;
          show.photo = ASHLEY_PAIGE_FLYER;
          show.alt = "Ashley Paige with The Soulcial Club flyer";
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