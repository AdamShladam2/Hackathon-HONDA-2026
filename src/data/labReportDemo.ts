import { DocumentEditSession, Project, SharedDocumentActivity, WorkEvidence } from '../types';
import { DEMO_STUDENTS } from './mockData';

// Demo: an ENGR 1181 group lab report written in a shared Google Doc. The edit sessions
// are what the doc's version history shows for each member.

const alex = DEMO_STUDENTS[0];

const MEMBERS = {
  alex: { id: alex.id, name: alex.name, avatar: alex.avatar },
  samira: {
    id: 'cm-samira-khan',
    name: 'Samira Khan',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
  },
  brandon: {
    id: 'cm-brandon-ortiz',
    name: 'Brandon Ortiz',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&auto=format&fit=crop&q=80',
  },
  daniel: {
    id: 'cm-dan-miller',
    name: 'Daniel Miller',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
  },
};

let n = 0;
// Times are Eastern (UTC-4 in October)
const session = (
  memberId: string,
  sectionId: string,
  localStart: string,
  minutes: number,
  wordsAdded: number,
  wordsDeleted: number,
  activity: DocumentEditSession['activity'],
  note: string,
  comments = 0
): DocumentEditSession => ({
  id: `lab5-s${++n}`,
  memberId,
  sectionId,
  start: new Date(`${localStart}:00-04:00`).toISOString(),
  minutes,
  wordsAdded,
  wordsDeleted,
  comments,
  activity,
  note,
});

export const LAB_REPORT_DOC_EVIDENCE_ID = 'evidence-engr1181-lab5-gdoc';
const LAB_REPORT_DOC_TITLE = 'ENGR 1181 Lab 5 – Beam Deflection (Group Report)';

export const LAB_REPORT_DEMO_PROJECT: Project = {
  id: 'class-proj-engr1181-lab5',
  title: 'ENGR 1181 Lab 5: Beam Deflection & Material Stiffness',
  summary: 'Group lab report measuring how aluminum and steel beams deflect under load to find each material’s stiffness.',
  description:
    'We loaded simply supported aluminum and steel beams at six weights, measured mid-span deflection with a dial gauge, and calculated Young’s modulus from the slope of load vs. deflection. The report compares our values with handbook values and explains the error.',
  whatItDoes: 'Calculates Young’s modulus for aluminum and steel from measured beam deflection.',
  useCases: ['ENGR 1181 lab report'],
  targetAudience: 'ENGR 1181 students and instructors',
  tags: ['ENGR 1181', 'Lab Report', 'Materials', 'Uncertainty Analysis'],
  codeAvailability: 'none',
  githubRepo: null,
  status: 'Finished',
  openRoles: [],
  author: alex,
  teamMembers: [
    { ...MEMBERS.alex, role: 'Data & Results', identity: 'Student', contributionDescription: 'Recorded measurements, built tables and plots, and computed E.' },
    { ...MEMBERS.samira, role: 'Theory & Error Analysis', identity: 'Student', contributionDescription: 'Wrote the theory section and the uncertainty propagation.' },
    { ...MEMBERS.brandon, role: 'Procedure & Formatting', identity: 'Student', contributionDescription: 'Wrote the procedure and conclusion, and formatted the report.' },
    { ...MEMBERS.daniel, role: 'Abstract', identity: 'Student', contributionDescription: 'Wrote the abstract.' },
  ],
  interestCount: 6,
  viewCount: 41,
  createdAt: '2026-10-21T04:30:00Z',
  hubType: 'campus',
  school: 'Ohio State University',
  isClassProject: true,
  courseCode: 'ENGR 1181',
  courseName: 'Engineering Fundamentals & Rover Design',
  professorName: 'Dr. Sarah Lin',
  attachedFiles: [
    {
      id: 'file-lab5-gdoc',
      name: LAB_REPORT_DOC_TITLE,
      size: '2,725 words',
      type: 'Google Doc',
      mimeType: 'application/vnd.google-apps.document',
      url: '',
      source: 'google_doc',
      evidenceId: LAB_REPORT_DOC_EVIDENCE_ID,
      labeledStudentId: 'team',
      labeledStudentName: 'Whole Team Deliverable',
      description: 'The shared Google Doc the group wrote the report in. Open it to see its version history.',
      uploadedAt: '2026-10-14T22:55:00Z',
    },
    {
      id: 'file-lab5-report',
      name: 'ENGR1181_Lab5_Beam_Deflection_Report.pdf',
      size: '2.4 MB',
      type: 'PDF Document',
      url: '#',
      labeledStudentId: 'team',
      labeledStudentName: 'Whole Team Deliverable',
      description: 'Final report exported from the group Google Doc.',
      uploadedAt: '2026-10-21T03:50:00Z',
    },
    {
      id: 'file-lab5-data',
      name: 'beam_deflection_measurements.xlsx',
      size: '86 KB',
      type: 'Spreadsheet',
      url: '#',
      labeledStudentId: MEMBERS.alex.id,
      labeledStudentName: MEMBERS.alex.name,
      description: 'Raw dial gauge readings and regression fit.',
      uploadedAt: '2026-10-15T23:40:00Z',
    },
  ],
  projectAssignments: ['Lab 5 Report'],
  peerAssessments: [
    { id: 'pa-lab5-1', assignmentName: 'Lab 5 Report', reviewerId: MEMBERS.alex.id, reviewerName: MEMBERS.alex.name, revieweeId: MEMBERS.samira.id, revieweeName: MEMBERS.samira.name, rating: 5, comment: 'Did the whole uncertainty derivation and caught our inertia mistake.', createdAt: '2026-10-21T05:00:00Z' },
    { id: 'pa-lab5-2', assignmentName: 'Lab 5 Report', reviewerId: MEMBERS.alex.id, reviewerName: MEMBERS.alex.name, revieweeId: MEMBERS.brandon.id, revieweeName: MEMBERS.brandon.name, rating: 4, comment: 'Procedure was clear and the formatting pass saved us.', createdAt: '2026-10-21T05:00:00Z' },
    { id: 'pa-lab5-3', assignmentName: 'Lab 5 Report', reviewerId: MEMBERS.alex.id, reviewerName: MEMBERS.alex.name, revieweeId: MEMBERS.daniel.id, revieweeName: MEMBERS.daniel.name, rating: 2, comment: 'Joined the night it was due.', createdAt: '2026-10-21T05:00:00Z' },
    { id: 'pa-lab5-4', assignmentName: 'Lab 5 Report', reviewerId: MEMBERS.samira.id, reviewerName: MEMBERS.samira.name, revieweeId: MEMBERS.alex.id, revieweeName: MEMBERS.alex.name, rating: 5, comment: 'Clean data tables and plots.', createdAt: '2026-10-21T13:00:00Z' },
    { id: 'pa-lab5-5', assignmentName: 'Lab 5 Report', reviewerId: MEMBERS.samira.id, reviewerName: MEMBERS.samira.name, revieweeId: MEMBERS.daniel.id, revieweeName: MEMBERS.daniel.name, rating: 2, createdAt: '2026-10-21T13:00:00Z' },
    { id: 'pa-lab5-6', assignmentName: 'Lab 5 Report', reviewerId: MEMBERS.brandon.id, reviewerName: MEMBERS.brandon.name, revieweeId: MEMBERS.samira.id, revieweeName: MEMBERS.samira.name, rating: 5, createdAt: '2026-10-21T15:00:00Z' },
  ],
  sharedDocument: {
    title: LAB_REPORT_DOC_TITLE,
    assignmentName: 'Lab 5 Report',
    dueAt: new Date('2026-10-20T23:59:00-04:00').toISOString(),
    finalWordCount: 2725,
    sections: [
      { id: 'abstract', title: 'Abstract', difficulty: 2, difficultyReason: 'Short summary of results written by others' },
      { id: 'intro', title: 'Introduction & Theory', difficulty: 2, difficultyReason: 'Background largely from the lab handout and textbook' },
      { id: 'procedure', title: 'Procedure', difficulty: 1, difficultyReason: 'Restates the steps from the lab handout' },
      { id: 'results', title: 'Data & Results', difficulty: 4, difficultyReason: 'Tables, plots and a regression fit to compute E' },
      { id: 'error', title: 'Error Analysis', difficulty: 5, difficultyReason: 'Uncertainty propagation through E = PL³ / 48δI' },
      { id: 'discussion', title: 'Discussion', difficulty: 4, difficultyReason: 'Explaining the gap between measured and handbook values' },
      { id: 'conclusion', title: 'Conclusion', difficulty: 2, difficultyReason: 'Restates the main results' },
      { id: 'refs', title: 'References & Formatting', difficulty: 1, difficultyReason: 'Citations, figure numbers and layout' },
    ],
    sessions: [
      session(MEMBERS.alex.id, 'results', '2026-10-14T19:00', 55, 420, 30, 'data', 'Entered deflection readings for all six loads and built Table 1'),
      session(MEMBERS.brandon.id, 'procedure', '2026-10-14T21:00', 30, 280, 10, 'writing', 'Wrote the procedure from the handout and setup photos'),
      session(MEMBERS.samira.id, 'intro', '2026-10-15T13:00', 35, 310, 20, 'writing', 'Drafted beam theory and the Euler–Bernoulli deflection equation'),
      session(MEMBERS.alex.id, 'results', '2026-10-15T20:30', 70, 380, 60, 'data', 'Plotted load vs. deflection, fit a regression line and computed E for both metals'),
      session(MEMBERS.brandon.id, 'refs', '2026-10-16T12:00', 15, 60, 0, 'writing', 'Added the textbook and ASTM references'),
      session(MEMBERS.samira.id, 'error', '2026-10-16T19:00', 80, 460, 90, 'writing', 'Derived the partial derivatives of E and propagated each measurement uncertainty'),
      session(MEMBERS.alex.id, 'error', '2026-10-17T18:00', 45, 210, 40, 'writing', 'Added caliper and dial gauge resolution to the uncertainty table'),
      session(MEMBERS.samira.id, 'error', '2026-10-18T14:00', 65, 240, 180, 'revising', 'Fixed the moment of inertia uncertainty and recomputed percent error'),
      session(MEMBERS.samira.id, 'discussion', '2026-10-18T20:00', 50, 350, 40, 'writing', 'Explained the 7% steel discrepancy (support friction, gauge zero drift)'),
      session(MEMBERS.samira.id, 'results', '2026-10-19T19:30', 20, 10, 5, 'reviewing', 'Commented on figure units and significant figures', 6),
      session(MEMBERS.alex.id, 'results', '2026-10-19T21:00', 40, 120, 150, 'revising', 'Fixed figure captions and units after Samira’s comments'),
      session(MEMBERS.brandon.id, 'conclusion', '2026-10-20T13:00', 30, 190, 20, 'writing', 'Wrote the conclusion summarizing both E values'),
      session(MEMBERS.alex.id, 'discussion', '2026-10-20T16:00', 25, 90, 20, 'reviewing', 'Flagged two discussion claims the data didn’t support', 3),
      session(MEMBERS.brandon.id, 'refs', '2026-10-20T21:30', 40, 40, 60, 'revising', 'Numbered figures and tables and fixed the citation style'),
      session(MEMBERS.daniel.id, 'abstract', '2026-10-20T22:10', 25, 180, 0, 'writing', 'Wrote the abstract'),
      session(MEMBERS.daniel.id, 'discussion', '2026-10-20T22:45', 20, 140, 10, 'writing', 'Added a paragraph on real-world uses of beam stiffness'),
      session(MEMBERS.daniel.id, 'procedure', '2026-10-20T23:15', 10, 20, 40, 'revising', 'Reworded two procedure steps'),
    ],
  },
};

const ACTIVITY_VERB: Record<DocumentEditSession['activity'], string> = {
  writing: 'Wrote',
  revising: 'Revised',
  reviewing: 'Reviewed',
  data: 'Added data to',
};

const doc = LAB_REPORT_DEMO_PROJECT.sharedDocument as SharedDocumentActivity;

// The Google Doc as work evidence, so the version history viewer and the
// contribution analysis can show it for every group member
export const LAB_REPORT_DOC_EVIDENCE: WorkEvidence = {
  id: LAB_REPORT_DOC_EVIDENCE_ID,
  title: LAB_REPORT_DOC_TITLE,
  url: '',
  evidenceType: 'Google Docs',
  description:
    'Group lab report written together in one Google Doc. Alex led Data & Results, Samira led Theory and Error Analysis, Brandon wrote the Procedure, Conclusion and formatting, and Daniel wrote the Abstract.',
  associatedProjectId: LAB_REPORT_DEMO_PROJECT.id,
  associatedProjectTitle: LAB_REPORT_DEMO_PROJECT.title,
  date: '2026-10-21',
  visibility: 'Team Only',
  status: 'Evidence attached',
  claimedSections: doc.sections.map((s) => s.title),
  contributors: Object.values(MEMBERS),
  documentTimeline: doc.sessions
    .slice()
    .sort((a, b) => b.start.localeCompare(a.start))
    .map((s) => {
      const member = Object.values(MEMBERS).find((m) => m.id === s.memberId);
      const section = doc.sections.find((x) => x.id === s.sectionId);
      return {
        timestamp: s.start,
        authorName: member?.name || 'Unknown',
        authorId: s.memberId,
        action: `${ACTIVITY_VERB[s.activity]} ${section?.title} · ${s.minutes} min · +${s.wordsAdded} / −${s.wordsDeleted} words${
          s.comments ? ` · ${s.comments} comments` : ''
        }`,
        section: section?.title || '',
        note: s.note,
      };
    }),
};
