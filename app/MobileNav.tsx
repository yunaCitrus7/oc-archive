"use client";
import {useState} from "react";

export default function MobileNav(){
 const [open,setOpen]=useState(false);
 return <div className={`mobile-site-menu${open?" open":""}`}>
  <button type="button" aria-label="Open navigation menu" aria-expanded={open} onClick={()=>setOpen(!open)}><span/><span/><span/></button>
  <nav aria-label="Mobile navigation"><a href="/#characters">CHARACTERS</a><a href="/comics">COMICS</a><a href="/gallery">GALLERY</a><a href="/relationships">RELATIONSHIPS</a></nav>
 </div>
}
