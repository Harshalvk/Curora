"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GetUserCoureses() {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("Unauthenticated");
    }

    if (!session?.user?.id) {
      throw new Error("Invalid user ID. Please log in again.");
    }

    const courses = await prisma.course.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        units: true,
      },
    });

    if (!courses) {
      throw new Error("No coureses for user found");
    }

    return { success: true, courses };
  } catch (error: any) {
    console.error("Get user's courses error", error);
    return { success: false, message: error.message };
  }
}
