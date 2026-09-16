"use client";

import {useParams} from "next/navigation";
import {sitePath} from "../../sitePath";
import {chapters} from "../data";

export default function ComicReaderPage() {
  const {chapter} = useParams<{chapter: string}>();
  const selected = chapters.find(item => item.slug === chapter) ?? chapters[0];
  const current = selected.number;
  const chapterCount = chapters.length;
  const previous = current > 1 ? current - 1 : null;
  const next = current < chapterCount ? current + 1 : null;

  return <main className="notebook-page comics-page">
    <nav className="nav">
      <a className="brand" href={sitePath("/")}><span>CITRUSODA</span> OC ARCHIVE</a>
      <div className="navlinks"><a href={sitePath("/#characters")}>角色介紹</a><a href={sitePath("/comics")}>漫畫合集</a><a href={sitePath("/gallery")}>繪畫合集</a></div>
    </nav>
    <section className="comic-reader-shell">
      <a className="back" href={sitePath("/comics")}>← ALL CHAPTERS</a>
      <header className="comic-reader-head">
        <h1>#{String(current).padStart(2, "0")} {selected.title}</h1>
        <p>CHAPTER {current} / {chapterCount}</p>
      </header>
      <div className="comic-reader-pages">
        {selected.pages.map((page, index) => <div className="comic-reader-page" key={page}>
          <img src={sitePath(page)} alt={`Chapter ${current}, page ${index + 1}`} loading={index === 0 ? "eager" : "lazy"} />
        </div>)}
      </div>
      <nav className="reader-chapter-nav" aria-label="Chapter navigation">
        <a className={previous ? "" : "disabled"} href={previous ? sitePath(`/comics/chapter-${previous}`) : "#"} aria-disabled={!previous}>
          <span>←</span> PREVIOUS CHAPTER
        </a>
        <b>{current} / {chapterCount}</b>
        <a className={next ? "" : "disabled"} href={next ? sitePath(`/comics/chapter-${next}`) : "#"} aria-disabled={!next}>
          NEXT CHAPTER <span>→</span>
        </a>
      </nav>
    </section>
  </main>;
}
