"use client";
import Link from "next/link";
 
 // ─── Theme types & definitions ────────────────────────────
 
 export interface LandingPageData {
   heroTitle: string;
   heroSubtitle: string;
   services: string[];
   advantages: string[];
   cta: string;
  heroBgImage?: string;
  pageBgImage?: string;
  sectionTitles?: { services?: string; advantages?: string; cta?: string; contact?: string; gallery?: string };
  customSections?: { title: string; content: string }[];
  gallerySections?: { title: string; images: { url: string; caption?: string }[] }[];
  formFields?: { label: string; type: string; required: boolean }[];
  galleryImages?: string[];
 }
 
 export interface ThemeConfig {
   name: string;
   heroFrom: string;
   heroVia: string;
   heroTo: string;
   cardBorder: string;
   cardBg: string;
   sectionBg: string;
   ctaBg: string;
   checkmark: string;
   accentBg: string;
   accentText: string;
   accentHover: string;
 }
 
 export const THEMES: Record<string, ThemeConfig> = {
   professional: {
     name: "经典灰",
     heroFrom: "from-gray-900",
     heroVia: "via-gray-800",
     heroTo: "to-gray-900",
     cardBorder: "border-gray-200",
     cardBg: "bg-white",
     sectionBg: "bg-gray-50",
     ctaBg: "bg-gray-900",
     checkmark: "#16a34a",
     accentBg: "bg-white",
     accentText: "text-gray-900",
     accentHover: "hover:bg-gray-100",
   },
   rose: { name:"浪漫粉", heroFrom:"from-rose-800", heroVia:"via-pink-700", heroTo:"to-purple-800",
    cardBorder:"border-pink-200", cardBg:"bg-white", sectionBg:"bg-pink-50",
    ctaBg:"bg-rose-800", checkmark:"#e11d48",
    accentBg:"bg-rose-600", accentText:"text-white", accentHover:"hover:bg-rose-500" },
   forest: { name:"森林绿", heroFrom:"from-green-900", heroVia:"via-emerald-700", heroTo:"to-teal-800",
    cardBorder:"border-green-200", cardBg:"bg-white", sectionBg:"bg-green-50",
    ctaBg:"bg-green-900", checkmark:"#16a34a",
    accentBg:"bg-emerald-600", accentText:"text-white", accentHover:"hover:bg-emerald-500" },
   ocean: {
     name: "海洋蓝",
     heroFrom: "from-blue-900",
     heroVia: "via-blue-800",
     heroTo: "to-cyan-900",
     cardBorder: "border-blue-200",
     cardBg: "bg-white",
     sectionBg: "bg-blue-50",
     ctaBg: "bg-blue-900",
     checkmark: "#2563eb",
     accentBg: "bg-blue-600",
     accentText: "text-white",
     accentHover: "hover:bg-blue-500",
   },
   warm: {
     name: "暖阳橙",
     heroFrom: "from-amber-800",
     heroVia: "via-orange-700",
     heroTo: "to-rose-800",
     cardBorder: "border-orange-200",
     cardBg: "bg-white",
     sectionBg: "bg-orange-50",
     ctaBg: "bg-orange-700",
     checkmark: "#ea580c",
     accentBg: "bg-orange-600",
     accentText: "text-white",
     accentHover: "hover:bg-orange-500",
   },
 };
 
 // ─── LandingPage component ────────────────────────────────
 
 interface LandingPageProps {
   data: LandingPageData;
   themeKey: string;
   showAdminBar?: boolean;
   onRegenerate?: () => void;
   shareUrl?: string;
 }
 
 function buildHtml(data: LandingPageData): string {

  const e = (s: string) => s.replace(/</g,"&lt;").replace(/>/g,"&gt;");

  const svc = data.services.map((s,i) => '<div class="rounded-xl border border-gray-200 bg-white p-6"><div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 mb-4">'+(i+1).toString().padStart(2,"0")+'</div><p class="text-gray-900 font-medium">'+e(s)+'</p></div>').join("");

  const adv = data.advantages.map(a => '<div class="flex items-start gap-4 rounded-xl bg-white border border-gray-200 p-6 shadow-sm"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><p class="text-gray-900">'+e(a)+'</p></div>').join("");

  return '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>'+e(data.heroTitle)+'</title><script src="https://cdn.tailwindcss.com"></script></head><body class="min-h-screen bg-white text-gray-900">'+

    '<section class="bg-gray-900 text-white py-24 px-6 text-center"><h1 class="text-5xl font-bold mb-6">'+e(data.heroTitle)+'</h1><p class="text-xl text-gray-300 mb-10">'+e(data.heroSubtitle)+'</p><a href="#" class="inline-block px-8 py-3 rounded-lg bg-white text-gray-900 font-semibold">'+e(data.cta)+'</a></section>'+

    (data.services.length ? '<section class="py-20 px-6 border-b border-gray-100"><div class="max-w-6xl mx-auto"><h2 class="text-3xl font-bold text-center mb-4">服务项目</h2><div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">'+svc+'</div></div></section>' : '')+

    (data.advantages.length ? '<section class="py-20 px-6 bg-gray-50 border-b border-gray-100"><div class="max-w-6xl mx-auto"><h2 class="text-3xl font-bold text-center mb-4">为什么选择我们</h2><div class="grid gap-5 sm:grid-cols-2">'+adv+'</div></div></section>' : '')+

    '<section class="bg-gray-900 text-white py-20 px-6 text-center"><h2 class="text-4xl font-bold mb-4">准备好开始了吗？</h2><p class="text-lg text-gray-300 mb-8">'+e(data.heroSubtitle)+'</p><a href="#" class="inline-block px-8 py-3 rounded-lg bg-white text-gray-900 font-semibold">'+e(data.cta)+'</a></section>'+

    '<footer class="py-8 text-center text-xs text-gray-400 border-t border-gray-100"></footer></body></html>';

}



export default function LandingPage({
   data,
   themeKey,
   showAdminBar = false,
   onRegenerate,
   shareUrl,
 }: LandingPageProps) {
   const t = THEMES[themeKey] || THEMES.professional;
 
   const services = data.services ?? [];
   const advantages = data.advantages ?? [];
   const heroTitle = data.heroTitle || "欢迎";
   const heroSubtitle = data.heroSubtitle || "";
   const ctaText = data.cta || "立即咨询";
 
   const copyShareLink = () => {
     if (shareUrl && navigator.clipboard) {
       navigator.clipboard.writeText(shareUrl);
     }
   };
 
   const downloadAsHtml = () => {
     const html = buildStandaloneHtml(data, t);
     const blob = new Blob([html], { type: "text/html;charset=utf-8" });
     const url = URL.createObjectURL(blob);
     const a = document.createElement("a");
     a.href = url;
     a.download = "landing-page.html";
     a.click();
     URL.revokeObjectURL(url);
   };
 
   const heroGrad = `${t.heroFrom} ${t.heroVia} ${t.heroTo}`;
 
   return (
     <div className="min-h-screen bg-white">
       {/* ── Admin Bar ── */}
       {showAdminBar && (
         <div className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
           <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
             <div className="flex items-center gap-3">
               <Link
                 href="/"
                 className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
               >
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
                 </svg>
                 返回
               </Link>
             </div>
             <div className="flex items-center gap-2">
               <span className="hidden sm:block text-xs text-gray-400">
                 1分钟生成可用于接单的商业网站
               </span>
               {shareUrl && (
                 <button
                   onClick={copyShareLink}
                   className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                   title="复制分享链接"
                 >
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1">
                     <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                     <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                   </svg>
                   复制链接
                 </button>
               )}
               <button
                 onClick={downloadAsHtml}
                 className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                 title="下载 HTML"
               >
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1">
                   <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                   <polyline points="7 10 12 15 17 10" />
                   <line x1="12" y1="15" x2="12" y2="3" />
                 </svg>
                 导出
               </button>
               {onRegenerate && (
                 <button
                   onClick={onRegenerate}
                   className="rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                 >
                   重新生成
                 </button>
               )}
             </div>
           </div>
         </div>
       )}
 
       {/* ── Hero ── */}
       <section className={`bg-gradient-to-br ${heroGrad} text-white relative overflow-hidden`}>
         <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(ellipse_at_center,_#fff_0%,_transparent_70%)]" />
         <div className="mx-auto max-w-4xl px-6 py-24 sm:py-32 lg:py-40 text-center relative">
           <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
             {heroTitle}
           </h1>
           <p className="mt-6 text-lg leading-relaxed text-gray-300 sm:text-xl max-w-2xl mx-auto">
             {heroSubtitle}
           </p>
           <div className="mt-10 flex items-center justify-center gap-3">
             <button className={`inline-flex items-center rounded-lg ${t.accentBg} ${t.accentText} ${t.accentHover} px-8 py-3 text-sm font-semibold shadow-sm transition-colors`}>
               {ctaText}
             </button>
           </div>
         </div>
       </section>
 
       {/* ── Services ── */}
       {services.length > 0 && (
         <section className="border-b border-gray-100">
           <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
             <div className="text-center mb-14">
               <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                 服务项目
               </h2>
               <p className="mt-3 text-gray-500">
                 专业服务，值得信赖
               </p>
             </div>
             <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
               {services.map((service, index) => (
                 <div
                   key={index}
                   className={`group rounded-xl border ${t.cardBorder} ${t.cardBg} p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
                 >
                   <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-600 mb-4`}>
                     {String(index + 1).padStart(2, "0")}
                   </div>
                   <p className="text-gray-900 font-medium leading-relaxed">
                     {service}
                   </p>
                 </div>
               ))}
             </div>
           </div>
         </section>
       )}
 
       {/* ── Advantages ── */}
       {advantages.length > 0 && (
         <section className={`border-b border-gray-100 ${t.sectionBg}`}>
           <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
             <div className="text-center mb-14">
               <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                 为什么选择我们
               </h2>
               <p className="mt-3 text-gray-500">
                 我们与竞争对手的不同之处
               </p>
             </div>
             <div className="grid gap-5 sm:grid-cols-2">
               {advantages.map((advantage, index) => {
                 const isEven = index % 2 === 0;
                 return (
                   <div
                     key={index}
                     className={`flex items-start gap-4 rounded-xl ${isEven ? "bg-white border border-gray-200" : "bg-white border border-gray-200"} p-6 shadow-sm`}
                   >
                     <div className="flex-shrink-0 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: t.checkmark + "18" }}>
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.checkmark} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                         <polyline points="20 6 9 17 4 12" />
                       </svg>
                     </div>
                     <p className="text-gray-900 leading-relaxed">
                       {advantage}
                     </p>
                   </div>
                 );
               })}
             </div>
           </div>
         </section>
       )}
 
       {/* ── CTA ── */}
       <section className={`${t.ctaBg} text-white`}>
         <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28 text-center">
           <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
             准备好开始了吗？
           </h2>
           <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto">
             {heroSubtitle}
           </p>
           <div className="mt-8 flex items-center justify-center gap-4">
             <button className={`rounded-lg ${t.accentBg} ${t.accentText} ${t.accentHover} px-8 py-3 text-sm font-semibold shadow-sm transition-colors`}>
               生成我的商业官网
             </button>
             {onRegenerate && (
               <button
                 onClick={onRegenerate}
                 className="rounded-lg border border-gray-600 px-8 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
               >
                 重新生成
               </button>
             )}
           </div>
         </div>
       </section>
 
       {/* ── Footer ── */}
       <footer className="border-t border-gray-100 bg-white">
         <div className="mx-auto max-w-6xl px-6 py-8 text-center">
           <p className="text-xs text-gray-400">
             由 AI 落地页生成器自动生成 &middot; 基于 DeepSeek AI 技术
           </p>
         </div>
       </footer>
     </div>
   );
 }
 
 // ─── Standalone HTML export ────────────────────────────────
 
 function buildStandaloneHtml(data: LandingPageData, t: ThemeConfig): string {
   const s = (str: string) => str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
 
   return `<!DOCTYPE html>
 <html lang="zh-CN">
 <head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>${s(data.heroTitle)}</title>
 <script src="https://cdn.tailwindcss.com"></script>
 <style>
 body { -webkit-font-smoothing: antialiased; }
 .gradient-bg { background: linear-gradient(135deg, ${t.heroFrom.replace("from-", "#")} 0%, ${t.heroVia.replace("via-", "#")} 50%, ${t.heroTo.replace("to-", "#")} 100%); }
 </style>
 </head>
 <body class="min-h-screen bg-white text-gray-900">
   <!-- Hero -->
   <section class="gradient-bg text-white py-24 px-6 text-center">
     <h1 class="text-5xl font-bold tracking-tight mb-6">${s(data.heroTitle)}</h1>
     <p class="text-xl text-gray-300 max-w-2xl mx-auto mb-10">${s(data.heroSubtitle)}</p>
     <a class="inline-block px-8 py-3 rounded-lg bg-white text-gray-900 font-semibold shadow-sm hover:bg-gray-100" href="#">${s(data.cta)}</a>
   </section>
   ${data.services.length > 0 ? `
   <!-- Services -->
   <section class="py-20 px-6 border-b border-gray-100">
     <div class="max-w-6xl mx-auto">
       <h2 class="text-3xl font-bold text-center mb-4">服务项目</h2>
       <p class="text-gray-500 text-center mb-14">专业服务，值得信赖</p>
       <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
         ${data.services.map((svc, i) => `
         <div class="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow">
           <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 mb-4">${String(i+1).padStart(2,"0")}</div>
           <p class="text-gray-900 font-medium">${s(svc)}</p>
         </div>`).join("")}
       </div>
     </div>
   </section>` : ""}
   ${data.advantages.length > 0 ? `
   <!-- Advantages -->
   <section class="py-20 px-6 bg-gray-50 border-b border-gray-100">
     <div class="max-w-6xl mx-auto">
       <h2 class="text-3xl font-bold text-center mb-4">为什么选择我们</h2>
       <p class="text-gray-500 text-center mb-14">我们与众不同</p>
       <div class="grid gap-5 sm:grid-cols-2">
         ${data.advantages.map((adv) => `
         <div class="flex items-start gap-4 rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${t.checkmark}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
           <p class="text-gray-900">${s(adv)}</p>
         </div>`).join("")}
       </div>
     </div>
   </section>` : ""}
   <!-- CTA -->
   <section class="bg-gray-900 text-white py-20 px-6 text-center">
     <h2 class="text-4xl font-bold mb-4">准备好开始了吗？</h2>
     <p class="text-lg text-gray-300 mb-8">${s(data.heroSubtitle)}</p>
     <a href="#" class="inline-block px-8 py-3 rounded-lg bg-white text-gray-900 font-semibold shadow-sm hover:bg-gray-100">生成我的商业官网</a>
   </section>
   <footer class="py-8 text-center text-xs text-gray-400 border-t border-gray-100">
     由 AI 落地页生成器自动生成 &middot; 基于 DeepSeek AI 技术
   </footer>
 </body>
 </html>`;
 }
