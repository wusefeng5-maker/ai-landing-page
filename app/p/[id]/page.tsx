import LandingPage, { LandingPageData } from "@/app/components/landing-page";
 import { getPage } from "@/app/lib/store";
 import { notFound } from "next/navigation";
 
 export default function PublicPage({ params }: { params: { id: string } }) {
   const page = getPage(params.id);
   if (!page) notFound();
 
   let data: LandingPageData;
   try {
     data = JSON.parse(page.data);
   } catch {
     notFound();
   }
 
   return <LandingPage data={data} themeKey={page.theme} />;
 }
