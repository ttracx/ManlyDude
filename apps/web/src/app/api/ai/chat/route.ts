import { claude } from '@/lib/claude';
import { requireAuth, requireTier, type AuthContext } from '@/lib/auth-guard';
import { NextResponse } from 'next/server';

interface ChatRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
}

const SYSTEM_PROMPT = `You are ManlyDude AI Coach — a world-class strength and conditioning coach powered by Claude. You combine deep exercise science knowledge with a direct, motivational coaching style.

PERSONALITY:
- Confident and knowledgeable, but never arrogant
- You give clear, actionable advice backed by science
- You use the ManlyDude brand voice: bold, encouraging, no fluff
- You call the user "champ", "king", or "legend" occasionally
- Keep responses focused and practical

CAPABILITIES:
- Form advice and exercise technique coaching
- Program design and periodization guidance
- Injury prevention and recovery protocols
- Nutrition strategy and meal timing
- Mental performance and training motivation
- Progress analysis and plateau-busting strategies

RULES:
- Never give medical advice — redirect to a doctor for injuries or health concerns
- Always prioritize safety over intensity
- Base recommendations on evidence-based practices
- If asked about something outside your expertise, say so honestly
- Keep responses concise unless the user asks for detail`;

export async function POST(request: Request) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;
  const { profile } = authResult as AuthContext;

  const tierCheck = requireTier(profile, 'premium');
  if (tierCheck) return tierCheck;

  let body: ChatRequest;
  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.messages?.length) {
    return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
  }

  // Build context about the user for personalized coaching
  const userContext = [
    profile.full_name ? `Name: ${profile.full_name}` : null,
    profile.weight_kg ? `Weight: ${profile.weight_kg}kg` : null,
    profile.height_cm ? `Height: ${profile.height_cm}cm` : null,
    profile.gender ? `Gender: ${profile.gender}` : null,
    profile.fitness_goal ? `Goal: ${profile.fitness_goal.replace('_', ' ')}` : null,
    profile.experience_level ? `Level: ${profile.experience_level}` : null,
  ]
    .filter(Boolean)
    .join(', ');

  const systemWithContext = userContext
    ? `${SYSTEM_PROMPT}\n\nUSER PROFILE: ${userContext}`
    : SYSTEM_PROMPT;

  try {
    const stream = await claude.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemWithContext,
      messages: body.messages,
    });

    // Return a streaming response using Server-Sent Events
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              const chunk = `data: ${JSON.stringify({ text: event.delta.text })}\n\n`;
              controller.enqueue(encoder.encode(chunk));
            }
          }

          const finalMessage = await stream.finalMessage();
          const done = `data: ${JSON.stringify({
            done: true,
            usage: {
              input_tokens: finalMessage.usage.input_tokens,
              output_tokens: finalMessage.usage.output_tokens,
            },
          })}\n\n`;
          controller.enqueue(encoder.encode(done));
          controller.close();
        } catch (err) {
          console.error('Stream error:', err);
          const errorChunk = `data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`;
          controller.enqueue(encoder.encode(errorChunk));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    console.error('AI chat failed:', err);
    return NextResponse.json(
      { error: 'Failed to start chat. Please try again.' },
      { status: 500 },
    );
  }
}
