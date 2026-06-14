const BMC_PUZZLE_BACKGROUND_MEDIA = [
  { type: "image", src: "assets/background/live-performance-1.jpg", accent: true },
  { type: "image", src: "assets/background/ashley-paige-poster.webp", accent: true },
  { type: "image", src: "assets/background/bmc-stage-bw.jpg" },
  { type: "image", src: "assets/background/trombone-player.jpg" },
  { type: "image", src: "assets/background/window-band.jpg", accent: true },
  { type: "image", src: "assets/background/outdoor-band.webp" },
  { type: "image", src: "assets/background/woody-blur.jpg" },
  { type: "image", src: "assets/background/bmc-empty-stage.jpg", accent: true },
  { type: "video", src: "assets/background/background-loop.mp4", poster: "assets/background/bmc-empty-stage.jpg", accent: true },
  { type: "image", src: "assets/background/sierra-green-cover.jpg" },
  { type: "gif", src: "assets/background/trumpet-cat.gif", pixel: true },
  { type: "gif", src: "assets/background/pixel-jazz-bar.gif", pixel: true, accent: true },
  { type: "image", src: "assets/background/portrait-woman.webp" },
  { type: "image", src: "assets/background/guitarist-bw.webp" },
  { type: "gif", src: "assets/background/pixel-nola.gif", pixel: true },
  { type: "image", src: "assets/background/bmc-collage.webp", accent: true }
];

const BMC_PUZZLE_DESKTOP_SLOTS = [
  { x: -3,  y: 2,  w: 20, h: 18, r: -5 },
  { x: 18,  y: 0,  w: 18, h: 16, r: 2 },
  { x: 39,  y: 2,  w: 23, h: 23, r: -2 },
  { x: 64,  y: 4,  w: 12, h: 15, r: 4 },
  { x: 77,  y: 3,  w: 19, h: 18, r: -3 },
  { x: 1,   y: 24, w: 20, h: 18, r: 3 },
  { x: 23,  y: 19, w: 17, h: 18, r: -4 },
  { x: 42,  y: 27, w: 22, h: 19, r: 2 },
  { x: 66,  y: 22, w: 29, h: 21, r: 0 },
  { x: -2,  y: 46, w: 17, h: 22, r: -2 },
  { x: 17,  y: 42, w: 10, h: 13, r: 3 },
  { x: 29,  y: 47, w: 18, h: 19, r: -1 },
  { x: 49,  y: 48, w: 14, h: 18, r: 4 },
  { x: 64,  y: 47, w: 14, h: 18, r: -4 },
  { x: 79,  y: 44, w: 15, h: 16, r: 3 },
  { x: 19,  y: 66, w: 26, h: 24, r: 0 }
];

const BMC_PUZZLE_MOBILE_SLOTS = [
  { x: -8, y: 2,  w: 34, h: 15, r: -4 },
  { x: 26, y: 1,  w: 30, h: 14, r: 3 },
  { x: 58, y: 2,  w: 36, h: 18, r: -3 },
  { x: -6, y: 18, w: 28, h: 17, r: 2 },
  { x: 22, y: 17, w: 32, h: 16, r: -2 },
  { x: 56, y: 20, w: 32, h: 17, r: 3 },
  { x: -3, y: 37, w: 34, h: 17, r: -4 },
  { x: 31, y: 35, w: 31, h: 16, r: 2 },
  { x: 62, y: 39, w: 30, h: 16, r: -1 },
  { x: 0,  y: 55, w: 24, h: 13, r: 3 },
  { x: 25, y: 54, w: 17, h: 11, r: -2 },
  { x: 43, y: 54, w: 28, h: 15, r: 2 },
  { x: 72, y: 56, w: 26, h: 15, r: -3 },
  { x: 3,  y: 70, w: 26, h: 14, r: 2 },
  { x: 30, y: 71, w: 28, h: 14, r: -2 },
  { x: 60, y: 72, w: 36, h: 16, r: 1 }
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
      tile.style.setProperty("--float-duration", `${12 + (index % 5) * 2}s`);
      tile.style.setProperty("--float-delay", `${(index % 4) * -1.4}s`);

      let media;
      if (item.type === "video") {
        media = document.createElement("video");
        media.src = item.src;
        media.poster = item.poster || "";
        media.className = "bmc-mosaic-media";
        media.muted = true;
        media.loop = true;
        media.autoplay = true;
        media.playsInline = true;
        media.preload = "metadata";
        media.addEventListener("error", () => tile.remove());

        if (!prefersReduced) {
          media.play().catch(() => {});
        }
      } else {
        media = document.createElement("img");
        media.src = item.src;
        media.alt = "";
        media.loading = "eager";
        media.className = `bmc-mosaic-media${item.pixel ? " pixel" : ""}`;
        media.decoding = "async";
        media.addEventListener("error", () => tile.remove());
      }

      tile.appendChild(media);
      mosaicEl.appendChild(tile);
      mosaicTiles.push(tile);
    });

    relayoutMosaic(true);

    clearInterval(mosaicTimer);
    if (!prefersReduced) {
      mosaicTimer = setInterval(shiftMosaic, 5200);
    }
  }

  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => relayoutMosaic(true), 120);
  }

  window.addEventListener("resize", handleResize);

  document.addEventListener("visibilitychange", () => {
    document.querySelectorAll(".bmc-mosaic video").forEach((video) => {
      if (document.hidden) {
        video.pause();
      } else if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        video.play().catch(() => {});
      }
    });
  });

  buildMosaic();
})();
