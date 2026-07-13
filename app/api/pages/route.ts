import { NextRequest, NextResponse } from "next/server";
 import { savePage, generateId } from "@/app/lib/store";
 
 export async function POST(request: NextRequest) {
   try {
     const { data, industry, theme } = await request.json();
     if (!data) {
       return NextResponse.json({ error: "页面数据不能为空" }, { status: 400 });
     }
     const id = generateId();
     savePage(id, JSON.stringify(data), industry || "", theme || "professional");
     return NextResponse.json({ id });
   } catch (error: any) {
     return NextResponse.json({ error: error.message }, { status: 500 });
   }
 }
