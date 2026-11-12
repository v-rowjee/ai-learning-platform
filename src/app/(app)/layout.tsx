import { AppShell } from "@/components/layout/app-shell";
import { Suspense } from "react";
export default function LearningLayout({ children }: { children: React.ReactNode }) { return <Suspense fallback={<div className="min-h-screen bg-[#f6f7fb]" />}>{<AppShell>{children}</AppShell>}</Suspense>; }
