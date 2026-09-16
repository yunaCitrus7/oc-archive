// Chapter numbers and page counts from the supplied Comics.zip archive.
const pageCounts = [9, 3, 8, 1, 3, 2, 4, 7, 2, 2, 8, 1, 3, 1, 1, 1, 7, 6, 1, 2, 2, 1];
const titles = [
  "初遇", "同居", "討債", "短篇塗鴉1", "佔地對戰", "抱枕", "哥哥", "過去",
  "搭訕", "短篇塗鴉2", "情人節", "短篇塗鴉3", "兄妹過去日常 - 宿醉",
  "短篇塗鴉4", "海邊", "短篇塗鴉5", "曇", "兄妹過去日常",
  "兄妹過去日常", "兄妹過去日常", "拍照", "意外？",
];

export const chapters = pageCounts.map((pageCount, index) => {
  const number = index + 1;
  const folder = `ch-${String(number).padStart(2, "0")}`;
  return {
    number,
    slug: `chapter-${number}`,
    title: titles[index],
    pages: Array.from({length: pageCount}, (_, pageIndex) =>
      `/comics/${folder}/page-${String(pageIndex + 1).padStart(2, "0")}${number === 1 && pageIndex === 6 ? ".png" : ".jpg"}`
    ),
  };
});
