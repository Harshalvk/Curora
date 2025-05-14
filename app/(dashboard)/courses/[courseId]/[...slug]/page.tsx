import { prisma } from "@/lib/prisma";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React from "react";
import CourseSidebar from "./_components/CourseSidebar";
import MainVideoSummary from "./_components/MainVideoSummary";
import QuizCards from "./_components/QuizCards";

type Props = {
  params: {
    courseId: string;
    slug: string[];
  };
};

const CoursePage = async ({ params }: Props) => {
  await params;
  const [unitIndexParam, chapterIndexParam] = params.slug;

  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      units: {
        include: {
          chapters: {
            include: {
              questions: true,
            },
          },
        },
      },
    },
  });

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

  return (
    <div className="w-full h-full flex">
      <div className="flex-1 overflow-auto">
        <div>
          <div className="px-6 py-2">
            <MainVideoSummary
              chapter={chapter}
              chapterIndex={chapterIndex}
              unit={unit}
              unitIndex={unitIndex}
            />
            {chapter.questions && <QuizCards chapter={chapter} />}
          </div>
        </div>
      </div>
      <CourseSidebar course={course} currentChapterId={chapter.id} />
    </div>
  );
};

export default CoursePage;
