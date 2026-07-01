import { NextRequest, NextResponse } from 'next/server';
import { generateText, buildOutlinePrompt, buildCharacterPrompt, buildStoryboardPrompt } from '@/lib/ai-service';
import { withAuth } from '@/lib/auth';
import { checkAndConsumeQuota } from '@/lib/quota';

/**
 * POST /api/ai/generate
 * AI 生成接口（需要认证 + 额度校验）
 * 
 * 请求体: { type: 'outline' | 'character' | 'storyboard', params: {...} }
 */
export const POST = withAuth(async (request, user) => {
  try {
    const body = await request.json();
    const { type, params } = body;

    // 额度校验
    const quotaType = type === 'character' ? 'CHARACTER_GEN' as const : 'TEXT_GEN' as const;
    const { allowed, remaining } = await checkAndConsumeQuota(user.userId, quotaType);

    if (!allowed) {
      return NextResponse.json({
        error: `额度不足！剩余 ${remaining} 次`,
        remaining,
      }, { status: 402 });
    }

    // 根据不同类型构建 Prompt
    let messages;
    switch (type) {
      case 'outline':
        messages = buildOutlinePrompt(params.topic, params.genre);
        break;
      case 'character':
        messages = buildCharacterPrompt(params.name, params.gender, params.style);
        break;
      case 'storyboard':
        messages = buildStoryboardPrompt(params.scriptContent);
        break;
      default:
        return NextResponse.json({ error: '不支持的生成类型' }, { status: 400 });
    }

    // 调用通义千问
    const result = await generateText(messages, {
      maxTokens: type === 'storyboard' ? 4096 : 2048,
    });

    return NextResponse.json({
      content: result.output.text,
      usage: result.usage,
      remaining,
    });
  } catch (error) {
    console.error('AI generate error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'AI 生成失败',
    }, { status: 500 });
  }
});

/**
 * GET /api/ai/generate?type=stream&...
 * AI 流式生成接口（SSE）
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const topic = searchParams.get('topic');
    const genre = searchParams.get('genre');

    if (!type || type !== 'outline' || !topic || !genre) {
      return NextResponse.json({ error: '参数不完整' }, { status: 400 });
    }

    const messages = buildOutlinePrompt(topic, genre);

    // SSE 流式响应
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 使用非流式方式（通义千问流式需要特殊处理SSE格式）
          const { generateTextStream } = await import('@/lib/ai-service');
          const generator = generateTextStream(messages);

          for await (const chunk of generator) {
            const data = JSON.stringify({ text: chunk });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          const data = JSON.stringify({
            error: error instanceof Error ? error.message : '生成失败',
          });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : '服务器错误',
    }, { status: 500 });
  }
}
