const BMC_PUZZLE_BACKGROUND_MEDIA = [
  { type: "image", src: "assets/background/live-performance-1.jpg", accent: true },
  { type: "image", src: "assets/background/ashley-paige-poster.webp", accent: true },
  { type: "image", src: "assets/background/bmc-stage-bw.jpg" },
  { type: "image", src: "assets/background/trombone-player.jpg", accent: true },
  { type: "image", src: "assets/background/window-band.jpg", accent: true },
  { type: "image", src: "assets/background/outdoor-band.webp" },
  { type: "image", src: "assets/background/woody-blur.jpg", accent: true },
  { type: "image", src: "assets/background/sierra-green-cover.jpg" },
  { type: "image", src: "assets/background/portrait-woman.webp" },
  { type: "image", src: "assets/background/guitarist-bw.webp", accent: true },
  { type: "image", src: "assets/background/bmc-collage.webp", accent: true },
  { type: "image", src: "assets/background/bmc-women-singers-stage.jpg", accent: true },
  { type: "image", src: "assets/background/bmc-lamp-bar.jpg" },
  { type: "image", src: "assets/background/bmc-woman-singer-show-love.jpg", accent: true },
  { type: "image", src: "assets/background/bmc-balcony-crowd-night.jpg", accent: true },
  { type: "image", src: "assets/background/bmc-stage-band-show-love.jpg", accent: true },
  { type: "image", src: "assets/background/bmc-main-room-wide.jpg" },
  { type: "image", src: "assets/background/bmc-patio-sign.jpg" },
  { type: "image", src: "assets/background/bmc-empty-stage.jpg" },
  { type: "image", src: "https://floydclaptonblues.github.io/Balcony-Music-Club-PWA/assets/bands/bmc-band-assets/assets/bands/Tropical%20Weather.png", accent: true },
  { type: "image", src: "https://floydclaptonblues.github.io/Balcony-Music-Club-PWA/assets/bands/bmc-band-assets/assets/bands/Jam%20Brass%20Band%20Thursday%20%281%29.jpg", accent: true },
  { type: "image", src: "https://floydclaptonblues.github.io/Balcony-Music-Club-PWA/assets/bands/bmc-band-assets/assets/bands/Josh%20Benitez%20Band%20Sunday.png", accent: true },
  { type: "gif", src: "assets/background/pixel-jazz-bar.gif", pixel: true, accent: true },
  { type: "gif", src: "assets/background/pixel-nola.gif", pixel: true }
];

const BMC_PUZZLE_DESKTOP_SLOTS = [
  { x: -4, y: 1,  w: 24, h: 24, r: -5 },
  { x: 17, y: 0,  w: 22, h: 22, r: 3 },
  { x: 39, y: 1,  w: 27, h: 25, r: -2 },
  { x: 64, y: 2,  w: 20, h: 23, r: 4 },
  { x: 82, y: 0,  w: 22, h: 25, r: -4 },
  { x: -2, y: 24, w: 22, h: 26, r: 2 },
  { x: 19, y: 22, w: 18, h: 22, r: -3 },
  { x: 38, y: 26, w: 26, h: 24, r: 4 },
  { x: 62, y: 24, w: 31, h: 25, r: -1 },
  { x: 0,  y: 49, w: 20, h: 26, r: -4 },
  { x: 20, y: 47, w: 24, h: 25, r: 2 },
  { x: 43, y: 51, w: 18, h: 23, r: -2 },
  { x: 61, y: 49, w: 21, h: 26, r: 4 },
  { x: 80, y: 46, w: 23, h: 26, r: -3 },
  { x: 9,  y: 72, w: 24, h: 24, r: 3 },
  { x: 34, y: 71, w: 28, h: 26, r: -2 },
  { x: 62, y: 72, w: 26, h: 24, r: 2 },
  { x: 84, y: 69, w: 19, h: 24, r: -4 }
];

const BMC_PUZZLE_MOBILE_SLOTS = [
  { x: -10, y: 1,  w: 42, h: 20, r: -4 },
  { x: 25,  y: 0,  w: 38, h: 19, r: 3 },
  { x: 61,  y: 2,  w: 42, h: 21, r: -3 },
  { x: -8,  y: 22, w: 36, h: 20, r: 2 },
  { x: 25,  y: 21, w: 39, h: 20, r: -2 },
  { x: 60,  y: 23, w: 39, h: 21, r: 3 },
  { x: -6,  y: 45, w: 40, h: 20, r: -4 },
  { x: 31,  y: 43, w: 38, h: 20, r: 2 },
  { x: 65,  y: 45, w: 36, h: 20, r: -1 },
  { x: -2,  y: 67, w: 36, h: 20, r: 3 },
  { x: 33,  y: 66, w: 38, h: 20, r: -2 },
  { x: 67,  y: 68, w: 35, h: 20, r: 2 }
];

(function mountBmcPuzzleBackground() {
  const mosaicEl = document.getElementById("bmcMosaic");
  if (!mosaicEl) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ACTIVE_COUNT = window.innerWidth <= 720 ? 11 : 17;
  let tiles = [];
  let mediaCursor = 0;
  let layoutTimer = null;
  let resizeTimer = null;

  function currentSlots() {
    return window.innerWidth <= 720 ? BMC_PUZZLE_MOBILE_SLOTS : BMC_PUZZLE_DESKTOP_SLOTS;
  }

  function createMediaEl(item, eager = false) {
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = "";
    img.className = `bmc-mosaic-media${item.pixel ? " pixel" : ""}`;
    img.decoding = "async";
    img.loading = eager ? "eager" : "lazy";
    return img;
  }

  function nextItem() {
    const item = BMC_PUZZLE_BACKGROUND_MEDIA[mediaCursor % BMC_PUZZLE_BACKGROUND_MEDIA.length];
    mediaCursor += 1;
    return item;
  }

  function applySlot(tile, slot, index) {
    tile.style.left = `${slot.x}%`;
    tile.style.top = `${slot.y}%`;
    tile.style.width = `${slot.w}%`;
    tile.style.height = `${slot.h}%`;
    tile.style.setProperty("--tile-rot", `${slot.r}deg`);
    tile.style.transform = `rotate(${slot.r}deg)`;
    tile.style.zIndex = String((index % 4) + 1);
  }

  function buildTiles() {
    mosaicEl.innerHTML = "";
    tiles = [];
    mediaCursor = 0;
    const slots = currentSlots();
    const count = Math.min(ACTIVE_COUNT, slots.length);

    for (let i = 0; i < count; i++) {
      const item = nextItem();
      const tile = document.createElement("div");
      tile.className = `bmc-mosaic-tile floating is-${item.type}${item.accent ? " is-accent" : ""}${item.pixel ? " is-pixel" : ""}`;
      tile.style.setProperty("--float-duration", `${10 + (i % 6) * 1.5}s`);
      tile.style.setProperty("--float-delay", `${(i % 5) * -1.15}s`);
      tile.dataset.type = item.type;
      tile.appendChild(createMediaEl(item, i < 8));
      applySlot(tile, slots[i], i);
      mosaicEl.appendChild(tile);
      tiles.push(tile);
    }
  }

  function rotateOneTile() {
    if (!tiles.length) return;
    const slots = currentSlots();
    const first = tiles.shift();
    const item = nextItem();
    first.className = `bmc-mosaic-tile floating is-${item.type}${item.accent ? " is-accent" : ""}${item.pixel ? " is-pixel" : ""}`;
    first.innerHTML = "";
    first.appendChild(createMediaEl(item, false));
    tiles.push(first);
    tiles.forEach((tile, i) => applySlot(tile, slots[i % slots.length], i));
  }

  function relayoutAll() {
    const slots = currentSlots();
    tiles.forEach((tile, i) => applySlot(tile, slots[i % slots.length], i));
  }

  function start() {
    buildTiles();
    clearInterval(layoutTimer);
    if (!prefersReduced) {
      layoutTimer = setInterval(rotateOneTile, 3100);
    }
  }

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      start();
      relayoutAll();
    }, 150);
  });

  start();
})();

(function mountBmcUpcomingUfoBackdrop() {
  if (document.getElementById("bmc-upcoming-ufo-backdrop")) return;

  const frame = document.querySelector(".bmc-frame");
  if (!frame) return;

  const style = document.createElement("style");
  style.id = "bmc-upcoming-ufo-backdrop-style";
  style.textContent = `
    .bmc-frame{position:relative!important;z-index:4!important}
    .bmc-hero,.bmc-calendar,.bmc-top-media{position:relative!important;z-index:2!important}
    #bmc-upcoming-ufo-backdrop{
      position:absolute;
      left:50%;
      top:clamp(172px,26vh,280px);
      z-index:1;
      width:clamp(320px,54vw,820px);
      transform:translateX(-50%) rotate(-3deg);
      opacity:.50;
      pointer-events:none;
      filter:drop-shadow(0 0 18px rgba(94,230,255,.48)) drop-shadow(0 0 34px rgba(255,216,87,.24));
      animation:bmcUpcomingUfoDrift 14s ease-in-out infinite alternate;
      will-change:transform;
    }
    #bmc-upcoming-ufo-backdrop img{display:block;width:100%;height:auto;user-select:none;-webkit-user-drag:none}
    @keyframes bmcUpcomingUfoDrift{
      0%{transform:translateX(-50%) translateY(0) rotate(-4deg) scale(1)}
      33%{transform:translateX(-46%) translateY(18px) rotate(2deg) scale(1.03)}
      66%{transform:translateX(-54%) translateY(-12px) rotate(-1deg) scale(.99)}
      100%{transform:translateX(-50%) translateY(24px) rotate(3deg) scale(1.02)}
    }
    @media(max-width:720px){#bmc-upcoming-ufo-backdrop{top:clamp(150px,20vh,220px);width:clamp(250px,78vw,430px);opacity:.38}}
    @media(prefers-reduced-motion:reduce){#bmc-upcoming-ufo-backdrop{animation:none;opacity:.34}}
  `;
  document.head.appendChild(style);

  const ufo = document.createElement("div");
  ufo.id = "bmc-upcoming-ufo-backdrop";
  ufo.setAttribute("aria-hidden", "true");
  const img = document.createElement("img");
  img.src = "https://floydclaptonblues.github.io/Balcony-Music-Club-PWA/assets/venue/bmc_jazzycat_ufo_360_rotation.gif?v=20260705-upcoming-calendar-backdrop";
  img.alt = "";
  img.decoding = "async";
  img.loading = "lazy";
  ufo.appendChild(img);
  frame.insertBefore(ufo, frame.firstChild);
})();
