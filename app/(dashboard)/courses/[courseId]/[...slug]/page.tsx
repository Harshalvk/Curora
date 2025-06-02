import { redirect } from "next/navigation";
import React from "react";
import CourseSidebar from "./_components/CourseSidebar";
import MainVideoSummary from "./_components/MainVideoSummary";
import QuizCards from "./_components/QuizCards";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GetCourseById } from "@/actions/courese/getCourseById";

type Props = {
  params: {
    courseId: string;
    slug: string[];
  };
};

const CoursePage = async ({ params }: Props) => {
  await params;
  const [unitIndexParam, chapterIndexParam] = params.slug;

  const { course, success } = await GetCourseById(params.courseId);

  if (!course) {
    return redirect("/courses");
  }

  let unitIndex = parseInt(unitIndexParam);
  let chapterIndex = parseInt(chapterIndexParam);

  const unit = course.units[unitIndex];
  if (!unit) {
    return redirect("/courses");
  }
  const chapter = unit.chapters[chapterIndex];
  if (!chapter) {
    return redirect("/courses");
  }

  const nextChapter = unit.chapters[chapterIndex + 1];
  const prevChapter = unit.chapters[chapterIndex - 1];

  return (
    <div className="w-full h-full flex">
      <div className="flex-1 w-full h-full flex flex-col justify-between overflow-auto">
        <div className="px-6 py-2">
          <MainVideoSummary
            chapter={chapter}
            chapterIndex={chapterIndex}
            unit={unit}
            unitIndex={unitIndex}
          />
          {chapter.questions && <QuizCards chapter={chapter} />}
        </div>
        <div className="sticky bottom-0 inset-x-0 dark:bg-zinc-950/50 bg-white/40 backdrop-blur-lg border-t w-full h-fit flex">
          {prevChapter && (
            <Link
              href={`/courses/${course.id}/${unitIndex}/${chapterIndex - 1}`}
              className="flex mr-auto w-fit py-2"
            >
              <div className="flex items-center">
                <ChevronLeft className="w-6 h-6" />
                <div className="flex flex-col items-start">
                  <span className="text-sm text-secondary-foreground/60">
                    Previous
                  </span>
                  <span className="text-xs font-semibold">
                    {prevChapter.name}
                  </span>
                </div>
              </div>
            </Link>
          )}
          {nextChapter && (
            <Link
              href={`/courses/${course.id}/${unitIndex}/${chapterIndex + 1}`}
              className="flex ml-auto w-fit py-2"
            >
              <div className="flex items-center">
                <div className="flex flex-col items-end">
                  <span className="text-sm text-secondary-foreground/60">
                    Next
                  </span>
                  <span className="text-xs font-semibold">
                    {nextChapter.name}
                  </span>
                </div>
                <ChevronRight className="w-6 h-6" />
              </div>
            </Link>
          )}
        </div>
      </div>
      <CourseSidebar course={course} currentChapterId={chapter.id} />
    </div>
  );
};

export default CoursePage;
