const BMC_PUZZLE_BACKGROUND_MEDIA = [
  { type: "image", src: "assets/background/live-performance-1.jpg", accent: true },
  { type: "gif", src: "assets/background/trumpet-cat.gif", pixel: true, accent: true },
  { type: "image", src: "assets/background/bmc-women-singers-stage.jpg", accent: true },
  { type: "image", src: "assets/background/bmc-lamp-bar.jpg", accent: true },
  { type: "image", src: "assets/background/bmc-woman-singer-show-love.jpg" },
  { type: "gif", src: "assets/background/trumpet-cat.gif", pixel: true, accent: true },
  { type: "image", src: "assets/background/bmc-balcony-crowd-night.jpg", accent: true },
  { type: "image", src: "assets/background/bmc-stage-band-show-love.jpg", accent: true },
  { type: "image", src: "assets/background/bmc-main-room-wide.jpg" },
  { type: "image", src: "assets/background/bmc-patio-sign.jpg" },
  { type: "image", src: "assets/background/ashley-paige-poster.webp", accent: true },
  { type: "image", src: "assets/background/bmc-stage-bw.jpg" },
  { type: "image", src: "assets/background/trombone-player.jpg" },
  { type: "image", src: "assets/background/window-band.jpg", accent: true },
  { type: "gif", src: "assets/background/trumpet-cat.gif", pixel: true, accent: true },
  { type: "image", src: "assets/background/outdoor-band.webp" },
  { type: "image", src: "assets/background/woody-blur.jpg" },
  { type: "image", src: "assets/background/bmc-empty-stage.jpg", accent: true },
  { type: "image", src: "assets/background/sierra-green-cover.jpg" },
  { type: "gif", src: "assets/background/pixel-jazz-bar.gif", pixel: true, accent: true },
  { type: "image", src: "assets/background/portrait-woman.webp" },
  { type: "image", src: "assets/background/guitarist-bw.webp" },
  { type: "gif", src: "assets/background/trumpet-cat.gif", pixel: true, accent: true },
  { type: "gif", src: "assets/background/pixel-nola.gif", pixel: true },
  { type: "image", src: "assets/background/bmc-collage.webp", accent: true }
];

const BMC_PUZZLE_DESKTOP_SLOTS = [
  { x: -3,  y: 3,  w: 20, h: 18, r: -5 },
  { x: 18,  y: 1,  w: 18, h: 16, r: 2 },
  { x: 39,  y: 3,  w: 22, h: 20, r: -2 },
  { x: 64,  y: 3,  w: 17, h: 17, r: 4 },
  { x: 80,  y: 2,  w: 20, h: 19, r: -3 },
  { x: -4,  y: 25, w: 22, h: 19, r: 3 },
  { x: 20,  y: 21, w: 18, h: 18, r: -4 },
  { x: 42,  y: 26, w: 22, h: 18, r: 2 },
  { x: 66,  y: 23, w: 24, h: 20, r: 0 },
  { x: -3,  y: 48, w: 19, h: 21, r: -2 },
  { x: 22,  y: 45, w: 20, h: 18, r: 3 },
  { x: 47,  y: 49, w: 18, h: 19, r: -1 },
  { x: 70,  y: 47, w: 20, h: 20, r: 4 },
  { x: 7,   y: 70, w: 22, h: 18, r: -4 },
  { x: 38,  y: 68, w: 24, h: 20, r: 0 },
  { x: 71,  y: 69, w: 21, h: 20, r: 3 }
];

const BMC_PUZZLE_MOBILE_SLOTS = [
  { x: -8, y: 2,  w: 34, h: 17, r: -4 },
  { x: 26, y: 2,  w: 30, h: 16, r: 3 },
  { x: 58, y: 3,  w: 34, h: 17, r: -3 },
  { x: -7, y: 22, w: 30, h: 17, r: 2 },
  { x: 26, y: 20, w: 32, h: 16, r: -2 },
  { x: 61, y: 23, w: 30, h: 17, r: 3 },
  { x: -4, y: 43, w: 32, h: 17, r: -4 },
  { x: 31, y: 41, w: 30, h: 16, r: 2 },
  { x: 64, y: 45, w: 31, h: 16, r: -1 },
  { x: 0,  y: 64, w: 29, h: 15, r: 3 },
  { x: 33, y: 63, w: 28, h: 14, r: -2 },
  { x: 65, y: 65, w: 30, h: 15, r: 2 }
];

(function mountBmcPuzzleBackground() {
  const mosaicEl = document.getElementById("bmcMosaic");
  if (!mosaicEl) return;

  let mosaicTiles = [];
  let mosaicOrder = [];
  let mosaicTimer = null;
  let resizeTimer = null;
  let mediaCursor = 0;
  let swapCursor = 0;

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function visibleTileCount() {
    return window.innerWidth <= 720 ? 7 : 10;
  }

  function tileScale() {
    return window.innerWidth <= 720 ? 0.76 : 0.68;
  }

  function currentSlots() {
    return window.innerWidth <= 720 ? BMC_PUZZLE_MOBILE_SLOTS : BMC_PUZZLE_DESKTOP_SLOTS;
  }

  function applySlot(tile, slot, index) {
    const scale = tileScale();
    tile.style.left = `${slot.x}%`;
    tile.style.top = `${slot.y}%`;
    tile.style.width = `${slot.w * scale}%`;
    tile.style.height = `${slot.h * scale}%`;
    tile.style.transform = `rotate(${slot.r}deg)`;
    tile.style.zIndex = String((index % 4) + 1);
  }

  function setTileMedia(tile, item, index, isInitial = false) {
    tile.className = `bmc-mosaic-tile floating is-${item.type}${item.accent ? " is-accent" : ""}${item.pixel ? " is-pixel" : ""}`;
    tile.style.setProperty("--float-duration", `${12 + (index % 5) * 1.7}s`);
    tile.style.setProperty("--float-delay", `${(index % 4) * -1.2}s`);
    tile.style.setProperty("--media-duration", `${18 + (index % 6) * 1.9}s`);
    tile.innerHTML = "";

    const media = document.createElement("img");
    media.src = item.src;
    media.alt = "";
    media.loading = isInitial ? "eager" : "lazy";
    media.className = `bmc-mosaic-media${item.pixel ? " pixel" : ""}`;
    media.decoding = "async";
    media.addEventListener("error", () => tile.remove());
    tile.appendChild(media);
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

  function rotateMediaSource() {
    if (!mosaicTiles.length) return;
    const tile = mosaicTiles[swapCursor % mosaicTiles.length];
    const item = BMC_PUZZLE_BACKGROUND_MEDIA[mediaCursor % BMC_PUZZLE_BACKGROUND_MEDIA.length];
    setTileMedia(tile, item, swapCursor, false);
    mediaCursor += 1;
    swapCursor += 1;
  }

  function shiftMosaic() {
    if (!mosaicTiles.length) return;
    const next = mosaicOrder.slice(1).concat(mosaicOrder[0]);

    if (next.length > 5) {
      const a = 2;
      const b = next.length - 2;
      [next[a], next[b]] = [next[b], next[a]];
    }

    mosaicOrder = next;
    relayoutMosaic(false);
    rotateMediaSource();
  }

  function buildMosaic() {
    mosaicEl.innerHTML = "";
    mosaicTiles = [];

    const count = Math.min(visibleTileCount(), BMC_PUZZLE_BACKGROUND_MEDIA.length);
    mosaicOrder = Array.from({ length: count }, (_, index) => index);
    mediaCursor = count;
    swapCursor = 0;

    for (let index = 0; index < count; index += 1) {
      const item = BMC_PUZZLE_BACKGROUND_MEDIA[index];
      const tile = document.createElement("div");
      setTileMedia(tile, item, index, true);
      mosaicEl.appendChild(tile);
      mosaicTiles.push(tile);
    }

    relayoutMosaic(true);

    clearInterval(mosaicTimer);
    if (!prefersReducedMotion()) {
      mosaicTimer = setInterval(shiftMosaic, 5600);
    }
  }

  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildMosaic();
    }, 180);
  }

  window.addEventListener("resize", handleResize);
  buildMosaic();
})();
