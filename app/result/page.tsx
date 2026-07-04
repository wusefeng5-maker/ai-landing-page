 
 "use client";
 
 import { useEffect, useState } from "react";
 import { useRouter } from "next/navigation";
 import LandingPage, { LandingPageData } from "@/app/components/landing-page";
 
 export default function ResultPage() {
   const [data, setData] = useState<LandingPageData | null>(null);
   const [theme, setTheme] = useState("professional");
   const [shareUrl, setShareUrl] = useState("");
   const [loading, setLoading] = useState(true);
   const router = useRouter();
 
   useEffect(() => {
     const storedData = sessionStorage.getItem("landingPageData");
     const storedTheme = sessionStorage.getItem("landingPageTheme");
 
     if (!storedData) {
       router.replace("/");
       return;
     }
 
     try {
       const parsed = JSON.parse(storedData);
       const safe: LandingPageData = {
         heroTitle: parsed?.heroTitle ?? "",
         heroSubtitle: parsed?.heroSubtitle ?? "",
         services: Array.isArray(parsed?.services) ? parsed.services : [],
         advantages: Array.isArray(parsed?.advantages) ? parsed.advantages : [],
         cta: parsed?.cta ?? "",
       };
       setData(safe);
       const t = storedTheme || "professional";
       setTheme(t);
 
       // Build shareable URL
       const payload = JSON.stringify(safe);
       const encoded = encodeURIComponent(btoa(payload));
       const origin = window.location.origin;
       setShareUrl(`${origin}/share?d=${encoded}&t=${t}`);
     } catch {
       router.replace("/");
     } finally {
       setLoading(false);
     }
   }, [router]);
 
   const handleRegenerate = () => {
     router.push("/");
   };
 
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
     <LandingPage
       data={data}
       themeKey={theme}
       showAdminBar
       onRegenerate={handleRegenerate}
       shareUrl={shareUrl}
     />
   );
 }
