import { QuizPage } from "@/components/learning/learning-ui";
export const instant = false;
export default async function Page({ params }: { params: Promise<{ quizId: string }> }) { return <QuizPage quizId={(await params).quizId} />; }
