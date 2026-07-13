 import { NextRequest, NextResponse } from "next/server";
 
 interface ContactSubmission {
   id: string;
   name: string;
   phone: string;
   message: string;
   business: string;
   timestamp: string;
 }
 
 // In-memory store (resets on server restart - for MVP)
 // In production, replace with a database
 const submissions: ContactSubmission[] = [];
 
 export async function POST(request: NextRequest) {
   try {
     const { name, phone, message, business } = await request.json();
 
     if (!name || !phone) {
       return NextResponse.json(
         { error: "姓名和电话为必填项" },
         { status: 400 }
       );
     }
 
     const submission: ContactSubmission = {
       id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
       name: name.trim(),
       phone: phone.trim(),
       message: (message || "").trim(),
       business: business || "未指定",
       timestamp: new Date().toISOString(),
     };
 
     submissions.push(submission);
 
     console.log(`[Contact] New lead: ${submission.name} (${submission.phone}) for ${submission.business}`);
 
     return NextResponse.json({
       success: true,
       id: submission.id,
       message: "咨询已提交，我们会尽快联系您！",
     });
   } catch (error: any) {
     console.error("Contact API error:", error);
     return NextResponse.json(
       { error: error?.message || "提交失败，请稍后重试" },
       { status: 500 }
     );
   }
 }
 
 export async function GET() {
   return NextResponse.json({ submissions });
 }
