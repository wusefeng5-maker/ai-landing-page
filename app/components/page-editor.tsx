"use client";
 
 import { useState } from "react";
 import { LandingPageData } from "@/app/components/landing-page";
 
 interface Props {
   data: LandingPageData; pageId?: string; industry: string; theme: string;
   onSave: (data: LandingPageData, theme: string) => void; onClose: () => void;
 }
 
 const THEMES = [
   { key:"professional", label:"经典灰", colors:["#374151","#1f2937","#111827"] },
   { key:"ocean", label:"海洋蓝", colors:["#1e3a5f","#1e40af","#0891b2"] },
   { key:"warm", label:"暖阳橙", colors:["#9a3412","#ea580c","#be123c"] },
   { key:"rose", label:"浪漫粉", colors:["#9f1239","#e11d48","#7c3aed"] },
   { key:"forest", label:"森林绿", colors:["#14532d","#047857","#0f766e"] },
 ];
 
 export default function PageEditor({ data:init, pageId, industry, theme:initTheme, onSave, onClose }: Props) {
   const [ht, setHt] = useState(init.heroTitle);
   const [hs, setHs] = useState(init.heroSubtitle);
   const [cta, setCta] = useState(init.cta);
   const [svc, setSvc] = useState(init.services);
   const [adv, setAdv] = useState(init.advantages);
   const [hb, setHb] = useState(init.heroBgImage || "");
   const [pb, setPb] = useState(init.pageBgImage || "");
   const [st, setSt] = useState(init.sectionTitles || {});
   const [theme, setTheme] = useState(initTheme);
   const [custom, setCustom] = useState<{title:string;content:string}[]>(init.customSections || []);
   const [gal, setGal] = useState<{title:string;images:{url:string;caption?:string}[]}[]>(init.gallerySections || []);
   const [ff, setFf] = useState<{label:string;type:string;required:boolean}[]>(init.formFields?.length ? init.formFields : [{label:"姓名",type:"text",required:true},{label:"电话",type:"tel",required:true},{label:"留言",type:"textarea",required:false}]);
   const [gen, setGen] = useState("");
   const [aiPrompt, setAiPrompt] = useState("");
   const [aiResult, setAiResult] = useState("");
   const [aiLoading, setAiLoading] = useState(false);
 
   const upImg = (e: React.ChangeEvent<HTMLInputElement>, s: (v:string)=>void) => {
     const f = e.target.files?.[0]; if (!f) return;
     const r = new FileReader();
     r.onload = () => {
       const img = new Image();
       img.onload = () => {
         const mx = 800; let w = img.width, h = img.height;
         if (w > mx || h > mx) { const ra = Math.min(mx/w, mx/h); w = Math.round(w*ra); h = Math.round(h*ra); }
         const c = document.createElement("canvas"); c.width = w; c.height = h;
         const ctx = c.getContext("2d");
         if (ctx) { ctx.drawImage(img, 0, 0, w, h); s(c.toDataURL("image/jpeg", 0.7)); }
         else { s(r.result as string); }
       };
       img.onerror = () => s(r.result as string);
       img.src = r.result as string;
     };
     r.readAsDataURL(f);
   };
 
   const upGal = (e: React.ChangeEvent<HTMLInputElement>, si: number) => {
     const files = Array.from(e.target.files || []);
     Promise.all(files.map(f => new Promise<string>(resolve => {
       const r = new FileReader();
       r.onload = ev => resolve(ev.target?.result as string);
       r.readAsDataURL(f);
     }))).then(urls => {
       const n = [...gal]; n[si] = { ...n[si], images: [...n[si].images, ...urls.map(u => ({ url: u }))] }; setGal(n);
     });
   };
 
   const genSec = async (sec: string) => {
     setGen(sec);
     try {
       const res = await fetch("/api/generate-section", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ section:sec, business:industry }) });
       const result = await res.json(); if (!res.ok) return;
       if (Array.isArray(result.content)) {
         if (sec==="services") setSvc(result.content); else setAdv(result.content);
       } else {
         if (sec==="heroTitle") setHt(result.content); else if (sec==="heroSubtitle") setHs(result.content); else if (sec==="cta") setCta(result.content);
       }
     } catch {}
     setGen("");
   };
 
   const save = async () => {
     const nd: LandingPageData = {
       heroTitle:ht, heroSubtitle:hs, services:svc, advantages:adv, cta,
       heroBgImage:hb||undefined, pageBgImage:pb||undefined,
       sectionTitles:st, customSections:custom.filter(x=>x.title.trim()||x.content.trim()),
       gallerySections:gal.length?gal:undefined, formFields:ff,
     };
     if (pageId) try { await fetch("/api/pages/"+pageId, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ data:nd, industry, theme }) }); } catch {}
     onSave(nd, theme);
   };
 
   const GBtn = ({ s }: { s: string }) => (
     <button type="button" onClick={()=>genSec(s)} disabled={gen===s}
       className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50 shrink-0">{gen===s ? "生成中..." : "AI 生成"}</button>
   );
 
   return (
     <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
       <div className="max-w-3xl mx-auto px-6 py-10">
         <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-bold text-gray-900">编辑页面</h2>
           <div className="flex gap-3">
             <button onClick={save} className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800">保存修改</button>
             <button onClick={onClose} className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">取消</button>
           </div>
         </div>
 
         {/* Theme */}
         <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
           <h3 className="font-semibold text-gray-900 mb-4">配色风格</h3>
           <div className="flex gap-3">
             {THEMES.map(t => (
               <button key={t.key} onClick={()=>setTheme(t.key)}
                 className={"flex-1 rounded-xl border-2 p-3 transition-all "+(theme===t.key?"border-gray-900 bg-white shadow-sm":"border-gray-200 bg-white hover:border-gray-300")}>
                 <div className="flex gap-1 justify-center mb-1.5">{t.colors.map((c,i)=><div key={i} className="w-4 h-4 rounded-full" style={{backgroundColor:c}}/>)}</div>
                 <span className={"text-xs font-medium "+(theme===t.key?"text-gray-900":"text-gray-500")}>{t.label}</span>
               </button>
             ))}
           </div>
         </div>
 
         {/* Hero */}
         <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
           <h3 className="font-semibold text-gray-900 mb-4">Hero 区 <GBtn s="heroTitle" /></h3>
           <label className="text-xs font-medium text-gray-500 block mb-1">大标题</label>
           <input value={ht} onChange={e=>setHt(e.target.value)} className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 mb-3 text-base" />
           <label className="text-xs font-medium text-gray-500 block mb-1">副标题 <GBtn s="heroSubtitle" /></label>
           <textarea rows={2} value={hs} onChange={e=>setHs(e.target.value)} className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 mb-3 resize-none" />
           <label className="text-xs font-medium text-gray-500 block mb-1">CTA 按钮 <GBtn s="cta" /></label>
           <input value={cta} onChange={e=>setCta(e.target.value)} className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 mb-3 text-base" />
           <label className="text-xs font-medium text-gray-500 block mb-1">Hero 背景图</label>
           <input type="file" accept="image/*" onChange={e=>upImg(e,setHb)} className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
           {hb && <div className="mt-2"><img src={hb} alt="" className="h-16 rounded-lg object-cover border" /><button onClick={()=>setHb("")} className="text-xs text-red-500 mt-1">清除</button></div>}
         </div>
 
         {/* Services */}
         <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
           <h3 className="font-semibold text-gray-900 mb-4">服务项目 <GBtn s="services" /></h3>
           <input value={st.services||""} onChange={e=>setSt(p=>({...p,services:e.target.value}))} placeholder="模块标题" className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 mb-3 text-base" />
           {svc.map((s,i)=>(
             <div key={i} className="flex gap-2 mb-2">
               <input value={s} onChange={e=>{const n=[...svc]; n[i]=e.target.value; setSvc(n);}} className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 text-sm" />
               <button onClick={()=>setSvc(svc.filter((_,j)=>j!==i))} className="text-xs text-red-500 shrink-0">删除</button>
             </div>
           ))}
           <button onClick={()=>setSvc([...svc,""])} className="text-xs text-blue-600">+ 添加</button>
         </div>
 
         {/* Advantages */}
         <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
           <h3 className="font-semibold text-gray-900 mb-4">优势模块 <GBtn s="advantages" /></h3>
           <input value={st.advantages||""} onChange={e=>setSt(p=>({...p,advantages:e.target.value}))} placeholder="模块标题" className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 mb-3 text-base" />
           {adv.map((a,i)=>(
             <div key={i} className="flex gap-2 mb-2">
               <input value={a} onChange={e=>{const n=[...adv]; n[i]=e.target.value; setAdv(n);}} className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 text-sm" />
               <button onClick={()=>setAdv(adv.filter((_,j)=>j!==i))} className="text-xs text-red-500 shrink-0">删除</button>
             </div>
           ))}
           <button onClick={()=>setAdv([...adv,""])} className="text-xs text-blue-600">+ 添加</button>
         </div>
 
         {/* Custom Sections */}
         <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
           <h3 className="font-semibold text-gray-900 mb-4">自定义模块 <span className="text-xs font-normal text-gray-400">自由添加任意标题+内容段落</span></h3>
           {custom.map((sec,i)=>(
             <div key={i} className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-xs text-gray-500">模块 {i+1}</span>
                 <button onClick={()=>setCustom(custom.filter((_,j)=>j!==i))} className="text-xs text-red-500">删除</button>
               </div>
               <input value={sec.title} onChange={e=>{const n=[...custom]; n[i]={...n[i],title:e.target.value}; setCustom(n);}} placeholder="模块标题（可选）" className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 mb-2 text-sm font-medium" />
               <textarea rows={3} value={sec.content} onChange={e=>{const n=[...custom]; n[i]={...n[i],content:e.target.value}; setCustom(n);}} placeholder="在此输入内容..." className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 text-sm resize-none" />
             </div>
           ))}
           <button onClick={()=>setCustom([...custom,{title:"",content:""}])} className="text-xs text-blue-600">+ 添加自定义模块</button>
         </div>
 
         {/* Gallery */}
         <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
           <h3 className="font-semibold text-gray-900 mb-4">作品图集 <span className="text-xs font-normal text-gray-400">多组图集，每图可加说明</span></h3>
           {gal.length===0 && <p className="text-xs text-gray-400 mb-4">尚未添加图集</p>}
           {gal.map((sec,si)=>(
             <div key={si} className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
               <div className="flex justify-between items-center mb-3">
                 <span className="text-xs font-medium text-gray-500">图集 {si+1}</span>
                 <button onClick={()=>setGal(gal.filter((_,j)=>j!==si))} className="text-xs text-red-500">删除此图集</button>
               </div>
               <input value={sec.title} onChange={e=>{const n=[...gal]; n[si]={...n[si],title:e.target.value}; setGal(n);}} placeholder="图集标题" className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 mb-3 text-sm" />
               <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 mb-3">
                 {sec.images.map((img,ii)=>(
                   <div key={ii} className="relative group">
                     <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 mb-1"><img src={img.url} alt="" className="w-full h-full object-cover" /></div>
                     <input value={img.caption||""} onChange={e=>{const n=[...gal]; n[si].images[ii]={...n[si].images[ii],caption:e.target.value}; setGal(n);}} placeholder="图片说明" className="block w-full text-xs border border-gray-100 rounded px-2 py-1 text-gray-600 mb-1" />
                     <button onClick={()=>{const n=[...gal]; n[si].images=n[si].images.filter((_,j)=>j!==ii); setGal(n);}} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100">x</button>
                   </div>
                 ))}
               </div>
               <input type="file" accept="image/*" multiple onChange={e=>upGal(e,si)} className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
             </div>
           ))}
           <button onClick={()=>setGal([...gal,{title:"",images:[]}])} className="text-xs text-blue-600">+ 添加新图集</button>
         </div>
 
         {/* Form Fields */}
         <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
           <h3 className="font-semibold text-gray-900 mb-4">自定义表单字段 <span className="text-xs font-normal text-gray-400">客户填写的表单项</span></h3>
           {ff.map((f,i)=>(
             <div key={i} className="flex gap-2 mb-2 items-start">
               <div className="flex-1">
                 <input value={f.label} onChange={e=>{const n=[...ff]; n[i]={...n[i],label:e.target.value}; setFf(n);}} placeholder="字段名称" className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 text-sm mb-1" />
                 <div className="flex gap-2">
                   <select value={f.type} onChange={e=>{const n=[...ff]; n[i]={...n[i],type:e.target.value}; setFf(n);}} className="text-xs rounded border border-gray-200 bg-white px-2 py-1 text-gray-600">
                     <option value="text">文本</option><option value="tel">电话</option><option value="email">邮箱</option><option value="textarea">多行文本</option>
                   </select>
                   <label className="text-xs text-gray-500 flex items-center gap-1">
                     <input type="checkbox" checked={f.required} onChange={e=>{const n=[...ff]; n[i]={...n[i],required:e.target.checked}; setFf(n);}} className="rounded" />必填
                   </label>
                 </div>
               </div>
               <button onClick={()=>setFf(ff.filter((_,j)=>j!==i))} className="text-xs text-red-500 mt-2 shrink-0">删除</button>
             </div>
           ))}
           <button onClick={()=>setFf([...ff,{label:"",type:"text",required:false}])} className="text-xs text-blue-600">+ 添加表单字段</button>
         </div>
 
         {/* Page BG */}
         <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
           <h3 className="font-semibold text-gray-900 mb-4">页面背景</h3>
           <label className="text-xs font-medium text-gray-500 block mb-1">整页背景图（建议浅色/半透明图片）</label>
           <input type="file" accept="image/*" onChange={e=>upImg(e,setPb)} className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
           {pb && <div className="mt-2"><img src={pb} alt="" className="h-16 rounded-lg object-cover border" /><button onClick={()=>setPb("")} className="text-xs text-red-500 mt-1">清除</button></div>}
         </div>
 
         {/* AI Writing Assistant */}
         <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
           <h3 className="font-semibold text-gray-900 mb-2">AI 写作助手</h3>
           <p className="text-xs text-gray-500 mb-4">描述您需要的内容，AI 将为您生成专业文案</p>
           <textarea rows={3} value={aiPrompt} onChange={e=>setAiPrompt(e.target.value)} placeholder="例如：写一段介绍美甲服务的文案，突出技术好、价格实惠"
             className="block w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-gray-900 text-sm resize-none mb-3" />
           <div className="flex gap-2 mb-3">
             <button onClick={async()=>{if(!aiPrompt.trim()) return; setAiLoading(true); try{const r=await fetch("/api/generate-section",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({section:"all",business:industry,context:aiPrompt})}); const j=await r.json(); setAiResult(j.content||j.error||"")}catch{}setAiLoading(false);}}
               disabled={aiLoading||!aiPrompt.trim()}
               className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50">{aiLoading ? "生成中..." : "AI 生成"}</button>
           </div>
           {aiResult && (
             <div className="bg-white rounded-lg border border-blue-200 p-4">
               <p className="text-sm text-gray-700 whitespace-pre-wrap mb-3">{aiResult}</p>
               <button onClick={()=>navigator.clipboard.writeText(aiResult)} className="text-xs text-blue-600 hover:text-blue-800 underline">复制结果</button>
             </div>
           )}
         </div>
 
         {/* Save Bar */}
         <div className="sticky bottom-0 bg-white border-t border-gray-100 py-4 -mx-6 px-6 mt-8">
           <div className="flex justify-end gap-3">
             <button onClick={onClose} className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">取消</button>
             <button onClick={save} className="rounded-lg bg-gray-900 px-8 py-2.5 text-sm font-semibold text-white hover:bg-gray-800">保存修改</button>
           </div>
         </div>
       </div>
     </div>
   );
 }
