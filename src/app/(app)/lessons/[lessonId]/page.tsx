import { notFound } from "next/navigation";
import { LessonEngine } from "@/components/learning/lesson-engine";
import { services } from "@/services";
export const instant = false;
export default async function Page({ params }: { params: Promise<{ lessonId: string }> }) { const { lessonId } = await params; const lesson = await services.courses.getLessonById(lessonId); if (!lesson || lesson.status !== "published") notFound(); return <LessonEngine lesson={lesson} />; }
