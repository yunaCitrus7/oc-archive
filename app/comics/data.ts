// Chapter numbers and page counts from the supplied Comics.zip archive.
const pageCounts = [9, 3, 8, 1, 3, 2, 4, 7, 4, 3, 2, 2, 8, 1, 3, 1, 1, 1, 7, 6, 1, 2, 2, 1];
const titles = [
  "初遇", "同居", "討債", "短篇塗鴉1", "佔地對戰", "抱枕", "哥哥", "過去",
  "鮭魚跑", "布丁", "搭訕", "短篇塗鴉2", "情人節", "短篇塗鴉3", "兄妹過去日常 - 宿醉",
  "短篇塗鴉4", "海邊", "短篇塗鴉5", "曇", "兄妹過去日常",
  "兄妹過去日常", "兄妹過去日常", "拍照", "意外？",
];

const englishTitles = [
  "First Meeting", "Living Together", "Debt Collection", "Doodle Shorts 1", "Turf War", "Hug Pillow", "Big Brother", "The Past",
  "Salmon Run", "Pudding", "Flirting", "Doodle Shorts 2", "Valentine's Day", "Doodle Shorts 3", "The Siblings' Past — Hangover",
  "Doodle Shorts 4", "At the Beach", "Doodle Shorts 5", "Kumori", "The Siblings' Past",
  "The Siblings' Past", "The Siblings' Past", "Taking Photos", "An Accident?",
];

export const chapters = pageCounts.map((pageCount, index) => {
  const number = index + 1;
  // Fresh asset addresses avoid cached pages from before the chapter renumbering.
  // Chapters 20–24 correspond to original folders Ch 18–22, in numeric page order.
  const folder = `ch-${String(number).padStart(2, "0")}${number >= 20 ? "-revised" : ""}`;
  return {
    number,
    slug: `chapter-${number}`,
    title: titles[index],
    enTitle: englishTitles[index],
    pages: Array.from({length: pageCount}, (_, pageIndex) =>
      `/comics/${folder}/page-${String(pageIndex + 1).padStart(2, "0")}${number === 1 && pageIndex === 6 ? ".png" : ".jpg"}`
    ),
  };
});
