import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI({
  baseURL: "http://localhost:11434/v1",
  apiKey: "ollama",
});

interface OutputFormat {
  [key: string]: string | string[] | OutputFormat;
}

export async function strict_output<Schema extends z.ZodTypeAny>(
  system_prompt: string,
  user_prompt: string | string[],
  output_format: OutputFormat,
  output_type: Schema,
  default_category: string = "",
  output_value_only: boolean = false,
  model: string = "mistral",
  temperature: number = 1,
  num_tries: number = 3,
  verbose: boolean = false
) {
  const list_input: boolean = Array.isArray(user_prompt);
  const dynamic_elements: boolean = /<.*?>/.test(JSON.stringify(output_format));
  const list_output: boolean = /\[.*?\]/.test(JSON.stringify(output_format));

  let error_msg: string = "";

  for (let i = 0; i < num_tries; i++) {
    let output_format_prompt: string = `\nYou are to output ${
      list_output ? "an array of objects in" : ""
    } the following in JSON format: ${JSON.stringify(
      output_format
    )}. Do not put quotation marks or escape character \\ in the output fields. Output ONLY the JSON. Do NOT write any explanations or introductions.`;

    if (list_output) {
      output_format_prompt += `\nIf output field is a list, classify output into the best element of the list.`;
    }

    if (dynamic_elements) {
      output_format_prompt += `\nAny text enclosed by < and > indicates you must generate content to replace it. Example input: Go to <location>, Example output: Go to the garden.\nAny output key containing < and > indicates you must generate the key name to replace it.`;
    }

    if (list_input) {
      output_format_prompt += `\nGenerate an array of JSON, one JSON object per input element.`;
    }

    const response = await openai.beta.chat.completions.parse({
      model,
      temperature,
      messages: [
        {
          role: "system",
          content: system_prompt + output_format + error_msg,
        },
        { role: "user", content: user_prompt.toString() },
      ],
      response_format: zodResponseFormat(output_type, "res"),
    });

    let res = response.choices;

    try {
      return res[0].message.parsed;
    } catch (e: any) {
      error_msg = `\n\nResult returned by model:\n${res}\n\nError parsing JSON:\n${e.message}`;
      if (verbose) {
        console.log("An exception occurred:", e);
        console.log("Current invalid JSON format:", res);
      }
    }
  }

  return null;
}
