const BMC_PUZZLE_BACKGROUND_MEDIA = [
  { type: "image", src: "assets/background/bmc-women-singers-stage.jpg", accent: true },
  { type: "image", src: "assets/background/live-performance-1.jpg", accent: true },
  { type: "image", src: "assets/background/bmc-stage-band-show-love.jpg", accent: true },
  { type: "image", src: "assets/background/bmc-woman-singer-show-love.jpg", accent: true },
  { type: "image", src: "assets/background/bmc-stage-bw.jpg" },
  { type: "image", src: "assets/background/trombone-player.jpg" },
  { type: "image", src: "assets/background/window-band.jpg", accent: true },
  { type: "image", src: "assets/background/outdoor-band.webp" },
  { type: "image", src: "assets/background/woody-blur.jpg" },
  { type: "image", src: "assets/background/guitarist-bw.webp" },
  { type: "image", src: "assets/background/ashley-paige-poster.webp", accent: true },
  { type: "image", src: "assets/background/bmc-collage.webp", accent: true },
  { type: "image", src: "assets/background/bmc-jazzfest-cart.jpg", accent: true },
  { type: "image", src: "assets/background/bmc-lamp-bar.jpg" },
  { type: "image", src: "assets/background/bmc-balcony-crowd-night.jpg", accent: true },
  { type: "image", src: "assets/background/bmc-stage-band-show-love.jpg", accent: true },
  { type: "image", src: "assets/background/bmc-main-room-wide.jpg" },
  { type: "image", src: "assets/background/bmc-patio-sign.jpg" },
  { type: "image", src: "assets/background/bmc-empty-stage.jpg" },
  { type: "image", src: "assets/background/portrait-woman.webp" },
  { type: "image", src: "assets/background/sierra-green-cover.jpg" },
  { type: "gif", src: "assets/background/trumpet-cat.gif", pixel: true, accent: true },
  { type: "gif", src: "assets/background/trumpet-cat.gif", pixel: true, accent: true },
  { type: "gif", src: "assets/background/trumpet-cat.gif", pixel: true, accent: true },
  { type: "gif", src: "assets/background/pixel-jazz-bar.gif", pixel: true },
  { type: "gif", src: "assets/background/pixel-nola.gif", pixel: true }
];

const BMC_PUZZLE_DESKTOP_SLOTS = [
  { x: -2, y: 3,  w: 14, h: 18, r: -5 },
  { x: 10, y: 1,  w: 13, h: 16, r: 3 },
  { x: 24, y: 2,  w: 15, h: 18, r: -2 },
  { x: 39, y: 4,  w: 13, h: 16, r: 4 },
  { x: 52, y: 2,  w: 15, h: 19, r: -3 },
  { x: 67, y: 1,  w: 14, h: 17, r: 2 },
  { x: 82, y: 3,  w: 13, h: 18, r: -4 },
  { x: 2,  y: 30, w: 15, h: 17, r: 2 },
  { x: 18, y: 27, w: 13, h: 16, r: -3 },
  { x: 33, y: 29, w: 14, h: 18, r: 4 },
  { x: 49, y: 27, w: 13, h: 16, r: -2 },
  { x: 64, y: 29, w: 15, h: 18, r: 3 },
  { x: 80, y: 26, w: 13, h: 17, r: -4 },
  { x: 6,  y: 58, w: 14, h: 18, r: -3 },
  { x: 23, y: 57, w: 15, h: 17, r: 2 },
  { x: 42, y: 56, w: 14, h: 18, r: -1 },
  { x: 61, y: 58, w: 15, h: 17, r: 4 },
  { x: 79, y: 57, w: 13, h: 18, r: -3 }
];

const BMC_PUZZLE_MOBILE_SLOTS = [
  { x: -4, y: 3,  w: 24, h: 16, r: -4 },
  { x: 19, y: 1,  w: 23, h: 15, r: 2 },
  { x: 43, y: 2,  w: 24, h: 16, r: -2 },
  { x: 67, y: 3,  w: 23, h: 16, r: 3 },
  { x: 2,  y: 25, w: 23, h: 15, r: 2 },
  { x: 27, y: 23, w: 23, h: 15, r: -2 },
  { x: 52, y: 25, w: 23, h: 15, r: 3 },
  { x: 76, y: 24, w: 20, h: 15, r: -3 },
  { x: 5,  y: 47, w: 22, h: 15, r: -3 },
  { x: 29, y: 46, w: 23, h: 15, r: 2 },
  { x: 54, y: 47, w: 22, h: 15, r: -2 },
  { x: 78, y: 46, w: 18, h: 15, r: 3 },
  { x: 8,  y: 69, w: 23, h: 15, r: 2 },
  { x: 33, y: 68, w: 24, h: 16, r: -2 },
  { x: 59, y: 69, w: 23, h: 15, r: 3 }
];

(function mountBmcPuzzleBackground() {
  const mosaicEl = document.getElementById("bmcMosaic");
  if (!mosaicEl) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ACTIVE_COUNT = window.innerWidth <= 720 ? 7 : 10;
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
    tile.style.setProperty('--tile-rot', `${slot.r}deg`);
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
      tile.style.setProperty("--float-duration", `${11 + (i % 5) * 1.6}s`);
      tile.style.setProperty("--float-delay", `${(i % 4) * -1.1}s`);
      tile.dataset.type = item.type;
      tile.appendChild(createMediaEl(item, true));
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
      layoutTimer = setInterval(rotateOneTile, 3800);
    }
  }

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      start();
      relayoutAll();
    }, 150);
  });

  start();
})();
