"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { photos as allPhotos, photoCategories, type Photo, type PhotoCategory } from "@/lib/photos";

type FilterValue = "전체" | PhotoCategory;

interface PhotoGridProps {
  /** 표시할 사진 목록. 생략 시 전체. */
  photos?: Photo[];
  /** 카테고리 필터 chip 표시 여부 */
  showFilter?: boolean;
}

export default function PhotoGrid({
  photos = allPhotos,
  showFilter = true,
}: PhotoGridProps) {
  const [active, setActive] = useState<FilterValue>("전체");

  const filtered = useMemo(
    () => (active === "전체" ? photos : photos.filter((p) => p.cat === active)),
    [active, photos]
  );

  const cats: FilterValue[] = ["전체", ...photoCategories];

  return (
    <>
      {showFilter && (
        <nav
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8"
          aria-label="사진 카테고리"
        >
          {cats.map((c) => {
            const isActive = c === active;
            const count =
              c === "전체"
                ? photos.length
                : photos.filter((p) => p.cat === c).length;
            if (count === 0) return null;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm rounded-full border transition-colors min-h-[40px] sm:min-h-0 ${
                  isActive
                    ? "bg-[rgb(var(--accent))] text-white border-[rgb(var(--accent))] font-semibold"
                    : "border-current/20 hover:bg-current/5"
                }`}
              >
                {c}
                <span className="opacity-70 text-[0.85em]">({count})</span>
              </button>
            );
          })}
        </nav>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {filtered.map((p, i) => (
          <motion.figure
            key={p.src}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: (i % 6) * 0.04 }}
            className={`relative overflow-hidden rounded-lg sm:rounded-xl border border-current/10 group ${
              p.span === "lg"
                ? "col-span-2 row-span-2 aspect-square sm:aspect-[4/3]"
                : "aspect-square sm:aspect-[4/3]"
            }`}
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-3 py-2 text-white text-xs sm:text-sm font-medium">
              {p.caption}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </>
  );
}
