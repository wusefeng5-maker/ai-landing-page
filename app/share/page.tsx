"use client";
 
 import { useEffect, useState } from "react";
 import { useRouter } from "next/navigation";
 import LandingPage, { LandingPageData } from "@/app/components/landing-page";
 
 function decodeData(encoded: string): LandingPageData | null {
   try {
     const decoded = decodeURIComponent(atob(encoded));
     const parsed = JSON.parse(decoded);
     return {
       heroTitle: parsed?.heroTitle ?? "",
       heroSubtitle: parsed?.heroSubtitle ?? "",
       services: Array.isArray(parsed?.services) ? parsed.services : [],
       advantages: Array.isArray(parsed?.advantages) ? parsed.advantages : [],
       cta: parsed?.cta ?? "",
     };
   } catch {
     return null;
   }
 }
 
 export default function SharePage() {
   const router = useRouter();
   const [data, setData] = useState<LandingPageData | null>(null);
   const [theme, setTheme] = useState("professional");
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     const params = new URLSearchParams(window.location.search);
     const encoded = params.get("d");
     const t = params.get("t") || "professional";
 
     if (!encoded) {
       router.replace("/");
       return;
     }
 
     const safe = decodeData(encoded);
     if (safe && safe.heroTitle) {
       setData(safe);
       setTheme(t);
     }
     setLoading(false);
   }, [router]);
 
   if (loading) {
     return (
       <div className="flex min-h-screen items-center justify-center">
         <div className="flex items-center gap-2 text-gray-400">
           <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
           </svg>
           加载中...
         </div>
       </div>
     );
   }
 
   if (!data) {
     return (
       <div className="flex min-h-screen items-center justify-center px-6 text-center">
         <div className="max-w-sm">
           <div className="text-4xl mb-4">😕</div>
           <h1 className="text-lg font-semibold text-gray-900 mb-2">数据加载失败</h1>
           <p className="text-sm text-gray-500 mb-6">链接可能已失效，请重新生成。</p>
         </div>
       </div>
     );
   }
 
   return (
     <>
       <div className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
         <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
           <span className="text-sm font-medium text-gray-900">AI 落地页生成器</span>
           <a href="/" className="rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors">立即创建</a>
         </div>
       </div>
       <LandingPage data={data} themeKey={theme} />
     </>
   );
 }
