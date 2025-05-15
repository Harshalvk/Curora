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
    "You are a helpful and expert educational AI. Generate challenging multiple-choice questions (MCQs) based on the provided transcript.",
    new Array(5).fill(
      `Create one difficult MCQ related to the course "${courseTitle}", using this transcript as context:\n\n${transcript}\n\nEach answer option should be short and relevant.`
    ),
    {
      question: "A clear and concise question related to the topic.",
      option1: "First answer option (max 10 words).",
      option2: "Second answer option (max 10 words).",
      option3: "Third answer option (max 10 words).",
      option4: "Fourth answer option (max 10 words).",
      answer: "The correct answer, matching exactly one of the above options.",
    },
    z.array(
      z.object({
        question: z.string().max(200),
        option1: z.string().max(10),
        option2: z.string().max(10),
        option3: z.string().max(10),
        option4: z.string().max(10),
        answer: z.string(),
      })
    )
  );

  if (questions === null) return [];

  return questions;
}
