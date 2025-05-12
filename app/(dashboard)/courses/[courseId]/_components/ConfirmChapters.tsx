"use client";

import { Chapter, Course, Unit } from "@prisma/client";
import React, { useMemo, useState } from "react";
import ChapterCard, { ChapterCardHandler } from "./ChapterCard";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader } from "lucide-react";
import Link from "next/link";

type Props = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
};

const ConfirmChapters = ({ course }: Props) => {
  const [loading, setLoading] = useState(false);
  const chapterRefs: Record<
    string,
    React.RefObject<ChapterCardHandler | null>
  > = {};
  course.units.forEach((unit) => {
    unit.chapters.forEach((chapter) => {
      chapterRefs[chapter.id] = React.useRef(null);
    });
  });
  const [completedChapters, setCompletedChapters] = useState<Set<String>>(
    new Set()
  );

  const totalChaptersCount = useMemo(() => {
    return course.units.reduce((acc, unit) => {
      return acc + unit.chapters.length;
    }, 0);
  }, [course.units]);

  return (
    <div className="w-full mt-4 border rounded-md px-4">
      {course.units.map((unit, unitIdx) => (
        <div key={unitIdx}>
          <div className="my-2">
            <span className="text-sm capitalize text-muted-foreground">
              Unit {unitIdx + 1}
            </span>
            <h1 className="font-semibold text-xl leading-tight">{unit.name}</h1>
            {unit.chapters.map((chapter, chapterIdx) => (
              <ChapterCard
                completedChapters={completedChapters}
                setCompletedChapters={setCompletedChapters}
                ref={chapterRefs[chapter.id]}
                key={chapterIdx}
                chapter={chapter}
                chapterIdx={chapterIdx}
              />
            ))}
          </div>
        </div>
      ))}
      <div className="flex items-center justify-center my-2">
        <Separator className="flex-[1] hidden sm:block" />
        <div className="mx-4 space-x-2 flex">
          <Button type="button" variant={"secondary"} className="text-xs group">
            <ArrowLeft className="translate-x-0.5 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </Button>
          {totalChaptersCount === completedChapters.size ? (
            <Button asChild className="group" variant={"outline"}>
              <Link href={`/course/${course.id}/0/0`}>
                Save & Continue{" "}
                <ArrowRight className="-translate-x-0.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              variant={"default"}
              className="text-xs group"
              disabled={loading}
              onClick={() => {
                setLoading(true);
                Object.values(chapterRefs).forEach((ref) => {
                  {
                    ref.current?.triggerLoad();
                  }
                });
              }}
            >
              Generate{" "}
              {loading ? (
                <Loader className="animate-spin" />
              ) : (
                <ArrowRight className="-translate-x-0.5 group-hover:translate-x-0.5 transition-transform" />
              )}
            </Button>
          )}
        </div>
        <Separator className="flex-[1] hidden sm:block" />
      </div>
    </div>
  );
};

export default ConfirmChapters;
