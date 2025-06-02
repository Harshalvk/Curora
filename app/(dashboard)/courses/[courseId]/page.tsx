import { auth } from "@/auth";
import AlertMessage from "@/components/Alert";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";
import ConfirmChapters from "./_components/ConfirmChapters";

type Props = {
  params: {
    courseId: string;
  };
};

const CoursePage = async ({ params }: Props) => {
  await params;

  const session = await auth();

  if (!session?.user) {
    return redirect("/gallery");
  }

  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      units: {
        include: {
          chapters: true,
        },
      },
    },
  });

  if (!course) {
    return redirect("/create-course");
  }

  return (
    <div>
      <div className="sticky top-0 z-10 border-b px-4 pb-2 backdrop-blur-lg">
        <span className="text-muted-foreground text-sm">Course name</span>
        <h1 className="capitalize font-bold text-xl sm:text-2xl leading-5">
          {course.name}
        </h1>
      </div>
      <div className="max-w-4xl mx-auto mt-4 p-4">
        <AlertMessage
          title="Important!"
          description="Below are the generated chapters for each of your units. Look over them & then click on the button to confirm and continue."
        />
        <ConfirmChapters course={course} />
        <div className="mb-4" />
      </div>
    </div>
  );
};

export default CoursePage;
