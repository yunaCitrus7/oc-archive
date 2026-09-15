"use client";
import {useState} from "react";
import {sitePath} from "./sitePath";

export default function MobileNav(){
 const [open,setOpen]=useState(false);
 return <div className={`mobile-site-menu${open?" open":""}`}>
  <button type="button" aria-label="Open navigation menu" aria-expanded={open} onClick={()=>setOpen(!open)}><span/><span/><span/></button>
  <nav aria-label="Mobile navigation"><a href={sitePath("/#characters")}>CHARACTERS</a><a href={sitePath("/comics")}>COMICS</a><a href={sitePath("/gallery")}>GALLERY</a><a href={sitePath("/relationships")}>RELATIONSHIPS</a></nav>
 </div>
}
