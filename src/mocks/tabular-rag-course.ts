import type { Course, CourseModule, Lesson, LessonBlock, LessonQuizQuestion } from "@/types";

const courseId = "course-tabular-rag";

type Entry = {
  title: string;
  description: string;
  objective: string;
  language: "python";
  filename: string;
  example: string;
  starter: string;
  required: string;
  question: string;
  options: string[];
  answer: number;
  reading?: { label: string; url: string }[];
};

const definitions: { title: string; entries: Entry[] }[] = [
  {
    title: "Introduction to Tabular RAG",
    entries: [
      {
        title: "Understanding Tabular RAG and its architecture",
        description: "Tabular RAG answers questions about structured records by combining schema discovery, query planning, constrained execution, and explanation. Unlike document RAG, the core evidence is usually a reproducible query result rather than a retrieved paragraph.",
        objective: "Describe the path from a natural-language question to a bounded, traceable table result.", language: "python", filename: "architecture.py",
        example: `def answer(question, catalog, planner, read_only_db):\n    schema = catalog.describe_relevant_tables(question)\n    plan = planner.create_plan(question, schema)\n    result = read_only_db.execute(plan.sql)\n    return explain(question, result, sources=plan.tables)`,
        starter: `def answer(question, catalog, planner, read_only_db):\n    schema = catalog.describe_relevant_tables(question)\n    plan = planner.create_plan(question, schema)\n    # Execute the validated query and return its result\n    return ______`, required: "execute the validated query", question: "What is the primary evidence for a numerical answer in tabular RAG?", options: ["A reproducible query result", "A semantically similar paragraph alone", "The model's confidence statement"], answer: 0,
        reading: [{ label: "Pandas DataFrame basics", url: "https://pandas.pydata.org/docs/user_guide/dsintro.html" }, { label: "DuckDB SQL introduction", url: "https://duckdb.org/docs/current/sql/introduction" }],
      },
      {
        title: "Loading and exploring CSV, Excel and SQL data",
        description: "Load each source deliberately, inspect its dimensions and inferred types, and confirm parsing assumptions before analysis. Sampling and profiling reveal malformed values and unexpected nulls early.",
        objective: "Load common tabular sources and inspect their shape, columns, and types.", language: "python", filename: "load_tables.py",
        example: `import pandas as pd\n\norders = pd.read_csv("orders.csv")\nworkbook = pd.ExcelFile("sales.xlsx")\nmonthly = pd.read_excel(workbook, sheet_name="January")\nprint(orders.shape, orders.dtypes)\nprint(monthly.head())`,
        starter: `import pandas as pd\n\norders = pd.read_csv("orders.csv")\nprint(orders.______)\nprint(orders.dtypes)`, required: "inspect shape and dtypes", question: "Why inspect inferred dtypes after loading a CSV?", options: ["To catch incorrect type inference before analysis", "To automatically remove every missing value", "To prove every row is valid"], answer: 0,
        reading: [{ label: "Pandas IO tools", url: "https://pandas.pydata.org/docs/user_guide/io.html" }, { label: "DuckDB CSV import", url: "https://duckdb.org/docs/stable/data/csv/overview" }],
      },
      {
        title: "Understanding table schemas and preparing context",
        description: "A useful schema catalog includes table and column names, types, meanings, keys, relationships, units, and sensitivity. Give the model only relevant schema context and preserve stable identifiers for result provenance.",
        objective: "Build concise, business-meaningful schema context with keys and relationships.", language: "python", filename: "schema_catalog.py",
        example: `catalog = {\n    "orders": {\n        "description": "One row per customer order",\n        "columns": {"order_id": "integer primary key", "customer_id": "integer foreign key", "total": "decimal USD"},\n        "relationships": ["orders.customer_id -> customers.customer_id"],\n    }\n}`, starter: `catalog = {\n    "orders": {\n        "description": "One row per customer order",\n        "columns": {"order_id": "integer primary key", "customer_id": "integer foreign key"},\n        "relationships": [______],\n    }\n}`, required: "document the foreign-key relationship", question: "Which schema detail helps a planner join two tables correctly?", options: ["A documented key relationship", "A larger prompt token budget", "A random row sample"], answer: 0,
        reading: [{ label: "DuckDB information schema", url: "https://duckdb.org/docs/stable/sql/meta/information_schema.html" }],
      },
    ],
  },
  {
    title: "Text-to-Pandas and Text-to-SQL",
    entries: [
      {
        title: "Convert natural language into Pandas operations",
        description: "Translate the question into explicit filter, grouping, aggregation, and ordering steps. Check that the requested columns exist and avoid exposing arbitrary Python execution to untrusted model output.", objective: "Express a natural-language aggregation as a small, inspectable Pandas pipeline.", language: "python", filename: "pandas_query.py",
        example: `result = (\n    orders.loc[orders["status"].eq("paid")]\n    .groupby("region", as_index=False)["total"]\n    .sum()\n    .sort_values("total", ascending=False)\n)`, starter: `result = (\n    orders.loc[orders["status"].eq("paid")]\n    .groupby("region", as_index=False)["total"]\n    .____()\n)`, required: "aggregate the total for each region", question: "Which operation creates one aggregate row per region?", options: ["groupby", "head", "astype"], answer: 0,
        reading: [{ label: "Pandas group by guide", url: "https://pandas.pydata.org/docs/user_guide/groupby.html" }],
      },
      {
        title: "Build a Text-to-Pandas pipeline with PandasAI",
        description: "Wrap a DataFrame with a natural-language analysis layer, then control the data and execution boundary. Keep datasets scoped, validate outputs, and treat generated code as untrusted; use the library's current configuration and provider integration for the installed version.", objective: "Separate user intent, DataFrame context, execution policy, and result validation.", language: "python", filename: "pandasai_pipeline.py",
        example: `# Illustrative flow: bind a scoped dataframe, ask, then validate\nagent = create_dataframe_agent(orders, config=trusted_config)\nanswer = agent.chat("Which region had the highest paid revenue?")\nif not is_expected_result(answer):\n    raise ValueError("Unexpected analysis result")`, starter: `agent = create_dataframe_agent(orders, config=trusted_config)\nanswer = agent.chat("Which region had the highest paid revenue?")\n# Validate before returning the generated result\nif not ______(answer):\n    raise ValueError("Unexpected analysis result")`, required: "validate the generated result", question: "How should generated analysis code be treated?", options: ["As untrusted input behind execution controls", "As trusted because it came from an LLM", "As a substitute for access controls"], answer: 0,
        reading: [{ label: "PandasAI documentation", url: "https://docs.pandas-ai.com/" }],
      },
      {
        title: "Generate SQL queries from natural language using LLMs",
        description: "Give the model a concise schema, dialect, and output contract. Ask it to return a query plan or SQL without executing it, then inspect referenced tables, columns, joins, limits, and query intent in application code.", objective: "Generate SQL from schema context while keeping generation separate from execution.", language: "python", filename: "generate_sql.py",
        example: `prompt = f"""\nUse DuckDB SQL. Return one SELECT statement only.\nSchema:\n{schema_context}\nQuestion: {question}\n"""\nsql = model.generate(prompt)\n# Parsing and policy checks happen before database execution.`, starter: `prompt = f"Use DuckDB SQL. Return one SELECT statement only.\n{schema_context}\n{question}"\nsql = model.generate(prompt)\n# Do not execute until SQL passes ______`, required: "validate generated SQL before execution", question: "Why keep SQL generation separate from execution?", options: ["So application policy can inspect the query first", "Because SQL does not need a database", "So prompts can replace database permissions"], answer: 0,
        reading: [{ label: "DuckDB SQL introduction", url: "https://duckdb.org/docs/current/sql/introduction" }],
      },
      {
        title: "Validate and execute SQL using SQLGlot and DuckDB",
        description: "Parse the query with its intended dialect, require a read-only SELECT shape, enforce allowed tables and resource limits, and execute through a read-only connection. Parsing alone is not authorization or proof the query will succeed.", objective: "Parse generated SQL, enforce a read-only policy, and execute with bounded access.", language: "python", filename: "validate_sql.py",
        example: `import sqlglot\nfrom sqlglot import exp\n\nparsed = sqlglot.parse_one(sql, read="duckdb")\nif not isinstance(parsed, exp.Select):\n    raise ValueError("Only SELECT queries are allowed")\nif not allowed_tables(parsed, {"orders", "customers"}):\n    raise ValueError("Query references an unavailable table")\nresult = read_only_connection.execute(sql).fetchdf()`, starter: `parsed = sqlglot.parse_one(sql, read="duckdb")\nif not isinstance(parsed, exp.Select):\n    raise ValueError("Only SELECT queries are allowed")\n# Execute through a read-only connection\nresult = ______.execute(sql).fetchdf()`, required: "execute SQL through a read-only connection", question: "What does successful SQL parsing establish?", options: ["The statement can be represented syntactically", "The query is safe and authorized", "The result is factually correct"], answer: 0,
        reading: [{ label: "SQLGlot documentation", url: "https://sqlglot.com/" }, { label: "DuckDB Python API", url: "https://duckdb.org/docs/stable/clients/python/overview" }],
      },
    ],
  },
  {
    title: "Advanced Tabular RAG and AI Data Analysis",
    entries: [
      {
        title: "Build schema-aware retrieval for multiple tables",
        description: "For multi-table questions, retrieve schema snippets by table and column meaning, then expand through known foreign-key relationships. Rank relevant context and include join guidance without sending the entire database catalog on every request.", objective: "Retrieve relevant table and relationship metadata for a multi-table question.", language: "python", filename: "schema_retrieval.py",
        example: `def schema_context(question, catalog, embedder, top_k=4):\n    matches = catalog.search(embedder.encode(question), limit=top_k)\n    tables = expand_relationships(matches, catalog.relationships)\n    return render_schema(tables)`, starter: `matches = catalog.search(embedder.encode(question), limit=4)\ntables = expand_relationships(matches, catalog.relationships)\ncontext = ______(tables)`, required: "render relevant schemas and relationships", question: "Why expand retrieved tables through known relationships?", options: ["To provide valid join paths for cross-table questions", "To include every table regardless of relevance", "To avoid checking column names"], answer: 0,
        reading: [{ label: "Text-to-SQL with schema linking (Spider paper)", url: "https://arxiv.org/abs/1809.08887" }],
      },
      {
        title: "Generate grounded insights and visualisations",
        description: "Base narrative claims on returned aggregates and preserve the query, filters, time range, and row counts as provenance. Select chart encodings that match data types, label units, and distinguish observed results from interpretation.", objective: "Return an insight with its supporting aggregate and a suitable chart specification.", language: "python", filename: "grounded_chart.py",
        example: `summary = {"region": "West", "revenue_usd": 18420.0}\ninsight = f"West had the highest paid revenue at \${summary['revenue_usd']:,.0f}."\nchart = {"mark": "bar", "x": "region", "y": "revenue_usd", "y_title": "Revenue (USD)"}\nreturn {"insight": insight, "chart": chart, "sql": executed_sql}`, starter: `chart = {\n    "mark": "bar",\n    "x": "region",\n    "y": "revenue_usd",\n    "y_title": ______,\n}`, required: "label the chart unit as USD", question: "What should support a generated numerical insight?", options: ["The executed query result and its provenance", "A plausible model explanation alone", "A chart title without the underlying data"], answer: 0,
        reading: [{ label: "Pandas visualization guide", url: "https://pandas.pydata.org/docs/user_guide/visualization.html" }],
      },
      {
        title: "Final project: AI Data Analyst with Text-to-SQL and Text-to-Pandas",
        description: "Build an analyst workflow that profiles uploaded tables, retrieves relevant schema, offers SQL and Pandas plans, validates constrained execution, and returns a cited result with a readable visualization. Compare both query paths on a fixed set of questions and record errors and latency.", objective: "Combine schema-aware planning, guarded query execution, result validation, and grounded reporting.", language: "python", filename: "data_analyst.py",
        example: `def analyze(question, tables, mode="sql"):\n    context = retrieve_schema(question, tables)\n    plan = make_plan(question, context, mode=mode)\n    validate_plan(plan, allowed_tables=tables.keys())\n    result = execute_read_only(plan)\n    return {\n        "answer": summarize_from_result(question, result),\n        "sources": plan.sources,\n        "query": plan.display_query,\n        "visualization": choose_chart(result),\n    }`, starter: `def analyze(question, tables, mode="sql"):\n    context = retrieve_schema(question, tables)\n    plan = make_plan(question, context, mode=mode)\n    validate_plan(plan, allowed_tables=tables.keys())\n    result = execute_read_only(plan)\n    return {"answer": summarize_from_result(question, result),\n            "sources": plan.sources, "query": plan.display_query,\n            "visualization": ______(result)}`, required: "choose a visualization from validated results", question: "Which sequence keeps the final analyst grounded and controlled?", options: ["Retrieve schema, validate plan, execute read-only, explain results with provenance", "Ask the model to guess a chart and answer without querying", "Execute generated code first, then decide whether access was allowed"], answer: 0,
        reading: [{ label: "Pandas user guide", url: "https://pandas.pydata.org/docs/user_guide/index.html" }, { label: "SQLGlot documentation", url: "https://sqlglot.com/" }, { label: "DuckDB Python API", url: "https://duckdb.org/docs/stable/clients/python/overview" }],
      },
    ],
  },
];

const modules: CourseModule[] = [];
const lessons: Lesson[] = [];

definitions.forEach(({ title: moduleTitle, entries }, moduleIndex) => {
  const moduleId = `${courseId}-module-${moduleIndex + 1}`;
  const lessonIds: string[] = [];
  entries.forEach((entry, lessonIndex) => {
    const id = `lesson-tabular-rag-${moduleIndex + 1}-${lessonIndex + 1}`;
    const previous = lessonIds.at(-1);
    const questions: LessonQuizQuestion[] = [{ id: `${id}-q1`, type: "single", prompt: entry.question, options: entry.options, answer: [entry.answer], explanation: entry.description }];
    const blocks: LessonBlock[] = [
      { id: `${id}-intro`, type: "introduction", body: entry.description },
      { id: `${id}-theory`, type: "theory", heading: "Apply the pattern", body: `${entry.objective} Treat model-generated plans and code as untrusted input. Keep data access scoped, validate assumptions, and retain enough query provenance to reproduce the result.` },
      { id: `${id}-example`, type: "code", language: entry.language, filename: entry.filename, source: entry.example, explanation: "This illustrative snippet demonstrates the lesson's core step. The course editor uses deterministic source checks; it does not execute this code or contact an external model.", expectedOutput: entry.objective, editable: false },
      { id: `${id}-exercise`, type: "exercise", title: `Practice: ${entry.title}`, instructions: `Complete the starter to demonstrate how to ${entry.objective.toLowerCase()}. The check inspects source text and does not execute arbitrary code.`, language: entry.language, starterCode: entry.starter, expectedOutcome: entry.required, testCases: [{ id: `${id}-test`, label: entry.required, includes: entry.required.toLowerCase().split(" ").slice(0, 2) }], hints: ["Keep the steps explicit so each boundary can be reviewed.", "Check the columns, tables, permissions, and output shape before trusting a generated result."], referenceSolution: entry.example },
      { id: `${id}-quiz`, type: "quiz", title: "Check your understanding", questions, passingScore: 100 },
      { id: `${id}-summary`, type: "summary", points: [entry.description, entry.objective, "Validate generated work before execution and keep evidence with the result."] },
    ];
    lessonIds.push(id);
    lessons.push({ id, version: 1, status: "published", courseId, moduleId, title: entry.title, description: entry.description, duration: moduleIndex === 2 && lessonIndex === 2 ? 35 : 20, kind: "lesson", content: `## ${entry.title}\n\n${entry.description}`, objectives: [entry.objective, "Apply the concept in a short Python example", "Explain the validation and provenance requirements"], blocks, prerequisites: previous ? [previous] : [], completionRequirements: { exercise: true, quizScore: 100 }, quizId: `${id}-quiz`, furtherReading: entry.reading });
  });
  modules.push({ id: moduleId, courseId, title: moduleTitle, description: `Study ${moduleTitle.toLowerCase()} using explicit schemas, inspectable queries, and grounded results.`, lessons: lessonIds, status: "published" });
});

export const tabularRagCourse: Course = {
  id: courseId,
  title: "Building Tabular RAG Applications",
  description: "Build a schema-aware AI data analyst that answers questions over structured data with validated SQL and Pandas workflows.",
  longDescription: "Move from inspecting CSV, Excel, and SQL data through schema retrieval, natural-language query planning, guarded SQL and Pandas execution, and grounded insight reporting.",
  difficulty: "Advanced",
  duration: "5h",
  tags: ["Tabular RAG", "Text-to-SQL", "Pandas", "Hands-on"],
  accent: "#0e7490",
  modules,
  lessonIds: lessons.map((lesson) => lesson.id),
  prerequisites: ["Intermediate Python", "Basic SQL", "Working knowledge of tabular data"],
  outcomes: ["Prepare schema context for multi-table questions", "Validate generated SQL before read-only execution", "Build grounded analysis with query provenance and visualizations"],
};

export const tabularRagLessons = lessons;
