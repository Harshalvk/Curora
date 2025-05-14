import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Chapter, Course, Unit } from "@prisma/client";
import Link from "next/link";
import React from "react";

type Props = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
  currentChapterId: string;
};

const CourseSidebar = async ({ course, currentChapterId }: Props) => {
  return (
    <div className="w-[350px] inset-y-0 top-[51px] right-0 border-l overflow-y-auto">
      <h1 className="text-2xl font-semibold tracking-tight sticky top-0 border-b mb-2 backdrop-blur-sm p-1">
        {course.name}
      </h1>
      <div className="">
        {course.units.map((unit, unitIdx) => (
          <div key={unit.id} className="px-2">
            <h2 className="text-muted-foreground text-sm">
              Unit {unitIdx + 1}
            </h2>
            <p className="font-semibold">{unit.name}</p>
            {unit.chapters.map((chapter, chapterIdx) => (
              <div key={chapter.id}>
                <Link
                  href={`/courses/${course.id}/${unitIdx}/${chapterIdx}`}
                  className={cn(
                    "hover:underline text-muted-foreground underline-offset-4 transition-all",
                    currentChapterId === chapter.id &&
                      "text-yellow-800 font-semibold"
                  )}
                >
                  <span className="">{chapterIdx + 1}.</span>{" "}
                  <span className="">{chapter.name}</span>
                </Link>
              </div>
            ))}
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;
