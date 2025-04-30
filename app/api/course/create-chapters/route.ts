import { modelResponse, strict_output } from "@/lib/gpt";
import { CreateChapterSchema } from "@/schema/course";
import { NextResponse } from "next/server";
import { ZodError, z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, units } = CreateChapterSchema.parse(body);
    console.log(body);
    type outputUnits = {
      title: string;
      chapters: {
        youtube_search_query: string;
        chapter_title: string;
      }[];
    };

    let output_units = await strict_output(
      "You are an AI capable of curating course content, coming up with relevant chapter titles, and findind relevant youtube for each chapter. YOU HAVE STRICT INSTRUCTION TO GIVE YOUR OUTPUT IN ONLY JSON OBJECT DO NOT ADD ANY INTRODUCTION FOR EXPLANATIONS FOR YOUR RESPONSE JUST STRICT JSON OBJECT. Make user your response should contain an entry for unit given by user.",
      new Array(units.length).fill(
        `It is your job to create a course about ${title}. The user has requested to create a chapters for each of the units. Then, for each chapter, provide a detailed youtube search query that can be used to find an informative educational video for each chapter. Each query should give an educational informative course in youtube.`
      ),
      {
        title: "title of the unit",
        chapters:
          "an array of chapters, each chapter should have a youtube_search_query and a chapter_title key in the JSON object",
      }
    );

    console.log("###OUTPUT", output_units);
    return NextResponse.json(output_units);
  } catch (error) {
    if (error instanceof ZodError) {
      return new NextResponse("invalid body", { status: 400 });
    }
    return new NextResponse("error while calling model");
  }
}
