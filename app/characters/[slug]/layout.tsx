export function generateStaticParams() {
  return ["yuuhi", "musubi", "shuu", "sumire", "akane", "kumori"].map(slug => ({slug}));
}

export default function CharacterLayout({children}: {children: React.ReactNode}) {
  return children;
}
