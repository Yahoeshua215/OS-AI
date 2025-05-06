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
    const { description, useUserBehavior = true } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 })
    }

    // Extract specific requirements from the description
    const emailCount = extractCount(description, "email")
    const pushCount = extractCount(description, "push")
    const notificationCount = extractCount(description, "notification")
    const waitCount = extractCount(description, "wait")
    const branchCount = extractCount(description, "branch")

    // Build specific requirements string
    let specificRequirements = ""
    if (emailCount > 0) specificRequirements += `- Include exactly ${emailCount} email nodes.\n`
    if (pushCount > 0) specificRequirements += `- Include exactly ${pushCount} push notification nodes.\n`
    if (notificationCount > 0 && pushCount === 0)
      specificRequirements += `- Include exactly ${notificationCount} push notification nodes.\n`
    if (waitCount > 0) specificRequirements += `- Include exactly ${waitCount} wait nodes.\n`
    if (branchCount > 0) specificRequirements += `- Include exactly ${branchCount} branch nodes.\n`

    // If no specific counts were found, look for general numeric indicators
    if (!specificRequirements) {
      const totalNodeMatch = description.match(/(\d+)\s+(steps|nodes|messages)/i)
      if (totalNodeMatch) {
        const totalNodes = Number.parseInt(totalNodeMatch[1])
        specificRequirements += `- Include a total of ${totalNodes} message nodes (combination of email and push).\n`
      }
    }

    const systemPrompt = `You are an expert in customer journey mapping and marketing automation.
    Based on the user's description, create a customer journey flow with appropriate nodes.
    
    ${specificRequirements ? "IMPORTANT - You MUST follow these specific requirements:\n" + specificRequirements : ""}
    
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
    ${useUserBehavior ? "Base your recommendations on typical user behavior patterns and include reasoning for your choices." : ""}
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
        
        ${specificRequirements ? "Remember to STRICTLY follow these requirements:\n" + specificRequirements : ""}
        Make sure to generate contextually relevant content for each push notification and email node that fits the journey purpose.
        For push notifications, create compelling titles and message bodies.
        For emails, create engaging subject lines, titles, and brief content summaries.`,
        maxTokens: 1500,
      })

      // Clean the response to ensure it's valid JSON
      let cleanedText = text.trim()
      // If the response starts with \`\`\`json or \`\`\` remove it
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.substring(7)
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.substring(3)
      }
      // If the response ends with \`\`\` remove it
      if (cleanedText.endsWith("```")) {
        cleanedText = cleanedText.substring(0, cleanedText.length - 3)
      }

      cleanedText = cleanedText.trim()

      try {
        const journeyNodes = JSON.parse(cleanedText)

        // Validate that the journey meets the specific requirements
        const validation = validateJourneyRequirements(journeyNodes, {
          emailCount,
          pushCount: pushCount > 0 ? pushCount : notificationCount,
          waitCount,
          branchCount,
        })

        if (!validation.valid) {
          // If validation fails, try to fix the journey
          const fixedJourney = fixJourneyStructure(journeyNodes, validation.requirements, validation.counts)
          journeyNodes.splice(0, journeyNodes.length, ...fixedJourney)
        }

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

        // Fix connections to ensure proper flow
        fixConnections(journeyNodes)

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

// Helper function to extract counts from the description
function extractCount(description: string, nodeType: string): number {
  // Look for patterns like "3 emails", "2 push notifications", etc.
  const patterns = [new RegExp(`(\\d+)\\s+${nodeType}s?`, "i"), new RegExp(`${nodeType}s?\\s+(\\d+)`, "i")]

  for (const pattern of patterns) {
    const match = description.match(pattern)
    if (match && match[1]) {
      return Number.parseInt(match[1])
    }
  }

  return 0
}

// Validate that the journey meets the specific requirements
function validateJourneyRequirements(
  nodes: JourneyNode[],
  requirements: { emailCount: number; pushCount: number; waitCount: number; branchCount: number },
) {
  const counts = {
    email: nodes.filter((node) => node.type === "email").length,
    push: nodes.filter((node) => node.type === "push").length,
    wait: nodes.filter((node) => node.type === "wait").length,
    branch: nodes.filter((node) => node.type === "branch").length,
  }

  const valid =
    (requirements.emailCount === 0 || counts.email === requirements.emailCount) &&
    (requirements.pushCount === 0 || counts.push === requirements.pushCount) &&
    (requirements.waitCount === 0 || counts.wait === requirements.waitCount) &&
    (requirements.branchCount === 0 || counts.branch === requirements.branchCount)

  return { valid, requirements, counts }
}

// Fix the journey structure to meet the requirements
function fixJourneyStructure(
  nodes: JourneyNode[],
  requirements: { emailCount: number; pushCount: number; waitCount: number; branchCount: number },
  currentCounts: { email: number; push: number; wait: number; branch: number },
): JourneyNode[] {
  // Create a copy of the nodes to modify
  const fixedNodes = [...nodes]

  // Find entrance and exit nodes
  const entranceNode = fixedNodes.find((node) => node.type === "entrance")
  const exitNode = fixedNodes.find((node) => node.type === "exit")

  if (!entranceNode || !exitNode) {
    // If missing entrance or exit, create a basic structure
    return createBasicJourney(requirements)
  }

  // Remove excess nodes or add missing nodes as needed
  adjustNodeCount(fixedNodes, "email", currentCounts.email, requirements.emailCount)
  adjustNodeCount(fixedNodes, "push", currentCounts.push, requirements.pushCount)
  adjustNodeCount(fixedNodes, "wait", currentCounts.wait, requirements.waitCount)
  adjustNodeCount(fixedNodes, "branch", currentCounts.branch, requirements.branchCount)

  return fixedNodes
}

// Adjust the count of a specific node type
function adjustNodeCount(nodes: JourneyNode[], nodeType: string, currentCount: number, targetCount: number) {
  if (targetCount === 0 || currentCount === targetCount) return

  if (currentCount < targetCount) {
    // Add nodes
    for (let i = 0; i < targetCount - currentCount; i++) {
      const newNode: JourneyNode = {
        id: `${nodeType}-${Date.now()}-${i}`,
        type: nodeType as any,
        title: `${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} ${currentCount + i + 1}`,
        position: { x: 0, y: 0 }, // Will be adjusted later
        connections: [],
      }

      if (nodeType === "push") {
        newNode.messageContent = {
          title: "Push Notification",
          body: "Notification content goes here",
        }
      } else if (nodeType === "email") {
        newNode.messageContent = {
          subject: "Email Subject",
          title: "Email Title",
          body: "Email content goes here",
        }
      } else if (nodeType === "wait") {
        newNode.waitDuration = "1 Day"
      }

      nodes.push(newNode)
    }
  } else {
    // Remove excess nodes
    const nodesToRemove = nodes.filter((node) => node.type === nodeType).slice(0, currentCount - targetCount)

    nodesToRemove.forEach((node) => {
      const index = nodes.findIndex((n) => n.id === node.id)
      if (index !== -1) {
        nodes.splice(index, 1)
      }
    })
  }
}

// Create a basic journey structure if needed
function createBasicJourney(requirements: {
  emailCount: number
  pushCount: number
  waitCount: number
  branchCount: number
}): JourneyNode[] {
  const journey: JourneyNode[] = [
    {
      id: "entrance-1",
      type: "entrance",
      title: "Journey Start",
      position: { x: 600, y: 150 },
      connections: ["node-2"],
      segments: ["All Users"],
    },
  ]

  let lastNodeId = "entrance-1"
  let nodeIndex = 2

  // Add required email nodes
  for (let i = 0; i < requirements.emailCount; i++) {
    const nodeId = `node-${nodeIndex}`
    journey.push({
      id: nodeId,
      type: "email",
      title: `Email ${i + 1}`,
      position: { x: 600, y: 150 + nodeIndex * 180 },
      connections: [],
      messageContent: {
        subject: `Email Subject ${i + 1}`,
        title: `Email Title ${i + 1}`,
        body: `This is the content for email ${i + 1}.`,
      },
    })

    // Connect previous node to this one
    const prevNode = journey.find((node) => node.id === lastNodeId)
    if (prevNode) {
      prevNode.connections = [nodeId]
    }

    lastNodeId = nodeId
    nodeIndex++

    // Add a wait node after each email except the last one
    if (i < requirements.emailCount - 1) {
      const waitNodeId = `node-${nodeIndex}`
      journey.push({
        id: waitNodeId,
        type: "wait",
        title: "Wait",
        waitDuration: "2 Days",
        position: { x: 600, y: 150 + nodeIndex * 180 },
        connections: [],
      })

      // Connect previous node to wait node
      const prevNode = journey.find((node) => node.id === lastNodeId)
      if (prevNode) {
        prevNode.connections = [waitNodeId]
      }

      lastNodeId = waitNodeId
      nodeIndex++
    }
  }

  // Add required push nodes
  for (let i = 0; i < requirements.pushCount; i++) {
    const nodeId = `node-${nodeIndex}`
    journey.push({
      id: nodeId,
      type: "push",
      title: `Push Notification ${i + 1}`,
      position: { x: 600, y: 150 + nodeIndex * 180 },
      connections: [],
      messageContent: {
        title: `Push Title ${i + 1}`,
        body: `This is the content for push notification ${i + 1}.`,
      },
    })

    // Connect previous node to this one
    const prevNode = journey.find((node) => node.id === lastNodeId)
    if (prevNode) {
      prevNode.connections = [nodeId]
    }

    lastNodeId = nodeId
    nodeIndex++

    // Add a wait node after each push except the last one
    if (i < requirements.pushCount - 1) {
      const waitNodeId = `node-${nodeIndex}`
      journey.push({
        id: waitNodeId,
        type: "wait",
        title: "Wait",
        waitDuration: "2 Days",
        position: { x: 600, y: 150 + nodeIndex * 180 },
        connections: [],
      })

      // Connect previous node to wait node
      const prevNode = journey.find((node) => node.id === lastNodeId)
      if (prevNode) {
        prevNode.connections = [waitNodeId]
      }

      lastNodeId = waitNodeId
      nodeIndex++
    }
  }

  // Add additional wait nodes if required
  const additionalWaits = requirements.waitCount - (requirements.emailCount - 1) - (requirements.pushCount - 1)
  for (let i = 0; i < additionalWaits; i++) {
    const nodeId = `node-${nodeIndex}`
    journey.push({
      id: nodeId,
      type: "wait",
      title: `Wait ${i + 1}`,
      waitDuration: "3 Days",
      position: { x: 600, y: 150 + nodeIndex * 180 },
      connections: [],
    })

    // Connect previous node to this one
    const prevNode = journey.find((node) => node.id === lastNodeId)
    if (prevNode) {
      prevNode.connections = [nodeId]
    }

    lastNodeId = nodeId
    nodeIndex++
  }

  // Add branch nodes if required
  for (let i = 0; i < requirements.branchCount; i++) {
    const nodeId = `node-${nodeIndex}`
    journey.push({
      id: nodeId,
      type: "branch",
      title: `Branch ${i + 1}`,
      position: { x: 600, y: 150 + nodeIndex * 180 },
      connections: [],
    })

    // Connect previous node to this one
    const prevNode = journey.find((node) => node.id === lastNodeId)
    if (prevNode) {
      prevNode.connections = [nodeId]
    }

    lastNodeId = nodeId
    nodeIndex++
  }

  // Add exit node
  const exitNodeId = `node-${nodeIndex}`
  journey.push({
    id: exitNodeId,
    type: "exit",
    title: "Journey End",
    position: { x: 600, y: 150 + nodeIndex * 180 },
    connections: [],
    exitConditions: ["Journey completed"],
  })

  // Connect last node to exit
  const lastNode = journey.find((node) => node.id === lastNodeId)
  if (lastNode) {
    lastNode.connections = [exitNodeId]
  }

  return journey
}

// Fix connections to ensure proper flow
function fixConnections(nodes: JourneyNode[]) {
  // Sort nodes by vertical position
  nodes.sort((a, b) => a.position.y - b.position.y)

  // Connect nodes in sequence, except for the last one
  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].connections = [nodes[i + 1].id]
  }

  // Make sure the last node (exit) has no connections
  if (nodes.length > 0) {
    nodes[nodes.length - 1].connections = []
  }
}
