export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type LessonKind = "lesson" | "quiz" | "challenge";
export type LessonBlockType = "introduction" | "theory" | "code" | "explanation" | "exercise" | "quiz" | "callout" | "summary";
export interface LessonBlockBase { id: string; type: LessonBlockType; }
export interface IntroductionBlock extends LessonBlockBase { type: "introduction"; body: string; }
export interface TheoryBlock extends LessonBlockBase { type: "theory"; heading: string; body: string; }
export interface CodeBlock extends LessonBlockBase { type: "code"; language: string; filename: string; source: string; explanation: string; expectedOutput?: string; editable: boolean; }
export interface ExplanationBlock extends LessonBlockBase { type: "explanation"; heading: string; body: string; }
export interface ExerciseTestCase { id: string; label: string; includes: string[]; }
export interface ExerciseBlock extends LessonBlockBase { type: "exercise"; title: string; instructions: string; language: string; starterCode: string; expectedOutcome: string; testCases: ExerciseTestCase[]; hints: string[]; referenceSolution: string; }
export type QuizQuestionType = "single" | "multiple" | "trueFalse" | "output" | "error";
export interface LessonQuizQuestion { id: string; type: QuizQuestionType; prompt: string; options: string[]; answer: number[]; explanation: string; }
export interface QuizBlock extends LessonBlockBase { type: "quiz"; title: string; questions: LessonQuizQuestion[]; passingScore: number; }
export interface CalloutBlock extends LessonBlockBase { type: "callout"; tone: "note" | "warning" | "tip"; body: string; }
export interface SummaryBlock extends LessonBlockBase { type: "summary"; points: string[]; }
export type LessonBlock = IntroductionBlock | TheoryBlock | CodeBlock | ExplanationBlock | ExerciseBlock | QuizBlock | CalloutBlock | SummaryBlock;
export type LessonStatus = "published" | "draft";

export interface User { id: string; name: string; email: string; role: "learner"; avatar: string; }
export interface Lesson { id: string; version?: number; status?: LessonStatus; prerequisites?: string[]; furtherReading?: { label: string; url: string }[]; blocks?: LessonBlock[]; completionRequirements?: { exercise: boolean; quizScore: number }; courseId: string; moduleId: string; title: string; description: string; duration: number; kind: LessonKind; content: string; objectives: string[]; challengeId?: string; quizId?: string; }
export interface CourseModule { id: string; courseId: string; title: string; description: string; lessons: string[]; status?: LessonStatus; }
export interface Course { id: string; title: string; description: string; longDescription: string; difficulty: Difficulty; duration: string; tags: string[]; accent: string; modules: CourseModule[]; lessonIds: string[]; prerequisites: string[]; outcomes: string[]; }
export interface QuizQuestion { id: string; prompt: string; options: string[]; answer: number[]; explanation: string; multiple?: boolean; }
export interface Quiz { id: string; lessonId: string; title: string; questions: QuizQuestion[]; }
export interface Challenge { id: string; courseId: string; lessonId: string; title: string; description: string; language: string; starterCode: string; expectedOutput: string; hint: string; }
export interface UserProgress { userId: string; completedLessonIds: string[]; completedChallengeIds: string[]; streak: number; lastActive: string; currentLessonId?: string; exerciseAttempts?: Record<string, number>; exerciseResults?: Record<string, boolean>; quizResults?: Record<string, { score: number; passed: boolean; attempts: number }>; }
export interface TutorContext { courseId?: string; lessonId?: string; challengeId?: string; currentTopic?: string; objectives?: string[]; exerciseInstructions?: string; userProgress?: UserProgress; submittedCode?: string; feedback?: string; }
export interface TutorMessage { id: string; role: "user" | "assistant"; content: string; createdAt: string; }
export interface TutorResponse { message: TutorMessage; suggestions: string[]; }
export interface ServiceContracts { courses: CourseService; progress: ProgressService; tutor: TutorService; challenges: ChallengeService; exercises: ExerciseService; quizzes: QuizService; }
export interface CourseService { getCourses(): Promise<Course[]>; getCourseById(id: string): Promise<Course | null>; getLessonsForCourse(id: string): Promise<Lesson[]>; getLessonById(id: string): Promise<Lesson | null>; getQuizById(id: string): Promise<Quiz | null>; }
export interface ProgressService { getUserProgress(userId: string): Promise<UserProgress>; completeLesson(userId: string, lessonId: string): Promise<UserProgress>; completeChallenge(userId: string, challengeId: string): Promise<UserProgress>; recordExerciseAttempt(userId: string, exerciseId: string, passed: boolean): Promise<UserProgress>; recordQuizResult(userId: string, quizId: string, score: number, passed: boolean): Promise<UserProgress>; setCurrentLesson(userId: string, lessonId: string): Promise<UserProgress>; reset(userId: string): Promise<void>; }
export interface TutorService { sendMessage(message: string, context: TutorContext): Promise<TutorResponse>; }
export interface ChallengeService { getChallenges(): Promise<Challenge[]>; getChallengeById(id: string): Promise<Challenge | null>; evaluate(id: string, code: string): Promise<{ passed: boolean; output: string; tests: { name: string; passed: boolean }[] }>; }
export interface ExerciseService { evaluate(exercise: ExerciseBlock, code: string): Promise<{ passed: boolean; simulated: boolean; tests: { name: string; passed: boolean }[] }>; }
export interface CodeExecutionService { execute(input: { language: string; source: string; stdin?: string }): Promise<{ status: "completed" | "failed" | "not-configured"; stdout: string; stderr: string }>; }
export interface QuizService { submit(quiz: QuizBlock, answers: Record<string, number[]>): Promise<{ score: number; passed: boolean; results: { questionId: string; correct: boolean; explanation: string }[] }>; }
