 
 "use client";
 
 import { useState } from "react";
 import { useRouter } from "next/navigation";
 
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
 
       const res = await fetch("/api/generate", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(body),
       });
 
       const result = await res.json();
 
       if (!res.ok) {
         throw new Error(result.error || "生成失败");
       }
 
       sessionStorage.setItem("landingPageData", JSON.stringify(result));
       sessionStorage.setItem("landingPageIndustry", industry);
       sessionStorage.setItem("landingPageTheme", theme);
       const descText = isCustom ? customDescription.trim() : industry;
       sessionStorage.setItem("landingPageDescription", descText);
       router.push("/result");
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
 
   return (
     <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
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
           <p className="text-xs text-gray-400 mb-2 text-center">试试这些示例：</p>
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
 
         {/* Input Section */}
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
 
           {/* Industry Dropdown */}
           <div>
             <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
               选择行业
             </label>
             <select
               id="industry"
               value={industry}
               onChange={(e) => {
                 setIndustry(e.target.value);
                 setError("");
               }}
               className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors appearance-none"
               disabled={loading}
             >
               <option value="">请选择行业...</option>
               {INDUSTRIES.map((ind) => (
                 <option key={ind} value={ind}>{ind}</option>
               ))}
             </select>
           </div>
 
           {/* Custom Description (only custom) */}
           {isCustom && (
             <div>
               <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                 业务描述
               </label>
               <textarea
                 id="description"
                 rows={5}
                 value={customDescription}
                 onChange={(e) => {
                   setCustomDescription(e.target.value);
                   setError("");
                 }}
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
 
         {/* Footer */}
         <p className="mt-8 text-center text-xs text-gray-400">
           基于 DeepSeek AI 技术 &middot; 1分钟生成可接单的商业官网 &middot; 免费使用
         </p>
       </div>
     </main>
   );
 }
