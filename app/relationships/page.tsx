"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

const characters = [
  { id: "yuuhi", name: "纁", roman: "YUUHI", x: 50, y: 18, color: "#ff672f" },
  { id: "musubi", name: "結", roman: "MUSUBI", x: 24, y: 38, color: "#ff4f98" },
  { id: "shuu", name: "終", roman: "SHUU", x: 78, y: 38, color: "#ff78b5" },
  { id: "sumire", name: "堇", roman: "SUMIRE", x: 24, y: 67, color: "#7652f3" },
  { id: "akane", name: "茜", roman: "AKANE", x: 78, y: 67, color: "#e93935" },
  { id: "kumori", name: "曇", roman: "KUMORI", x: 55, y: 82, color: "#ffe8f1" },
] as const;

const links: { a: string; b: string; zh: string; en: string; feeling?: boolean; directed?: boolean; curve?: number }[] = [
  { a: "yuuhi", b: "musubi", zh: "同居", en: "Housemates" },
  { a: "yuuhi", b: "shuu", zh: "打工隊友", en: "Work teammates" },
  { a: "yuuhi", b: "kumori", zh: "青梅竹馬", en: "Childhood friends" },
  { a: "musubi", b: "shuu", zh: "兄妹", en: "Siblings" },
  { a: "musubi", b: "sumire", zh: "前戀人", en: "Former lovers" },
  { a: "shuu", b: "sumire", zh: "前同事", en: "Former colleagues" },
  { a: "shuu", b: "akane", zh: "真格隊友", en: "Ranked teammates" },
  { a: "kumori", b: "akane", zh: "朋友", en: "Friends" },
  { a: "musubi", b: "yuuhi", zh: "♥", en: "♥", feeling: true, directed: true, curve: -17 },
  { a: "shuu", b: "yuuhi", zh: "♥", en: "♥", feeling: true, directed: true, curve: 17 },
  { a: "musubi", b: "shuu", zh: "信任", en: "Trust", feeling: true, curve: 7 },
  { a: "musubi", b: "sumire", zh: "警戒", en: "Wary", feeling: true, directed: true, curve: 19 },
  { a: "sumire", b: "musubi", zh: "♥", en: "♥", feeling: true, directed: true, curve: -11 },
  { a: "sumire", b: "yuuhi", zh: "不喜歡", en: "Dislikes", feeling: true, directed: true, curve: 0 },
  { a: "sumire", b: "shuu", zh: "奇怪的距離感", en: "An odd distance", feeling: true, curve: 0 },
  { a: "akane", b: "shuu", zh: "信任", en: "Trust", feeling: true, curve: 18 },
  { a: "kumori", b: "akane", zh: "信任", en: "Trust", feeling: true, curve: 13 },
].filter((link) => !link.feeling);

export default function RelationshipsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const board = useRef<HTMLDivElement>(null);
  const positions = useRef(characters.map(c => ({ x: Number(c.x), y: Number(c.y), vx: 0, vy: 0 })));
  const drag = useRef<{ index: number; x: number; y: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [paused, setPaused] = useState(false);
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const en = lang === "en";
  const person = characters.find((item) => item.id === selected)!;
  const related = links.filter((link) => link.a === selected || link.b === selected);

  useEffect(() => {
    const root = board.current;
    if (!root) return;
    const nodes = root.querySelectorAll<HTMLElement>(".network-node");
    const edges = root.querySelectorAll<SVGPathElement>(".relationship-edge");
    const labels = root.querySelectorAll<HTMLElement>(".network-edge-label");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, last = 0, time = 0;
    const paint = () => {
      positions.current.forEach((p, i) => { nodes[i].style.left = `${p.x}%`; nodes[i].style.top = `${p.y}%`; });
      links.forEach((link, i) => {
        const a = positions.current[characters.findIndex(c => c.id === link.a)];
        const b = positions.current[characters.findIndex(c => c.id === link.b)];
        const dx=b.x-a.x, dy=b.y-a.y, d=Math.max(Math.hypot(dx,dy),1);
        const bend=link.curve || 0, cx=(a.x+b.x)/2-dy/d*bend, cy=(a.y+b.y)/2+dx/d*bend;
        const startD=Math.max(Math.hypot(cx-a.x,cy-a.y),1), endD=Math.max(Math.hypot(b.x-cx,b.y-cy),1);
        const sx=a.x+(cx-a.x)/startD*6, sy=a.y+(cy-a.y)/startD*6;
        const ex=b.x-(b.x-cx)/endD*6, ey=b.y-(b.y-cy)/endD*6;
        edges[i].setAttribute("d", `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`);
        labels[i].style.left=`${(sx+2*cx+ex)/4}%`;
        labels[i].style.top=`${(sy+2*cy+ey)/4}%`;
      });
    };
    const tick = (now: number) => {
      const dt = Math.min((now - (last || now)) / 16.667, 2); last = now;
      if (!document.hidden && !paused && !reduced.matches) {
        time += dt * .012;
        const ps = positions.current;
        ps.forEach((p, i) => {
          if (drag.current?.index === i) return;
          let fx = (characters[i].x - p.x) * .006 + Math.sin(time + i * 2.4) * .008;
          let fy = (characters[i].y - p.y) * .006 + Math.cos(time * .7 + i * 1.7) * .008;
          ps.forEach((q, j) => {
            if (i === j) return;
            const dx = p.x-q.x, dy = p.y-q.y, d = Math.max(Math.hypot(dx,dy), .1);
            fx += dx/d * 7/(d*d); fy += dy/d * 7/(d*d);
          });
          links.forEach(l => {
            if (l.feeling) return;
            const id = characters[i].id;
            if (l.a !== id && l.b !== id) return;
            const q = ps[characters.findIndex(c => c.id === (l.a === id ? l.b : l.a))];
            const dx=q.x-p.x, dy=q.y-p.y, d=Math.max(Math.hypot(dx,dy),.1);
            fx += dx/d*(d-31)*.001; fy += dy/d*(d-31)*.001;
          });
          p.vx = (p.vx+fx*dt)*Math.pow(.94,dt); p.vy = (p.vy+fy*dt)*Math.pow(.94,dt);
          p.x = Math.max(12,Math.min(88,p.x+Math.max(-.18,Math.min(.18,p.vx))*dt));
          p.y = Math.max(13,Math.min(83,p.y+Math.max(-.18,Math.min(.18,p.vy))*dt));
        });
      }
      paint(); frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused]);

  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, []);

  return <main className="relationship-page">
    <nav className="nav">
      <a className="brand" href="/"><span>CITRUSODA</span> OC ARCHIVE</a>
      <button className="lang" onClick={() => setLang(en ? "zh" : "en")} aria-label="Switch language"><span className={!en ? "on" : ""}>中</span><span className={en ? "on" : ""}>EN</span></button>
    </nav>
    <section className="relationship-shell">
      <a className="back" href="/">← {en ? "BACK TO ARCHIVE" : "返回角色檔案"}</a>
      <header><small>CHARACTER CONNECTION MAP</small><h1>{en ? "RELATIONSHIPS" : "人物關係網"}</h1></header>
      <div className="network-layout">
        <div ref={board} className="network-board" aria-label={en ? "Interactive character relationship network" : "互動人物關係網"}>
          <div className="network-controls"><span>{en ? "Drag to move · Click to explore" : "拖曳移動 · 點擊查看關係"}</span><button onClick={() => setPaused(!paused)}>{paused ? (en ? "Resume" : "繼續") : (en ? "Pause motion" : "暫停動畫")}</button></div>
          <svg className="network-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <defs>{["black", "red"].map(color => <marker key={color} id={`arrow-${color}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 1 1 L 9 5 L 1 9" fill="none" stroke={color === "red" ? "#ff303e" : "#111018"} strokeWidth="1.5" /></marker>)}</defs>
            {links.map((link, index) => {
              const active = link.a === selected || link.b === selected;
              const marker = `url(#arrow-${link.feeling ? "red" : "black"})`;
              return <path key={index} className={`relationship-edge ${link.feeling ? "feeling" : ""} ${active ? "active" : ""}`} markerEnd={marker} markerStart={link.directed ? undefined : marker} />;
            })}
          </svg>
          {links.map((link,index) => <span key={index} className={`network-edge-label ${link.feeling ? "feeling" : ""}`}>{en ? link.en : link.zh}</span>)}
          {characters.map((item, index) => <button
            key={item.id}
            className={`network-node${selected === item.id ? " active" : ""}`}
            style={{ left: `${item.x}%`, top: `${item.y}%`, "--node-color": item.color } as CSSProperties}
            onPointerDown={event => {
              if (event.button !== 0) return;
              event.currentTarget.setPointerCapture(event.pointerId);
              drag.current = { index, x: event.clientX, y: event.clientY, moved: false };
              suppressClick.current = false;
            }}
            onPointerMove={event => {
              const held = drag.current;
              if (!held || held.index !== index || !board.current) return;
              if (Math.hypot(event.clientX-held.x,event.clientY-held.y)>4) held.moved = true;
              if (!held.moved) return;
              const rect=board.current.getBoundingClientRect(), p=positions.current[index];
              p.x=Math.max(12,Math.min(88,(event.clientX-rect.left)/rect.width*100));
              p.y=Math.max(13,Math.min(83,(event.clientY-rect.top)/rect.height*100));
              p.vx=0; p.vy=0;
            }}
            onPointerUp={() => { suppressClick.current = !!drag.current?.moved; drag.current=null; }}
            onPointerCancel={() => { drag.current=null; suppressClick.current=true; }}
            onClick={event => { if (event.detail === 0 || !suppressClick.current) setSelected(item.id); suppressClick.current=false; }}
            aria-pressed={selected === item.id}
          ><img src={`/icons/${item.id}.svg`} alt="" /><b>{item.roman}</b></button>)}
        </div>
        {person && <aside className="relationship-panel" aria-label={en ? "Character relationships" : "角色關係"} style={{ "--node-color": person.color } as CSSProperties}>
          <button className="network-close" onClick={() => setSelected(null)} aria-label={en ? "Close panel" : "關閉視窗"}>×</button>
          <img className="relationship-avatar" src={`/icons/${person.id}.svg`} alt="" />
          <small>{en ? "SELECTED CHARACTER" : "已選角色"}</small>
          <h2>{en ? person.roman : <>{person.name}<i>{person.roman}</i></>}</h2>
          <div className="relationship-list">
            {related.map((link, index) => {
              const otherId = link.a === selected ? link.b : link.a;
              const other = characters.find((item) => item.id === otherId)!;
              return <button key={index} onClick={() => setSelected(other.id)}><img src={`/icons/${other.id}.svg`} alt="" /><span><b>{other.roman}</b><small style={{ color: link.feeling ? "#d51e35" : undefined }}>{link.directed ? (link.a === selected ? "→ " : "← ") : "↔ "}{en ? link.en : link.zh}</small></span></button>;
            })}
          </div>
          <a className="readmore" href={`/characters/${person.id}`}>{en ? "VIEW PROFILE" : "查看角色檔案"}<span>➜</span></a>
        </aside>}
      </div>
    </section>
  </main>;
}
