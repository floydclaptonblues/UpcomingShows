const BMC_PUZZLE_BACKGROUND_MEDIA = [
  { type: "image", src: "assets/background/live-performance-1.jpg", accent: true },
  { type: "gif", src: "assets/background/trumpet-cat.gif", pixel: true, accent: true },
  { type: "image", src: "assets/background/ashley-paige-poster.webp", accent: true },
  { type: "image", src: "assets/background/bmc-stage-bw.jpg" },
  { type: "image", src: "assets/background/trombone-player.jpg" },
  { type: "image", src: "assets/background/window-band.jpg", accent: true },
  { type: "gif", src: "assets/background/trumpet-cat.gif", pixel: true, accent: true },
  { type: "image", src: "assets/background/outdoor-band.webp" },
  { type: "image", src: "assets/background/woody-blur.jpg" },
  { type: "image", src: "assets/background/bmc-empty-stage.jpg", accent: true },
  { type: "image", src: "assets/background/bmc-women-singers-stage.jpg", accent: true },
  { type: "image", src: "assets/background/sierra-green-cover.jpg" },
  { type: "image", src: "assets/background/bmc-lamp-bar.jpg", accent: true },
  { type: "gif", src: "assets/background/trumpet-cat.gif", pixel: true, accent: true },
  { type: "image", src: "assets/background/bmc-woman-singer-show-love.jpg" },
  { type: "image", src: "assets/background/bmc-balcony-crowd-night.jpg", accent: true },
  { type: "image", src: "assets/background/bmc-stage-band-show-love.jpg", accent: true },
  { type: "image", src: "assets/background/bmc-main-room-wide.jpg" },
  { type: "image", src: "assets/background/bmc-patio-sign.jpg" },
  { type: "gif", src: "assets/background/pixel-jazz-bar.gif", pixel: true, accent: true },
  { type: "image", src: "assets/background/portrait-woman.webp" },
  { type: "image", src: "assets/background/guitarist-bw.webp" },
  { type: "gif", src: "assets/background/trumpet-cat.gif", pixel: true, accent: true },
  { type: "gif", src: "assets/background/pixel-nola.gif", pixel: true },
  { type: "image", src: "assets/background/bmc-collage.webp", accent: true }
];

const BMC_PUZZLE_DESKTOP_SLOTS = [
  { x: -3,  y: 2,  w: 21, h: 18, r: -5 },
  { x: 16,  y: 0,  w: 14, h: 18, r: 2 },
  { x: 29,  y: 2,  w: 22, h: 21, r: -2 },
  { x: 49,  y: 1,  w: 17, h: 18, r: 4 },
  { x: 64,  y: 3,  w: 19, h: 18, r: -3 },
  { x: 81,  y: 1,  w: 20, h: 22, r: 2 },
  { x: -4,  y: 22, w: 23, h: 20, r: 3 },
  { x: 17,  y: 20, w: 18, h: 20, r: -4 },
  { x: 33,  y: 23, w: 24, h: 20, r: 2 },
  { x: 55,  y: 20, w: 25, h: 22, r: 0 },
  { x: 78,  y: 24, w: 24, h: 21, r: -2 },
  { x: -3,  y: 43, w: 19, h: 23, r: -2 },
  { x: 14,  y: 42, w: 15, h: 18, r: 3 },
  { x: 27,  y: 44, w: 22, h: 21, r: -1 },
  { x: 47,  y: 45, w: 20, h: 21, r: 4 },
  { x: 65,  y: 44, w: 17, h: 22, r: -4 },
  { x: 80,  y: 43, w: 21, h: 20, r: 3 },
  { x: -3,  y: 66, w: 22, h: 20, r: 4 },
  { x: 17,  y: 64, w: 27, h: 23, r: 0 },
  { x: 42,  y: 66, w: 22, h: 20, r: -3 },
  { x: 62,  y: 64, w: 20, h: 23, r: 2 },
  { x: 80,  y: 63, w: 20, h: 24, r: -2 },
  { x: 4,   y: 6,  w: 12, h: 30, r: 1 },
  { x: 87,  y: 24, w: 13, h: 31, r: -1 },
  { x: 44,  y: 6,  w: 13, h: 28, r: -2 }
];

const BMC_PUZZLE_MOBILE_SLOTS = [
  { x: -8, y: 2,  w: 34, h: 17, r: -4 },
  { x: 23, y: 1,  w: 26, h: 18, r: 3 },
  { x: 47, y: 2,  w: 29, h: 18, r: -3 },
  { x: 72, y: 0,  w: 30, h: 20, r: 2 },
  { x: -7, y: 19, w: 31, h: 18, r: 2 },
  { x: 21, y: 18, w: 33, h: 18, r: -2 },
  { x: 52, y: 20, w: 28, h: 18, r: 3 },
  { x: 78, y: 19, w: 25, h: 19, r: -2 },
  { x: -4, y: 38, w: 34, h: 18, r: -4 },
  { x: 28, y: 36, w: 32, h: 18, r: 2 },
  { x: 58, y: 39, w: 34, h: 18, r: -1 },
  { x: 0,  y: 57, w: 28, h: 15, r: 3 },
  { x: 26, y: 56, w: 23, h: 14, r: -2 },
  { x: 47, y: 56, w: 31, h: 17, r: 2 },
  { x: 74, y: 58, w: 27, h: 16, r: -3 },
  { x: -4, y: 73, w: 32, h: 16, r: 2 },
  { x: 27, y: 74, w: 30, h: 16, r: -2 },
  { x: 55, y: 75, w: 37, h: 17, r: 1 },
  { x: -5, y: 89, w: 30, h: 13, r: -2 },
  { x: 24, y: 90, w: 23, h: 12, r: 3 },
  { x: 46, y: 89, w: 28, h: 13, r: -3 },
  { x: 72, y: 88, w: 29, h: 14, r: 2 },
  { x: -4, y: 5,  w: 20, h: 35, r: 1 },
  { x: 80, y: 25, w: 20, h: 35, r: -1 }
];

(function mountBmcPuzzleBackground() {
  const mosaicEl = document.getElementById("bmcMosaic");
  if (!mosaicEl) return;

  let mosaicTiles = [];
  let mosaicOrder = [];
  let mosaicTimer = null;
  let resizeTimer = null;

  function currentSlots() {
    return window.innerWidth <= 720 ? BMC_PUZZLE_MOBILE_SLOTS : BMC_PUZZLE_DESKTOP_SLOTS;
  }

  function applySlot(tile, slot, index) {
    tile.style.left = `${slot.x}%`;
    tile.style.top = `${slot.y}%`;
    tile.style.width = `${slot.w}%`;
    tile.style.height = `${slot.h}%`;
    tile.style.transform = `rotate(${slot.r}deg)`;
    tile.style.zIndex = String((index % 4) + 1);
  }

  function relayoutMosaic(initial = false) {
    const slots = currentSlots();

    mosaicTiles.forEach((tile, index) => {
      if (!tile.isConnected) return;

      const slot = slots[mosaicOrder[index] % slots.length];

      if (initial) {
        tile.style.transition = "none";
        applySlot(tile, slot, index);
        requestAnimationFrame(() => {
          tile.style.transition = "";
        });
      } else {
        applySlot(tile, slot, index);
      }
    });
  }

  function shiftMosaic() {
    if (!mosaicTiles.length) return;

    const next = mosaicOrder.slice(1).concat(mosaicOrder[0]);

    if (next.length > 5) {
      const a = 2;
      const b = next.length - 3;
      [next[a], next[b]] = [next[b], next[a]];
    }

    if (next.length > 9) {
      const a = 5;
      const b = 9;
      [next[a], next[b]] = [next[b], next[a]];
    }

    mosaicOrder = next;
    relayoutMosaic(false);
  }

  function buildMosaic() {
    mosaicEl.innerHTML = "";
    mosaicTiles = [];
    mosaicOrder = BMC_PUZZLE_BACKGROUND_MEDIA.map((_, index) => index);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    BMC_PUZZLE_BACKGROUND_MEDIA.forEach((item, index) => {
      const tile = document.createElement("div");
      tile.className = `bmc-mosaic-tile floating is-${item.type}${item.accent ? " is-accent" : ""}${item.pixel ? " is-pixel" : ""}`;
      tile.style.setProperty("--float-duration", `${11 + (index % 5) * 1.6}s`);
      tile.style.setProperty("--float-delay", `${(index % 4) * -1.4}s`);
      tile.style.setProperty("--media-duration", `${15 + (index % 6) * 1.7}s`);

      const media = document.createElement("img");
      media.src = item.src;
      media.alt = "";
      media.loading = "eager";
      media.className = `bmc-mosaic-media${item.pixel ? " pixel" : ""}`;
      media.decoding = "async";
      media.addEventListener("error", () => tile.remove());

      tile.appendChild(media);
      mosaicEl.appendChild(tile);
      mosaicTiles.push(tile);
    });

    relayoutMosaic(true);

    clearInterval(mosaicTimer);
    if (!prefersReduced) {
      mosaicTimer = setInterval(shiftMosaic, 4200);
    }
  }

  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => relayoutMosaic(true), 120);
  }

  window.addEventListener("resize", handleResize);
  buildMosaic();
})();
