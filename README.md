# Open Test Series

Offline-capable, fast-setup, open-source test series platform. No backend required—serve static JSON tests and start practicing.

- React + Vite + Tailwind CSS
- Works with static hosting (GitHub Pages, Netlify, Vercel) or `vite preview`
- Exam data loaded from JSON in `public/exams`

## Features

- Test catalog (full/subject/topic) from a single manifest
- Sectioned exams with timers, navigation, mark-for-review
- Local persistence for attempts (localStorage fallback to memory)
- Dark mode and responsive layout
- Error and loading states

## Quick Start

- Node 18+ recommended

```bash
pnpm i # or npm i / yarn
pnpm dev
# build: pnpm build
# preview (static): pnpm preview
```

Open http://localhost:5173

## Project Structure

- public/exams/exams_manifest.json: index of all tests
- public/exams/...: JSON files for each exam
- src/pages: main pages (dashboard, exams, exam runner)
- src/components: layout, UI, exam widgets
- src/services: data/attempts services
- src/hooks: exam state, navigation, timer

## Add Exams

1) Create or reuse an exam JSON (example):
- public/exams/full-tests/nimcet/nimcet_mock1.json

2) Register it in the manifest:
- public/exams/exams_manifest.json

Minimal entry example:

```json
{
  "full_tests": [
    {
      "exam_id": "sample_full_1",
      "exam_name": "Sample Full Test",
      "category": "Demo",
      "subjects": ["Math", "Reasoning"],
      "topics": ["Algebra", "Puzzles"],
      "duration_minutes": 60,
      "total_marks": 100,
      "total_questions": 25,
      "exam_strength": "easy",
      "file": "/exams/full-tests/sample/sample_full_1.json"
    }
  ],
  "subject_tests": [],
  "topic_tests": []
}
```

Exam JSON shape (abridged):

```json
{
  "exam_id": "string",
  "exam_name": "string",
  "duration_minutes": 120,
  "total_marks": 400,
  "total_questions": 100,
  "exam_strength": "easy|medium|hard",
  "sections": [
    {
      "section_id": "A",
      "section_name": "Mathematics",
      "max_marks": 100,
      "time_limit_minutes": 60,
      "questions": [
        {
          "q_id": "A1",
          "question_text": "text or markdown-like",
          "options": [{ "opt_id": "1", "text": "Option A" }],
          "correct_opt_id": "1",
          "marks": 4,
          "negative_marks": -1
        }
      ]
    }
  ]
}
```

## Scripts

- dev: Vite dev server
- build: production build
- preview: static preview server

## Tech

- React 19, react-router-dom
- Vite 7
- Tailwind CSS v4
- react-icons, lucide-react

## Data & Attempts

- Attempts stored in localStorage (`attempts` key), with in-memory fallback.
- Static fetch from `/public/exams` via relative paths.

## License

MIT. See LICENCE.