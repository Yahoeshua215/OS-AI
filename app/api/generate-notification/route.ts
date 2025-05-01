import { NextResponse } from "next/server"
import { generatePushNotification, type GenerationPrompt } from "@/lib/openai"

export async function POST(request: Request) {
  try {
    const prompt = (await request.json()) as GenerationPrompt

    // Validate the prompt
    if (!prompt) {
      return NextResponse.json({ error: "Invalid prompt data" }, { status: 400 })
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "OpenAI API key is not configured",
          notification: {
            title: "Sample Notification",
            body: "This is a sample notification since OpenAI API is not configured.",
          },
        },
        { status: 200 },
      )
    }

    const notification = await generatePushNotification(prompt)

    return NextResponse.json({ notification })
  } catch (error) {
    console.error("Error in generate-notification API route:", error)

    // Return a fallback notification with the error
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate notification",
        notification: {
          title: "Sample Notification",
          body: "This is a sample notification since an error occurred.",
        },
      },
      { status: 200 },
    )
  }
}
