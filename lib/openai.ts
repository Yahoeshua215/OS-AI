import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export type GenerationPrompt = {
  industry?: string
  tone?: string
  goal?: string
  audience?: string
  length?: "short" | "medium" | "long"
  includeEmoji?: boolean
}

export async function generatePushNotification(prompt: GenerationPrompt) {
  const {
    industry = "general",
    tone = "professional",
    goal = "engagement",
    audience = "customers",
    length = "short",
    includeEmoji = false,
  } = prompt

  const systemPrompt = `You are an expert in creating engaging push notifications. 
  Generate a push notification for the ${industry} industry with a ${tone} tone. 
  The goal is to increase ${goal} and the target audience is ${audience}.
  The notification should be ${length} (short: 5-7 words, medium: 8-12 words, long: 13-20 words).
  ${includeEmoji ? "Include relevant emojis." : "Do not include emojis."}
  
  Return the result in JSON format with 'title', 'subtitle', and 'body' fields.
  The title should be attention-grabbing, the subtitle should provide context, and the body should provide more details.`

  const userPrompt = `Generate a push notification for ${industry} industry targeting ${audience} with a ${tone} tone to increase ${goal}.`

  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured")
    }

    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"), // Changed from gpt-4o to gpt-3.5-turbo
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

      // If subtitle is missing, create a default one
      if (!result.subtitle) {
        result.subtitle = ""
      }

      return result
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError)
      console.error("Raw response:", text)

      // If JSON parsing fails, try to extract title, subtitle, and body using regex
      const titleMatch = text.match(/["']title["']\s*:\s*["'](.+?)["']/i)
      const subtitleMatch = text.match(/["']subtitle["']\s*:\s*["'](.+?)["']/i)
      const bodyMatch = text.match(/["']body["']\s*:\s*["'](.+?)["']/i)

      if (titleMatch && bodyMatch) {
        return {
          title: titleMatch[1],
          subtitle: subtitleMatch ? subtitleMatch[1] : "",
          body: bodyMatch[1],
        }
      }

      // If all extraction attempts fail, create a fallback response
      return {
        title: "New Notification",
        subtitle: "",
        body: "We have something special for you! Check it out now.",
      }
    }
  } catch (error) {
    console.error("Error generating push notification:", error)
    throw new Error(`Failed to generate notification: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
