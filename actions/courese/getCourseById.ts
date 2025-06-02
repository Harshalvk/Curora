"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GetCourseById(courseId: string) {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("Unauthenticated");
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
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
      throw new Error(`No course with courseId:${courseId} found`);
    }

    return { success: true, course };
  } catch (error: any) {
    console.log("Error by fetching course by ID: ", error);
    return { success: false, message: error.message };
  }
}
