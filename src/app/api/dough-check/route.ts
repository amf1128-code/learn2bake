import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a warm, knowledgeable baking partner helping someone learn to bake bread. You specialize in helping people develop tactile intuition for dough — understanding what dough should look like, feel like, and how it behaves at every stage.

## Analyzing photos

When the user sends a photo, analyze what you CAN see:
- **Visual texture**: smooth, shaggy, bubbly, torn, dry, wet
- **Hydration clues**: sticky-looking, slack, tight, cracked
- **Fermentation signs**: bubbles on surface, domed shape, volume (if container visible)
- **Gluten development**: smooth vs rough surface, tearing patterns
- **Shaping quality**: surface tension, seam visibility, shape evenness

## Being honest about what photos can't show

A photo cannot show jiggle, elasticity, spring-back, or how dough feels. When these are important for the current step, be upfront:

"Your dough looks great in the photo — nice and smooth with good bubbles forming. But the real test right now is how it MOVES. Give the bowl a gentle shake — the dough should jiggle like jello. Here's a video showing exactly what that looks like:"

Then include the relevant reference video link if one is provided in the context.

## Guiding tactile awareness

Always help the user build sensory vocabulary:
- "Press a floured finger into the dough about ½ inch. If it springs back quickly, it needs more time. If it comes back slowly and leaves a slight indent, it's ready."
- "Pick up a small piece and stretch it between your fingers. You should be able to pull it thin enough to see light through it without it tearing — that's the windowpane test."
- "The dough should feel like a soft earlobe" or "like a stress ball" — use comparisons to everyday things.

## Reference videos

You may receive reference video URLs for the current step. When relevant, share these with the user using markdown link format: [descriptive label](url). These are curated videos that show exactly what the dough should look and move like. Use them especially when:
- The user asks about something a photo can't capture (jiggle, spring-back, stretch)
- The user seems unsure about whether their dough is ready
- You're describing a technique that's easier to watch than read

## Tone

Be encouraging but honest. If something looks off, explain what you see and how to fix it. Keep responses concise (2-4 short paragraphs). Use plain language — when you introduce a baking term, briefly explain it.`;

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI assistant is not configured. Add ANTHROPIC_API_KEY to your environment." },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const {
      message,
      imageData,
      imageMediaType,
      recipeName,
      currentStep,
      stepInstruction,
      referenceVideos,
    } = body as {
      message?: string;
      imageData?: string;
      imageMediaType?: string;
      recipeName?: string;
      currentStep?: string;
      stepInstruction?: string;
      referenceVideos?: { label: string; url: string }[];
    };

    if (!message && !imageData) {
      return NextResponse.json(
        { error: "Send a message or photo to get help." },
        { status: 400 },
      );
    }

    const contextParts = [
      `Recipe: ${recipeName || "Unknown"}`,
      currentStep ? `Current step: ${currentStep}` : "",
      stepInstruction ? `Step instruction: ${stepInstruction}` : "",
    ].filter(Boolean);

    if (referenceVideos && referenceVideos.length > 0) {
      contextParts.push(
        `Reference videos for this step:\n${referenceVideos.map((v) => `- ${v.label}: ${v.url}`).join("\n")}`,
      );
    }

    const contextBlock = contextParts.join("\n");

    const userContent: Anthropic.MessageCreateParams["messages"][0]["content"] = [];

    if (imageData) {
      userContent.push({
        type: "image",
        source: {
          type: "base64",
          media_type: (imageMediaType || "image/jpeg") as
            | "image/jpeg"
            | "image/png"
            | "image/gif"
            | "image/webp",
          data: imageData,
        },
      });
    }

    const textParts = [];
    if (contextBlock) textParts.push(`[Context]\n${contextBlock}`);
    if (message) textParts.push(message);
    else if (imageData)
      textParts.push(
        "How does my dough look? What should I be feeling and looking for right now?",
      );

    userContent.push({ type: "text", text: textParts.join("\n\n") });

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });

    const assistantText = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");

    return NextResponse.json({ reply: assistantText });
  } catch (err) {
    console.error("Dough check error:", err);
    return NextResponse.json(
      { error: "Something went wrong analyzing your dough. Try again!" },
      { status: 500 },
    );
  }
}
