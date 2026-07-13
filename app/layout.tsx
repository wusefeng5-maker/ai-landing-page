 import type { Metadata } from "next";
 import "./globals.css";
 
 export const metadata: Metadata = {
   title: "AI 落地页生成器 - 1分钟生成可接单的商业官网",
   description: "免费在线工具，选择行业输入描述，AI自动生成精美商业官网。支持宠物美容、摄影工作室、教培机构等行业，一键分享、导出HTML。",
   openGraph: {
     title: "AI 落地页生成器 - 1分钟生成商业官网",
     description: "免费在线工具，AI自动生成可用于接单的商业官网，支持分享链接和导出HTML文件。",
     type: "website",
     locale: "zh_CN",
   },
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
