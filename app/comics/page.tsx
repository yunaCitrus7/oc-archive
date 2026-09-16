"use client";
import {useState} from "react";
import {sitePath} from "../sitePath";
import {chapters} from "./data";

export default function ComicsPage(){
 const [newestFirst,setNewestFirst]=useState(true);
 const ordered = newestFirst ? [...chapters].reverse() : chapters;
 return <main className="notebook-page comics-page">
 <nav className="nav"><a className="brand" href={sitePath("/")}><span>CITRUSODA</span> OC ARCHIVE</a><div className="navlinks"><a href={sitePath("/#characters")}>角色介紹</a><a href={sitePath("/comics")}>漫畫合集</a><a href={sitePath("/gallery")}>繪畫合集</a></div></nav>
 <section className="comics-shell"><a className="back" href={sitePath("/")}>← BACK TO ARCHIVE</a><h1>Comics</h1><div className="comic-sort">SORTING: <button onClick={()=>setNewestFirst(value=>!value)} aria-label="Change chapter order">{newestFirst?"NEWEST FIRST":"OLDEST FIRST"}⌄</button></div>
  <div className="comic-chapter-list">{ordered.map(chapter=><a id={`chapter-${chapter.number}`} href={sitePath(`/comics/${chapter.slug}`)} className="comic-chapter-row" key={chapter.number}><div className="comic-chapter-preview"><img src={sitePath(chapter.pages[0])} alt={`Chapter ${chapter.number} preview`} loading="lazy" /></div><div className="comic-chapter-title"><b>#{String(chapter.number).padStart(2,"0")}</b><span>{chapter.title}</span></div><i aria-hidden="true">➜</i></a>)}</div>
 </section>
 </main>}
