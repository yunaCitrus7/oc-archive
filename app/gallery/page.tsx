"use client";
import {useEffect,useState} from "react";
import {sitePath} from "../sitePath";

const characters=["musubi","yuuhi","shuu","akane","sumire","kumori"];
const works=characters.map((character,index)=>({character,category:index%3===0?"Sketch":"Illustration",year:index<2?"2026":index<4?"2025":"2024"}));

export default function GalleryPage(){
 const [category,setCategory]=useState("All"),[year,setYear]=useState("All"),[character,setCharacter]=useState("All"),[filterOpen,setFilterOpen]=useState(false),[lightbox,setLightbox]=useState<number|null>(null);
 const shown=works.filter(x=>(category==="All"||x.category===category)&&(year==="All"||x.year===year)&&(character==="All"||x.character===character));
 const current=lightbox===null?null:shown[lightbox];
 const move=(step:number)=>setLightbox(i=>i===null?0:(i+step+shown.length)%shown.length);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(lightbox===null)return;if(e.key==="Escape")setLightbox(null);if(e.key==="ArrowLeft")move(-1);if(e.key==="ArrowRight")move(1)};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key)},[lightbox,shown.length]);
 return <main className="notebook-page gallery-page">
  <nav className="nav"><a className="brand" href={sitePath("/")}><span>CITRUSODA</span> OC ARCHIVE</a><div className="navlinks"><a href={sitePath("/#characters")}>角色介紹</a><a href={sitePath("/comics")}>漫畫合集</a><a href={sitePath("/gallery")}>繪畫合集</a></div></nav>
  <section className="gallery-shell"><a className="back" href={sitePath("/")}>← BACK TO ARCHIVE</a><h1>Gallery</h1>
   <button className="gallery-filter-toggle" type="button" aria-expanded={filterOpen} onClick={()=>setFilterOpen(!filterOpen)}><span>☰</span> FILTER</button>
   <div className="gallery-layout">
    <aside className={`gallery-filters${filterOpen?" open":""}`}><h2>Filter</h2>
     <div className="filter-group"><b>Category</b><div className="filter-options">{["All","Illustration","Sketch","Animation","Comic"].map(x=><button className={category===x?"active":""} onClick={()=>setCategory(x)} key={x}>{x}</button>)}</div></div>
     <div className="filter-group"><b>Year</b><div className="filter-options years">{["All","2026","2025","2024","2023"].map(x=><button className={year===x?"active":""} onClick={()=>setYear(x)} key={x}>{x}</button>)}</div></div>
     <div className="filter-group"><b>Character</b><div className="character-filter">{characters.map(x=><button className={character===x?"active":""} onClick={()=>setCharacter(character===x?"All":x)} key={x} aria-label={x}><img src={sitePath(`/icons/${x}.svg`)} alt=""/></button>)}</div></div>
    </aside>
    <section key={`${category}-${year}-${character}`} className="gallery-package"><div className="gallery-handle" aria-hidden="true"/><div className="gallery-art-grid">{shown.map((x,index)=><figure key={x.character}><button className="gallery-art-button" type="button" onClick={()=>setLightbox(index)}><img src={sitePath(`/characters/${x.character}.png`)} alt={`${x.character} artwork`}/></button><figcaption><b>{x.character.toUpperCase()}</b><span>{x.category} · {x.year}</span></figcaption></figure>)}{shown.length===0&&<p className="gallery-empty">No artwork matches these filters yet.</p>}</div></section>
   </div>
  </section>
  {current&&<div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`${current.character} artwork`} onClick={()=>setLightbox(null)}><button className="lightbox-close" onClick={()=>setLightbox(null)} aria-label="Close">×</button><button className="lightbox-arrow prev" onClick={e=>{e.stopPropagation();move(-1)}} aria-label="Previous image">‹</button><div className="lightbox-image" onClick={e=>e.stopPropagation()}><img src={sitePath(`/characters/${current.character}.png`)} alt={`${current.character} artwork`}/><p>{current.character.toUpperCase()} · {current.category} · {current.year}</p></div><button className="lightbox-arrow next" onClick={e=>{e.stopPropagation();move(1)}} aria-label="Next image">›</button></div>}
 </main>
}
