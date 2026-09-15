"use client";

import {useParams} from "next/navigation";

const chapterCount = 3;

export default function ComicReaderPage() {
  const {chapter} = useParams<{chapter: string}>();
  const parsed = Number(chapter?.replace("chapter-", ""));
  const current = Number.isInteger(parsed) && parsed >= 1 && parsed <= chapterCount ? parsed : 1;
  const previous = current > 1 ? current - 1 : null;
  const next = current < chapterCount ? current + 1 : null;

  return <main className="notebook-page comics-page">
    <nav className="nav">
      <a className="brand" href="/"><span>CITRUSODA</span> OC ARCHIVE</a>
      <div className="navlinks"><a href="/#characters">CHARACTERS</a><a href="/comics">COMICS</a><a href="/gallery">GALLERY</a></div>
    </nav>
    <section className="comic-reader-shell">
      <a className="back" href="/comics">← ALL CHAPTERS</a>
      <header className="comic-reader-head">
        <h1>#{String(current).padStart(2, "0")} Chapter Name</h1>
        <p>CHAPTER {current} / {chapterCount}</p>
      </header>
      <div className="comic-reader-pages">
        {[1, 2, 3].map(page => <div className="comic-reader-page" key={page}>
          <span>CHAPTER {current} · PAGE {page} IMAGE</span>
        </div>)}
      </div>
      <nav className="reader-chapter-nav" aria-label="Chapter navigation">
        <a className={previous ? "" : "disabled"} href={previous ? `/comics/chapter-${previous}` : "#"} aria-disabled={!previous}>
          <span>←</span> PREVIOUS CHAPTER
        </a>
        <b>{current} / {chapterCount}</b>
        <a className={next ? "" : "disabled"} href={next ? `/comics/chapter-${next}` : "#"} aria-disabled={!next}>
          NEXT CHAPTER <span>→</span>
        </a>
      </nav>
    </section>
  </main>;
}
