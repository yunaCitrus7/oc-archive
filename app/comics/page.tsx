const chapters=[1,2,3];

export default function ComicsPage(){return <main className="notebook-page comics-page">
 <nav className="nav"><a className="brand" href="/"><span>CITRUSODA</span> OC ARCHIVE</a><div className="navlinks"><a href="/">CHARACTERS</a><a href="/gallery">GALLERY</a></div></nav>
 <section className="comics-shell"><a className="back" href="/">← BACK TO ARCHIVE</a><h1>Comics</h1><div className="comic-sort">SORTING: <button>NEWEST FIRST⌄</button></div>
  <div className="comic-chapter-list">{chapters.map(chapter=><a id={`chapter-${chapter}`} href={`/comics/chapter-${chapter}`} className="comic-chapter-row" key={chapter}><div className="comic-chapter-preview"><span>PREVIEW IMAGE</span></div><div className="comic-chapter-title"><b>#{String(chapter).padStart(2,"0")}</b><span>Chapter Name</span></div><i aria-hidden="true">➜</i></a>)}</div>
 </section>
 </main>}
