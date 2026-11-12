# Course and lesson authoring

Course content is static and lives in `src/mocks/data.ts`. Services expose that content to pages; lesson components do not import the data file. A future HTTP or database course service can replace the current adapter without changing lesson rendering.

## Add a course

Add a course entry to the `tracks` list. Each entry has a display name, a course title, a short description, and three authored lessons for its first module. Lesson IDs should be stable lowercase slugs and should not be reused after publication.

Each lesson tuple follows this shape:

```ts
[id, title, shortIntroduction, language, exampleSource, starterCode, requiredSourceTerms]
```

Keep the introduction short. The example should be valid code for the stated language and provider. Do not include credentials. The starter should require a learner change; the mock checker looks for the configured source terms and is clearly labelled as simulated. It does not execute learner code. Review the source terms to ensure the starter does not already satisfy them.

The current content builder supplies reusable theory, code explanation, exercise hints, a reference solution, quiz questions, and a summary. For a lesson that needs distinct checks, add lesson-specific `LessonBlock` definitions and preserve stable IDs. Quiz questions should have three to five objective questions, explanations, and a passing score. Keep reference solutions out of visible content until a learner has attempted the exercise. `ExerciseService` is the current deterministic mock checker; `CodeExecutionService` describes a future isolated runner and is not connected in mock mode.

## Curriculum status

The first module is published and should contain three complete lessons. The remaining five modules are generated as three-lesson outlines with `status: "draft"`. Draft lessons have no blocks or objectives and must stay unavailable from lesson routes and navigation. Change a lesson to `published` only after its code, exercise, quiz, prerequisites, and completion requirements have been reviewed.

## Add a block type

Extend the discriminated `LessonBlock` union in `src/types/index.ts`, then add its renderer case to `renderBlock` in `src/components/learning/lesson-engine.tsx`. Content blocks need stable IDs and must not contain learner-specific progress. Keep persistence behind the service interfaces in `src/services/index.ts`.

## Checks before publishing

- Confirm the provider package and method names against their current official documentation.
- Confirm examples compile conceptually in their stated language and do not claim to run in the lesson page.
- Make exercise criteria deterministic and explain whether a check is simulated or executed.
- Make every quiz question assess something taught in that lesson.
- Verify lesson completion requires both a passing exercise and quiz result.
