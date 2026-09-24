"use client";
import {useEffect,useState} from "react";
import {sitePath} from "../sitePath";
import Link from "next/link";
import {galleryFiles} from "./data";

const characters=["musubi","yuuhi","shuu","akane","sumire","kumori"];
const characterTags: Record<string,string> = {m:"musubi",y:"yuuhi",s:"shuu",su:"sumire",k:"kumori"};
const getCharacters=(path:string)=>{
 const filename=path.split("/").pop()!.toLowerCase();
 const tokens=filename.split(/[^a-z]+/);
 if(tokens.includes("all")) return characters;
 const tagged=Object.entries(characterTags).filter(([tag,name])=>tokens.includes(tag)||tokens.includes(name)).map(([,name])=>name);
 if(filename.startsWith("20240906-a.")) tagged.push("akane");
 return tagged;
};
const works=galleryFiles.map((path,index)=>{
 const parts=path.split("/");
 const file=parts[parts.length-1];
 const category=parts[parts.length-2];
 const year=parts[parts.length-3];
 return {path,file,category,year,characters:getCharacters(path),kind:/\.mp4$/i.test(file)?"video":"image",id:index};
});

export default function GalleryPage(){
 const [category,setCategory]=useState("All"),[year,setYear]=useState("All"),[character,setCharacter]=useState("All"),[sortOrder,setSortOrder]=useState<"newest"|"oldest">("newest"),[filterOpen,setFilterOpen]=useState(false),[lightbox,setLightbox]=useState<number|null>(null),[lang,setLang]=useState<"zh"|"en">("zh");
 const en=lang==="en";
 const shown=works.filter(x=>(category==="All"||x.category===category)&&(year==="All"||x.year===year)&&(character==="All"||x.characters.includes(character))).sort((a,b)=>{const dateA=Number(a.file.match(/20\d{6}/)?.[0]??0),dateB=Number(b.file.match(/20\d{6}/)?.[0]??0);return sortOrder==="newest"?dateB-dateA:dateA-dateB});
 const current=lightbox===null?null:shown[lightbox];
 const move=(step:number)=>setLightbox(i=>i===null?0:(i+step+shown.length)%shown.length);
 useEffect(()=>{const sync=()=>setLang(localStorage.getItem("site-language")==="en"?"en":"zh");sync();window.addEventListener("site-language-change",sync);return()=>window.removeEventListener("site-language-change",sync)},[]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(lightbox===null)return;if(e.key==="Escape")setLightbox(null);if(e.key==="ArrowLeft")move(-1);if(e.key==="ArrowRight")move(1)};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key)},[lightbox,shown.length]);
 return <main className="notebook-page gallery-page">
  <nav className="nav"><Link className="brand" href={sitePath("/")}><span>CITRUSODA</span> OC ARCHIVE</Link><div className="navlinks"><Link href={sitePath("/#characters")}>{en?"CHARACTERS":"角色介紹"}</Link><Link href={sitePath("/comics")}>{en?"COMICS":"漫畫合集"}</Link><Link href={sitePath("/gallery")}>{en?"GALLERY":"繪畫合集"}</Link></div><button className="lang" onClick={()=>{const next=en?"zh":"en";setLang(next);localStorage.setItem("site-language",next);window.dispatchEvent(new Event("site-language-change"))}} aria-label="Switch language"><span className={!en?"on":""}>中</span><span className={en?"on":""}>EN</span></button></nav>
  <section className="gallery-shell"><Link className="back" href={sitePath("/")}>← BACK TO ARCHIVE</Link><h1>{en?"Gallery":"繪畫合集"}</h1>
   <button className="gallery-filter-toggle" type="button" aria-expanded={filterOpen} onClick={()=>setFilterOpen(!filterOpen)}><span>☰</span> {en?"FILTER":"篩選"}</button>
   <div className="gallery-layout">
    <aside className={`gallery-filters${filterOpen?" open":""}`}><h2>{en?"Filter":"篩選"}</h2>
     <div className="filter-group"><b>{en?"Category":"作品類型"}</b><div className="filter-options">{[["All",en?"All":"全部"],["Illustration",en?"Illustration":"插圖"],["Sketch",en?"Sketch":"塗鴉"],["Animation",en?"Animation":"動畫"],["Comic",en?"Comic":"漫畫"]].map(([value,label])=><button className={category===value?"active":""} onClick={()=>setCategory(value)} key={value}>{label}</button>)}</div></div>
     <div className="filter-group"><b>{en?"Year":"年份"}</b><div className="filter-options years">{["All","2026","2025","2024","2023"].map(x=><button className={year===x?"active":""} onClick={()=>setYear(x)} key={x}>{x==="All"&&!en?"全部":x}</button>)}</div></div>
     <div className="filter-group"><b>{en?"Sort":"排序"}</b><div className="filter-options"><button className={sortOrder==="newest"?"active":""} onClick={()=>setSortOrder("newest")}>{en?"Latest first":"由新至舊"}</button><button className={sortOrder==="oldest"?"active":""} onClick={()=>setSortOrder("oldest")}>{en?"Oldest first":"由舊至新"}</button></div></div>
     <div className="filter-group"><b>{en?"Character":"角色"}</b><div className="character-filter">{characters.map(x=><button className={character===x?"active":""} onClick={()=>setCharacter(character===x?"All":x)} key={x} aria-label={x}><img src={sitePath(`/icons/${x}.svg`)} alt=""/></button>)}</div></div>
    </aside>
    <section key={`${category}-${year}-${character}-${sortOrder}`} className="gallery-package"><div className="gallery-handle" aria-hidden="true"/><div className="gallery-art-grid">{shown.map((x,index)=><figure key={x.path}><button className="gallery-art-button" type="button" onClick={()=>setLightbox(index)}>{x.kind==="video"?<video src={sitePath(x.path)} muted playsInline preload="metadata"/>:<img src={sitePath(x.path)} alt={x.file} loading="lazy"/>}</button><figcaption><b>{x.characters.length?x.characters.map(name=>name.toUpperCase()).join(" · "):"ARTWORK"}</b><span>{x.category} · {x.year}</span></figcaption></figure>)}{shown.length===0&&<p className="gallery-empty">No artwork matches these filters yet.</p>}</div></section>
   </div>
  </section>
  {current&&<div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`${current.file} artwork`} onClick={()=>setLightbox(null)}><button className="lightbox-close" onClick={()=>setLightbox(null)} aria-label="Close">×</button><button className="lightbox-arrow prev" onClick={e=>{e.stopPropagation();move(-1)}} aria-label="Previous image">‹</button><div className="lightbox-image" onClick={e=>e.stopPropagation()}>{current.kind==="video"?<video src={sitePath(current.path)} controls autoPlay loop/>:<img src={sitePath(current.path)} alt={current.file}/>}<p>{current.characters.length?current.characters.map(name=>name.toUpperCase()).join(" · "):"ARTWORK"} · {current.category} · {current.year}</p></div><button className="lightbox-arrow next" onClick={e=>{e.stopPropagation();move(1)}} aria-label="Next image">›</button></div>}
 </main>
}
