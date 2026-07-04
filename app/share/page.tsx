 
 "use client";
 
 import { Suspense, useEffect, useState } from "react";
 import { useSearchParams, useRouter } from "next/navigation";
 import LandingPage, { LandingPageData } from "@/app/components/landing-page";
 
 function ShareContent() {
   const searchParams = useSearchParams();
   const router = useRouter();
   const [data, setData] = useState<LandingPageData | null>(null);
   const [theme, setTheme] = useState("professional");
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     const encoded = searchParams.get("d");
     const t = searchParams.get("t") || "professional";
 
     if (!encoded) {
       router.replace("/");
       return;
     }
 
     try {
       const decoded = atob(decodeURIComponent(encoded));
       const parsed = JSON.parse(decoded);
       setData({
         heroTitle: parsed?.heroTitle ?? "",
         heroSubtitle: parsed?.heroSubtitle ?? "",
         services: Array.isArray(parsed?.services) ? parsed.services : [],
         advantages: Array.isArray(parsed?.advantages) ? parsed.advantages : [],
         cta: parsed?.cta ?? "",
       });
       setTheme(t);
     } catch {
       router.replace("/");
     } finally {
       setLoading(false);
     }
   }, [searchParams, router]);
 
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
 
   if (!data) return null;
 
   return (
     <>
       {/* ── Shared page top bar ── */}
       <div className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
         <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
           <span className="text-sm font-medium text-gray-900">AI 落地页生成器</span>
           <a
             href="/"
             className="rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
           >
             立即创建
           </a>
         </div>
       </div>
       <LandingPage data={data} themeKey={theme} />
     </>
   );
 }
 
 export default function SharePage() {
   return (
     <Suspense fallback={
       <div className="flex min-h-screen items-center justify-center">
         <div className="flex items-center gap-2 text-gray-400">
           <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
           </svg>
           加载中...
         </div>
       </div>
     }>
       <ShareContent />
     </Suspense>
   );
 }
