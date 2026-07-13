"use client";

import { useState } from "react";

import Link from "next/link";

import QRCode from "qrcode";

export interface LandingPageData {

  heroTitle: string; heroSubtitle: string; services: string[]; advantages: string[]; cta: string;

  heroBgImage?: string;

  sectionTitles?: { services?: string; advantages?: string; cta?: string; contact?: string; gallery?: string };

  pageBgImage?: string;

  customSections?: { title: string; content: string }[];

  formFields?: { label: string; type: string; required: boolean }[];

  gallerySections?: { title: string; images: { url: string; caption?: string }[] }[];

}

export interface ThemeConfig {

  name: string; heroFrom: string; heroVia: string; heroTo: string; cardBorder: string;

  cardBg: string; sectionBg: string; ctaBg: string; checkmark: string;

  accentBg: string; accentText: string; accentHover: string;

}

export const THEMES: Record<string, ThemeConfig> = {

  professional: { name:"经典灰", heroFrom:"from-gray-900", heroVia:"via-gray-800", heroTo:"to-gray-900",

    cardBorder:"border-gray-200", cardBg:"bg-white", sectionBg:"bg-gray-50", ctaBg:"bg-gray-900",

    checkmark:"#16a34a", accentBg:"bg-white", accentText:"text-gray-900", accentHover:"hover:bg-gray-100" },

  ocean: { name:"海洋蓝", heroFrom:"from-blue-900", heroVia:"via-blue-800", heroTo:"to-cyan-900",

    cardBorder:"border-blue-200", cardBg:"bg-white", sectionBg:"bg-blue-50", ctaBg:"bg-blue-900",

    checkmark:"#2563eb", accentBg:"bg-blue-600", accentText:"text-white", accentHover:"hover:bg-blue-500" },

  rose: { name:"浪漫粉", heroFrom:"from-rose-800", heroVia:"via-pink-700", heroTo:"to-purple-800",

    cardBorder:"border-pink-200", cardBg:"bg-white", sectionBg:"bg-pink-50",

    ctaBg:"bg-rose-800", checkmark:"#e11d48",

    accentBg:"bg-rose-600", accentText:"text-white", accentHover:"hover:bg-rose-500" },

  forest: { name:"森林绿", heroFrom:"from-green-900", heroVia:"via-emerald-700", heroTo:"to-teal-800",

    cardBorder:"border-green-200", cardBg:"bg-white", sectionBg:"bg-green-50",

    ctaBg:"bg-green-900", checkmark:"#16a34a",

    accentBg:"bg-emerald-600", accentText:"text-white", accentHover:"hover:bg-emerald-500" },

  warm: { name:"暖阳橙", heroFrom:"from-amber-800", heroVia:"via-orange-700", heroTo:"to-rose-800",

    cardBorder:"border-orange-200", cardBg:"bg-white", sectionBg:"bg-orange-50", ctaBg:"bg-orange-700",

    checkmark:"#ea580c", accentBg:"bg-orange-600", accentText:"text-white", accentHover:"hover:bg-orange-500" },

};

interface Props {
  data: LandingPageData;
  themeKey: string;
  showAdminBar?: boolean;
  onRegenerate?: () => void;
  shareUrl?: string;
  pageId?: string;
}

function buildHtml(data: LandingPageData): string {

  const esc = (s: string) => s.replace(/</g,"&lt;").replace(/>/g,"&gt;");

  const svc = data.services.map((s,i) => '<div class="rounded-xl border border-gray-200 bg-white p-6"><div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 mb-4">'+(i+1).toString().padStart(2,"0")+'</div><p class="text-gray-900 font-medium">'+esc(s)+'</p></div>').join("");

  const adv = data.advantages.map(a => '<div class="flex items-start gap-4 rounded-xl bg-white border border-gray-200 p-6 shadow-sm"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><p class="text-gray-900">'+esc(a)+'</p></div>').join("");

  return '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>'+esc(data.heroTitle)+'</title><script src="https://cdn.tailwindcss.com"></script></head><body class="min-h-screen bg-white text-gray-900">'+

    '<section class="bg-gray-900 text-white py-24 px-6 text-center"><h1 class="text-5xl font-bold mb-6">'+esc(data.heroTitle)+'</h1><p class="text-xl text-gray-300 mb-10">'+esc(data.heroSubtitle)+'</p><a href="#" class="inline-block px-8 py-3 rounded-lg bg-white text-gray-900 font-semibold">'+esc(data.cta)+'</a></section>'+

    (data.services.length ? '<section class="py-20 px-6 border-b border-gray-100"><div class="max-w-6xl mx-auto text-center"><h2 class="text-3xl font-bold mb-4">鏈嶅姟椤圭洰</h2><p class="text-gray-500 mb-14">涓撲笟鏈嶅姟</p><div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">'+svc+'</div></div></section>' : '')+

    (data.advantages.length ? '<section class="py-20 px-6 bg-gray-50 border-b border-gray-100"><div class="max-w-6xl mx-auto text-center"><h2 class="text-3xl font-bold mb-4">涓轰粈涔堥€夋嫨鎴戜滑</h2><p class="text-gray-500 mb-14">鎴戜滑涓庝紬涓嶅悓</p><div class="grid gap-5 sm:grid-cols-2">'+adv+'</div></div></section>' : '')+

    '<section class="bg-gray-900 text-white py-20 px-6 text-center"><h2 class="text-4xl font-bold mb-4">鍑嗗濂藉紑濮嬩簡鍚楋紵</h2><p class="text-lg text-gray-300 mb-8">'+esc(data.heroSubtitle)+'</p><a href="#" class="inline-block px-8 py-3 rounded-lg bg-white text-gray-900 font-semibold">'+esc(data.cta)+'</a></section>'+

    '<footer class="py-8 text-center text-xs text-gray-400 border-t border-gray-100"></footer></body></html>';

}

export default function LandingPage({ data, themeKey, showAdminBar, onRegenerate, shareUrl, pageId }: Props) {

  const t = THEMES[themeKey] || THEMES.professional;

  const heroTitle = data.heroTitle || "娆㈣繋";

  const heroSubtitle = data.heroSubtitle || "";

  const ctaText = data.cta || "绔嬪嵆鍜ㄨ";

  const services = data.services ?? [];

  const advantages = data.advantages ?? [];

  const st = data.sectionTitles || {};

  const heroGrad = t.heroFrom + " " + t.heroVia + " " + t.heroTo;

  const heroBg = data.heroBgImage ? { backgroundImage: "url("+data.heroBgImage+")", backgroundSize: "cover" as const, backgroundPosition: "center" as const } : {};

  const pageBgStyle = data.pageBgImage ? { backgroundImage: "url("+data.pageBgImage+")", backgroundSize: "cover" as const, backgroundAttachment: "fixed" as const, backgroundPosition: "center" as const } : {};

  const [form, setForm] = useState({ name:"", phone:"", message:"" });

  const [formStatus, setFormStatus] = useState<"idle"|"submitting"|"success"|"error">("idle");

  const [formErr, setFormErr] = useState("");

  const [showInq, setShowInq] = useState(false);

  const [showFloatForm, setShowFloatForm] = useState(false);

  const floatFields = data.formFields?.length ? data.formFields : [{label:"濮撳悕",type:"text",required:true},{label:"鐢佃瘽",type:"tel",required:true},{label:"鐣欒█",type:"textarea",required:false}];

  const scrollToContact = () => document.getElementById("contact-form")?.scrollIntoView({ behavior:"smooth" });

  const publicUrl = pageId ? (typeof window !== "undefined" ? window.location.origin : "") + "/p/" + pageId : "";

  const submitForm = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) { setFormErr("璇峰～鍐欏鍚嶅拰鐢佃瘽"); return; }

    setFormStatus("submitting"); setFormErr("");

    try {

      const res = await fetch("/api/contact", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ ...form, business:heroTitle }) });

      if (!res.ok) throw new Error();

      const safe = heroTitle.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g,"_");

      const existing = JSON.parse(localStorage.getItem("contact_"+safe) || "[]");

      existing.push({ ...form, business:heroTitle, timestamp:new Date().toISOString() });

      localStorage.setItem("contact_"+safe, JSON.stringify(existing));

      setFormStatus("success"); setForm({ name:"", phone:"", message:"" });

    } catch { setFormErr("鎻愪氦澶辫触锛岃閲嶈瘯"); setFormStatus("error"); }

  };

  const getInquiries = () => {

    try { const safe = heroTitle.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g,"_"); return JSON.parse(localStorage.getItem("contact_"+safe) || "[]"); }

    catch { return []; }

  };

  const copyLink = () => { if(publicUrl && navigator.clipboard) navigator.clipboard.writeText(publicUrl); };

  const generateQR = async () => {

    if (!publicUrl) return;

    const url = await QRCode.toDataURL(publicUrl, { width: 300, margin: 2 });

    const w = window.open("", "_blank");

    if (w) { w.document.write('<img src="'+url+'" style="width:300px;height:300px;display:block;margin:20px auto" /><p style="text-align:center;font-family:sans-serif;color:#666">鎵竴鎵煡鐪嬪晢瀹堕〉闈?/p>'); w.document.title = "QR Code"; }

  };

  const downloadHtml = () => {

    const html = buildHtml(data); const b = new Blob([html],{type:"text/html;charset=utf-8"});

    const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href=u; a.download="page.html"; a.click(); URL.revokeObjectURL(u);

  };

  return (

    <div className="min-h-screen bg-white" style={pageBgStyle}>

      {showAdminBar && (

        <div className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-sm">

          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">

            <Link href="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">

              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>杩斿洖

            </Link>

            <div className="flex items-center gap-2">

              <button onClick={()=>setShowInq(!showInq)}

                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">&#x1F4CB; 鍜ㄨ ({getInquiries().length})</button>

              {publicUrl && <button onClick={()=>navigator.clipboard.writeText(publicUrl)}

                className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100">&#x1F517; 鍏紑閾炬帴</button>}

              {pageId && <button onClick={generateQR}

                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50">&#x1F4F7; 浜岀淮鐮?/button>}

              {shareUrl && <button onClick={copyLink} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50">澶嶅埗閾炬帴</button>}

              <button onClick={downloadHtml} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50">瀵煎嚭</button>

              {onRegenerate && <button onClick={onRegenerate} className="rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800">閲嶆柊鐢熸垚</button>}

            </div>

          </div>

          {showInq && (

            <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">

              <p className="text-sm font-semibold text-gray-900 mb-2">瀹㈡埛鍜ㄨ</p>

              {getInquiries().length===0 ? <p className="text-xs text-gray-400">鏆傛棤鍜ㄨ</p> :

                getInquiries().map((x:any,i:number) => (

                  <div key={i} className="text-xs bg-white rounded-lg border border-gray-200 p-3 mb-2"><b>{x.name}</b> <span className="text-gray-400">{x.phone}</span>{x.message && <p className="text-gray-500 mt-1">{x.message}</p>}</div>

                ))

              }

            </div>

          )}

        </div>

      )}

      <section className={"bg-gradient-to-br "+heroGrad+" text-white relative overflow-hidden"}>

        <div className="mx-auto max-w-4xl px-6 py-24 sm:py-32 lg:py-40 text-center">

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{heroTitle}</h1>

          <p className="mt-6 text-lg text-gray-300 sm:text-xl max-w-2xl mx-auto">{heroSubtitle}</p>

          <div className="mt-10">

            <button onClick={scrollToContact} className={"inline-flex items-center rounded-lg px-8 py-3 text-sm font-semibold shadow-sm transition-colors "+t.accentBg+" "+t.accentText+" "+t.accentHover}>{ctaText}</button>

          </div>

        </div>

      </section>

      {services.length>0 && (

        <section className="border-b border-gray-100" style={data.sectionBgColors?.services ? {backgroundColor:data.sectionBgColors.services} : {}}>

          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">

            <h2 className="text-2xl font-bold text-center text-gray-900 sm:text-3xl mb-4">{st.services || "鏈嶅姟椤圭洰"}</h2>

            <p className="text-center text-gray-500 mb-14">涓撲笟鏈嶅姟锛屽€煎緱淇¤禆</p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {services.map((s,i) => (

                <div key={i} className={"rounded-xl border p-6 hover:shadow-md transition-all "+t.cardBorder+" "+t.cardBg}>

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-600 mb-4">{(i+1).toString().padStart(2,"0")}</div>

                  <p className="text-gray-900 font-medium">{s}</p>

                </div>

              ))}

            </div>

          </div>

        </section>

      )}

      {advantages.length>0 && (

        <section className={"border-b border-gray-100 "+(data.sectionBgColors?.advantages ? "" : t.sectionBg)} style={data.sectionBgColors?.advantages ? {backgroundColor:data.sectionBgColors.advantages} : {}}>

          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">

            <h2 className="text-2xl font-bold text-center text-gray-900 sm:text-3xl mb-4">{st.advantages || "涓轰粈涔堥€夋嫨鎴戜滑"}</h2>

            <p className="text-center text-gray-500 mb-14">鎴戜滑涓庝紬涓嶅悓</p>

            <div className="grid gap-5 sm:grid-cols-2">

              {advantages.map((a,i) => (

                <div key={i} className="flex items-start gap-4 rounded-xl bg-white border border-gray-200 p-6 shadow-sm">

                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.checkmark} strokeWidth="2.5" className="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>

                  <p className="text-gray-900">{a}</p>

                </div>

              ))}

            </div>

          </div>

        </section>

      )}

      <section className={"text-white "+(data.sectionBgColors?.cta ? "" : t.ctaBg)} style={data.sectionBgColors?.cta ? {backgroundColor:data.sectionBgColors.cta} : {}}>

        <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28 text-center">

          <h2 className="text-3xl font-bold sm:text-4xl mb-4">{st.cta || "鍑嗗濂藉紑濮嬩簡鍚楋紵"}</h2>

          <p className="text-lg text-gray-300 max-w-xl mx-auto mb-8">{heroSubtitle}</p>

          <button onClick={scrollToContact} className={"rounded-lg px-8 py-3 text-sm font-semibold shadow-sm transition-colors "+t.accentBg+" "+t.accentText+" "+t.accentHover}>绔嬪嵆鍜ㄨ</button>

        </div>

      </section>

      {data.gallerySections?.map((sec, si) => (

        <section key={si} className="border-b border-gray-100" style={data.sectionBgColors?.customSections?.[si] ? {backgroundColor:data.sectionBgColors.customSections[si]} : {}}>

          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">

            {sec.title && <h2 className="text-2xl font-bold text-center text-gray-900 sm:text-3xl mb-10">{sec.title}</h2>}

            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">

              {sec.images.map((img, i) => (

                <div key={i} className="group cursor-pointer" onClick={()=>window.open(img.url,"_blank")}>

                  <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 mb-2">

                    <img src={img.url} alt={img.caption || ""} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />

                  </div>

                  {img.caption && <p className="text-sm text-gray-600 text-center">{img.caption}</p>}

                </div>

              ))}

            </div>

          </div>

        </section>

      ))}

      {data.customSections?.map((sec, i) => (

        <section key={i} className="border-b border-gray-100">

          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">

            {sec.title && <h2 className="text-2xl font-bold text-center text-gray-900 sm:text-3xl mb-6">{sec.title}</h2>}

            {sec.content && <div className="max-w-4xl mx-auto text-gray-700 leading-relaxed whitespace-pre-wrap">{sec.content}</div>}

          </div>

        </section>

      ))}

      <section id="contact-form" className="border-b border-gray-100" style={data.sectionBgColors?.contact ? {backgroundColor:data.sectionBgColors.contact} : {}}>

        <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">

          <h2 className="text-2xl font-bold text-center text-gray-900 sm:text-3xl mb-2">{st.contact || "鑱旂郴鎴戜滑"}</h2>

          <p className="text-center text-gray-500 mb-10">濉啓淇℃伅锛屾垜浠皢灏藉揩涓庢偍鑱旂郴</p>

          {formStatus==="success" ? (

            <div className="text-center py-12"><div className="text-5xl mb-4">&#x2705;</div><p className="text-lg font-semibold text-gray-900 mb-2">鎻愪氦鎴愬姛锛?/p><p className="text-sm text-gray-500 mb-6">鎴戜滑浼氬敖蹇笌鎮ㄥ彇寰楄仈绯汇€?/p><button onClick={()=>setFormStatus("idle")} className="text-sm text-gray-500 underline">缁х画鍜ㄨ</button></div>

          ) : (

            <form onSubmit={submitForm} className="space-y-5 max-w-lg mx-auto">

              <input type="text" placeholder="鎮ㄧ殑濮撳悕" value={form.name} required onChange={e=>setForm(p=>({...p,name:e.target.value}))}

                className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />

              <input type="tel" placeholder="鎮ㄧ殑鎵嬫満鍙? value={form.phone} required onChange={e=>setForm(p=>({...p,phone:e.target.value}))}

                className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />

              <textarea rows={3} placeholder="璇锋弿杩版偍鐨勯渶姹? value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))}

                className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none" />

              {formErr && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{formErr}</div>}

              <button type="submit" disabled={formStatus==="submitting"}

                className="w-full rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-50">{formStatus==="submitting" ? "鎻愪氦涓?.." : "鎻愪氦鍜ㄨ"}</button>

            </form>

          )}

        </div>

      </section>

      {/* Floating Contact Button */}

      <div className="fixed bottom-6 right-6 z-40">

        <button onClick={()=>setShowFloatForm(true)}

          className={"flex items-center gap-2 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 px-5 py-3 "+t.accentBg+" "+t.accentText}>

          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>

          绔嬪嵆鍜ㄨ

        </button>

      </div>

      {/* Floating Contact Modal */}

      {showFloatForm && (

        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={()=>setShowFloatForm(false)}>

          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto shadow-xl" onClick={e=>e.stopPropagation()}>

            <div className="flex justify-between items-center mb-4">

              <h3 className="text-lg font-semibold text-gray-900">绔嬪嵆鍜ㄨ</h3>

              <button onClick={()=>setShowFloatForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>

            </div>

            <form onSubmit={(e)=>{e.preventDefault(); const fd:Record<string,string>={}; const els=e.currentTarget.elements; for(let i=0;i<els.length;i++){const el=els[i] as HTMLInputElement; if(el.name) fd[el.name]=el.value;} fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...fd,business:heroTitle})}).then(()=>setShowFloatForm(false)).catch(()=>{})}} className="space-y-4">

              {floatFields.map((f, i) => (

                <div key={i}>

                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}{f.required && <span className="text-red-500">*</span>}</label>

                  {f.type === "textarea" ? (

                    <textarea rows={3} name={f.label} required={f.required} placeholder="璇疯緭鍏? className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 text-sm resize-none" />

                  ) : (

                    <input type={f.type} name={f.label} required={f.required} placeholder="璇疯緭鍏? className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 text-sm" />

                  )}

                </div>

              ))}

              <button type="submit" className="w-full rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800">鎻愪氦鍜ㄨ</button>

            </form>

          </div>

        </div>

      )}

      <footer className="border-t border-gray-100 bg-white">

        <div className="mx-auto max-w-6xl px-6 py-8 text-center">

          <p className="text-xs text-gray-400"></p>

        </div>

      </footer>

    </div>

  );

}

