(function mountBmcRadioMini() {
  const root = document.getElementById("bmcRadioMini");
  if (!root) return;

  const AUTOPLAY_ON_LOAD = true;
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

  if (!audio || !play || !next || !title || !progress || !time || !volume) return;

  audio.autoplay = true;
  audio.preload = "auto";
  audio.muted = false;
  audio.setAttribute("autoplay", "");
  audio.setAttribute("preload", "auto");

  let current = 0;
  let introArmed = true;
  let introActive = false;
  let autoplayAttempted = false;
  let autoplayUnlocked = false;

  function fmt(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  function syncButton() {
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

  function tryPlay({ fromAutoplay = false } = {}) {
    audio.muted = false;
    setVolumeFromControl();
    const promise = audio.play();

    if (promise && typeof promise.then === "function") {
      promise.then(() => {
        autoplayUnlocked = true;
        root.classList.remove("is-autoplay-blocked");
        syncButton();
      }).catch(() => {
        if (fromAutoplay) {
          root.classList.add("is-autoplay-blocked");
          play.textContent = "▶ Start Radio";
        }
        syncButton();
      });
    } else {
      autoplayUnlocked = true;
      syncButton();
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

  function attemptAutoplay() {
    if (!AUTOPLAY_ON_LOAD || autoplayAttempted || autoplayUnlocked) return;
    autoplayAttempted = true;
    startIntroThenGhost({ fromAutoplay: true });
  }

  function unlockOnFirstInteraction() {
    if (autoplayUnlocked || !audio.paused) return;
    root.classList.remove("is-autoplay-blocked");
    if (introArmed) {
      startIntroThenGhost();
    } else {
      tryPlay();
    }
  }

  play.addEventListener("click", () => {
    root.classList.remove("is-autoplay-blocked");
    if (audio.paused) {
      if (introArmed) {
        startIntroThenGhost();
      } else {
        tryPlay();
      }
    } else {
      audio.pause();
    }
  });

  next.addEventListener("click", () => {
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
    if (document.hidden) audio.pause();
  });

  ["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
    window.addEventListener(eventName, unlockOnFirstInteraction, { once: true, passive: true });
  });

  current = 0;
  introActive = false;
  introArmed = true;
  loadSource(STARTUP_CHIME);
  title.textContent = `${STARTUP_CHIME.title} → ${playlist[0].title}`;

  if (AUTOPLAY_ON_LOAD) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", attemptAutoplay, { once: true });
    } else {
      attemptAutoplay();
    }
    window.addEventListener("pageshow", () => window.setTimeout(attemptAutoplay, 250), { once: true });
    window.setTimeout(attemptAutoplay, 900);
  }
})();