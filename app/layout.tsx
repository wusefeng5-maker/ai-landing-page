 import type { Metadata } from "next";
 import "./globals.css";
 
 export const metadata: Metadata = {
   title: "AI 落地页生成器",
   description: "输入行业描述，AI 自动生成可用于接单的商业官网",
 };
 
 export default function RootLayout({
   children,
 }: {
   children: React.ReactNode;
 }) {
   return (
     <html lang="zh-CN">
       <body className="min-h-screen bg-white text-gray-900">{children}</body>
     </html>
   );
 }
