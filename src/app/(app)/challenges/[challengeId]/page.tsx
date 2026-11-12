import { ChallengePage } from "@/components/learning/learning-ui";
export const instant = false;
export default async function Page({ params }: { params: Promise<{ challengeId: string }> }) { return <ChallengePage challengeId={(await params).challengeId} />; }
