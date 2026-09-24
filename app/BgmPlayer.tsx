"use client";

import {useEffect, useRef, useState} from "react";
import {sitePath} from "./sitePath";

const VIDEO_ID = "kJTdjOFI4vY";
const PLAYER_ORIGIN = "https://www.youtube-nocookie.com";

function sendCommand(frame: HTMLIFrameElement | null, func: string, args: unknown[] = []) {
  frame?.contentWindow?.postMessage(JSON.stringify({event: "command", func, args}), PLAYER_ORIGIN);
}

export default function BgmPlayer() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const popRef = useRef<HTMLAudioElement | null>(null);
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.45);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  useEffect(() => {
    const saved = Number(localStorage.getItem("bgm-volume"));
    if (Number.isFinite(saved) && saved >= 0 && saved <= 1) setVolume(saved);
    setMuted(localStorage.getItem("site-audio-muted") === "true");
  }, []);

  useEffect(() => {
    const playPop = (event: MouseEvent) => {
      if (mutedRef.current || document.querySelector("main.gallery-page, main.comics-page")) return;
      if (!(event.target instanceof Element) || !event.target.closest("button, a, [role='button'], input[type='button'], input[type='submit']")) return;
      const pop = popRef.current;
      if (!pop) return;
      pop.currentTime = 0;
      void pop.play().catch(() => {});
    };

    document.addEventListener("click", playPop, true);
    return () => {
      document.removeEventListener("click", playPop, true);
    };
  }, []);

  useEffect(() => {
    const savedPlaying = localStorage.getItem("bgm-playing") === "true";
    const savedTime = Number(localStorage.getItem("bgm-time"));
    const restore = () => {
      if (Number.isFinite(savedTime) && savedTime > 0) {
        sendCommand(frameRef.current, "seekTo", [savedTime, true]);
      }
      if (savedPlaying) {
        sendCommand(frameRef.current, "playVideo");
        setPlaying(true);
      }
    };
    window.addEventListener("message", restore, {once: true});
    return () => window.removeEventListener("message", restore);
  }, []);

  useEffect(() => {
    const saveTime = () => {
      sendCommand(frameRef.current, "getCurrentTime");
    };
    const receiveTime = (event: MessageEvent) => {
      if (event.origin !== PLAYER_ORIGIN) return;
      try {
        const data = JSON.parse(event.data);
        const time = data?.info?.currentTime;
        if (typeof time === "number" && Number.isFinite(time)) {
          localStorage.setItem("bgm-time", String(time));
        }
      } catch {}
    };
    const timer = window.setInterval(saveTime, 1000);
    window.addEventListener("message", receiveTime);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("message", receiveTime);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("bgm-volume", String(volume));
    sendCommand(frameRef.current, "setVolume", [Math.round(volume * 100)]);
  }, [volume]);

  useEffect(() => {
    localStorage.setItem("site-audio-muted", String(muted));
    popRef.current && (popRef.current.muted = muted);
    sendCommand(frameRef.current, muted ? "mute" : "unMute");
  }, [muted]);

  useEffect(() => {
    const playFromHomepage = () => {
      sendCommand(frameRef.current, "playVideo");
      setPlaying(true);
      localStorage.setItem("bgm-playing", "true");
    };
    window.addEventListener("bgm-play-request", playFromHomepage);
    return () => window.removeEventListener("bgm-play-request", playFromHomepage);
  }, []);

  const toggle = () => {
    sendCommand(frameRef.current, playing ? "pauseVideo" : "playVideo");
    setPlaying(!playing);
    localStorage.setItem("bgm-playing", String(!playing));
  };

  const toggleMute = () => setMuted((current) => !current);

  return (
    <div className="bgm-player" aria-label="Background music player">
      <audio ref={popRef} className="bgm-pop-audio" src={sitePath("/audio/bubble-pop.mp3")} preload="auto" />
      <iframe
        ref={frameRef}
        title="Background music"
        src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?enablejsapi=1&origin=${encodeURIComponent(origin)}&autoplay=1&loop=1&playlist=${VIDEO_ID}&controls=0&rel=0&playsinline=1`}
        allow="autoplay; encrypted-media"
        className="bgm-frame"
        onLoad={() => {
          const savedTime = Number(localStorage.getItem("bgm-time"));
          if (Number.isFinite(savedTime) && savedTime > 0) {
            sendCommand(frameRef.current, "seekTo", [savedTime, true]);
          }
          if (localStorage.getItem("bgm-playing") === "true") {
            sendCommand(frameRef.current, "playVideo");
            setPlaying(true);
          }
          sendCommand(frameRef.current, muted ? "mute" : "unMute");
        }}
      />
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
