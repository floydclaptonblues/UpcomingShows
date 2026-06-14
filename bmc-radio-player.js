(function mountBmcRadioMini() {
  const root = document.getElementById("bmcRadioMini");
  if (!root) return;

  const playlist = [
    {
      title: "Parade On Esplanade",
      src: "https://img1.wsimg.com/blobby/go/fcde905d-e711-4bbd-8961-6b9df0cf58b2/downloads/a862837f-91fa-448b-bb7a-8e02d7e68ac7/ONE%20MO_%20_GIN.mp3?ver=1775241263886"
    },
    {
      title: "Ghost Parade on Canal",
      src: "https://img1.wsimg.com/blobby/go/fcde905d-e711-4bbd-8961-6b9df0cf58b2/downloads/f079c265-e581-4b05-a37d-65b396267fb1/Ghost%20Parade%20on%20Canal.mp3?ver=1774633564261"
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

  function setTrack(index, shouldPlay) {
    current = ((index % playlist.length) + playlist.length) % playlist.length;
    const track = playlist[current];
    audio.pause();
    audio.src = track.src;
    title.textContent = track.title;
    audio.load();
    audio.volume = Number.parseFloat(volume.value || "0.18");
    syncButton();
    syncTime();

    if (shouldPlay) {
      const promise = audio.play();
      if (promise && typeof promise.then === "function") {
        promise.then(syncButton).catch(syncButton);
      } else {
        syncButton();
      }
    }
  }

  play.addEventListener("click", () => {
    if (audio.paused) {
      const promise = audio.play();
      if (promise && typeof promise.then === "function") {
        promise.then(syncButton).catch(syncButton);
      } else {
        syncButton();
      }
    } else {
      audio.pause();
    }
  });

  next.addEventListener("click", () => setTrack(current + 1, true));
  volume.addEventListener("input", () => {
    audio.volume = Number.parseFloat(volume.value || "0.18");
  });

  audio.addEventListener("timeupdate", syncTime);
  audio.addEventListener("loadedmetadata", syncTime);
  audio.addEventListener("play", syncButton);
  audio.addEventListener("pause", syncButton);
  audio.addEventListener("ended", () => setTrack(current + 1, true));

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) audio.pause();
  });

  setTrack(0, false);
})();
