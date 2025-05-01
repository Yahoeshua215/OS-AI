import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { baseTitle, baseSubtitle, baseBody, count = 3, tone, goal } = data

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "OpenAI API key is not configured",
          variants: generateMockVariants(baseTitle, baseSubtitle, baseBody, count),
        },
        { status: 200 },
      )
    }

    // In a real implementation, we would make multiple calls to the OpenAI API
    // with instructions to generate variations of the base notification

    // For now, we'll simulate the API calls and return mock variants
    const variants = generateMockVariants(baseTitle, baseSubtitle, baseBody, count)

    return NextResponse.json({ variants })
  } catch (error) {
    console.error("Error in generate-variants API route:", error)

    // Return fallback variants with the error
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate variants",
        variants: [
          {
            title: "Flash Sale: 24 Hours Only! 🔥",
            subtitle: "Limited Time Offer",
            body: "Exclusive deals up to 50% off. Shop now before they're gone!",
          },
          {
            title: "Last Chance: 24 Hour Sale! ⏰",
            subtitle: "Don't Miss Out",
            body: "Up to 50% off your favorite items. Limited time only!",
          },
          {
            title: "SALE ALERT: 50% Off Everything! 💯",
            subtitle: "Today Only",
            body: "Our biggest sale of the season ends in 24 hours. Shop now!",
          },
        ],
      },
      { status: 200 },
    )
  }
}

// Helper function to generate mock variants
function generateMockVariants(baseTitle: string, baseSubtitle: string, baseBody: string, count: number) {
  const variants = [
    {
      title: baseTitle,
      subtitle: baseSubtitle || "",
      body: baseBody,
    },
  ]

  // Generate variations
  const titleVariations = [
    "Don't Miss Out! ",
    "Limited Time: ",
    "HURRY: ",
    "Last Chance: ",
    "Exclusive Offer: ",
    "Just For You: ",
    "Special Alert: ",
    "Act Now: ",
    "Today Only: ",
  ]

  const bodyVariations = [
    "Don't wait too long! ",
    "Limited quantities available. ",
    "This offer won't last! ",
    "Be one of the first to get it! ",
    "Exclusive deal just for you! ",
    "Take advantage of this special offer! ",
    "Shop now before it's gone! ",
    "Don't miss this amazing opportunity! ",
    "Claim your special offer today! ",
  ]

  for (let i = 1; i < count; i++) {
    const titlePrefix = titleVariations[i % titleVariations.length]
    const bodyPrefix = bodyVariations[i % bodyVariations.length]

    variants.push({
      title: `${titlePrefix}${baseTitle.replace(/^(HURRY:|Limited Time:|Don't Miss Out!|Last Chance:)/i, "")}`,
      subtitle: baseSubtitle || "",
      body: `${bodyPrefix}${baseBody}`,
    })
  }

  return variants
}
