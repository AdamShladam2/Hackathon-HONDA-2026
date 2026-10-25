# collabr

collabr helps students find teammates, show the work they did, and get credit for it. It has two modes:

- **Campus**: school projects at your university. Find classmates by course, invite them to an assignment, post class projects, and show your part of the work with Google Doc version history and peer ratings.
- **Discover**: personal and professional projects that aren't tied to a school. Browse projects, apply to collaborate (with a resume), and find opportunities.

Teachers get their own mode with their students, the posts in their classes, an integrity check and the opportunities they offer.

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Data is saved in the browser (localStorage and IndexedDB), so there is no database to set up.

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | Type-check with `tsc --noEmit` |

### Optional: Claude summaries

The teacher Integrity Check can have Claude write its summaries. Copy `.env.example` to `.env` and set:

```
ANTHROPIC_API_KEY=your-key
```

The key is only read by the dev/preview server (`server/integritySummary.ts`) and never reaches the browser. Only the computed signals are sent to Claude, not the students' work. Without a key, the app shows a built-in summary.

## Demo accounts

Click your name at the top right (or **Or try a demo account** on the sign-in page) to switch accounts without a password:

| Account | Shows |
| --- | --- |
| Alex Chen (student, Ohio State) | Campus mode, My Classes, Find Teammates, the ENGR 1181 Lab 5 group report |
| Maya Okonkwo (student, ENGR 1181) | A teammate match backed by Google Doc version histories and peer ratings |
| Dr. Sarah Lin (teacher, ENGR 1181) | Teacher mode: students, class posts, Integrity Check, opportunities |
| Prof. Robert Hayes (teacher, CSE 3901 / 5521) | Teacher mode with individual CSE submissions |

You can also sign in with any school email. Ohio State addresses use `@osu.edu`.

## Features

### Students

- **Find Teammates**: swipe through classmates and other students, ranked by shared courses, skills, availability and peer ratings. Each card links to a contribution portfolio.
- **Class invites**: invite a classmate to an assignment. Only the assignment is required; the class, what they could work on and a message are optional.
- **Class projects**: post a project for a course with labeled files, each student's contribution and peer ratings.
- **Google Doc effort analysis**: shows each group member's editing time, effort weighted by section difficulty and when they worked, using the doc's version history.
- **Carmen / Canvas**: connect with a calendar feed link or an access token to import your courses, assignments and classmates.
- **Opportunities**: research, TA, grader and other positions from professors, plus cross-hub projects. Apply with a saved resume (PDF or Word, up to 5 MB).

### Teachers

- **My Students**: everyone in the courses you teach, with their posts and peer ratings.
- **Class Posts**: posts made in your courses, with contribution analysis and Google Doc effort.
- **Integrity Check**: scores how likely each student's work needs a closer look (0–100: High is 50 or more, Medium is 25–49). Every score is built from signals that show their evidence:
  - large blocks added faster than anyone types, which are likely pasted
  - all edits in the last hours before the deadline, or most of them on the final day
  - a small share of the group's work, or no edits at all
  - low peer ratings
  - word-sequence overlap with other submissions and reference material (assignment boilerplate is ignored)

  It only covers courses you teach. A score is a reason to talk with the student, not proof of cheating.
- **Opportunities**: post research, TA, grader, lab assistant and tutor positions, then review applicants and their resumes.
- **Connect Carmen**: load the courses you teach.

## Project structure

```
server/            Dev/preview server endpoint for Claude summaries
src/
  components/      React views and modals
  context/         AppContext: app state, saved to localStorage
  data/            Demo accounts, courses, projects and submissions
  hooks/           Shared hooks (e.g. the teacher's courses and posts)
  services/        Canvas, contribution analysis, similarity, integrity scoring, file storage
  types/           Shared TypeScript types
vite.config.ts     Vite config, plus the Canvas proxy and the summary endpoint
```

Built with React 19, TypeScript, Vite, Tailwind CSS 4 and lucide-react. The Canvas API proxy and the Claude summary endpoint run as Vite server middleware, so they work with `npm run dev` and `npm run preview`. A static host would need its own server for them.
