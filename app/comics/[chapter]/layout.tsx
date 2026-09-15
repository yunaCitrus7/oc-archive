export function generateStaticParams() {
  return ["chapter-1", "chapter-2", "chapter-3"].map(chapter => ({chapter}));
}

export default function ComicChapterLayout({children}: {children: React.ReactNode}) {
  return children;
}
