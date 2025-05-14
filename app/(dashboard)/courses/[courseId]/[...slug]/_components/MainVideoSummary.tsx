"use client";

import { Chapter, Unit } from "@prisma/client";
import React from "react";

type Props = {
  chapter: Chapter;
  unit: Unit;
  unitIndex: number;
  chapterIndex: number;
};

const MainVideoSummary = ({
  chapter,
  chapterIndex,
  unit,
  unitIndex,
}: Props) => {
  return (
    <div>
      <h4 className="text-sm text-muted-foreground font-semibold uppercase">
        Unit {unitIndex + 1} &bull; Chapter {chapterIndex + 1}
      </h4>
      <h1 className="font-bold text-xl">{chapter.name}</h1>
      <iframe
        title="chapter video"
        className="w-full mt-4 aspect-video max-h-[24rem] rounded-md"
        src={`https://www.youtube.com/embed/${chapter.videoId}`}
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      />
      <div className="mt-4">
        <h3 className="text-2xl font-semibold mb-1">Summary</h3>
        <p className="text-justify leading-5">{chapter.summary}</p>
      </div>
    </div>
  );
};

export default MainVideoSummary;
