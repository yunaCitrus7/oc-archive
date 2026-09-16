import {chapters} from "../data";

export function generateStaticParams() {
  return chapters.map(({slug}) => ({chapter: slug}));
}

export default function ComicChapterLayout({children}: {children: React.ReactNode}) {
  return children;
}
