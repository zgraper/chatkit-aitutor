import OpenAI from "openai";
import { NextResponse } from "next/server";
import type { LessonPlan } from "@/types/lesson";

export const runtime = "nodejs";

interface GenerateLessonRequestBody {
  pdfText?: string;
}

const promptTemplate = (pdfText: string) => `You are an educational designer. From this PDF text:
${pdfText}
Create a JSON object with the following structure:
{
  "lesson_objective": string,
  "summary": string,
  "learning_objectives": [
    {
      "title": string,
      "summary": string,
      "reflection_prompt": string,
      "discussion_prompt": string,
      "quiz": [
        {
          "question": string,
          "choices": string[],
          "answer": string,
          "explanation": string
        }
      ]
    }
  ],
  "analysis": {
    "overall": string,
    "concepts_to_review": string[]
  },
  "next_steps": string[]
}
Ensure there are exactly three learning objectives and that every quiz contains at least three choices. Respond with valid JSON only.`;

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as GenerateLessonRequestBody;
    const pdfText = body?.pdfText?.trim();

    if (!pdfText) {
      return NextResponse.json(
        { error: "Missing pdfText in request body." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey });
    const prompt = promptTemplate(pdfText.slice(0, 5000));

    const completion = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content:
            "You specialize in transforming source materials into structured learning experiences.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("OpenAI API returned an empty response.");
    }

    let lesson: LessonPlan;
    try {
      lesson = JSON.parse(content) as LessonPlan;
    } catch (parseError) {
      console.error("Failed to parse lesson plan", parseError);
      return NextResponse.json(
        {
          error: "Unable to parse lesson plan.",
          raw: content,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("generate-lesson error", error);
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
