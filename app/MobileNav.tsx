"use client";
import {useEffect,useState} from "react";
import {sitePath} from "./sitePath";
import Link from "next/link";

export default function MobileNav(){
 const [open,setOpen]=useState(false);
 const [language,setLanguage]=useState("zh");
 useEffect(()=>{const sync=()=>setLanguage(localStorage.getItem("site-language")==="en"?"en":"zh");sync();window.addEventListener("site-language-change",sync);return()=>window.removeEventListener("site-language-change",sync)},[]);
 return <div className={`mobile-site-menu${open?" open":""}`}>
  <button type="button" aria-label="Open navigation menu" aria-expanded={open} onClick={()=>setOpen(!open)}><span/><span/><span/></button>
  <nav aria-label="Mobile navigation"><Link href={sitePath("/#characters")}>{language==="en"?"CHARACTERS":"角色介紹"}</Link><Link href={sitePath("/comics")}>{language==="en"?"COMICS":"漫畫合集"}</Link><Link href={sitePath("/gallery")}>{language==="en"?"GALLERY":"繪畫合集"}</Link><Link href={sitePath("/relationships")}>{language==="en"?"RELATIONSHIPS":"人物關係"}</Link></nav>
 </div>
}
