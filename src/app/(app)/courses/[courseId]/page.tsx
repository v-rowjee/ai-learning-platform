import { CourseDetails } from "@/components/learning/learning-ui";
export const instant = false;
export default async function Page({ params }: { params: Promise<{ courseId: string }> }) { return <CourseDetails courseId={(await params).courseId} />; }
