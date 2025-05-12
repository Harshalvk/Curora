import { strict_output } from "@/lib/gpt";
import { prisma } from "@/lib/prisma";
import {
  getQuestionsFromTranscript,
  getTranscript,
  searchYoutube,
} from "@/lib/youtube";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodyParser = z.object({
  chapterId: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { chapterId } = bodyParser.parse(body);

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
    });

    if (!chapter) {
      return NextResponse.json(
        {
          success: false,
          error: "Chapter not found",
        },
        { status: 404 }
      );
    }

    const videoId = await searchYoutube(chapter.youtubeSearchQuery);
    let transcript = await getTranscript(videoId);
    let maxLength = 300;
    transcript = transcript.split(" ").slice(0, maxLength).join(" ");
    let summary = await strict_output(
      "You are an AI capable of summarising a youtube transcript",
      "Summaries in 250 words or less and do not talk of the sponsors or anything unrelated to the main topic, also do not introduce what the summary is about. from the next line You will have the video transicption just summaries it.\n" +
        transcript,
      { summary: "summary of the transcript" },
      z.object({
        summary: z.string(),
      })
    );
    const questions = await getQuestionsFromTranscript(
      transcript,
      chapter.name
    );

    await prisma.question.createMany({
      data: questions.map((question) => {
        let options = [question.option1, question.option2, question.option3];
        options = options.sort(() => Math.random() - 0.5);
        return {
          chapterId,
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
        };
      }),
    });

    await prisma.chapter.update({
      where: {
        id: chapterId,
      },
      data: {
        videoId,
        summary: summary ? summary.summary : "",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid body",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Unknown",
        },
        { status: 500 }
      );
    }
  }
}
