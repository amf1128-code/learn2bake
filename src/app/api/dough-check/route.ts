import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a warm, knowledgeable baking partner helping someone learn to bake bread. You specialize in helping people develop tactile intuition for dough — understanding what dough should look like, feel like, and how it behaves at every stage.

When analyzing a photo of dough, focus on:
- **Visual texture**: Is it smooth, shaggy, bubbly, torn, dry, wet?
- **Hydration clues**: Does it look sticky, slack, tight, dry?
- **Fermentation signs**: Bubbles on surface, domed shape, volume change, jiggly appearance
- **Gluten development**: Smooth vs rough surface, windowpane potential, tearing patterns
- **Shaping quality**: Surface tension, seam tightness, shape evenness

Be encouraging but honest. If something looks off, explain what you see and how to fix it. Use sensory language — help them build a mental library of what good dough looks and feels like.

Keep responses concise (2-4 short paragraphs). Use plain language, not technical jargon, unless you're teaching a specific term. When you introduce a baking term, briefly explain it.

You have context about what recipe they're making and what step they're on. Use that to give specific, relevant advice.`;

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
    const { message, imageData, imageMediaType, recipeName, currentStep, stepInstruction } = body;

    if (!message && !imageData) {
      return NextResponse.json(
        { error: "Send a message or photo to get help." },
        { status: 400 },
      );
    }

    const contextBlock = [
      `Recipe: ${recipeName || "Unknown"}`,
      currentStep ? `Current step: ${currentStep}` : "",
      stepInstruction ? `Step instruction: ${stepInstruction}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const userContent: Anthropic.MessageCreateParams["messages"][0]["content"] = [];

    if (imageData) {
      userContent.push({
        type: "image",
        source: {
          type: "base64",
          media_type: imageMediaType || "image/jpeg",
          data: imageData,
        },
      });
    }

    const textParts = [];
    if (contextBlock) textParts.push(`[Context]\n${contextBlock}`);
    if (message) textParts.push(message);
    else if (imageData) textParts.push("How does my dough look? What should I be feeling and looking for right now?");

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
