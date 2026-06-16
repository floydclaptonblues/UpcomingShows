(function mountBmcRadioMini() {
  const root = document.getElementById("bmcRadioMini");
  if (!root) return;

  const AUTOPLAY_ON_LOAD = true;
  const AUTOPLAY_RETRY_DELAYS = [0, 250, 900, 1800, 3200];
  const STARTUP_CHIME = {
    title: "Windows 95 Startup",
    src: "https://img1.wsimg.com/blobby/go/fcde905d-e711-4bbd-8961-6b9df0cf58b2/downloads/db8c01b6-b94b-40e4-9cea-b854edc28c27/Windows_95.mp3?ver=1781495024914"
  };

  const playlist = [
    {
      title: "Ghost Parade On Canal",
      src: "https://img1.wsimg.com/blobby/go/fcde905d-e711-4bbd-8961-6b9df0cf58b2/downloads/f079c265-e581-4b05-a37d-65b396267fb1/Ghost%20Parade%20on%20Canal.mp3?ver=1774633564261"
    },
    {
      title: "Parade On Esplanade",
      src: "https://img1.wsimg.com/blobby/go/fcde905d-e711-4bbd-8961-6b9df0cf58b2/downloads/a862837f-91fa-448b-bb7a-8e02d7e68ac7/ONE%20MO_%20_GIN.mp3?ver=1775241263886"
    }
  ];

  const audio = document.getElementById("bmcRadioAudio");
  const play = document.getElementById("bmcRadioPlay");
  const next = document.getElementById("bmcRadioNext");
  const title = document.getElementById("bmcRadioTitle");
  const progress = document.getElementById("bmcRadioProgress");
  const time = document.getElementById("bmcRadioTime");
  const volume = document.getElementById("bmcRadioVolume");
  const waypoint = document.querySelector(".bmc-music-waypoint");

  if (!audio || !play || !next || !title || !progress || !time || !volume) return;

  audio.autoplay = true;
  audio.preload = "auto";
  audio.muted = false;
  audio.playsInline = true;
  audio.setAttribute("autoplay", "");
  audio.setAttribute("preload", "auto");
  audio.setAttribute("playsinline", "");

  let current = 0;
  let introArmed = true;
  let introActive = false;
  let autoplayUnlocked = false;

  function fmt(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  function syncButton() {
    if (audio.paused && root.classList.contains("is-autoplay-blocked")) {
      play.textContent = "▶ Start Radio";
      return;
    }
    play.textContent = audio.paused ? "▶ Play" : "❚❚ Pause";
  }

  function syncTime() {
    const cur = audio.currentTime || 0;
    const dur = audio.duration || 0;
    const pct = dur ? Math.min(100, Math.max(0, (cur / dur) * 100)) : 0;
    progress.style.width = `${pct}%`;
    time.textContent = `${fmt(cur)} / ${fmt(dur)}`;
  }

  function activeTrack() {
    return introActive ? STARTUP_CHIME : playlist[current];
  }

  function updateTitle() {
    const track = activeTrack();
    title.textContent = introActive ? `${track.title} → ${playlist[0].title}` : track.title;
  }

  function setVolumeFromControl() {
    audio.volume = Number.parseFloat(volume.value || "0.18");
  }

  function markAutoplayBlocked() {
    root.classList.add("is-autoplay-blocked");
    syncButton();
  }

  function markAutoplayUnlocked() {
    autoplayUnlocked = true;
    root.classList.remove("is-autoplay-blocked");
    syncButton();
  }

  function tryPlay({ fromAutoplay = false } = {}) {
    audio.muted = false;
    setVolumeFromControl();
    const promise = audio.play();

    if (promise && typeof promise.then === "function") {
      promise.then(markAutoplayUnlocked).catch(() => {
        if (fromAutoplay) markAutoplayBlocked();
        syncButton();
      });
    } else {
      markAutoplayUnlocked();
    }
  }

  function loadSource(track) {
    audio.pause();
    audio.src = track.src;
    audio.load();
    setVolumeFromControl();
    updateTitle();
    syncButton();
    syncTime();
  }

  function setTrack(index, shouldPlay) {
    introActive = false;
    introArmed = false;
    current = ((index % playlist.length) + playlist.length) % playlist.length;
    loadSource(playlist[current]);

    if (shouldPlay) {
      tryPlay();
    }
  }

  function startIntroThenGhost({ fromAutoplay = false } = {}) {
    current = 0;
    introActive = true;
    introArmed = false;
    loadSource(STARTUP_CHIME);
    tryPlay({ fromAutoplay });
  }

  function startRadioFromGesture() {
    root.classList.remove("is-autoplay-blocked");

    if (introArmed || !audio.currentSrc) {
      startIntroThenGhost();
      return;
    }

    if (audio.paused) {
      tryPlay();
    }
  }

  function attemptAutoplay() {
    if (!AUTOPLAY_ON_LOAD || autoplayUnlocked || !audio.paused) return;

    if (introArmed || !audio.currentSrc) {
      startIntroThenGhost({ fromAutoplay: true });
      return;
    }

    tryPlay({ fromAutoplay: true });
  }

  play.addEventListener("click", (event) => {
    event.preventDefault();
    if (audio.paused) {
      startRadioFromGesture();
    } else {
      audio.pause();
      syncButton();
    }
  });

  if (waypoint) {
    waypoint.setAttribute("href", "#bmcRadioMini");
    waypoint.addEventListener("click", (event) => {
      event.preventDefault();
      root.scrollIntoView({ behavior: "smooth", block: "center" });
      startRadioFromGesture();
    });
  }

  next.addEventListener("click", (event) => {
    event.preventDefault();
    root.classList.remove("is-autoplay-blocked");
    setTrack(introActive ? 0 : current + 1, true);
  });

  volume.addEventListener("input", () => {
    setVolumeFromControl();
  });

  audio.addEventListener("timeupdate", syncTime);
  audio.addEventListener("loadedmetadata", syncTime);
  audio.addEventListener("play", syncButton);
  audio.addEventListener("pause", syncButton);
  audio.addEventListener("ended", () => {
    if (introActive) {
      setTrack(0, true);
    } else {
      setTrack(current + 1, true);
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && !audio.paused) audio.pause();
  });

  current = 0;
  introActive = false;
  introArmed = true;
  loadSource(STARTUP_CHIME);
  title.textContent = `${STARTUP_CHIME.title} → ${playlist[0].title}`;

  if (AUTOPLAY_ON_LOAD) {
    const scheduleAutoplayRetries = () => {
      AUTOPLAY_RETRY_DELAYS.forEach((delay) => {
        window.setTimeout(attemptAutoplay, delay);
      });
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", scheduleAutoplayRetries, { once: true });
    } else {
      scheduleAutoplayRetries();
    }

    window.addEventListener("load", attemptAutoplay, { once: true });
    window.addEventListener("pageshow", () => window.setTimeout(attemptAutoplay, 250));
    window.addEventListener("focus", attemptAutoplay);
  }
})();