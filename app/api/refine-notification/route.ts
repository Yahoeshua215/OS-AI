import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { title, subtitle, body, feedback } = await request.json()

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "OpenAI API key is not configured",
          notification: {
            title,
            subtitle: subtitle || "",
            body: `Refined: ${body}`,
          },
        },
        { status: 200 },
      )
    }

    // In a real implementation, we would call the OpenAI API to refine the notification
    // based on the feedback
    try {
      const systemPrompt = `You are an expert in refining push notifications.
      You will be given a push notification title, subtitle, body, and feedback on how to improve it.
      Refine the notification based on the feedback while maintaining its core message.
      Return the result in JSON format with 'title', 'subtitle', and 'body' fields.`

      const userPrompt = `
      Original Title: ${title}
      Original Subtitle: ${subtitle || ""}
      Original Body: ${body}
      
      Feedback: ${feedback}
      
      Please refine this push notification based on the feedback.`

      const { text } = await generateText({
        model: openai("gpt-3.5-turbo"),
        system: systemPrompt,
        prompt: userPrompt,
        maxTokens: 200,
      })

      try {
        // Parse the JSON response
        const result = JSON.parse(text)

        // Validate the response structure
        if (!result.title || !result.body) {
          throw new Error("Invalid response format from OpenAI API")
        }

        // Ensure subtitle exists
        if (!result.subtitle) {
          result.subtitle = subtitle || ""
        }

        return NextResponse.json({ notification: result })
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError)
        console.error("Raw response:", text)

        // If parsing fails, return a simple refined version
        return NextResponse.json({
          notification: {
            title,
            subtitle: subtitle || "",
            body: `Refined based on feedback: ${body}`,
          },
        })
      }
    } catch (openaiError) {
      console.error("Error calling OpenAI API:", openaiError)

      // Return a fallback notification with the error
      return NextResponse.json({
        error: openaiError instanceof Error ? openaiError.message : "Failed to refine notification",
        notification: {
          title,
          subtitle: subtitle || "",
          body: `Refined: ${body}`,
        },
      })
    }
  } catch (error) {
    console.error("Error in refine-notification API route:", error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to process request",
        notification: {
          title: "Refined Notification",
          subtitle: "",
          body: "This is a refined notification since an error occurred.",
        },
      },
      { status: 500 },
    )
  }
}
