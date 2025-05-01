import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Helper function to extract JSON from markdown code blocks if present
function extractJsonFromMarkdown(text: string): string {
  // Check if the response contains a markdown code block
  const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (jsonBlockMatch && jsonBlockMatch[1]) {
    return jsonBlockMatch[1].trim()
  }

  // If no code block is found, return the original text
  return text.trim()
}

export async function POST(request: Request) {
  try {
    const { content, fieldType } = await request.json()

    if (!content || !fieldType) {
      return NextResponse.json({ error: "Content and fieldType are required" }, { status: 400 })
    }

    // Determine the appropriate system prompt based on field type
    let systemPrompt = ""
    if (fieldType === "title") {
      systemPrompt = `You are an expert in creating engaging push notification titles. 
      Generate 3 variations of the following title, each with a different tone or approach.
      The variations should be concise and attention-grabbing.
      For each variation, also provide a single word or short phrase that describes the variation's style (e.g., "Urgent", "Friendly", "Question").
      Return the result as a JSON array with objects containing 'text' and 'qualifier' properties.
      IMPORTANT: Return ONLY the raw JSON array without any markdown formatting, code blocks, or additional text.`
    } else if (fieldType === "subtitle") {
      systemPrompt = `You are an expert in creating engaging push notification subtitles. 
      Generate 3 variations of the following subtitle, each with a different tone or approach.
      The variations should provide context and encourage users to engage.
      For each variation, also provide a single word or short phrase that describes the variation's style (e.g., "Informative", "Teaser", "Direct").
      Return the result as a JSON array with objects containing 'text' and 'qualifier' properties.
      IMPORTANT: Return ONLY the raw JSON array without any markdown formatting, code blocks, or additional text.`
    } else if (fieldType === "message") {
      systemPrompt = `You are an expert in creating engaging push notification messages. 
      Generate 3 variations of the following message, each with a different tone or approach.
      The variations should be compelling and drive user action.
      For each variation, also provide a single word or short phrase that describes the variation's style (e.g., "Conversational", "Persuasive", "Urgent").
      Return the result as a JSON array with objects containing 'text' and 'qualifier' properties.
      IMPORTANT: Return ONLY the raw JSON array without any markdown formatting, code blocks, or additional text.`
    }

    const userPrompt = `Original ${fieldType}: "${content}"`

    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
      maxTokens: 500,
    })

    try {
      // Extract JSON if the response contains markdown formatting
      const cleanedText = extractJsonFromMarkdown(text)

      // Parse the JSON response
      const variations = JSON.parse(cleanedText)

      // Validate the response structure
      if (!Array.isArray(variations) || variations.length === 0) {
        throw new Error("Invalid response format")
      }

      return NextResponse.json({ variations })
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError)
      console.error("Raw response:", text)

      // Try to extract variations using regex as a fallback
      try {
        const regexVariations = []
        const textMatches = text.match(/"text"\s*:\s*"([^"]+)"/g)
        const qualifierMatches = text.match(/"qualifier"\s*:\s*"([^"]+)"/g)

        if (textMatches && qualifierMatches && textMatches.length === qualifierMatches.length) {
          for (let i = 0; i < textMatches.length; i++) {
            const textValue = textMatches[i].match(/"text"\s*:\s*"([^"]+)"/)[1]
            const qualifierValue = qualifierMatches[i].match(/"qualifier"\s*:\s*"([^"]+)"/)[1]
            regexVariations.push({ text: textValue, qualifier: qualifierValue })
          }

          if (regexVariations.length > 0) {
            return NextResponse.json({ variations: regexVariations })
          }
        }
      } catch (regexError) {
        console.error("Regex extraction failed:", regexError)
      }

      // Fallback variations if all parsing fails
      const fallbackVariations = [
        { text: content, qualifier: "Original" },
        { text: `${content} (alternative)`, qualifier: "Alternative" },
        { text: `${content} (reworded)`, qualifier: "Reworded" },
      ]

      return NextResponse.json({ variations: fallbackVariations })
    }
  } catch (error) {
    console.error("Error generating variations:", error)
    return NextResponse.json({ error: "Failed to generate variations" }, { status: 500 })
  }
}
