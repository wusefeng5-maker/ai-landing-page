 import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/app/lib/rate-limit";
 
 const DEEPSEEK_API = "https://api.deepseek.com/v1/chat/completions";
 
 const PROMPTS: Record<string, string> = {
   heroTitle: "生成一个吸引人的网站大标题（不超过12个字），突出核心卖点，语言有感染力",
   heroSubtitle: "生成一个网站副标题（1-2句话），解释价值主张，引发客户兴趣",
   services: "生成多个服务项目，每个用一句话描述特色和价值",
   advantages: "生成多个选择我们的理由，每个一句话强调客户利益",
   cta: "生成一句号召性文案（不超过10个字），例如：立即预约体验",
 };
 
 export async function POST(request: NextRequest) {
   try {
     const { section, business, context } = await request.json();
     if (!section || !business) {
       return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
     }
 
     const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "DeepSeek API 密钥未配置, 请在 .env.local 中设置 DEEPSEEK_API_KEY" },
        { status: 500 }
      );
    }

    // Rate limit: 20 per hour per IP
    const ip = getClientIp(request);
    const rlResult = checkRateLimit(ip, 20, 60 * 60 * 1000);
    if (!rlResult.allowed) {
      return NextResponse.json(
        { error: `生成次数已达上限(每小时20次), 请 ${Math.ceil(rlResult.resetInMs / 60000)} 分钟后再试` },
        { status: 429 }
      );
    }
 
     const desc = PROMPTS[section] || "生成相关文案";
     const system = `你是一位商业文案撰写师。${desc}。只返回纯文本，不要JSON格式。`;
     let user = `行业/业务：${business}`;
     if (context) user += `\n参考当前内容重写优化：${context}`;
     if (section === "services" || section === "advantages") user += "\n每行一条，3-5条。";
 
     const res = await fetch(DEEPSEEK_API, {
       method: "POST",
       headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
       body: JSON.stringify({
         model: "deepseek-chat",
         messages: [{ role: "system", content: system }, { role: "user", content: user }],
         temperature: 0.7,
         max_tokens: 1000,
       }),
     });
     if (!res.ok) return NextResponse.json({ error: "AI 生成失败" }, { status: 502 });
 
     const result = await res.json();
     const content = result.choices?.[0]?.message?.content;
     if (!content) return NextResponse.json({ error: "AI 返回为空" }, { status: 502 });
 
     if (section === "services" || section === "advantages") {
       const items = content.split("\n").map((s: string) => s.replace(/^\d+[.、]?\s*/, "").trim()).filter((s: string) => s.length > 5);
       return NextResponse.json({ content: items.length >= 3 ? items.slice(0, 5) : items });
     }
     const clean = content.split("\n")[0].trim();
     return NextResponse.json({ content: clean || content.trim() });
   } catch (error: any) {
     return NextResponse.json({ error: "服务器错误" }, { status: 500 });
   }
 }
