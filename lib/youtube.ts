import { YoutubeTranscript } from "youtube-transcript";
import { strict_output } from "./gpt";
import { z } from "zod";

export async function searchYoutube(searchQuery: string) {
  searchQuery = encodeURIComponent(searchQuery); // learn codeing => learn+coding

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&q=${searchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=5`,
    { method: "GET" }
  );

  const data = await response.json();

  if (!data) {
    console.log("Youtube fail");
    return null;
  }

  return data.items[0].id.videoId;
}

export async function getTranscript(videoId: string) {
  try {
    let transcript_arr = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: "en",
    });

    let transcript = "";

    for (let t of transcript_arr) {
      transcript += t.text + " ";
    }

    return transcript.replaceAll("\n", "");
  } catch (error) {
    return "";
  }
}

export async function getQuestionsFromTranscript(
  transcript: string,
  courseTitle: string
) {
  type Question = {
    question: string;
    answer: string;
    option1: string;
    option2: string;
    option3: string;
  };

  const questions: Question[] | null = await strict_output(
    "You are a helpful AI that is able to generate mcq questions and answers, the length of each answer should not be more than 15 words",
    new Array(5).fill(
      `You are to generate a randomo hard mcq question about ${courseTitle} with context of the following transcript: ${transcript}`
    ),
    {
      question: "question",
      answer: "answer with max length of 15 words",
      option1: "option1 with max length of 15 words",
      option2: "option2 with max length of 15 words",
      option3: "option3 with max length of 15 words",
    },
    z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
        option1: z.string(),
        option2: z.string(),
        option3: z.string(),
      })
    )
  );

  if (questions === null) return [];

  return questions;
}
