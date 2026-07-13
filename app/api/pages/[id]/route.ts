import { NextRequest, NextResponse } from "next/server";
 import { getPage, savePage } from "@/app/lib/store";
 
 export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
   const page = getPage(params.id);
   if (!page) {
     return NextResponse.json({ error: "页面不存在" }, { status: 404 });
   }
   return NextResponse.json({
     id: page.id,
     data: JSON.parse(page.data),
     industry: page.industry,
     theme: page.theme,
   });
 }
 
 export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
   try {
     const { data, industry, theme } = await request.json();
     const existing = getPage(params.id);
     if (!existing) {
       return NextResponse.json({ error: "页面不存在" }, { status: 404 });
     }
     savePage(
       params.id,
       JSON.stringify(data),
       industry || existing.industry,
       theme || existing.theme
     );
     return NextResponse.json({ success: true });
   } catch (error: any) {
     return NextResponse.json({ error: error.message }, { status: 500 });
   }
 }
