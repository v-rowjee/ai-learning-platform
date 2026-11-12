"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Bot, ChevronLeft, ChevronRight, Code2, LayoutDashboard, Menu, Moon, Settings, Sun, UserRound, X } from "lucide-react";
import { demoUser, services } from "@/services";
import { useLearningStore } from "@/stores/use-learning-store";
import type { TutorMessage } from "@/types";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/courses", label: "Learning paths", icon: BookOpen },
  { href: "/challenges/challenge-3", label: "Challenges", icon: Code2, disabled: true },
  { href: "/playground", label: "AI playground", icon: Code2, disabled: true },
];

const sentenceCase = (value: string) => {
  const normalized = value.replace(/[-_]+/g, " ").trim().toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1).replace(/\bai\b/g, "AI");
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [dark, setDark] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [messages, setMessages] = useState<TutorMessage[]>([
    { id: "welcome", role: "assistant", content: "Hi Alex — I’m your learning copilot. Ask me about the page you’re on or your next step.", createdAt: new Date().toISOString() },
  ]);
  const [draft, setDraft] = useState("");
  const progress = useLearningStore((state) => state.progress);
  const hydrate = useLearningStore((state) => state.hydrate);

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);

  async function ask(text = draft) {
    if (!text.trim()) return;
    setMessages((current) => [...current, { id: crypto.randomUUID(), role: "user", content: text, createdAt: new Date().toISOString() }]);
    setDraft("");
    const result = await services.tutor.sendMessage(text, { currentTopic: pathname.split("/").filter(Boolean).join(" / ") || "dashboard", userProgress: progress ?? undefined });
    setMessages((current) => [...current, result.message]);
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-stone-950 dark:bg-[#181715] dark:text-stone-100">
      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-stone-200 bg-[#f7f6f2] p-4 transition-all dark:border-stone-800 dark:bg-[#181715] ${collapsed ? "w-[76px]" : "w-[248px]"} ${mobile ? "tranneutral-x-0" : "-tranneutral-x-full md:tranneutral-x-0"}`}>
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid size-8 place-items-center border border-stone-300 bg-stone-900 text-xs text-stone-50 dark:border-stone-700 dark:bg-stone-100 dark:text-stone-900">N/</span>
            {!collapsed && <span>nexora<span className="text-orange-700 dark:text-orange-300">/learn</span></span>}
          </Link>
          <button className="rounded-md p-2 text-stone-500 hover:bg-stone-200 md:hidden dark:hover:bg-stone-800" onClick={() => setMobile(false)} aria-label="Close menu"><X size={18} /></button>
        </div>
        <div className="mt-10 flex-1 space-y-1">
          <p className={`mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 ${collapsed ? "sr-only" : ""}`}>Workspace</p>
          {nav.map(({ href, label, icon: Icon, disabled }) => disabled ? <div key={href} aria-disabled="true" className="flex cursor-not-allowed items-center gap-3 border-l-2 border-transparent px-3 py-2.5 text-sm font-medium text-stone-300 dark:text-stone-600"><Icon size={17} />{!collapsed && label}</div> : <Link key={href} href={href} onClick={() => setMobile(false)} className={`flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm font-medium ${pathname.startsWith(href) ? "border-orange-600 bg-stone-200/70 text-stone-950 dark:border-orange-400 dark:bg-stone-800/70 dark:text-stone-50" : "border-transparent text-stone-500 hover:bg-stone-200/60 dark:hover:bg-stone-800"}`}><Icon size={17} />{!collapsed && label}</Link>)}
          <div className="my-6 border-t border-stone-200 dark:border-stone-800" />
          {[{ href: "/profile", label: "Profile", icon: UserRound }, { href: "/settings", label: "Settings", icon: Settings }].map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="flex items-center gap-3 border-l-2 border-transparent px-3 py-2.5 text-sm font-medium text-stone-500 hover:bg-stone-200/60 dark:hover:bg-stone-800"><Icon size={17} />{!collapsed && label}</Link>)}
        </div>
        {!collapsed && <div className="border-t border-stone-200 pt-4 dark:border-stone-800"><p className="text-xs font-semibold">Weekly goal</p><div className="mt-2 h-1 bg-stone-200 dark:bg-stone-800"><div className="h-1 w-3/4 bg-orange-600 dark:bg-orange-400" /></div><p className="mt-2 text-xs text-stone-500">3 of 4 sessions</p></div>}
        <button onClick={() => setCollapsed(!collapsed)} className="mt-3 hidden items-center justify-center rounded-md p-2 text-stone-400 hover:bg-stone-200 md:flex dark:hover:bg-stone-800" aria-label="Collapse sidebar">{collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}</button>
      </aside>
      <div className={`min-h-screen transition-[margin] ${collapsed ? "md:ml-[76px]" : "md:ml-[248px]"}`}>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-200 bg-[#f7f6f2] px-4 dark:border-stone-800 dark:bg-[#181715] md:px-8">
          <div className="flex items-center gap-3"><button onClick={() => setMobile(true)} className="rounded-md p-2 text-stone-500 hover:bg-stone-200 md:hidden dark:hover:bg-stone-800" aria-label="Open menu"><Menu size={20} /></button><span className="hidden text-sm text-stone-400 md:block">Workspace / <span className="text-stone-700 dark:text-stone-200">{sentenceCase(pathname === "/dashboard" ? "Overview" : pathname.split("/")[1] || "home")}</span></span></div>
          <div className="flex items-center gap-3"><button onClick={() => setDark(!dark)} className="rounded-md p-2 text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800" aria-label="Toggle theme">{dark ? <Sun size={18} /> : <Moon size={18} />}</button><button onClick={() => setTutorOpen(!tutorOpen)} className="flex items-center gap-2 border border-stone-300 bg-stone-900 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-700 dark:border-stone-700 dark:bg-stone-100 dark:text-stone-900" aria-expanded={tutorOpen}><Bot size={16} /><span className="hidden sm:inline">Ask tutor</span></button><div className="grid size-8 place-items-center border border-stone-300 bg-stone-200 text-[10px] font-bold text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200">{demoUser.avatar}</div></div>
        </header>
        <main className="mx-auto max-w-7xl p-5 md:p-8">{children}</main>
      </div>
      {tutorOpen && <div className="fixed bottom-5 right-5 z-50 flex w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden border border-stone-300 bg-[#f7f6f2] shadow-2xl dark:border-stone-700 dark:bg-[#211f1c]"><div className="flex items-center justify-between border-b border-stone-300 px-5 py-4 dark:border-stone-700"><div><p className="font-semibold">Learning copilot</p><p className="text-xs text-stone-500">Context-aware tutor</p></div><button onClick={() => setTutorOpen(false)} aria-label="Close tutor"><X size={18} /></button></div><div className="flex max-h-80 flex-col gap-3 overflow-y-auto p-4">{messages.map((message) => <div key={message.id} className={`max-w-[88%] border px-3 py-2 text-sm ${message.role === "user" ? "self-end border-orange-700 bg-orange-700 text-white" : "border-stone-200 bg-stone-200/70 text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"}`}>{message.content}</div>)}</div><div className="border-t border-stone-300 p-3 dark:border-stone-700"><div className="flex gap-2"><input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} placeholder="Ask about this topic…" className="min-w-0 flex-1 border border-stone-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-orange-600 dark:border-stone-700" /><button onClick={() => ask()} className="bg-stone-900 px-3 text-sm font-semibold text-white dark:bg-stone-100 dark:text-stone-900">Send</button></div></div></div>}
    </div>
  );
}
