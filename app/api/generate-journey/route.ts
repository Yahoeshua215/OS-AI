import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export type JourneyNode = {
  id: string
  type: "entrance" | "push" | "email" | "wait" | "branch" | "exit"
  title: string
  description?: string
  waitDuration?: string
  position: { x: number; y: number }
  connections: string[]
  messageContent?: {
    title?: string
    body?: string
    subject?: string // For email nodes
  }
  segments?: string[]
  exitConditions?: string[]
}

export async function POST(request: Request) {
  try {
    const { description } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 })
    }

    const systemPrompt = `You are an expert in customer journey mapping and marketing automation.
    Based on the user's description, create a customer journey flow with appropriate nodes.
    
    Return a JSON array of journey nodes. Each node should have:
    - id: a unique string identifier
    - type: one of "entrance", "push", "email", "wait", "branch", or "exit"
    - title: a short title for the node
    - description: a brief description of what happens at this node (optional)
    - waitDuration: for wait nodes, how long to wait (e.g., "2 Days")
    - position: an object with x and y coordinates (for vertical layout, use the same x value for all nodes)
    - connections: an array of node IDs this node connects to
    - segments: for entrance nodes, include an array of segment names
    - exitConditions: for exit nodes, include an array of exit conditions
    
    For push notification nodes, include messageContent with:
    - title: An attention-grabbing title for the push notification (max 50 characters)
    - body: Compelling message body text (max 150 characters)
    
    For email nodes, include messageContent with:
    - subject: A relevant and engaging email subject line (max 60 characters)
    - title: A headline for the email content (max 80 characters)
    - body: A brief summary of the email content (max 200 characters)
    
    The content for each push notification and email MUST be contextually relevant to:
    1. The overall journey purpose described by the user
    2. The specific position of the node in the journey flow
    3. Any previous interactions or wait periods
    
    Always start with an entrance node and end with an exit node.
    Include at least one push notification or email node.
    If branching logic makes sense, include a branch node.
    Keep the total number of nodes between 4 and 8 for simplicity.
    Arrange nodes in a vertical layout with the same x-coordinate.
    
    Example:
    [
      {
        "id": "node-1",
        "type": "entrance",
        "title": "Entrance",
        "description": "Journey starts here",
        "position": { "x": 400, "y": 100 },
        "connections": ["node-2"],
        "segments": ["New Users", "Active in last 30 days"]
      },
      {
        "id": "node-2",
        "type": "push",
        "title": "Welcome Push",
        "description": "Send initial welcome message",
        "position": { "x": 400, "y": 200 },
        "connections": ["node-3"],
        "messageContent": {
          "title": "Welcome to Our App!",
          "body": "Thanks for joining. Discover all the amazing features we offer."
        }
      }
    ]`

    try {
      const { text } = await generateText({
        model: openai("gpt-3.5-turbo"),
        system: systemPrompt,
        prompt: `Create a customer journey based on this description: "${description}"
        
        Make sure to generate contextually relevant content for each push notification and email node that fits the journey purpose.
        For push notifications, create compelling titles and message bodies.
        For emails, create engaging subject lines, titles, and brief content summaries.`,
        maxTokens: 1500,
      })

      // Clean the response to ensure it's valid JSON
      let cleanedText = text.trim()
      // If the response starts with ```json or ``` remove it
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.substring(7)
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.substring(3)
      }
      // If the response ends with ``` remove it
      if (cleanedText.endsWith("```")) {
        cleanedText = cleanedText.substring(0, cleanedText.length - 3)
      }

      cleanedText = cleanedText.trim()

      try {
        const journeyNodes = JSON.parse(cleanedText)

        // Ensure nodes are in a vertical layout with proper spacing
        const centerX = 600 // Center of the canvas
        journeyNodes.forEach((node: JourneyNode, index: number) => {
          node.position = {
            x: centerX,
            y: 150 + index * 180, // Vertical spacing between nodes
          }

          // Ensure all nodes have a title
          if (!node.title) {
            node.title = node.type.charAt(0).toUpperCase() + node.type.slice(1)
          }

          // Ensure all message nodes have content
          if ((node.type === "push" || node.type === "email") && !node.messageContent) {
            node.messageContent = {}
          }

          // Ensure push nodes have title and body
          if (node.type === "push" && node.messageContent) {
            if (!node.messageContent.title) {
              node.messageContent.title = "Push Notification"
            }
            if (!node.messageContent.body) {
              node.messageContent.body = "There is still work to do"
            }
          }

          // Ensure email nodes have subject, title and body
          if (node.type === "email" && node.messageContent) {
            if (!node.messageContent.subject) {
              node.messageContent.subject = "Email Subject"
            }
            if (!node.messageContent.title) {
              node.messageContent.title = "Email Title"
            }
            if (!node.messageContent.body) {
              node.messageContent.body = "There is still work to do"
            }
          }
        })

        return NextResponse.json({ journeyNodes })
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError)
        console.error("Raw response:", text)
        console.error("Cleaned response:", cleanedText)
        return NextResponse.json(
          {
            error: "Failed to parse journey data",
            rawResponse: text,
          },
          { status: 500 },
        )
      }
    } catch (aiError) {
      console.error("Error calling OpenAI:", aiError)
      return NextResponse.json(
        {
          error: `Error generating journey with AI: ${aiError instanceof Error ? aiError.message : "Unknown error"}`,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in generate-journey API:", error)
    return NextResponse.json(
      { error: `Failed to process request: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 400 },
    )
  }
}
