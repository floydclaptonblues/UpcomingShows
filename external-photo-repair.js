(() => {
  const PWA_BAND_ASSET_BASE = "https://floydclaptonblues.github.io/Balcony-Music-Club-PWA/assets/bands/bmc-band-assets/assets/bands/";
  const BMC_MURAL_FALLBACK = "https://floydclaptonblues.github.io/Balcony-Music-Club-PWA/assets/venue/20260213_212259%20(1).jpg?v=20260730-band-fallback";
  const PHOTO_MAP = {
    "TROPICAL WEATHER": `${PWA_BAND_ASSET_BASE}Tropical%20Weather.png`,
    "JAM BRASS BAND": `${PWA_BAND_ASSET_BASE}Jam%20Brass%20Band%20Thursday%20%281%29.jpg`,
    "JOSH BENITEZ BAND": `${PWA_BAND_ASSET_BASE}Josh%20Benitez%20Band%20Sunday.png`,
    "LEROY MARSHALL BAND": `${PWA_BAND_ASSET_BASE}Leroy%20Marshal.jpg`,
    "LEROY MARSHAL BAND": `${PWA_BAND_ASSET_BASE}Leroy%20Marshal.jpg`,
    "JON RONIGER": `${PWA_BAND_ASSET_BASE}JON%20RONIGER.jpg`,
    "FLEURTATIONS": `${PWA_BAND_ASSET_BASE}FLEURTATIONS.jpg`,
    "THE FLEURTATIONS": `${PWA_BAND_ASSET_BASE}FLEURTATIONS.jpg`,
    "KAT KILEY EXPERIENCE": "https://images.squarespace-cdn.com/content/v1/5e08ffd9d89e7165b5a11246/1717437775819-8MHDQ8109RFUSOKV5KSZ/IMG_1324.JPG?format=2500w",
    "BIG MIKE & THE R&B KINGS": "https://img1.wsimg.com/isteam/ip/6d08c726-0aaa-4277-b580-c90403ae5f09/FB_IMG_1768786004376.jpg/:/cr=t:12.49%25,l:0%25,w:100%25,h:75.02%25/rs=w:2048,h:1024,cg:true",
    "BIG MIKE & R&B KINGS": "https://img1.wsimg.com/isteam/ip/6d08c726-0aaa-4277-b580-c90403ae5f09/FB_IMG_1768786004376.jpg/:/cr=t:12.49%25,l:0%25,w:100%25,h:75.02%25/rs=w:2048,h:1024,cg:true",
    "KIM IN THE WIND": "https://i.ytimg.com/vi/T50uynNUKmo/hqdefault.jpg",
    "KIM IN THE WIND BAND": "https://i.ytimg.com/vi/T50uynNUKmo/hqdefault.jpg",
    "SIERRA GREEN": "https://www.gigsalad.com/cdn-cgi/image/fit%3Dcontain%2Cformat%3Dauto%2Cheight%3D516%2Cwidth%3D917/s3/s/sierra_green_the_soul_machine_new_orleans/630ed47c61433.jpeg",
    "SIERRA & GREEN NOTES": "https://www.gigsalad.com/cdn-cgi/image/fit%3Dcontain%2Cformat%3Dauto%2Cheight%3D516%2Cwidth%3D917/s3/s/sierra_green_the_soul_machine_new_orleans/630ed47c61433.jpeg"
  };

  function key(value) {
    return String(value || "")
      .replaceAll("’", "'")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();
  }

  function makeImage(artist, src, isFallback = false) {
    const img = document.createElement("img");
    img.className = "bmc-photo";
    img.loading = "lazy";
    img.decoding = "async";
    img.src = src;
    img.alt = isFallback
      ? `Balcony Music Club mural — fallback image for ${artist}`
      : `${artist} promo photo`;
    img.dataset.photoRepair = isFallback ? "mural-fallback" : "external";
    img.onerror = () => {
      if (img.dataset.photoRepair !== "mural-fallback") {
        img.dataset.photoRepair = "mural-fallback";
        img.src = BMC_MURAL_FALLBACK;
        img.alt = `Balcony Music Club mural — fallback image for ${artist}`;
        return;
      }

      const placeholder = document.createElement("span");
      placeholder.className = "bmc-photo bmc-photo-placeholder";
      placeholder.setAttribute("aria-hidden", "true");
      placeholder.textContent = "♪";
      img.replaceWith(placeholder);
    };
    return img;
  }

  function repairPhotos() {
    document.querySelectorAll(".bmc-event").forEach((event) => {
      const artistEl = event.querySelector(".bmc-artist");
      const block = event.querySelector(".bmc-artist-block");
      if (!artistEl || !block) return;

      const artist = artistEl.textContent.trim();
      const mappedSrc = PHOTO_MAP[key(artist)];
      const current = block.querySelector(".bmc-photo");

      if (mappedSrc) {
        if (
          current &&
          current.tagName === "IMG" &&
          current.dataset.photoRepair === "external" &&
          current.getAttribute("src") === mappedSrc
        ) return;

        const replacement = makeImage(artist, mappedSrc, false);
        if (current) current.replaceWith(replacement);
        else block.insertBefore(replacement, block.firstChild);
        return;
      }

      if (current && current.tagName === "IMG") return;

      const fallback = makeImage(artist, BMC_MURAL_FALLBACK, true);
      if (current) current.replaceWith(fallback);
      else block.insertBefore(fallback, block.firstChild);
    });
  }

  function scheduleRepairs() {
    repairPhotos();
    [100, 300, 700, 1200, 2000, 3500, 5000].forEach((delay) => setTimeout(repairPhotos, delay));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleRepairs);
  } else {
    scheduleRepairs();
  }

  window.addEventListener("load", scheduleRepairs);
})();
