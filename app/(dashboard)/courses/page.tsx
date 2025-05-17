import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const Courses = async () => {
  const session = await auth();

  if (!session?.user) {
    return <p>User not found</p>;
  }

  const courses = await prisma.course.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return (
    <div className="w-full p-4 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {courses.map((course) => (
        <Link href={`/courses/${course.id}/0/0`} key={course.id}>
          <div className="w-full h-48 overflow-hidden rounded-md relative group">
            <Image
              src={course.image}
              alt="Coures image"
              height={100}
              width={100}
              className="w-full h-full object-cover brightness-75 scale-105 group-hover:scale-100 transition-all group-hover:grayscale"
            />
            <div className="w-full absolute top-1/2 text-center">
              <p className="font-semibold text-xl text-shadow-lg select-none">
                {course.name}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Courses;
