"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LandingPage, { LandingPageData } from "@/app/components/landing-page";
import PageEditor from "@/app/components/page-editor";

function getSearchParam(key: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(key);
}

function decodeData(encoded: string): LandingPageData | null {
  try {
    const decoded = decodeURIComponent(atob(encoded));
    const parsed = JSON.parse(decoded);
    return {
      heroTitle: parsed?.heroTitle ?? "",
      heroSubtitle: parsed?.heroSubtitle ?? "",
      services: Array.isArray(parsed?.services) ? parsed.services : [],
      advantages: Array.isArray(parsed?.advantages) ? parsed.advantages : [],
      cta: parsed?.cta ?? "",
      heroBgImage: parsed?.heroBgImage,
      sectionTitles: parsed?.sectionTitles,
    };
  } catch { return null; }
}

function buildShareUrl(data: LandingPageData, theme: string): string {
  const payload = JSON.stringify(data);
  const encoded = btoa(encodeURIComponent(payload));
  return `${window.location.origin}/share?d=${encodeURIComponent(encoded)}&t=${theme}`;
}

function ResultContent() {
  const router = useRouter();
  const [data, setData] = useState<LandingPageData | null>(null);
  const [theme, setTheme] = useState("professional");
  const [pageId, setPageId] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [editMode, setEditMode] = useState(false);

  const loadData = useCallback(() => {
    const storedData = sessionStorage.getItem("landingPageData");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setData({
          heroTitle: parsed?.heroTitle ?? "",
          heroSubtitle: parsed?.heroSubtitle ?? "",
          services: Array.isArray(parsed?.services) ? parsed.services : [],
          advantages: Array.isArray(parsed?.advantages) ? parsed.advantages : [],
          cta: parsed?.cta ?? "",
          heroBgImage: parsed?.heroBgImage,
          sectionTitles: parsed?.sectionTitles,
        });
        setTheme(sessionStorage.getItem("landingPageTheme") || "professional");
        setStatus("ready");
        return;
      } catch {}
    }
    const encoded = getSearchParam("d");
    const t = getSearchParam("t") || "professional";
    const pid = getSearchParam("pageId") || "";
    if (encoded) {
      const safe = decodeData(encoded);
      if (safe && safe.heroTitle) {
        sessionStorage.setItem("landingPageData", JSON.stringify(safe));
        sessionStorage.setItem("landingPageTheme", t);
        setData(safe); setTheme(t);
        if (pid) setPageId(pid);
        setShareUrl(buildShareUrl(safe, t));
        setStatus("ready");
        return;
      }
    }
    setStatus("missing");
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if (status !== "missing") return;
    if (redirectCountdown <= 0) { window.location.href = "/"; return; }
    const timer = setTimeout(() => setRedirectCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [status, redirectCountdown]);

  if (status === "loading") {
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

  if (status === "missing") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="max-w-sm">
          <div className="text-4xl mb-4">😕</div>
          <h1 className="text-lg font-semibold text-gray-900 mb-2">没有找到页面数据</h1>
          <p className="text-sm text-gray-500 mb-2">请在首页选择行业并生成商业网站。</p>
          <p className="text-xs text-gray-400 mb-6">{redirectCountdown} 秒后自动返回首页...</p>
          <Link href="/" className="inline-flex items-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800">返回首页生成</Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  if (editMode) {
    return (
      <PageEditor
        data={data}
        pageId={pageId}
        industry={data.heroTitle || ""}
        theme={theme}
        onSave={(newData) => { setData(newData); setEditMode(false); }}
        onClose={() => setEditMode(false)}
      />
    );
  }

  return (
    <>
      <div className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <span className="text-xs text-gray-400"></span>
          <button onClick={() => setEditMode(true)}
            className="rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800">
            编辑文案
          </button>
        </div>
      </div>
      <LandingPage
        data={data}
        themeKey={theme}
        showAdminBar
        onRegenerate={() => router.push("/")}
        shareUrl={shareUrl}
        pageId={pageId}
      />
    </>
  );
}

export default function ResultPage() {
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
      <ResultContent />
    </Suspense>
  );
}