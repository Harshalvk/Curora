import { auth } from "@/auth";
import { strict_output } from "@/lib/gpt";
import { prisma } from "@/lib/prisma";
import { CreateChapterSchema } from "@/schema/course";
import { NextResponse } from "next/server";
import { ZodError, z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, units } = CreateChapterSchema.parse(body);

    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { success: false, msg: "User not found" },
        { status: 403 }
      );
    }

    if (!session.user) {
      return NextResponse.json(
        { success: false, msg: "User not found" },
        { status: 403 }
      );
    }

    let output_units = await strict_output(
      "You are an AI capable of curating course content, coming up with relevant chapter titles, and findind relevant youtube for each chapter. YOU HAVE STRICT INSTRUCTION TO GIVE YOUR OUTPUT IN ONLY JSON OBJECT DO NOT ADD ANY INTRODUCTION FOR EXPLANATIONS FOR YOUR RESPONSE JUST STRICT JSON OBJECT. Make user your response should contain an entry for unit given by user.",
      new Array(units.length).fill(
        `It is your job to create a course about ${title}. The user has requested to create a chapters for each of the units. Then, for each chapter, provide a detailed youtube search query that can be used to find an informative educational video for each chapter. Each query should give an educational informative course in youtube.`
      ),
      {
        title: "title of the unit",
        chapters:
          "an array of chapters, each chapter should have a youtube_search_query (youtube_search_query should be generalized) and a chapter_title key in the JSON object",
      },
      z.array(
        z.object({
          title: z.string(),
          chapters: z
            .array(
              z.object({
                youtube_search_query: z.string(),
                chapter_title: z.string(),
              })
            )
            .max(3),
        })
      )
    );

    const course = await prisma.course.create({
      data: {
        name: title,
        userId: session.user.id as string,
      },
    });

    for (const unit of output_units!) {
      const title = unit.title;
      const prismaUnit = await prisma.unit.create({
        data: {
          name: title,
          courseId: course.id,
        },
      });
      await prisma.chapter.createMany({
        data: unit.chapters.map((chapter) => {
          return {
            name: chapter.chapter_title,
            youtubeSearchQuery: chapter.youtube_search_query,
            unitId: prismaUnit.id,
          };
        }),
      });
    }

    return NextResponse.json({ courseId: course.id }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return new NextResponse("invalid body", { status: 400 });
    }
    return new NextResponse("error while calling model");
  }
}
