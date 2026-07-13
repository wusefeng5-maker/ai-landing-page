"use client";
 
 import { useState } from "react";
 import { useRouter } from "next/navigation";
 import { EXAMPLE_DATA } from "@/app/data/examples";
 import type { LandingPageData } from "@/app/components/landing-page";
 
 const INDUSTRIES = [
   "宠物美容", "摄影工作室", "教培机构", "健身私教",
   "美甲美睫", "餐饮门店", "IT服务", "自定义",
 ];
 
 const THEMES_UI = [
   { key: "professional", label: "经典灰", colors: ["#374151", "#1f2937", "#111827"] },
   { key: "ocean", label: "海洋蓝", colors: ["#1e3a5f", "#1e40af", "#0891b2"] },
   { key: "warm", label: "暖阳橙", colors: ["#9a3412", "#ea580c", "#be123c"] },
 ];
 
 const QUICK_PROMPTS = [
   "高端宠物美容沙龙，提供宠物SPA和毛发护理服务",
   "专业儿童美术培训机构，3-12岁创意绘画课程",
   "独立摄影师，提供个人写真和商业摄影服务",
 ];
 
 const SHOWCASE_INDUSTRIES = [
   { key: "宠物美容", icon: "🐾" },
   { key: "摄影工作室", icon: "📸" },
   { key: "教培机构", icon: "📚" },
   { key: "健身私教", icon: "💪" },
   { key: "美甲美睫", icon: "💅" },
   { key: "餐饮门店", icon: "🍜" },
   { key: "IT服务", icon: "💻" },
 ];
 
 const FEATURES = [
   { icon: "🤖", title: "AI 智能生成", desc: "基于 DeepSeek 大模型，秒级生成专业商业文案" },
   { icon: "🎨", title: "多种风格", desc: "经典灰、海洋蓝、暖阳橙三种配色方案自由选择" },
   { icon: "🔗", title: "一键分享", desc: "生成即可复制分享链接，客户打开即看" },
   { icon: "📄", title: "导出 HTML", desc: "独立HTML文件，可直接上传服务器或发给客户" },
 ];
 
 export default function Home() {
   const [industry, setIndustry] = useState("");
   const [customDescription, setCustomDescription] = useState("");
   const [theme, setTheme] = useState("professional");
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const router = useRouter();
 
   const isCustom = industry === "自定义";
   const canGenerate = industry && (!isCustom || customDescription.trim());
 
 
   const handleGenerate = async () => {
     if (!canGenerate) return;
     setLoading(true);
     setError("");
 
     try {
       const body: Record<string, string> = { industry };
       if (isCustom && customDescription.trim()) {
         body.description = customDescription.trim();
       }
 
   const controller = new AbortController();
   const timeout = setTimeout(() => controller.abort(), 45000);
 
     const res = await fetch("/api/generate", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(body),
       signal: controller.signal,
     });
     clearTimeout(timeout);
 
       const result = await res.json();
 
       if (!res.ok) {
         throw new Error(result.error || "生成失败");
       }
 
       const descText = isCustom ? customDescription.trim() : industry;
       let pageId = "";
      try {
        const r2 = await fetch("/api/pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: result, industry, theme }),
        });
        const j2 = await r2.json();
        pageId = j2.id || "";
      } catch {}
      navigateWithData(result, industry, theme, descText, pageId);

     } catch (err: any) {
       setError(err.message || "网络异常，请稍后重试");
     } finally {
       setLoading(false);
     }
   };
 
   const handleKeyDown = (e: React.KeyboardEvent) => {
     if ((e.key === "Enter" && (e.metaKey || e.ctrlKey)) && canGenerate) {
       handleGenerate();
     }
   };
 
   const applyPrompt = (prompt: string) => {
     setIndustry("自定义");
     setCustomDescription(prompt);
   };
 
   const handlePreviewExample = (indKey: string) => {
     const data = EXAMPLE_DATA[indKey];
     if (data) {
       navigateWithData(data, indKey, theme, indKey);
     }
   };
 
   return (
     <main className="min-h-screen bg-white">
       {/* ── Hero / Form Section ── */}
       <div className="flex flex-col items-center justify-center px-6 pt-16 pb-12">
         <div className="w-full max-w-xl mx-auto">
           {/* Header */}
           <div className="text-center mb-10">
             <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
               AI 落地页生成器
             </h1>
             <p className="mt-4 text-lg text-gray-500 leading-relaxed">
               选择行业和风格，AI 自动生成可用于接单的商业网站
             </p>
           </div>
 
           {/* Quick Prompts */}
           <div className="mb-8">
             <p className="text-xs text-gray-400 mb-2 text-center">快速体验：</p>
             <div className="flex flex-wrap gap-2 justify-center">
               {QUICK_PROMPTS.map((prompt, i) => (
                 <button
                   key={i}
                   onClick={() => applyPrompt(prompt)}
                   className="text-xs rounded-full border border-gray-200 px-3 py-1.5 text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors"
                 >
                   {prompt.slice(0, 20)}...
                 </button>
               ))}
             </div>
           </div>
 
           {/* Form */}
           <div className="space-y-5 bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100">
             {/* Theme Selector */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-3">
                 选择配色风格
               </label>
               <div className="flex gap-3">
                 {THEMES_UI.map((t) => (
                   <button
                     key={t.key}
                     onClick={() => setTheme(t.key)}
                     className={`flex-1 rounded-xl border-2 p-3 transition-all ${
                       theme === t.key
                         ? "border-gray-900 bg-white shadow-sm"
                         : "border-gray-200 bg-white hover:border-gray-300"
                     }`}
                   >
                     <div className="flex gap-1 items-center justify-center mb-1.5">
                       {t.colors.map((color, ci) => (
                         <div key={ci} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                       ))}
                     </div>
                     <span className={`text-xs font-medium ${
                       theme === t.key ? "text-gray-900" : "text-gray-500"
                     }`}>
                       {t.label}
                     </span>
                   </button>
                 ))}
               </div>
             </div>
 
             {/* Industry */}
             <div>
               <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                 选择行业
               </label>
               <select
                 id="industry"
                 value={industry}
                 onChange={(e) => { setIndustry(e.target.value); setError(""); }}
                 className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors appearance-none"
                 disabled={loading}
               >
                 <option value="">请选择行业...</option>
                 {INDUSTRIES.map((ind) => (
                   <option key={ind} value={ind}>{ind}</option>
                 ))}
               </select>
             </div>
 
             {/* Custom Description */}
             {isCustom && (
               <div>
                 <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                   业务描述
                 </label>
                 <textarea
                   id="description"
                   rows={5}
                   value={customDescription}
                   onChange={(e) => { setCustomDescription(e.target.value); setError(""); }}
                   onKeyDown={handleKeyDown}
                   placeholder="请详细描述您的业务内容和特色，例如：我们是一家专注于高端宠物美容的工作室，提供..."
                   className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none transition-colors"
                   disabled={loading}
                 />
                 <p className="mt-1.5 text-xs text-gray-400">
                   按 Cmd+Enter 快速生成 &middot; {customDescription.length} 字
                 </p>
               </div>
             )}
 
             {/* Error */}
             {error && (
               <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                 {error}
                 <button onClick={() => setError("")} className="ml-2 underline">关闭</button>
               </div>
             )}
 
             {/* Generate Button */}
             <button
               onClick={handleGenerate}
               disabled={loading || !canGenerate}
               className="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               {loading ? (
                 <>
                   <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                   </svg>
                   正在生成您的商业网站...
                 </>
               ) : (
                 "生成商业官网"
               )}
             </button>
           </div>
         </div>
       </div>
 
       {/* ── Features ── */}
       <section className="border-t border-gray-100 bg-gray-50">
         <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
           <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
             {FEATURES.map((f, i) => (
               <div key={i} className="text-center">
                 <div className="text-2xl mb-2">{f.icon}</div>
                 <h3 className="text-sm font-semibold text-gray-900 mb-1">{f.title}</h3>
                 <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
               </div>
             ))}
           </div>
         </div>
       </section>
 
       {/* ── Industry Showcase ── */}
       <section className="border-t border-gray-100">
         <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
           <div className="text-center mb-10">
             <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
               行业案例展示
             </h2>
             <p className="mt-2 text-gray-500">
               无需API密钥，点击即可预览生成效果
             </p>
           </div>
           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
             {SHOWCASE_INDUSTRIES.map((item) => {
               const data = EXAMPLE_DATA[item.key];
               if (!data) return null;
               return (
                 <button
                   key={item.key}
                   onClick={() => handlePreviewExample(item.key)}
                   className="group text-left rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md hover:border-gray-300 transition-all"
                 >
                   <div className="flex items-center gap-3 mb-3">
                     <span className="text-xl">{item.icon}</span>
                     <span className="font-semibold text-gray-900 text-sm">{item.key}</span>
                   </div>
                   <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                     {data.heroTitle}
                   </p>
                   <span className="inline-flex items-center text-xs font-medium text-gray-400 group-hover:text-gray-900 transition-colors">
                     预览案例
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                       <path d="M5 12h14" /><polyline points="12 5 19 12 12 19" />
                     </svg>
                   </span>
                 </button>
               );
             })}
           </div>
         </div>
       </section>
 
       {/* ── Footer ── */}
       <footer className="border-t border-gray-100 bg-white">
         <div className="mx-auto max-w-6xl px-6 py-10 text-center">
           <p className="text-xs text-gray-400">
             基于 DeepSeek AI 技术 &middot; 1分钟生成可接单的商业官网 &middot; 免费使用
           </p>
         </div>
       </footer>
     </main>
   );
 }
   const navigateWithData = (data: LandingPageData, ind: string, t: string, desc: string, pageId?: string) => {
     sessionStorage.setItem("landingPageData", JSON.stringify(data));
     sessionStorage.setItem("landingPageIndustry", ind);
     sessionStorage.setItem("landingPageTheme", t);
     sessionStorage.setItem("landingPageDescription", desc);
     const encoded = encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(data))));
     // Use direct location change instead of router.push to avoid query param loss on static pages
     const url = pageId ? `/result?pageId=${pageId}&d=${encoded}&t=${t}` : `/result?d=${encoded}&t=${t}`; window.location.href = url;
   };
