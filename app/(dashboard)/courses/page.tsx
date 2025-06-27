import { auth } from "@/auth";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GetUserCoureses } from "@/actions/courese/getUsersCourses";
import { ArrowRight, FolderOpen } from "lucide-react";
import { Course, Unit } from "@prisma/client";

const Courses = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/signgin");
  }

  const { courses, success } = await GetUserCoureses();

  if (!success || !courses || courses.length === 0) {
    return (
      <div className="w-full h-1/2 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="border-3 p-4 rounded-full ">
            <FolderOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className=" text-xl font-semibold">No Coureses found</h1>
          <p>Please create one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      <CouresCard courses={courses} />
    </div>
  );
};

function CouresCard({ courses }: { courses: (Course & { units: Unit[] })[] }) {
  return (
    <>
      {courses?.map((course) => (
        <Link
          href={`/courses/${course.id}/0/0`}
          key={course.id}
          className="hover:bg-muted-foreground/3 transition-colors rounded-md border group"
        >
          <div className="w-full p-3 rounded-md">
            <div className="w-full flex justify-between">
              <p className="font-semibold text-xl select-none mb-2">
                {course.name}
              </p>
              <ArrowRight className="w-4 h-4 group-hover:-rotate-45 transition-all text-muted-foreground group-hover:text-white" />
            </div>

            {course.units.map((unit) => (
              <p
                key={unit.id}
                className="text-sm text-muted-foreground hover:underline underline-offset-2"
              >
                {unit.name}
              </p>
            ))}
          </div>
        </Link>
      ))}
    </>
  );
}

export default Courses;
