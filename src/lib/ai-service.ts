/**
 * AI 服务层 - 封装通义千问 DashScope API
 * 文档: https://help.aliyun.com/zh/dashscope/
 */

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || '';
const DASHSCOPE_BASE_URL = 'https://dashscope.aliyuncs.com/api/v1';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  model: string;
  input: {
    messages: ChatMessage[];
  };
  parameters?: {
    result_format?: 'text' | 'message';
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    stream?: boolean;
  };
}

interface ChatCompletionResponse {
  output: {
    text: string;
    finish_reason?: string;
  };
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
  request_id: string;
}

// 默认模型
const DEFAULT_MODEL = 'qwen-max';

/**
 * 生成聊天回复（非流式）
 */
export async function generateText(
  messages: ChatMessage[],
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): Promise<ChatCompletionResponse> {
  const body: ChatCompletionRequest = {
    model: options?.model || DEFAULT_MODEL,
    input: { messages },
    parameters: {
      result_format: 'message',
      max_tokens: options?.maxTokens || 4096,
      temperature: options?.temperature || 0.7,
    },
  };

  const response = await fetch(`${DASHSCOPE_BASE_URL}/services/aigc/text-generation/generation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DASHSCOPE_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`通义千问 API 错误 (${response.status}): ${err}`);
  }

  return response.json();
}

/**
 * 生成聊天回复（流式）
 */
export async function* generateTextStream(
  messages: ChatMessage[],
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): AsyncGenerator<string, void, unknown> {
  const body: ChatCompletionRequest = {
    model: options?.model || DEFAULT_MODEL,
    input: { messages },
    parameters: {
      result_format: 'message',
      max_tokens: options?.maxTokens || 4096,
      temperature: options?.temperature || 0.7,
      stream: true,
    },
  };

  const response = await fetch(`${DASHSCOPE_BASE_URL}/services/aigc/text-generation/generation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DASHSCOPE_API_KEY}`,
      'X-DashScope-SSE': 'enable',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`通义千问流式 API 错误 (${response.status}): ${err}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('无法读取响应流');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data:')) {
        const data = line.slice(5).trim();
        if (!data) continue;

        try {
          const parsed = JSON.parse(data);
          const text = parsed.output?.text || '';
          if (text) yield text;
        } catch {
          // 忽略解析错误的行
        }
      }
    }
  }
}

/**
 * 剧本大纲生成 Prompt
 */
export function buildOutlinePrompt(topic: string, genre: string): ChatMessage[] {
  return [
    {
      role: 'system',
      content: `你是一个专业的短剧编剧。根据用户提供的主题和类型，生成一个完整的剧本大纲。
大纲应包含：
1. 故事核心冲突
2. 主要角色关系
3. 分幕结构（3-5幕），每幕包含场景标题和50字以内的场景描述
4. 关键反转/高潮点
5. 目标时长为${genre.includes('甜宠') ? '2-3' : '3-5'}分钟短剧

请用简洁有力的语言，适合短视频平台短剧风格。`,
    },
    {
      role: 'user',
      content: `主题：${topic}\n类型：${genre}`,
    },
  ];
}

/**
 * 角色设定生成 Prompt
 */
export function buildCharacterPrompt(name: string, gender: string, style: string): ChatMessage[] {
  return [
    {
      role: 'system',
      content: `你是一个专业的短剧角色设计师。根据角色名称、性别和风格，生成详细的角色设定卡片。
输出格式：
1. 性格描述（80-120字）
2. 背景故事（100-150字）
3. 人物弧光/成长线（50字）
4. 与其他角色的可能关系（30字）
风格要求：${style}风格，角色设定要有辨识度和戏剧张力。`,
    },
    {
      role: 'user',
      content: `角色名称：${name}\n性别：${gender}\n风格：${style}`,
    },
  ];
}

/**
 * 分镜脚本生成 Prompt
 */
export function buildStoryboardPrompt(scriptContent: string): ChatMessage[] {
  return [
    {
      role: 'system',
      content: `你是一个专业的分镜师。根据剧本内容，拆解为详细的分镜脚本。
每个分镜包含：
- shotType: 镜头类型 (CLOSE_UP特写 / MEDIUM中景 / FULL全景 / LONG远景)
- description: 画面描述（30字以内）
- dialogue: 对白/旁白（如有）
- durationSeconds: 建议时长（3-10秒）

请输出 JSON 格式的分镜数组。`,
    },
    {
      role: 'user',
      content: scriptContent,
    },
  ];
}

/**
 * 场景画面 Prompt 生成
 */
export function buildSceneImagePrompt(sceneDescription: string, style: string): string {
  return `短剧场景画面，${sceneDescription}，${style}风格，高清，电影质感，16:9画幅，柔和光影，色彩饱满`;
}
