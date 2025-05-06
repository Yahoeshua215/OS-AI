import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 })
    }

    const systemPrompt = `You are OneSignal Intelligence, an AI marketing assistant for the OneSignal customer engagement platform.

Your role is to help marketers optimize their push notifications, emails, in-app messages, and customer journeys.

Guidelines:
1. Be conversational and friendly, but professional
2. Provide specific, actionable advice based on marketing best practices
3. Focus on practical tips that users can implement immediately
4. When suggesting features, explain how to access them in the OneSignal platform
5. Tailor your responses to mid-market businesses that may lack specialized expertise
6. Always suggest clear next steps the user can take
7. When appropriate, offer to help create segments, journeys, or campaigns
8. Base recommendations on engagement data, industry benchmarks, and best practices
9. Be transparent about your reasoning and capabilities

Areas of expertise:
- Push notification optimization
- Email marketing strategies
- Customer journey creation
- Audience segmentation
- A/B testing
- Timing optimization
- Message personalization
- Re-engagement campaigns
- Analytics and performance metrics

Always aim to provide insights that drive action and meet users where they are in their marketing journey.`

    try {
      const { text } = await generateText({
        model: openai("gpt-3.5-turbo"),
        system: systemPrompt,
        messages: messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
        maxTokens: 1000,
      })

      return NextResponse.json({ response: text })
    } catch (aiError) {
      console.error("Error calling OpenAI:", aiError)
      return NextResponse.json(
        {
          error: `Error generating response with AI: ${aiError instanceof Error ? aiError.message : "Unknown error"}`,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in intelligence API:", error)
    return NextResponse.json(
      { error: `Failed to process request: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 400 },
    )
  }
}
