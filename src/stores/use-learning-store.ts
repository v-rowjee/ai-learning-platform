"use client";
import { create } from "zustand";
import type { UserProgress } from "@/types";
import { demoUser } from "@/services";
import { services } from "@/services";
interface LearningState { progress: UserProgress | null; hydrate: () => Promise<void>; setCurrentLesson: (id: string) => Promise<void>; completeLesson: (id: string) => Promise<void>; completeChallenge: (id: string) => Promise<void>; reset: () => Promise<void>; }
export const useLearningStore = create<LearningState>((set) => ({ progress: null, async hydrate() { set({ progress: await services.progress.getUserProgress(demoUser.id) }); }, async setCurrentLesson(id) { set({ progress: await services.progress.setCurrentLesson(demoUser.id, id) }); }, async completeLesson(id) { set({ progress: await services.progress.completeLesson(demoUser.id, id) }); }, async completeChallenge(id) { set({ progress: await services.progress.completeChallenge(demoUser.id, id) }); }, async reset() { await services.progress.reset(demoUser.id); set({ progress: await services.progress.getUserProgress(demoUser.id) }); } }));
