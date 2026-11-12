import type { Course, CourseModule, Lesson, LessonBlock, LessonQuizQuestion } from "@/types";

const courseId = "course-1";
const moduleTitles = [
  "Connect to an AI model",
  "Integrate AI into applications",
  "Control AI responses",
  "Rate limits and provider routing",
  "Build a real AI feature",
] as const;

type LessonContent = {
  title: string;
  description: string;
  duration: number;
  objectives: string[];
  language: "python" | "typescript";
  filename: string;
  example: string;
  explanation: string;
  expected: string;
  exercise: string;
  starter: string;
  outcome: string;
  tests: { label: string; includes: string[] }[];
  hints: string[];
  solution: string;
  questions: { prompt: string; options: string[]; answer: number[]; explanation: string }[];
  reading?: { label: string; url: string }[];
};

const content: LessonContent[] = [
  {
    title: "Understanding AI providers",
    description: "Choose a provider and deployment model for a product requirement without assuming that an API-compatible interface means identical models, terms, or availability.",
    duration: 12,
    objectives: ["Compare hosted and local inference", "Separate open weights from open-source software", "Find current provider quotas and terms"],
    language: "typescript", filename: "provider-options.ts",
    example: `type ProviderOption = { name: string; hosted: boolean; compatible: boolean };\n\nconst options: ProviderOption[] = [\n  { name: "OpenAI", hosted: true, compatible: true },\n  { name: "Anthropic", hosted: true, compatible: false },\n  { name: "Google Gemini", hosted: true, compatible: false },\n  { name: "Groq", hosted: true, compatible: true },\n  { name: "Ollama", hosted: false, compatible: true },\n];\n\nconst hosted = options.filter((provider) => provider.hosted);`,
    explanation: "OpenAI, Anthropic, and Gemini are managed commercial APIs; Groq is hosted inference with a compatible client interface; Ollama can serve downloaded open-weight models locally. Open weights do not automatically make the training data, license, or surrounding software open source. Choose hosted APIs for managed operations and local models when local control justifies hardware and maintenance. Free tiers have quotas that bound shared capacity; check each provider's current docs. Compatibility is a protocol choice, not identical features or terms.",
    expected: "A shortlist that matches deployment, model, privacy, and operational needs.",
    exercise: "Complete a provider selector that returns only hosted options and keeps local runtimes separate.",
    starter: `type ProviderOption = { name: string; hosted: boolean };\nconst providers: ProviderOption[] = [\n  { name: "Groq", hosted: true },\n  { name: "Ollama", hosted: false },\n];\n\nexport function hostedProviders() {\n  return providers.filter((provider) => ______);\n}`,
    outcome: "Return Groq and exclude Ollama from the hosted provider list.",
    tests: [{ label: "Filters on the hosted flag", includes: ["filter", "hosted"] }, { label: "Returns the filtered providers", includes: ["return providers"] }],
    hints: ["Array.filter keeps values whose callback returns true.", "Read provider.hosted inside the callback."],
    solution: `type ProviderOption = { name: string; hosted: boolean };\nconst providers: ProviderOption[] = [\n  { name: "Groq", hosted: true },\n  { name: "Ollama", hosted: false },\n];\n\nexport function hostedProviders() {\n  return providers.filter((provider) => provider.hosted);\n}`,
    questions: [
      { prompt: "Which option runs model inference on your own machine?", options: ["A hosted API", "Ollama with a local model", "An API key in a browser"], answer: [1], explanation: "Ollama can run open-weight models locally; the model download and local compute still have requirements." },
      { prompt: "What does an OpenAI-compatible API tell you?", options: ["All models and terms are identical", "The service accepts a compatible request format", "The service has unlimited free access"], answer: [1], explanation: "Protocol compatibility helps reuse clients, but provider features, model IDs, quotas, and terms still differ." },
    ],
    reading: [
      { label: "OpenAI docs", url: "https://platform.openai.com/docs/overview" },
      { label: "Anthropic docs", url: "https://docs.anthropic.com/en/home" },
      { label: "Gemini API docs", url: "https://ai.google.dev/gemini-api/docs" },
      { label: "Groq docs", url: "https://console.groq.com/docs/overview" },
      { label: "Ollama docs", url: "https://docs.ollama.com/" },
    ],
  },
  {
    title: "Your first Groq API request",
    description: "Install the Groq Python SDK, keep the API key in an environment variable, and make a chat completion request. The lesson uses simulated checks and never sends a request to a provider.",
    duration: 16,
    objectives: ["Install the Groq SDK", "Load credentials from the environment", "Read a chat completion safely"],
    language: "python", filename: "first_request.py",
    example: `import os\nfrom groq import Groq\n\nclient = Groq(api_key=os.environ["GROQ_API_KEY"])\n\nresponse = client.chat.completions.create(\n    model=os.getenv("GROQ_MODEL", "openai/gpt-oss-20b"),\n    messages=[\n        {"role": "user", "content": "Explain APIs in one sentence"}\n    ],\n)\n\nprint(response.choices[0].message.content)`,
    explanation: "GROQ_API_KEY is read by server-side Python; model selects a provider model; messages carry role and content; choices contains returned completions. Free tiers have quotas because provider capacity and account policies are bounded—check current limits in provider docs.",
    expected: "A completion's text is printed; credentials remain outside source code.",
    exercise: "Modify the user message to request three programming tips and print the returned content.",
    starter: `import os\nfrom groq import Groq\n\nclient = Groq(api_key=os.environ["GROQ_API_KEY"])\nresponse = client.chat.completions.create(\n    model=os.getenv("GROQ_MODEL", "openai/gpt-oss-20b"),\n    messages=[{"role": "user", "content": "______"}],\n)\nprint(response.choices[0].message.content)`,
    outcome: "Request three programming tips and read the response content.",
    tests: [{ label: "Asks for three programming tips", includes: ["three", "programming tips"] }, { label: "Reads the response content", includes: ["choices[0]", "message.content"] }],
    hints: ["Keep the user role and change only the content text.", "The content is at choices[0].message.content."],
    solution: `import os\nfrom groq import Groq\n\nclient = Groq(api_key=os.environ["GROQ_API_KEY"])\nresponse = client.chat.completions.create(\n    model=os.getenv("GROQ_MODEL", "openai/gpt-oss-20b"),\n    messages=[{"role": "user", "content": "Give me three programming tips"}],\n)\nprint(response.choices[0].message.content)`,
    questions: [
      { prompt: "Where should GROQ_API_KEY be stored?", options: ["In a committed Python file", "In a server environment variable", "In a browser component"], answer: [1], explanation: "A server environment variable keeps the secret out of version control and browser bundles." },
      { prompt: "Where is the first response's text?", options: ["response.messages[0]", "response.choices[0].message.content", "response.content"], answer: [1], explanation: "The Groq chat completion response contains choices; each choice has a message with content." },
    ],
    reading: [{ label: "Groq Python quickstart", url: "https://console.groq.com/docs/quickstart" }, { label: "Groq rate limits", url: "https://console.groq.com/docs/rate-limits" }, { label: "Python venv", url: "https://docs.python.org/3/library/venv.html" }],
  },
  {
    title: "Making requests with HTTP",
    description: "Send the same chat completion over HTTP with Python requests. The request has an authorization header, JSON content type, model, and messages; status and response JSON must be handled deliberately.",
    duration: 15,
    objectives: ["Build a POST request", "Send bearer authentication safely", "Check and parse the response"],
    language: "python", filename: "http_request.py",
    example: `import os\nimport requests\n\nresponse = requests.post(\n    "https://api.groq.com/openai/v1/chat/completions",\n    headers={"Authorization": f"Bearer {os.environ['GROQ_API_KEY']}"},\n    json={"model": os.getenv("GROQ_MODEL", "openai/gpt-oss-20b"),\n          "messages": [{"role": "user", "content": "Hello"}]},\n    timeout=30,\n)\nresponse.raise_for_status()\nanswer = response.json()["choices"][0]["message"]["content"]`,
    explanation: "Authorization carries the bearer key over HTTPS; json serializes the request body; timeout bounds the wait; raise_for_status surfaces HTTP failures before parsing JSON.",
    expected: "A checked HTTP response and the assistant message content.",
    exercise: "Complete the request function and extract the first model answer from a checked response.",
    starter: `import requests\n\ndef ask(url: str, headers: dict, payload: dict) -> str:\n    response = requests.post(url, headers=headers, json=payload, timeout=30)\n    response.______()\n    data = response.json()\n    return data["choices"][0]["message"]["______"]`,
    outcome: "Raise on HTTP errors and return the completion content string.",
    tests: [{ label: "Checks the HTTP status", includes: ["raise_for_status"] }, { label: "Returns message content", includes: ["message", "content"] }],
    hints: ["Call raise_for_status before parsing the success payload.", "The nested key is message.content."],
    solution: `import requests\n\ndef ask(url: str, headers: dict, payload: dict) -> str:\n    response = requests.post(url, headers=headers, json=payload, timeout=30)\n    response.raise_for_status()\n    data = response.json()\n    return data["choices"][0]["message"]["content"]`,
    questions: [
      { prompt: "Which header format sends a bearer token?", options: ["Authorization: Bearer <key>", "Content-Type: <key>", "Model: <key>"], answer: [0], explanation: "Bearer credentials are sent in the Authorization header, over HTTPS, from trusted server code." },
      { prompt: "Why call raise_for_status before reading success data?", options: ["It retries forever", "It turns HTTP error statuses into exceptions", "It validates the model output"], answer: [1], explanation: "It prevents an error response body from being treated as the expected success shape." },
    ],
    reading: [{ label: "Groq API reference", url: "https://console.groq.com/docs/api-reference" }, { label: "Requests quickstart", url: "https://requests.readthedocs.io/en/latest/user/quickstart/" }],
  },
  {
    title: "Create a reusable Python function",
    description: "Put validation, the system instruction, and provider errors behind one ask_ai(prompt) function. Callers then use a small contract rather than duplicating transport details.",
    duration: 15,
    objectives: ["Validate prompt input", "Reuse one provider boundary", "Map provider errors to safe application errors"],
    language: "python", filename: "ai_service.py",
    example: `import groq\nfrom groq import Groq\n\nclient = Groq()  # reads GROQ_API_KEY from the environment\n\ndef ask_ai(prompt: str, system: str = "You are a helpful assistant.") -> str:\n    if not prompt.strip():\n        raise ValueError("Prompt is required")\n    try:\n        result = client.chat.completions.create(\n            model="openai/gpt-oss-20b",\n            messages=[{"role": "system", "content": system},\n                      {"role": "user", "content": prompt}],\n        )\n    except groq.APIConnectionError as error:\n        raise RuntimeError("AI service is unavailable") from error\n    return result.choices[0].message.content or ""`,
    explanation: "The optional system parameter makes behavior configurable; validation avoids an empty request; APIConnectionError is translated without returning provider details or credentials.",
    expected: "A nonempty prompt uses the configured instruction; connection failures become a safe application error.",
    exercise: "Add a configurable system instruction while preserving input validation and the user message.",
    starter: `def ask_ai(prompt: str, system: str = "You are a programming tutor.") -> str:\n    if not prompt.strip():\n        raise ValueError("Prompt is required")\n    messages = [\n        {"role": "system", "content": ______},\n        {"role": "user", "content": prompt},\n    ]\n    return call_model(messages)`,
    outcome: "The system message uses the function argument and the user prompt remains the user message.",
    tests: [{ label: "Uses the configurable system instruction", includes: ["role", "system", "content", "system"] }, { label: "Keeps the user prompt", includes: ["role", "user", "prompt"] }],
    hints: ["The system content should use the system parameter.", "Keep the user's input in a separate user-role message."],
    solution: `def ask_ai(prompt: str, system: str = "You are a programming tutor.") -> str:\n    if not prompt.strip():\n        raise ValueError("Prompt is required")\n    messages = [\n        {"role": "system", "content": system},\n        {"role": "user", "content": prompt},\n    ]\n    return call_model(messages)`,
    questions: [
      { prompt: "What should ask_ai do with an empty prompt?", options: ["Send it anyway", "Reject it before the provider call", "Print the API key"], answer: [1], explanation: "Boundary validation gives callers a predictable error and avoids unnecessary provider requests." },
      { prompt: "Why accept system as a parameter?", options: ["To make assistant behavior configurable", "To expose credentials", "To bypass provider validation"], answer: [0], explanation: "A parameter lets different callers provide an instruction without duplicating the API integration." },
    ],
    reading: [{ label: "Groq Python errors", url: "https://github.com/groq/groq-python#handling-errors" }],
  },
  {
    title: "Call an AI API from TypeScript",
    description: "Use the OpenAI JavaScript SDK against Groq's documented OpenAI-compatible base URL from server-only TypeScript. Keep the key in the server environment and accept only validated inputs.",
    duration: 17,
    objectives: ["Configure the compatible client", "Keep secrets server-side", "Return a narrow text result"],
    language: "typescript", filename: "ai-service.ts",
    example: `import OpenAI from "openai";\n\nconst client = new OpenAI({\n  apiKey: process.env.GROQ_API_KEY,\n  baseURL: "https://api.groq.com/openai/v1",\n});\n\nexport async function askAI(prompt: string) {\n  const response = await client.chat.completions.create({\n    model: process.env.GROQ_MODEL ?? "openai/gpt-oss-20b",\n    messages: [{ role: "user", content: prompt }],\n  });\n  return response.choices[0]?.message.content ?? "";\n}`,
    explanation: "The server-only module reads secrets from process.env. A browser bundle is public, so do not import this service into a client component. Check provider model IDs and compatibility in Groq's current docs.",
    expected: "A server function returns message text without exposing the key to browser code.",
    exercise: "Add a system message and reject a prompt when it is empty after trimming.",
    starter: `export async function askAI(prompt: string) {\n  if (!prompt.trim()) throw new Error("Prompt is required");\n  const response = await client.chat.completions.create({\n    model,\n    messages: [\n      { role: "system", content: "You are a programming tutor." },\n      { role: "user", content: prompt },\n    ],\n  });\n  return response.choices[0]?.message.content ?? "";\n}`,
    outcome: "Rejects blank text and sends a system instruction plus the user prompt.",
    tests: [{ label: "Validates the prompt", includes: ["prompt.trim", "throw"] }, { label: "Sends both message roles", includes: ["system", "user", "messages"] }],
    hints: ["Trim before checking whether the string is empty.", "Keep the system and user messages as distinct array entries."],
    solution: `export async function askAI(prompt: string) {\n  if (!prompt.trim()) throw new Error("Prompt is required");\n  const response = await client.chat.completions.create({\n    model,\n    messages: [\n      { role: "system", content: "You are a programming tutor." },\n      { role: "user", content: prompt },\n    ],\n  });\n  return response.choices[0]?.message.content ?? "";\n}`,
    questions: [
      { prompt: "Why must this SDK call stay on the server?", options: ["The secret key would be exposed in browser code", "TypeScript cannot run in browsers", "The browser cannot send HTTP"], answer: [0], explanation: "Anything shipped to the browser can be inspected. Keep provider credentials in server-only code." },
      { prompt: "What does baseURL configure?", options: ["The endpoint root for the compatible API", "The user's system message", "The model's output text"], answer: [0], explanation: "The OpenAI SDK uses baseURL to target a compatible service such as Groq." },
    ],
    reading: [{ label: "Groq OpenAI compatibility", url: "https://console.groq.com/docs/openai" }, { label: "OpenAI Node SDK", url: "https://github.com/openai/openai-node" }],
  },
  {
    title: "Build a Next.js API route",
    description: "Create a POST Route Handler that validates a JSON prompt, handles a missing provider key, calls a server-side model service, and returns safe JSON errors.",
    duration: 18,
    objectives: ["Use the App Router Route Handler convention", "Validate untrusted JSON", "Return deliberate HTTP statuses"],
    language: "typescript", filename: "app/api/analyze/route.ts",
    example: `import { z } from "zod";\nimport { askAI } from "@/lib/ai-service";\n\nconst requestSchema = z.object({ prompt: z.string().trim().min(1).max(4000) });\n\nexport async function POST(request: Request) {\n  if (!process.env.GROQ_API_KEY) {\n    return Response.json({ error: "AI service is not configured" }, { status: 503 });\n  }\n  const body: unknown = await request.json().catch(() => null);\n  const parsed = requestSchema.safeParse(body);\n  if (!parsed.success) return Response.json({ error: "Invalid prompt" }, { status: 400 });\n  try {\n    return Response.json({ answer: await askAI(parsed.data.prompt) });\n  } catch {\n    return Response.json({ error: "AI request failed" }, { status: 502 });\n  }\n}`,
    explanation: "The route.ts file exports POST. Parse untrusted request JSON with a runtime schema; 400 means invalid input, 503 means configuration is missing, and 502 hides internal provider details. The browser calls this route, never the provider directly.",
    expected: "The route accepts only a bounded nonempty prompt and returns a safe answer or error response.",
    exercise: "Connect a form to /api/analyze using fetch, disable empty submissions, and render response or an error.",
    starter: `async function submitPrompt(prompt: string) {\n  if (!prompt.trim()) return;\n  const response = await fetch("/api/analyze", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ prompt }),\n  });\n  const data = await response.json();\n  if (!response.ok) throw new Error(data.error ?? "Request failed");\n  return data.answer;\n}`,
    outcome: "Sends JSON to the app route and checks the HTTP status before using the answer.",
    tests: [{ label: "Posts JSON to the app route", includes: ["fetch", "/api/analyze", "POST", "JSON.stringify"] }, { label: "Handles unsuccessful responses", includes: ["response.ok", "throw"] }],
    hints: ["Send the prompt as JSON in a POST request.", "Check response.ok before treating answer as a success."],
    solution: `async function submitPrompt(prompt: string) {\n  if (!prompt.trim()) return;\n  const response = await fetch("/api/analyze", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ prompt }),\n  });\n  const data = await response.json();\n  if (!response.ok) throw new Error(data.error ?? "Request failed");\n  return data.answer;\n}`,
    questions: [
      { prompt: "Where does a Next.js App Router handler live?", options: ["app/api/name/route.ts", "components/api.tsx", "public/api.json"], answer: [0], explanation: "Route Handlers use route.ts files in the app directory and export HTTP method functions." },
      { prompt: "What should the route do with request.json() data?", options: ["Trust its TypeScript type", "Validate its runtime shape", "Forward it without limits"], answer: [1], explanation: "JSON is untrusted input; TypeScript types do not validate runtime values." },
    ],
    reading: [{ label: "Next.js Route Handlers", url: "https://nextjs.org/docs/app/getting-started/route-handlers" }, { label: "Zod basics", url: "https://zod.dev/basics" }],
  },
  {
    title: "System instructions",
    description: "Build a small programming tutor by separating durable behavior instructions from the learner's question. Instructions guide a response, but they do not replace application validation.",
    duration: 14,
    objectives: ["Separate system and user messages", "Write a task-specific instruction", "Keep untrusted inputs in their own message"],
    language: "typescript", filename: "tutor.ts",
    example: `const messages = [\n  { role: "system" as const, content: "You are a programming tutor. Give one clear hint before a full solution." },\n  { role: "user" as const, content: question },\n];\n\nconst result = await client.chat.completions.create({ model, messages });`,
    explanation: "The system message sets the intended assistant behavior; the user message carries the current request. Keep authorization and product rules enforced in code, not only in a prompt.",
    expected: "A completion request with separate system and user instructions.",
    exercise: "Change the tutor behavior using a configurable system instruction.",
    starter: `function tutorMessages(question: string, system: string) {\n  return [\n    { role: "system", content: ______ },\n    { role: "user", content: question },\n  ];\n}`,
    outcome: "Returns separate system and user messages using the supplied instruction.",
    tests: [{ label: "Uses the configurable system instruction", includes: ["role: \"system\"", "content: system"] }, { label: "Preserves the learner's question", includes: ["role: \"user\"", "content: question"] }],
    hints: ["The function receives system as a parameter.", "Do not merge the system and user content into one string."],
    solution: `function tutorMessages(question: string, system: string) {\n  return [\n    { role: "system", content: system },\n    { role: "user", content: question },\n  ];\n}`,
    questions: [
      { prompt: "What is the system message useful for here?", options: ["Setting tutor behavior", "Storing an API key", "Validating a JSON response"], answer: [0], explanation: "It provides consistent behavioral guidance for the assistant across requests." },
      { prompt: "Does a system instruction enforce authorization?", options: ["Yes, always", "No, enforce security rules in application code", "Only when the model is large"], answer: [1], explanation: "Prompts influence model output, but access control must be enforced by trusted application logic." },
    ],
    reading: [{ label: "Groq chat completions", url: "https://console.groq.com/docs/api-reference#chat-create" }],
  },
  {
    title: "Generate JSON",
    description: "Ask a model for a JSON-shaped sentiment result, then parse and validate the output. A requested shape is still untrusted text and can be malformed or semantically wrong.",
    duration: 15,
    objectives: ["Request a structured output", "Parse JSON safely", "Validate values and ranges"],
    language: "typescript", filename: "parse-sentiment.ts",
    example: `type Sentiment = { sentiment: "positive" | "neutral" | "negative"; confidence: number };\n\nfunction parseSentiment(text: string): Sentiment {\n  const value: unknown = JSON.parse(text);\n  if (typeof value !== "object" || value === null) throw new Error("Expected an object");\n  const item = value as Record<string, unknown>;\n  if (!["positive", "neutral", "negative"].includes(String(item.sentiment))) throw new Error("Invalid sentiment");\n  if (typeof item.confidence !== "number" || item.confidence < 0 || item.confidence > 1) throw new Error("Invalid confidence");\n  return { sentiment: item.sentiment as Sentiment["sentiment"], confidence: item.confidence };\n}`,
    explanation: "JSON.parse can throw. After parsing, validate object shape, allowed sentiment values, and the numeric confidence range before passing data to the UI.",
    expected: "Only valid sentiment values and confidence numbers from 0 to 1 are accepted.",
    exercise: "Create a parser that catches malformed JSON and returns a clear error result.",
    starter: `type ParseResult = { ok: true; value: unknown } | { ok: false; error: string };\n\nfunction parseJson(text: string): ParseResult {\n  try {\n    return { ok: true, value: JSON.parse(text) };\n  } catch {\n    return { ok: false, error: "______" };\n  }\n}`,
    outcome: "Malformed JSON returns a failure result instead of crashing the caller.",
    tests: [{ label: "Parses JSON within a try block", includes: ["try", "JSON.parse"] }, { label: "Returns a clear error result", includes: ["catch", "ok: false", "error"] }],
    hints: ["Keep JSON.parse in the try block.", "Return a discriminated failure result from catch."],
    solution: `type ParseResult = { ok: true; value: unknown } | { ok: false; error: string };\n\nfunction parseJson(text: string): ParseResult {\n  try {\n    return { ok: true, value: JSON.parse(text) };\n  } catch {\n    return { ok: false, error: "Response was not valid JSON" };\n  }\n}`,
    questions: [
      { prompt: "Does asking the model for JSON guarantee valid application data?", options: ["Yes", "No; parse and validate the result", "Only if confidence is high"], answer: [1], explanation: "The response can be malformed or contain unexpected values; treat it as untrusted input." },
      { prompt: "What should happen when JSON.parse throws?", options: ["Return a clear failure result", "Trust the original string", "Retry forever"], answer: [0], explanation: "A typed error result lets the caller show a safe, useful message." },
    ],
    reading: [{ label: "MDN JSON.parse", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse" }],
  },
  {
    title: "Validate AI responses with Zod",
    description: "Use a Zod schema to validate model-produced sentiment, summary, and keywords at runtime before returning the result to application code.",
    duration: 16,
    objectives: ["Define a runtime schema", "Use safeParse for untrusted output", "Return only validated data"],
    language: "typescript", filename: "analysis-schema.ts",
    example: `import { z } from "zod";\n\nconst analysisSchema = z.object({\n  sentiment: z.enum(["positive", "neutral", "negative"]),\n  summary: z.string().min(1).max(240),\n  keywords: z.array(z.string().min(1)).length(3),\n});\n\nexport function parseAnalysis(text: string) {\n  const json: unknown = JSON.parse(text);\n  return analysisSchema.safeParse(json);\n}`,
    explanation: "z.object and z.enum define runtime constraints; safeParse returns a success or error result without throwing a validation exception. JSON.parse still needs its own error handling.",
    expected: "A discriminated validation result; invalid JSON or invalid fields do not enter the app's trusted data flow.",
    exercise: "Handle invalid JSON, missing fields, and unexpected sentiment values using safe parsing and schema validation.",
    starter: `import { z } from "zod";\n\nconst schema = z.object({\n  sentiment: z.enum(["positive", "neutral", "negative"]),\n  summary: z.string().min(1),\n  keywords: z.array(z.string()).length(3),\n});\n\nexport function validateOutput(text: string) {\n  try {\n    const value: unknown = JSON.parse(text);\n    return schema.safeParse(value);\n  } catch {\n    return { success: false as const, error: "Invalid JSON" };\n  }\n}`,
    outcome: "Valid JSON is checked against the schema and malformed JSON returns a failure result.",
    tests: [{ label: "Validates with the Zod schema", includes: ["schema.safeParse", "z.enum"] }, { label: "Handles invalid JSON", includes: ["JSON.parse", "catch", "Invalid JSON"] }],
    hints: ["Parse JSON before passing its value to safeParse.", "Keep JSON parse failures separate from schema failures."],
    solution: `import { z } from "zod";\n\nconst schema = z.object({\n  sentiment: z.enum(["positive", "neutral", "negative"]),\n  summary: z.string().min(1),\n  keywords: z.array(z.string()).length(3),\n});\n\nexport function validateOutput(text: string) {\n  try {\n    const value: unknown = JSON.parse(text);\n    return schema.safeParse(value);\n  } catch {\n    return { success: false as const, error: "Invalid JSON" };\n  }\n}`,
    questions: [
      { prompt: "What does Zod safeParse return?", options: ["A success or failure result", "A provider API call", "A compiled TypeScript type only"], answer: [0], explanation: "safeParse performs runtime validation and returns a discriminated result." },
      { prompt: "Why is a TypeScript assertion insufficient for model output?", options: ["It does not validate runtime values", "It changes the JSON text", "It hides the API key"], answer: [0], explanation: "Type assertions are erased at runtime; use a runtime schema for untrusted output." },
    ],
    reading: [{ label: "Zod basics", url: "https://zod.dev/basics" }],
  },
  {
    title: "Handle API errors",
    description: "Map common HTTP failure classes to useful application behavior: 401 credentials, 429 rate limits, and 5xx provider failures. Keep internal exception details out of user-facing messages.",
    duration: 15,
    objectives: ["Recognize common HTTP statuses", "Return safe application errors", "Preserve useful server-side diagnostics"],
    language: "typescript", filename: "provider-errors.ts",
    example: `type ProviderFailure = { status: number };\n\nfunction publicMessage(error: ProviderFailure): { status: number; message: string } {\n  if (error.status === 401) return { status: 502, message: "AI service configuration error" };\n  if (error.status === 429) return { status: 503, message: "AI service is busy; try again shortly" };\n  if (error.status >= 500) return { status: 502, message: "AI service is temporarily unavailable" };\n  return { status: 502, message: "AI request failed" };\n}`,
    explanation: "A provider 401 signals authentication/configuration trouble; 429 indicates throttling; 5xx indicates server-side failure. Log a request ID and status on the server, but return a safe message to the client.",
    expected: "A bounded public message and an application status for each provider failure category.",
    exercise: "Handle a simulated rate-limit error without exposing the provider exception.",
    starter: `function toPublicError(status: number) {\n  if (status === 429) {\n    return { status: 503, message: "______" };\n  }\n  return { status: 502, message: "AI request failed" };\n}`,
    outcome: "A rate limit maps to a safe busy response for the application.",
    tests: [{ label: "Recognizes a 429 response", includes: ["429", "status: 503"] }, { label: "Returns a safe public message", includes: ["message", "try again"] }],
    hints: ["Check for status 429 explicitly.", "Do not include the raw exception or credential in the returned message."],
    solution: `function toPublicError(status: number) {\n  if (status === 429) {\n    return { status: 503, message: "AI service is busy; try again shortly" };\n  }\n  return { status: 502, message: "AI request failed" };\n}`,
    questions: [
      { prompt: "What does HTTP 429 commonly indicate?", options: ["Invalid credentials", "Rate limiting", "Successful response"], answer: [1], explanation: "429 means the client sent too many requests in a period or otherwise hit a rate limit." },
      { prompt: "What should the browser receive from a provider exception?", options: ["Raw stack trace and headers", "A safe, useful application message", "The API key"], answer: [1], explanation: "Keep diagnostics server-side and avoid leaking provider details or secrets." },
    ],
    reading: [{ label: "Groq errors", url: "https://console.groq.com/docs/errors" }],
  },
  {
    title: "Implement retry with backoff",
    description: "Retry transient failures with a bounded attempt count, capped exponential delay, jitter, and Retry-After when supplied. Do not retry authentication errors or invalid requests.",
    duration: 17,
    objectives: ["Bound retry attempts", "Add capped backoff and jitter", "Respect Retry-After and retry only transient failures"],
    language: "typescript", filename: "retry.ts",
    example: `const MAX_ATTEMPTS = 3;\nconst BASE_DELAY_MS = 250;\nconst MAX_DELAY_MS = 4000;\n\nfunction retryable(status: number) {\n  return status === 429 || status >= 500;\n}\n\nfunction delayFor(attempt: number, retryAfterMs?: number) {\n  const exponential = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** attempt);\n  const jitter = Math.random() * exponential * 0.2;\n  return Math.min(MAX_DELAY_MS, retryAfterMs ?? exponential + jitter);\n}`,
    explanation: "Attempts are finite; delay grows exponentially but is capped; jitter spreads simultaneous retries. Prefer a valid Retry-After value where supported. Never retry 400/401 as transient failures.",
    expected: "A finite retry policy that avoids a retry storm and respects provider guidance.",
    exercise: "Complete a retry helper and test its decision against a mocked 429 response and a non-retryable 401.",
    starter: `function shouldRetry(status: number, attempt: number, maxAttempts: number) {\n  if (attempt >= maxAttempts) return false;\n  return status === 429 || ______;\n}\n\nfunction backoffMs(attempt: number, retryAfterMs?: number) {\n  const capped = Math.min(4000, 250 * 2 ** attempt);\n  const jitter = Math.random() * capped * 0.2;\n  return retryAfterMs ?? capped + jitter;\n}`,
    outcome: "Retries 429 and 5xx only while under the configured attempt limit; uses a capped delay with jitter or Retry-After.",
    tests: [{ label: "Retries transient 5xx errors", includes: ["status >= 500", "maxAttempts"] }, { label: "Uses capped backoff and Retry-After", includes: ["Math.min", "retryAfterMs", "jitter"] }],
    hints: ["A 5xx response is transient in this example.", "Use Math.min to cap exponential growth; check Retry-After before your calculated delay."],
    solution: `function shouldRetry(status: number, attempt: number, maxAttempts: number) {\n  if (attempt >= maxAttempts) return false;\n  return status === 429 || status >= 500;\n}\n\nfunction backoffMs(attempt: number, retryAfterMs?: number) {\n  const capped = Math.min(4000, 250 * 2 ** attempt);\n  const jitter = Math.random() * capped * 0.2;\n  return retryAfterMs ?? capped + jitter;\n}`,
    questions: [
      { prompt: "Should a 401 credential failure be retried with backoff?", options: ["Yes, indefinitely", "No, fix credentials first", "Only after sending the key to the browser"], answer: [1], explanation: "Authentication failures are not transient; retrying unchanged credentials adds load without fixing the cause." },
      { prompt: "Why cap exponential backoff and add jitter?", options: ["To bound delay and spread concurrent retries", "To remove the attempt limit", "To guarantee a provider response"], answer: [0], explanation: "A cap prevents unbounded waits, and jitter reduces synchronized retry bursts." },
    ],
    reading: [{ label: "Groq rate limits", url: "https://console.groq.com/docs/rate-limits" }],
  },
  {
    title: "Use FreeLLMAPI and 9Router",
    description: "Treat gateways as optional OpenAI-compatible routing layers, not unlimited free APIs. They route only among configured and authorized providers, whose quotas, capabilities, credentials, and terms still apply.",
    duration: 16,
    objectives: ["Explain OpenAI-compatible gateways", "Configure endpoints from official guidance", "Route only across authorized providers"],
    language: "typescript", filename: "provider-client.ts",
    example: `import OpenAI from "openai";\n\nconst client = new OpenAI({\n  apiKey: process.env.LLM_API_KEY,\n  baseURL: process.env.LLM_BASE_URL,\n});\n\nconst response = await client.chat.completions.create({\n  model: process.env.LLM_MODEL ?? "auto",\n  messages: [{ role: "user", content: "Explain REST APIs briefly" }],\n});\n\nconsole.log(response.choices[0]?.message.content);`,
    explanation: "Copy base URL, key, model naming, and optional auto-routing behavior from the gateway's own current docs/dashboard. Do not assume auto works on direct providers or invent endpoint URLs. Switching to a gateway changes routing and trust boundaries; honor configured provider limits and terms.",
    expected: "A configurable client uses only the operator's authorized endpoint, credential, and model identifier.",
    exercise: "Implement a selector that tries a primary configured provider and falls back only to a second authorized provider for transient errors.",
    starter: `type Provider = { name: string; authorized: boolean; call: () => Promise<string> };\n\nexport async function route(providers: Provider[]) {\n  const allowed = providers.filter((provider) => provider.authorized);\n  for (const provider of allowed.slice(0, 2)) {\n    try {\n      return await provider.call();\n    } catch (error) {\n      if (!isTransient(error)) throw error;\n    }\n  }\n  throw new Error("No authorized provider succeeded");\n}`,
    outcome: "Uses at most two explicitly authorized providers and falls back only after a transient failure.",
    tests: [{ label: "Filters to authorized providers", includes: ["filter", "authorized"] }, { label: "Limits fallback and checks transient errors", includes: ["slice(0, 2)", "isTransient", "throw error"] }],
    hints: ["Never remove the authorization filter.", "Fallback should happen only when the error is transient."],
    solution: `type Provider = { name: string; authorized: boolean; call: () => Promise<string> };\n\nexport async function route(providers: Provider[]) {\n  const allowed = providers.filter((provider) => provider.authorized);\n  for (const provider of allowed.slice(0, 2)) {\n    try {\n      return await provider.call();\n    } catch (error) {\n      if (!isTransient(error)) throw error;\n    }\n  }\n  throw new Error("No authorized provider succeeded");\n}`,
    questions: [
      { prompt: "What does OpenAI-compatible mean for a gateway?", options: ["It accepts a compatible API request format", "It guarantees free unlimited inference", "All provider models support the same features"], answer: [0], explanation: "It describes a protocol surface. It does not promise unlimited usage or identical provider behavior." },
      { prompt: "Where should you get a gateway's base URL and model ID?", options: ["Invent a likely URL", "The gateway's official docs or configured dashboard", "The API key text"], answer: [1], explanation: "Each gateway has its own documented endpoint and model naming. Verify them in the official configuration source." },
    ],
    reading: [{ label: "FreeLLMAPI documentation", url: "https://github.com/tashfeenahmed/freellmapi" }, { label: "9Router documentation", url: "https://github.com/decolua/9router" }, { label: "OpenAI Node SDK", url: "https://github.com/openai/openai-node" }],
  },
  {
    title: "Create the user interface",
    description: "Start the text-analysis studio with a bounded text field, analyse action, loading state, results area, and a useful error state. Validate the user's input before submitting it.",
    duration: 15,
    objectives: ["Build accessible form states", "Validate before submitting", "Disable empty submissions"],
    language: "typescript", filename: "analysis-form.tsx",
    example: `function AnalysisForm() {\n  const [text, setText] = useState("");\n  const [loading, setLoading] = useState(false);\n  const [error, setError] = useState<string | null>(null);\n  const [result, setResult] = useState<Analysis | null>(null);\n\n  return <form onSubmit={submit}>\n    <textarea value={text} onChange={(event) => setText(event.target.value)} />\n    <button disabled={loading || !text.trim()}>\n      {loading ? "Analysing…" : "Analyse"}\n    </button>\n    {error && <p role="alert">{error}</p>}\n    {result && <AnalysisResult result={result} />}\n  </form>;\n}`,
    explanation: "Keep input, loading, error, and result as separate UI states; role=alert exposes errors to assistive technology. The button is disabled when the input is blank or a request is in flight.",
    expected: "An empty prompt cannot submit, loading is visible, and success or failure has a clear destination.",
    exercise: "Add trimming and input validation and disable submit for empty text.",
    starter: `const canSubmit = !loading && text.______;\n\nfunction validateText(value: string) {\n  if (!value.trim()) return "Enter text to analyse";\n  if (value.length > 4000) return "Text is too long";\n  return null;\n}`,
    outcome: "Blank text and oversized input are rejected and the submit action is disabled while invalid or busy.",
    tests: [{ label: "Rejects blank trimmed input", includes: ["trim()", "Enter text"] }, { label: "Disables submit while busy or empty", includes: ["loading", "disabled", "trim"] }],
    hints: ["Use trim to detect whitespace-only input.", "Combine busy state and nonempty trimmed text in the disabled condition."],
    solution: `const canSubmit = !loading && Boolean(text.trim());\n\nfunction validateText(value: string) {\n  if (!value.trim()) return "Enter text to analyse";\n  if (value.length > 4000) return "Text is too long";\n  return null;\n}`,
    questions: [
      { prompt: "Why disable Analyse for whitespace-only input?", options: ["To avoid submitting invalid work", "To make the API key visible", "To retry without bounds"], answer: [0], explanation: "Trimmed validation catches blank content before it reaches the server." },
      { prompt: "Which UI state should be shown while the request is pending?", options: ["A loading indicator", "A fake successful result", "The raw provider key"], answer: [0], explanation: "A loading state communicates that work is in progress and helps prevent duplicate submissions." },
    ],
    reading: [{ label: "React forms", url: "https://react.dev/reference/react-dom/components/form" }],
  },
  {
    title: "Connect the AI backend",
    description: "Receive text on a server-side route, call the configured model, and validate the structured analysis before returning sentiment, a short summary, and three keywords.",
    duration: 18,
    objectives: ["Keep model calls in a Route Handler", "Request a narrow result contract", "Validate all returned fields"],
    language: "typescript", filename: "app/api/analyze/route.ts",
    example: `const analysisSchema = z.object({\n  sentiment: z.enum(["positive", "neutral", "negative"]),\n  summary: z.string().min(1).max(240),\n  keywords: z.array(z.string().min(1)).length(3),\n});\n\nexport async function POST(request: Request) {\n  const body = await request.json().catch(() => null);\n  const input = requestSchema.safeParse(body);\n  if (!input.success) return Response.json({ error: "Invalid text" }, { status: 400 });\n  const raw = await generateAnalysis(input.data.text);\n  const parsed = analysisSchema.safeParse(JSON.parse(raw));\n  if (!parsed.success) return Response.json({ error: "Could not validate analysis" }, { status: 502 });\n  return Response.json(parsed.data);\n}`,
    explanation: "The browser submits text to your application route. Only the server calls the provider; validate both incoming input and generated output before returning the narrow result shape.",
    expected: "A validated response with sentiment, short summary, and exactly three keywords.",
    exercise: "Connect the form to the API route and render the validated analysis result.",
    starter: `async function analyse(text: string): Promise<Analysis> {\n  const response = await fetch("/api/analyze", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ text }),\n  });\n  if (!response.ok) throw new Error("Analysis failed");\n  return (await response.json()) as Analysis;\n}`,
    outcome: "The form posts text, checks the response, and displays the returned validated analysis.",
    tests: [{ label: "Posts the user's text", includes: ["/api/analyze", "POST", "JSON.stringify({ text })"] }, { label: "Checks and returns the API result", includes: ["response.ok", "response.json"] }],
    hints: ["Send the text to the relative app route, not to the provider from the browser.", "Check response.ok before reading a success result."],
    solution: `async function analyse(text: string): Promise<Analysis> {\n  const response = await fetch("/api/analyze", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ text }),\n  });\n  if (!response.ok) throw new Error("Analysis failed");\n  return (await response.json()) as Analysis;\n}`,
    questions: [
      { prompt: "Where should generateAnalysis call the model?", options: ["A server-side route or service", "A browser component with a secret", "A URL query string"], answer: [0], explanation: "Provider credentials remain on the server; the frontend calls your own route." },
      { prompt: "What must be checked before returning model-generated JSON?", options: ["Only that it is a string", "Its runtime schema and field constraints", "Only its token count"], answer: [1], explanation: "Validate sentiment, summary, and keyword count before the app trusts the result." },
    ],
    reading: [{ label: "Next.js Route Handlers", url: "https://nextjs.org/docs/app/getting-started/route-handlers" }, { label: "Zod basics", url: "https://zod.dev/basics" }],
  },
  {
    title: "Final project: AI Text Analysis Studio",
    description: "Finish the AI Text Analysis Studio: a Next.js text-analysis app with a server-side provider call, validated sentiment, summary, and three keywords, bounded input, finite transient retries, safe errors, and an optional authorized fallback provider.",
    duration: 18,
    objectives: ["Bound input and retry behavior", "Display safe failures", "Use only configured authorized fallback providers"],
    language: "typescript", filename: "analysis-client.ts",
    example: `const MAX_INPUT = 4000;\n\nfunction validateInput(text: string) {\n  if (!text.trim()) return "Enter text to analyse";\n  if (text.length > MAX_INPUT) return "Text is too long";\n  return null;\n}\n\nasync function withRetry<T>(run: () => Promise<T>, attempts = 2): Promise<T> {\n  for (let attempt = 0; ; attempt++) {\n    try { return await run(); }\n    catch (error) {\n      if (!isTransient(error) || attempt >= attempts) throw error;\n      await wait(delayFor(attempt));\n    }\n  }\n}`,
    explanation: "Input limits protect your service; retries are finite and transient-only; UI messages reveal no provider internals. A secondary provider must be configured and authorized, and must follow its own limits and terms.",
    expected: "Bounded input, finite retries, safe errors, and no credential or policy bypass.",
    exercise: "Complete the final reliability boundary and review the acceptance criteria for the full project. Deterministic checks cover safe rate-limit handling and configured provider routing; they inspect source patterns only and never run learner code or call a model.",
    starter: `type Analysis = {\n  sentiment: "positive" | "neutral" | "negative";\n  summary: string;\n  keywords: [string, string, string];\n};\ntype Result = { ok: true; value: Analysis } | { ok: false; message: string };\n\nfunction presentFailure(status: number): Result {\n  if (status === 429) return { ok: false, message: "AI is busy. Try again shortly." };\n  if (status >= 500) return { ok: false, message: "Analysis is temporarily unavailable." };\n  return { ok: false, message: "Check the submitted text and try again." };\n}\n\nfunction canUseFallback(configured: boolean, authorized: boolean) {\n  return configured && authorized;\n}\n\n// Acceptance criteria: server-only provider call; validated result;\n// three keywords; bounded input; loading/error/success UI; no browser secrets.`,
    outcome: "Maps simulated provider failures to safe messages and requires explicit authorization before fallback; acceptance criteria cover server credentials, validated fields, loading and error states, and bounded input.",
    tests: [{ label: "Handles simulated rate limits safely", includes: ["429", "AI is busy"] }, { label: "Requires configured authorized fallback", includes: ["configured", "authorized"] }],
    hints: ["Handle status 429 with a user-safe message.", "Fallback is allowed only if it is configured and authorized. Keep the full project acceptance criteria in view."],
    solution: `type Analysis = {\n  sentiment: "positive" | "neutral" | "negative";\n  summary: string;\n  keywords: [string, string, string];\n};\ntype Result = { ok: true; value: Analysis } | { ok: false; message: string };\n\nfunction presentFailure(status: number): Result {\n  if (status === 429) return { ok: false, message: "AI is busy. Try again shortly." };\n  if (status >= 500) return { ok: false, message: "Analysis is temporarily unavailable." };\n  return { ok: false, message: "Check the submitted text and try again." };\n}\n\nfunction canUseFallback(configured: boolean, authorized: boolean) {\n  return configured && authorized;\n}`,
    questions: [
      { prompt: "When may a secondary provider be used?", options: ["Whenever the primary hits a limit, regardless of terms", "When configured and authorized under that provider's terms", "To evade provider restrictions"], answer: [1], explanation: "Fallback must respect the credentials, quotas, capabilities, and terms of every configured provider." },
      { prompt: "What does a deterministic mock test do in this course?", options: ["Executes arbitrary learner code", "Checks source patterns against fixtures", "Calls a live model"], answer: [1], explanation: "The current evaluator performs source-pattern checks only; it does not execute code or contact an AI provider." },
    ],
    reading: [{ label: "Groq rate limits", url: "https://console.groq.com/docs/rate-limits" }, { label: "OWASP API Security", url: "https://owasp.org/www-project-api-security/" }],
  },
];

const moduleLessonTitles = [
  content.slice(0, 3).map((lesson) => lesson.title),
  content.slice(3, 6).map((lesson) => lesson.title),
  content.slice(6, 9).map((lesson) => lesson.title),
  content.slice(9, 12).map((lesson) => lesson.title),
  content.slice(12, 15).map((lesson) => lesson.title),
];

function makeQuestions(id: string, questions: LessonContent["questions"]): LessonQuizQuestion[] {
  return questions.map((question, index) => ({ id: `${id}-q${index + 1}`, type: "single", ...question }));
}

function makeLesson(item: LessonContent, index: number): Lesson {
  const id = `api-fundamentals-${String(index + 1).padStart(2, "0")}`;
  const moduleIndex = Math.floor(index / 3);
  const moduleId = `${courseId}-module-${moduleIndex + 1}`;
  const exerciseId = `${id}-exercise`;
  const quizId = `${id}-quiz`;
  const quizQuestions = makeQuestions(id, item.questions);
  const blocks: LessonBlock[] = [
    { id: `${id}-intro`, type: "introduction", body: item.description },
    { id: `${id}-example`, type: "code", language: item.language, filename: item.filename, source: item.example, explanation: item.explanation, expectedOutput: item.expected, editable: false },
    { id: exerciseId, type: "exercise", title: `Try it: ${item.title}`, instructions: item.exercise, language: item.language, starterCode: item.starter, expectedOutcome: item.outcome, testCases: item.tests.map((test, testIndex) => ({ id: `${exerciseId}-test-${testIndex + 1}`, label: test.label, includes: test.includes })), hints: item.hints, referenceSolution: item.solution },
    { id: quizId, type: "quiz", title: "Quick quiz", questions: quizQuestions, passingScore: 50 },
    { id: `${id}-summary`, type: "summary", points: item.objectives },
  ];
  return { id, version: 1, status: "published", courseId, moduleId, title: item.title, description: item.description, duration: item.duration, kind: "lesson", content: item.description, objectives: item.objectives, blocks, prerequisites: index ? [`api-fundamentals-${String(index).padStart(2, "0")}`] : [], completionRequirements: { exercise: true, quizScore: 50 }, quizId, furtherReading: item.reading };
}

export const apiIntegrationLessons = content.map(makeLesson);
export const apiIntegrationModules: CourseModule[] = moduleTitles.map((title, index) => ({
  id: `${courseId}-module-${index + 1}`,
  courseId,
  title,
  description: `${moduleLessonTitles[index].length} practical lessons with examples, simulated exercises, and quick quizzes.`,
  lessons: apiIntegrationLessons.slice(index * 3, index * 3 + 3).map((lesson) => lesson.id),
  status: "published",
}));

export const apiIntegrationCourse: Course = {
  id: courseId,
  title: "AI API Integration Fundamentals",
  description: "Build secure, reliable AI features with Groq and OpenAI-compatible APIs.",
  longDescription: "A code-first path from your first provider request to a production-minded text-analysis application. Each lesson combines a concise explanation, a worked example, a deterministic coding exercise, and a practical quiz.",
  difficulty: "Beginner",
  duration: "4h",
  tags: ["Python", "TypeScript", "Groq", "Hands-on"],
  accent: "#8b5cf6",
  modules: apiIntegrationModules,
  lessonIds: apiIntegrationLessons.map((lesson) => lesson.id),
  prerequisites: ["Basic Python or TypeScript"],
  outcomes: ["Integrate compatible AI APIs from server code", "Validate inputs and generated data", "Build and test a reliable AI text-analysis feature"],
};
