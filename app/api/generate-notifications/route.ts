import { NextResponse } from "next/server"
import { generatePushNotification } from "@/lib/openai"

export async function POST(request: Request) {
  try {
    const {
      description,
      count = 3,
      tone = "friendly",
      length = "short",
      includeEmoji = true,
      existingContent,
      ...promptOptions
    } = await request.json()

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "OpenAI API key is not configured",
          notifications: [
            {
              title: "Flash Sale: 24 Hours Only! 🔥",
              subtitle: "Limited Time Offer",
              body: "Exclusive deals up to 50% off. Shop now before they're gone!",
            },
            {
              title: "Your Cart Misses You 🛒",
              subtitle: "Items Waiting for You",
              body: "Items in your cart are waiting. Complete your purchase today!",
            },
            {
              title: "New Arrivals Just Dropped ✨",
              subtitle: "Fresh Collection",
              body: "Be the first to shop our latest collection. Limited quantities available.",
            },
          ],
        },
        { status: 200 },
      )
    }

    // Handle different input types
    let notifications = []

    let prompt = ""
    if (existingContent && (existingContent.title || existingContent.subtitle || existingContent.message)) {
      prompt = `Generate ${count} push notification variations based on the following existing content:\n`
      if (existingContent.title) prompt += `Title: ${existingContent.title}\n`
      if (existingContent.subtitle) prompt += `Subtitle: ${existingContent.subtitle}\n`
      if (existingContent.message) prompt += `Message: ${existingContent.message}\n\n`
      prompt += `Use a ${tone} tone and make them ${length} length. ${includeEmoji ? "Include emojis." : "Do not include emojis."} Maintain the core message but provide creative variations.`
    } else if (description) {
      prompt = `Generate ${count} push notification options for: ${description}. Use a ${tone} tone and make them ${length} length. ${includeEmoji ? "Include emojis." : "Do not include emojis."}`
    } else {
      // Use guided options
      prompt = `Generate ${count} push notification options for a ${promptOptions.industry} app. 
  Target audience: ${promptOptions.audience}.
  Goal: ${promptOptions.goal}.
  Tone: ${tone}.
  Length: ${length}.
  ${includeEmoji ? "Include emojis." : "Do not include emojis."}`
    }

    // In a real implementation, we would make multiple calls to the OpenAI API
    // or use a single call with instructions to generate multiple options

    // For now, we'll simulate multiple options
    const baseNotification = await generatePushNotification({
      industry: promptOptions.industry || "general",
      tone: tone || "professional",
      goal: promptOptions.goal || "engagement",
      audience: promptOptions.audience || "customers",
      length: length || "medium",
      includeEmoji: includeEmoji,
    })

    // Create variations based on the tone and length
    const emojiSet = includeEmoji ? ["🔥", "✨", "🎁", "⚡", "🚀"] : ["", "", "", "", ""]

    // Create variations
    if (existingContent && (existingContent.title || existingContent.subtitle || existingContent.message)) {
      // If we have existing content, create variations based on that
      const titleBase = existingContent.title || "New Notification"
      const subtitleBase = existingContent.subtitle || ""
      const messageBase = existingContent.message || "Check out our latest updates!"

      // Create tone-specific variations
      let toneAdjective = ""
      let toneVerb = ""

      switch (tone) {
        case "friendly":
          toneAdjective = "exciting"
          toneVerb = "discover"
          break
        case "professional":
          toneAdjective = "important"
          toneVerb = "review"
          break
        case "casual":
          toneAdjective = "cool"
          toneVerb = "check out"
          break
        case "urgent":
          toneAdjective = "urgent"
          toneVerb = "act now"
          break
        case "humorous":
          toneAdjective = "hilarious"
          toneVerb = "laugh at"
          break
        case "formal":
          toneAdjective = "noteworthy"
          toneVerb = "consider"
          break
        default:
          toneAdjective = "great"
          toneVerb = "see"
      }

      notifications = [
        baseNotification,
        {
          title: includeEmoji ? `${titleBase} ${emojiSet[1]}` : titleBase,
          subtitle: subtitleBase || `A ${toneAdjective} update`,
          body: `${messageBase} ${toneVerb} now!`,
        },
        {
          title: includeEmoji ? `Don't miss: ${titleBase} ${emojiSet[2]}` : `Don't miss: ${titleBase}`,
          subtitle: subtitleBase || "Just for you",
          body: messageBase,
        },
      ]
    } else {
      // Standard variations
      notifications = [
        baseNotification,
        {
          title: includeEmoji ? `Limited Time Offer! ${emojiSet[1]}` : "Limited Time Offer!",
          subtitle: "Don't Miss Out",
          body: "Don't miss out on our special promotion. Click to learn more!",
        },
        {
          title: includeEmoji ? `Just For You! ${emojiSet[2]}` : "Just For You!",
          subtitle: "Special Offer Inside",
          body: "We've got something special waiting for you inside. Check it out now!",
        },
      ]
    }

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error("Error in generate-notifications API route:", error)

    // Return fallback notifications with the error
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate notifications",
        notifications: [
          {
            title: "Flash Sale Today! 🔥",
            subtitle: "Limited Time Offer",
            body: "Exclusive deals up to 50% off. Shop now before they're gone!",
          },
          {
            title: "Your Cart Misses You 🛒",
            subtitle: "Items Waiting for You",
            body: "Items in your cart are waiting. Complete your purchase today!",
          },
          {
            title: "New Arrivals Just Dropped ✨",
            subtitle: "Fresh Collection",
            body: "Be the first to shop our latest collection. Limited quantities available.",
          },
        ],
      },
      { status: 200 },
    )
  }
}
