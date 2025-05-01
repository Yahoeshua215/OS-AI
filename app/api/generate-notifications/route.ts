import { NextResponse } from "next/server"
import { generatePushNotification, type GenerationPrompt } from "@/lib/openai"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const count = data.count || 3 // Default to 3 options

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

    if (data.description) {
      // Generate from description
      const description = data.description

      // In a real implementation, we would make multiple calls to the OpenAI API
      // or use a single call with instructions to generate multiple options

      // For now, we'll simulate multiple options
      const baseNotification = await generatePushNotification({
        industry: "general",
        tone: data.tone || "professional",
        goal: "engagement",
        audience: "customers",
        length: data.length || "medium",
        includeEmoji: true,
      })

      // Create variations
      notifications = [
        baseNotification,
        {
          title: "Limited Time Offer! 🎁",
          subtitle: "Don't Miss Out",
          body: "Don't miss out on our special promotion. Click to learn more!",
        },
        {
          title: "Just For You! ✨",
          subtitle: "Special Offer Inside",
          body: "We've got something special waiting for you inside. Check it out now!",
        },
      ]
    } else {
      // Generate from guided options
      const prompt = data as GenerationPrompt

      // In a real implementation, we would make multiple calls to the OpenAI API
      // with slight variations to the prompt

      // For now, we'll simulate multiple options
      const baseNotification = await generatePushNotification(prompt)

      // Create variations based on the prompt
      notifications = [
        baseNotification,
        {
          title: prompt.includeEmoji ? "Don't Miss Out! 🔥" : "Don't Miss Out!",
          subtitle: "Limited Time Offer",
          body: "Limited time offer just for you. Tap to see details!",
        },
        {
          title: prompt.includeEmoji ? "Special Alert! ⚡" : "Special Alert!",
          subtitle: "Exclusive Update",
          body: "We have an exclusive update for you. Check it out now!",
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
