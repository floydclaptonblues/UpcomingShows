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

  let current = 0;
  let introArmed = true;
  let introActive = false;

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

  function tryPlay() {
    audio.volume = Number.parseFloat(volume.value || "0.18");
    const promise = audio.play();
    if (promise && typeof promise.then === "function") {
      promise.then(() => {
        root.classList.remove("is-autoplay-blocked");
        syncButton();
      }).catch(() => {
        root.classList.add("is-autoplay-blocked");
        syncButton();
      });
    } else {
      syncButton();
    }
  }

  function loadSource(track) {
    audio.pause();
    audio.src = track.src;
    audio.load();
    audio.volume = Number.parseFloat(volume.value || "0.18");
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

  function startIntroThenGhost() {
    current = 0;
    introActive = true;
    introArmed = false;
    loadSource(STARTUP_CHIME);
    tryPlay();
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
    audio.volume = Number.parseFloat(volume.value || "0.18");
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

  current = 0;
  introActive = false;
  introArmed = true;
  loadSource(playlist[0]);
  title.textContent = `${STARTUP_CHIME.title} → ${playlist[0].title}`;

  if (AUTOPLAY_ON_LOAD) {
    window.setTimeout(() => startIntroThenGhost(), 650);
  }
})();
