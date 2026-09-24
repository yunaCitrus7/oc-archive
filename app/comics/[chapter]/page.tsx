"use client";
import {useSiteLanguage} from "../../useSiteLanguage";

import {useParams} from "next/navigation";
import {sitePath} from "../../sitePath";
import {chapters} from "../data";
import Link from "next/link";

export default function ComicReaderPage() {
 const {lang,en,setLang}=useSiteLanguage();
  const {chapter} = useParams<{chapter: string}>();
  const selected = chapters.find(item => item.slug === chapter) ?? chapters[0];
  const current = selected.number;
  const chapterCount = chapters.length;
  const previous = current > 1 ? current - 1 : null;
  const next = current < chapterCount ? current + 1 : null;

  return <main className="notebook-page comics-page">
    <nav className="nav">
      <Link className="brand" href={sitePath("/")}><span>CITRUSODA</span> OC ARCHIVE</Link>
      <div className="navlinks"><Link href={sitePath("/#characters")}>{en?"CHARACTERS":"角色介紹"}</Link><Link href={sitePath("/comics")}>{en?"COMICS":"漫畫合集"}</Link><Link href={sitePath("/gallery")}>{en?"GALLERY":"繪畫合集"}</Link></div>
    </nav>
    <section className="comic-reader-shell">
      <Link className="back" href={sitePath("/comics")}>← ALL CHAPTERS</Link>
      <header className="comic-reader-head">
        <h1>#{String(current).padStart(2, "0")} {en?selected.enTitle:selected.title}</h1>
        <p>CHAPTER {current} / {chapterCount}</p>{en&&<p className="comic-language-note">Comic pages are currently available in Chinese only.</p>}
      </header>
      <div className="comic-reader-pages">
        {selected.pages.map((page, index) => <div className="comic-reader-page" key={page}>
          <img src={sitePath(page)} alt={`Chapter ${current}, page ${index + 1}`} loading={index === 0 ? "eager" : "lazy"} />
        </div>)}
      </div>
      <nav className="reader-chapter-nav" aria-label="Chapter navigation">
        <Link className={previous ? "" : "disabled"} href={previous ? sitePath(`/comics/chapter-${previous}?lang=${lang}`) : "#"} aria-disabled={!previous} onClick={event => {if (!previous) event.preventDefault();}}>
          <span>←</span> PREVIOUS CHAPTER
        </Link>
        <b>{current} / {chapterCount}</b>
        <Link className={next ? "" : "disabled"} href={next ? sitePath(`/comics/chapter-${next}?lang=${lang}`) : "#"} aria-disabled={!next} onClick={event => {if (!next) event.preventDefault();}}>
          NEXT CHAPTER <span>→</span>
        </Link>
      </nav>
    </section>
  </main>;
}
