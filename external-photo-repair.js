(() => {
  const PHOTO_MAP = {
    "KAT KILEY EXPERIENCE": "https://images.squarespace-cdn.com/content/v1/5e08ffd9d89e7165b5a11246/1717437775819-8MHDQ8109RFUSOKV5KSZ/IMG_1324.JPG?format=2500w",
    "BIG MIKE & THE R&B KINGS": "https://img1.wsimg.com/isteam/ip/6d08c726-0aaa-4277-b580-c90403ae5f09/FB_IMG_1768786004376.jpg/:/cr=t:12.49%25,l:0%25,w:100%25,h:75.02%25/rs=w:2048,h:1024,cg:true",
    "BIG MIKE & R&B KINGS": "https://img1.wsimg.com/isteam/ip/6d08c726-0aaa-4277-b580-c90403ae5f09/FB_IMG_1768786004376.jpg/:/cr=t:12.49%25,l:0%25,w:100%25,h:75.02%25/rs=w:2048,h:1024,cg:true",
    "KIM IN THE WIND": "https://i.ytimg.com/vi/T50uynNUKmo/hqdefault.jpg",
    "KIM IN THE WIND BAND": "https://i.ytimg.com/vi/T50uynNUKmo/hqdefault.jpg",
    "SIERRA GREEN": "https://www.gigsalad.com/cdn-cgi/image/fit%3Dcontain%2Cformat%3Dauto%2Cheight%3D516%2Cwidth%3D917/s3/s/sierra_green_the_soul_machine_new_orleans/630ed47c61433.jpeg",
    "SIERRA & GREEN NOTES": "https://www.gigsalad.com/cdn-cgi/image/fit%3Dcontain%2Cformat%3Dauto%2Cheight%3D516%2Cwidth%3D917/s3/s/sierra_green_the_soul_machine_new_orleans/630ed47c61433.jpeg",
    "JOSH BENITEZ BAND": "https://f4.bcbits.com/img/0019269648_10.jpg"
  };

  function key(value) {
    return String(value || "")
      .replaceAll("’", "'")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();
  }

  function makeImage(artist, src) {
    const img = document.createElement("img");
    img.className = "bmc-photo";
    img.loading = "lazy";
    img.decoding = "async";
    img.src = src;
    img.alt = `${artist} promo photo`;
    img.dataset.photoRepair = "external";
    img.onerror = () => {
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
      const src = PHOTO_MAP[key(artist)];
      if (!src) return;

      const current = block.querySelector(".bmc-photo");
      if (current && current.tagName === "IMG" && current.dataset.photoRepair === "external" && current.getAttribute("src") === src) return;

      const replacement = makeImage(artist, src);
      if (current) {
        current.replaceWith(replacement);
      } else {
        block.insertBefore(replacement, block.firstChild);
      }
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
