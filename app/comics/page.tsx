"use client";
import {useSiteLanguage} from "../useSiteLanguage";
import {useState} from "react";
import {sitePath} from "../sitePath";
import {chapters} from "./data";
import Link from "next/link";

export default function ComicsPage(){
 const {lang,en,setLang}=useSiteLanguage();
 const [newestFirst,setNewestFirst]=useState(true);
 const ordered = newestFirst ? [...chapters].reverse() : chapters;
 return <main className="notebook-page comics-page">
 <nav className="nav"><Link className="brand" href={sitePath("/")}><span>CITRUSODA</span> OC ARCHIVE</Link><div className="navlinks"><Link href={sitePath("/#characters")}>{en?"CHARACTERS":"角色介紹"}</Link><Link href={sitePath("/comics")}>{en?"COMICS":"漫畫合集"}</Link><Link href={sitePath("/gallery")}>{en?"GALLERY":"繪畫合集"}</Link></div><button className="lang" aria-label="Switch language" onClick={()=>setLang(en?"zh":"en")}><span className={!en?"on":""}>中</span><span className={en?"on":""}>EN</span></button></nav>
 <section className="comics-shell"><Link className="back" href={sitePath("/")}>← BACK TO ARCHIVE</Link><h1>{en?"Comics":"漫畫合集"}</h1>{en&&<p className="comic-language-note">Comic pages are currently available in Chinese only.</p>}<div className="comic-sort">SORTING: <button onClick={()=>setNewestFirst(value=>!value)} aria-label="Change chapter order">{newestFirst?"NEWEST FIRST":"OLDEST FIRST"}⌄</button></div>
  <div className="comic-chapter-list">{ordered.map(chapter=><Link id={`chapter-${chapter.number}`} href={sitePath(`/comics/${chapter.slug}?lang=${lang}`)} className="comic-chapter-row" key={chapter.number}><div className="comic-chapter-preview"><img src={sitePath(chapter.pages[0])} alt={`Chapter ${chapter.number} preview`} loading="lazy" /></div><div className="comic-chapter-title"><b>#{String(chapter.number).padStart(2,"0")}</b><span>{en?chapter.enTitle:chapter.title}</span></div><i aria-hidden="true">➜</i></Link>)}</div>
 </section>
 </main>}
