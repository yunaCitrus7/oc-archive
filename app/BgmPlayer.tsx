"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import {sitePath} from "./sitePath";

export default function BgmPlayer() {
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const popRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.45);
  const [muted, setMuted] = useState(false);

  const play = useCallback(() => {
    const audio = bgmRef.current;
    if (!audio) return;
    void audio.play().then(() => {
      setPlaying(true);
      localStorage.setItem("bgm-playing", "true");
    }).catch(() => {
      setPlaying(false);
      localStorage.setItem("bgm-playing", "false");
    });
  }, []);

  useEffect(() => {
    const savedVolume = Number(localStorage.getItem("bgm-volume"));
    if (Number.isFinite(savedVolume) && savedVolume >= 0 && savedVolume <= 1) setVolume(savedVolume);
    setMuted(localStorage.getItem("site-audio-muted") === "true");

    const audio = bgmRef.current;
    const restoreTime = () => {
      const savedTime = Number(localStorage.getItem("bgm-time"));
      if (audio && Number.isFinite(savedTime) && savedTime > 0 && savedTime < (audio.duration || Infinity)) {
        audio.currentTime = savedTime;
      }
      if (localStorage.getItem("bgm-playing") === "true") play();
    };
    audio?.addEventListener("loadedmetadata", restoreTime);
    return () => audio?.removeEventListener("loadedmetadata", restoreTime);
  }, [play]);

  useEffect(() => {
    if (bgmRef.current) bgmRef.current.volume = volume;
    localStorage.setItem("bgm-volume", String(volume));
  }, [volume]);

  useEffect(() => {
    if (bgmRef.current) bgmRef.current.muted = muted;
    if (popRef.current) popRef.current.muted = muted;
    localStorage.setItem("site-audio-muted", String(muted));
  }, [muted]);

  useEffect(() => {
    const playPop = (event: MouseEvent) => {
      if (muted || document.querySelector("main.gallery-page, main.comics-page")) return;
      if (!(event.target instanceof Element) || !event.target.closest("button, a, [role='button'], input[type='button'], input[type='submit']")) return;
      const pop = popRef.current;
      if (!pop) return;
      pop.currentTime = 0;
      void pop.play().catch(() => {});
    };

    // Bubble phase lets a clicked audio control start its main track in the
    // original touch gesture before the secondary pop effect is requested.
    document.addEventListener("click", playPop);
    return () => document.removeEventListener("click", playPop);
  }, [muted]);

  useEffect(() => {
    const playFromHomepage = () => play();
    window.addEventListener("bgm-play-request", playFromHomepage);
    return () => window.removeEventListener("bgm-play-request", playFromHomepage);
  }, [play]);

  const toggle = () => {
    const audio = bgmRef.current;
    if (!audio) return;
    if (audio.paused) play();
    else {
      audio.pause();
      setPlaying(false);
      localStorage.setItem("bgm-playing", "false");
    }
  };

  const toggleMute = () => setMuted((current) => !current);

  return (
    <div className="bgm-player" aria-label="Background music player">
      <audio
        ref={bgmRef}
        className="bgm-track"
        src={sitePath("/audio/background-music.mp3")}
        loop
        preload="auto"
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => localStorage.setItem("bgm-time", String(event.currentTarget.currentTime))}
      />
      <audio ref={popRef} className="bgm-pop-audio" src={sitePath("/audio/bubble-pop.mp3")} preload="auto" />
      <button type="button" className="bgm-toggle" onClick={toggle} aria-label={playing ? "Pause background music" : "Play background music"} title={playing ? "Pause BGM" : "Play BGM"}>
        <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>
        <b>BGM</b>
      </button>
      <label className="bgm-volume">
        <span aria-hidden="true">VOL</span>
        <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => setVolume(Number(event.target.value))} aria-label="BGM volume" />
      </label>
      <button type="button" className="bgm-mute" onClick={toggleMute} aria-label={muted ? "Unmute music and sound effects" : "Mute music and sound effects"} title={muted ? "Unmute all audio" : "Mute all audio"}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="M16 9a5 5 0 0 1 0 6"/>{muted && <path d="m17 4 4 4m0-4-4 4"/>}</svg>
      </button>
    </div>
  );
}
