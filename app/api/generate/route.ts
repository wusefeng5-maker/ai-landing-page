import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API = "https://api.deepseek.com/v1/chat/completions";

const SYSTEM_PROMPT = `你是一位资深的商业文案撰写师和落地页设计师。

你的任务是为商家的行业生成一套完整的商业官网文案。

文案必须符合以下要求：
1. 突出客户收益和价值，强调能解决客户的什么问题
2. 使用有说服力的商业语言，适合真实商业网站展示
3. 文案要能吸引潜在客户主动咨询或下单
4. 内容具体且专业，避免空泛的套话
5. 语气真诚、专业、有信任感

只返回 JSON 格式，不要 markdown 标记或代码围栏。`;

const USER_PROMPT_TEMPLATE = `请为以下行业生成一份商业官网文案。

行业：{industry}
{description}

请按以下 JSON 格式输出（只返回 JSON，不要多余的文字）：
{
  "heroTitle": "一句强有力的标题（不超过12个字），突出核心卖点",
  "heroSubtitle": "支撑性副标题，解释价值主张，引发客户兴趣（1-2句话）",
  "services": ["服务名称 - 一句话描述特色和客户能获得的价值", "服务名称 - 一句话描述...", "服务名称 - 一句话描述..."],
  "advantages": ["选择我们的优势1，强调客户利益", "优势2，强调客户利益", "优势3", "优势4"],
  "cta": "一句有行动号召力的文案（不超过8个字），例如：立即预约体验、免费获取方案"
}

要求：3-5个服务项，3-5个优势项。内容必须具体、真实、有商业说服力。`;

export async function POST(request: NextRequest) {
  try {
    const { industry, description } = await request.json();

    if (!industry || typeof industry !== "string") {
      return NextResponse.json(
        { error: "请选择行业" },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "DeepSeek API 密钥未配置，请在 .env.local 中设置 DEEPSEEK_API_KEY" },
        { status: 500 }
      );
    }

    const descSection =
      description && typeof description === "string" && description.trim()
        ? `附加业务描述：${description.trim()}`
        : "";

    const userContent = USER_PROMPT_TEMPLATE
      .replace("{industry}", industry)
      .replace("{description}", descSection);

    const response = await fetch(DEEPSEEK_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("DeepSeek API error:", response.status, errText);
      return NextResponse.json(
        { error: `DeepSeek API 返回错误 (${response.status})` },
        { status: 502 }
      );
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "AI 返回内容为空，请重试" },
        { status: 502 }
      );
    }

    // Parse JSON, handling possible markdown code fences
    let jsonStr = content.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json(
        { error: "AI 返回格式异常，无法解析，请重试" },
        { status: 502 }
      );
    }

    // Validate structure with safety checks
    const safeData = {
      heroTitle: typeof parsed.heroTitle === "string" ? parsed.heroTitle : "",
      heroSubtitle: typeof parsed.heroSubtitle === "string" ? parsed.heroSubtitle : "",
      services: Array.isArray(parsed.services) ? parsed.services.filter((s: any) => typeof s === "string") : [],
      advantages: Array.isArray(parsed.advantages) ? parsed.advantages.filter((a: any) => typeof a === "string") : [],
      cta: typeof parsed.cta === "string" ? parsed.cta : "",
    };

    // If critical fields are empty, return error
    if (!safeData.heroTitle || !safeData.heroSubtitle || safeData.services.length === 0 || safeData.advantages.length === 0 || !safeData.cta) {
      return NextResponse.json(
        { error: "AI 生成内容不完整，请更换描述重试" },
        { status: 502 }
      );
    }

    return NextResponse.json(safeData);
  } catch (error: any) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { error: error?.message || "服务器内部错误" },
      { status: 500 }
    );
  }
}
