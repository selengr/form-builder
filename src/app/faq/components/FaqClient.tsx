"use client";

import { useState, useMemo } from "react";
import CustomAccordionGroup from "./accordion";
import React from "react";

const HighlightedText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) return <span>{text}</span>;

  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedHighlight})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-200 dark:bg-yellow-400 text-black rounded px-1 mx-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

export default function FaqClient({ items }: any) {

  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    if (!term) return items;

    return items
      .filter(
        (item: any) =>
          item.title.toLowerCase().includes(term) ||
          item.content.toLowerCase().includes(term)
      )
      .map((item: any) => ({
        ...item,
        title: <HighlightedText text={item.title} highlight={searchTerm} />,
        content: <HighlightedText text={item.content} highlight={searchTerm} />,
      }));
  }, [searchTerm, items]);

  return (
    <>
      <div className="relative w-full xs:min-w-[80vw] xs:max-w-[90vw] md:min-w-[40vw] md:max-w-[50vw] lg:min-w-[30vw] lg:max-w-[40vw] px-4">
        <input
          type="text"
          placeholder="جستجو در سوالات و پاسخ‌ها..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-2xl border bg-white py-3 pl-12 pr-5 text-gray-800 mb-3"
          dir="rtl"
        />
      </div>

      <div className="flex-grow w-full overflow-y-auto scroll-hide px-4 pb-4">
        {filteredItems.length > 0 ? (
          <CustomAccordionGroup items={filteredItems} />
        ) : (
          <div className="text-center text-gray-500 py-10">
            موردی مطابق با جستجوی شما یافت نشد.
          </div>
        )}
      </div>
    </>
  );
}
