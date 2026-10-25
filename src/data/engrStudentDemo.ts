import { Author, DocumentTimelineEvent, PastWorkRecord, TeammateRating, WorkEvidence } from '../types';

// ENGR 1181 student shown in Find Teammates: her past lab reports were written in Google Docs,
// and the version histories show she carried the hard analysis sections early and steadily.
export const ENGR_STUDENT_ID = 'user_maya_okonkwo';

export const DEMO_ENGR_STUDENT: Author = {
  id: ENGR_STUDENT_ID,
  name: 'Maya Okonkwo',
  email: 'okonkwo.37@osu.edu',
  avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=160&auto=format&fit=crop&q=80',
  school: 'Ohio State University',
  major: 'Civil Engineering',
  graduationYear: "'29",
  bio: 'First-year civil engineering student in ENGR 1181. I like the analysis side of lab work: MATLAB curve fits, uncertainty, and turning messy data into clear figures. I start drafts early and keep the shared doc organized.',
  identities: ['Student'],
  skills: ['MATLAB', 'Python', 'C++', 'Technical Writing', 'Data Analysis', 'Excel', 'SolidWorks'],
  nonTechnicalSkills: ['Clear Writing', 'Planning Ahead', 'Peer Editing'],
  availability: '10-12 hrs/week',
  collaborationPreferences: 'In person for labs, shared Google Doc for writing',
  githubConnected: false,
};

const LIN = { id: 'user_prof_sarah_lin', name: 'Dr. Sarah Lin', role: 'ENGR 1181 Instructor' };
const maya = { id: ENGR_STUDENT_ID, name: 'Maya Okonkwo', avatar: DEMO_ENGR_STUDENT.avatar };
const brandon = {
  id: 'cm-brandon-ortiz',
  name: 'Brandon Ortiz',
  avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&auto=format&fit=crop&q=80',
};
const jun = {
  id: 'cm-jun-park',
  name: 'Jun Park',
  avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
};
const leah = {
  id: 'cm-leah-schmidt',
  name: 'Leah Schmidt',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
};

const event = (timestamp: string, who: { id: string; name: string }, section: string, action: string, note: string): DocumentTimelineEvent => ({
  timestamp,
  authorId: who.id,
  authorName: who.name,
  section,
  action,
  note,
});

const LAB3_DOC: WorkEvidence = {
  id: 'evidence-maya-lab3-gdoc',
  title: 'ENGR 1181 Lab 3: Truss Load Testing Report (Google Doc)',
  url: 'https://docs.google.com/document/d/1demo-maya-engr1181-lab3/edit',
  evidenceType: 'Google Docs',
  description:
    'Wrote the Methods, the MATLAB load-deflection analysis and the full uncertainty section (the two hardest rubric sections), then edited the team discussion for consistency.',
  associatedProjectId: 'engr1181-lab3-truss',
  associatedProjectTitle: 'ENGR 1181 Lab 3: Truss Load Testing',
  date: '2026-09-26',
  visibility: 'Team Only',
  status: 'Reviewer-confirmed',
  reviewedBy: LIN,
  reviewedDate: '2026-09-30',
  reviewerFeedback:
    'Version history matches the claimed sections. Maya drafted the analysis four days before the deadline and her uncertainty treatment was the strongest in the section.',
  claimedSections: ['Methods', 'Results: MATLAB load-deflection fit', 'Uncertainty analysis', 'Discussion edits'],
  contributors: [maya, brandon, jun],
  documentTimeline: [
    event('2026-09-20T19:05:00-04:00', maya, 'Outline', 'Created the report outline from the rubric', 'Set up headings and assigned sections in a comment thread'),
    event('2026-09-21T15:40:00-04:00', maya, 'Methods', 'Drafted Methods (612 words)', 'Test setup, load steps, dial gauge readings'),
    event('2026-09-22T20:10:00-04:00', maya, 'Results', 'Added MATLAB linear fit and residual plot', 'Stiffness estimate with R² = 0.987'),
    event('2026-09-23T13:25:00-04:00', brandon, 'Introduction', 'Drafted Introduction (340 words)', 'Truss background and objectives'),
    event('2026-09-23T21:00:00-04:00', maya, 'Uncertainty', 'Wrote uncertainty propagation section (480 words)', 'Gauge resolution and load-cell error carried through to stiffness'),
    event('2026-09-24T18:30:00-04:00', jun, 'Discussion', 'Drafted Discussion (390 words)', 'Compared measured and theoretical deflection'),
    event('2026-09-25T16:45:00-04:00', maya, 'Discussion', 'Edited Discussion and linked it to the uncertainty bounds', 'Resolved 6 comments'),
    event('2026-09-26T10:15:00-04:00', brandon, 'Figures', 'Formatted figures and captions', 'Final layout pass'),
  ],
};

const LAB4_SHEET: WorkEvidence = {
  id: 'evidence-maya-lab4-gsheet',
  title: 'ENGR 1181 Lab 4: Thermal Conductivity Data (Google Sheet)',
  url: 'https://docs.google.com/spreadsheets/d/1demo-maya-engr1181-lab4/edit',
  evidenceType: 'Google Sheets',
  description: 'Built the shared data sheet: unit conversions, steady-state detection and the conductivity calculation every teammate used.',
  associatedProjectId: 'engr1181-lab4-thermal',
  associatedProjectTitle: 'ENGR 1181 Lab 4: Thermal Conductivity',
  date: '2026-10-08',
  visibility: 'Team Only',
  status: 'Reviewer-confirmed',
  reviewedBy: LIN,
  reviewedDate: '2026-10-12',
  reviewerFeedback: 'Sheet formulas are hers per the edit history; the team report cites it throughout.',
  contributors: [maya, leah],
};

const LAB4_DOC: WorkEvidence = {
  id: 'evidence-maya-lab4-gdoc',
  title: 'ENGR 1181 Lab 4: Thermal Conductivity Report (Google Doc)',
  url: 'https://docs.google.com/document/d/1demo-maya-engr1181-lab4-report/edit',
  evidenceType: 'Google Docs',
  description: 'Wrote Results and Error Analysis, and reviewed every other section with tracked suggestions.',
  associatedProjectId: 'engr1181-lab4-thermal',
  associatedProjectTitle: 'ENGR 1181 Lab 4: Thermal Conductivity',
  date: '2026-10-10',
  visibility: 'Team Only',
  status: 'Reviewer-confirmed',
  reviewedBy: LIN,
  reviewedDate: '2026-10-12',
  reviewerFeedback: 'Even split with Leah on writing; Maya owned the quantitative sections.',
  claimedSections: ['Results', 'Error analysis', 'Peer review suggestions'],
  contributors: [maya, leah],
  documentTimeline: [
    event('2026-10-04T17:20:00-04:00', leah, 'Introduction', 'Drafted Introduction and Theory (520 words)', 'Fourier law background'),
    event('2026-10-05T19:45:00-04:00', maya, 'Results', 'Drafted Results with conductivity table (450 words)', 'Linked to the shared data sheet'),
    event('2026-10-06T21:10:00-04:00', maya, 'Error analysis', 'Wrote Error Analysis (390 words)', 'Heat loss through insulation estimated at 4%'),
    event('2026-10-07T16:00:00-04:00', leah, 'Conclusion', 'Drafted Conclusion (210 words)', ''),
    event('2026-10-08T20:30:00-04:00', maya, 'Whole report', 'Reviewed all sections with 14 suggestions', 'Leah accepted 12'),
    event('2026-10-09T12:05:00-04:00', leah, 'Formatting', 'Final formatting and references', 'Submitted a day early'),
  ],
};

const MATLAB_DOC: WorkEvidence = {
  id: 'evidence-maya-matlab-gdoc',
  title: 'ENGR 1181 MATLAB Project: Rover Path Planning Memo (Google Doc)',
  url: 'https://docs.google.com/document/d/1demo-maya-engr1181-matlab/edit',
  evidenceType: 'Google Docs',
  description: 'Wrote the algorithm explanation and test-case section of the design memo, and the MATLAB script it documents.',
  associatedProjectId: 'engr1181-matlab-rover',
  associatedProjectTitle: 'ENGR 1181 MATLAB Project: Rover Path Planning',
  date: '2026-10-21',
  visibility: 'Team Only',
  status: 'Evidence attached',
  claimedSections: ['Algorithm', 'Test cases'],
  contributors: [maya, jun],
  documentTimeline: [
    event('2026-10-16T18:00:00-04:00', maya, 'Algorithm', 'Drafted grid search explanation with flowchart (530 words)', ''),
    event('2026-10-18T14:30:00-04:00', jun, 'Background', 'Drafted problem background (260 words)', ''),
    event('2026-10-19T20:15:00-04:00', maya, 'Test cases', 'Added 5 test maps with screenshots and run times', 'All paths verified against hand solutions'),
    event('2026-10-20T19:40:00-04:00', jun, 'Conclusion', 'Wrote conclusion and limitations (180 words)', ''),
  ],
};

export const ENGR_STUDENT_PAST_WORK: PastWorkRecord[] = [
  {
    id: 'pw-maya-lab3',
    projectId: 'engr1181-lab3-truss',
    projectTitle: 'ENGR 1181 Lab 3: Truss Load Testing Report',
    isAcademicProject: true,
    courseCode: 'ENGR 1181',
    role: 'Analysis & Methods Lead',
    responsibilities: ['Set up the shared report outline', 'MATLAB load-deflection fit', 'Uncertainty propagation'],
    skillsDemonstrated: ['MATLAB', 'Data Analysis', 'Technical Writing'],
    individualContributionSummary:
      'Started the Google Doc and outline, wrote Methods, Results and the uncertainty section (the highest-difficulty rubric items), and edited the Discussion. About 55% of the document by version history.',
    completedTasks: ['Report outline', 'MATLAB stiffness fit and residual plot', 'Uncertainty analysis', 'Discussion edit pass'],
    evidenceList: [LAB3_DOC],
    reviewerConfirmedCount: 1,
    overallStatus: 'Reviewer-confirmed',
    reviewerNotes: 'Claims match the Google Doc version history.',
    reviewedByTeacher: 'Dr. Sarah Lin',
    reviewedDate: '2026-09-30',
    isPublicShowcaseApproved: true,
  },
  {
    id: 'pw-maya-lab4',
    projectId: 'engr1181-lab4-thermal',
    projectTitle: 'ENGR 1181 Lab 4: Thermal Conductivity',
    isAcademicProject: true,
    courseCode: 'ENGR 1181',
    role: 'Data & Results Lead',
    responsibilities: ['Shared data sheet', 'Results and error analysis', 'Peer review of the full report'],
    skillsDemonstrated: ['Excel', 'Data Analysis', 'Technical Writing'],
    individualContributionSummary:
      'Built the Google Sheet the team calculated from, wrote Results and Error Analysis, and reviewed every section. Submitted a day early.',
    completedTasks: ['Conductivity calculation sheet', 'Results section', 'Error analysis', 'Full-report review'],
    evidenceList: [LAB4_SHEET, LAB4_DOC],
    reviewerConfirmedCount: 2,
    overallStatus: 'Reviewer-confirmed',
    reviewerNotes: 'Sheet and report sections both confirmed from edit history.',
    reviewedByTeacher: 'Dr. Sarah Lin',
    reviewedDate: '2026-10-12',
    isPublicShowcaseApproved: true,
  },
  {
    id: 'pw-maya-matlab',
    projectId: 'engr1181-matlab-rover',
    projectTitle: 'ENGR 1181 MATLAB Project: Rover Path Planning',
    isAcademicProject: true,
    courseCode: 'ENGR 1181',
    role: 'Algorithm & Testing',
    responsibilities: ['Grid search path planner in MATLAB', 'Design memo algorithm and test sections'],
    skillsDemonstrated: ['MATLAB', 'Technical Writing'],
    individualContributionSummary: 'Wrote the path planner and documented it with five verified test maps in the team memo.',
    completedTasks: ['Path planning script', 'Algorithm explanation', 'Test case write-up'],
    evidenceList: [MATLAB_DOC],
    reviewerConfirmedCount: 0,
    overallStatus: 'Evidence attached',
  },
];

const rating = (
  id: string,
  projectId: string,
  projectTitle: string,
  reviewer: { id: string; name: string; avatar: string },
  reviewerRole: TeammateRating['reviewerRole'],
  scores: TeammateRating['ratings'],
  writtenFeedback: string,
  createdAt: string
): TeammateRating => ({
  id,
  projectId,
  projectTitle,
  reviewerId: reviewer.id,
  reviewerName: reviewer.name,
  reviewerAvatar: reviewer.avatar,
  reviewerRole,
  targetUserId: ENGR_STUDENT_ID,
  targetUserName: 'Maya Okonkwo',
  ratings: scores,
  overallScore: Math.round(((scores.communication + scores.reliability + scores.collaboration + scores.qualityOfDeliverables) / 4) * 10) / 10,
  writtenFeedback,
  createdAt,
});

export const ENGR_STUDENT_RATINGS: TeammateRating[] = [
  rating(
    'rate-maya-1',
    'engr1181-lab3-truss',
    'ENGR 1181 Lab 3: Truss Load Testing Report',
    brandon,
    'Peer',
    { communication: 5, reliability: 5, collaboration: 5, qualityOfDeliverables: 5 },
    'Maya had the outline and Methods up before the rest of us started. Her MATLAB fit made the Results section easy.',
    '2026-09-28T18:00:00Z'
  ),
  rating(
    'rate-maya-2',
    'engr1181-lab4-thermal',
    'ENGR 1181 Lab 4: Thermal Conductivity',
    leah,
    'Peer',
    { communication: 5, reliability: 5, collaboration: 4, qualityOfDeliverables: 5 },
    'Her review comments were specific and kind. We turned it in a day early.',
    '2026-10-11T15:30:00Z'
  ),
  rating(
    'rate-maya-3',
    'engr1181-lab3-truss',
    'ENGR 1181 Lab 3: Truss Load Testing Report',
    { id: LIN.id, name: LIN.name, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80' },
    'Teacher / Instructor',
    { communication: 5, reliability: 5, collaboration: 5, qualityOfDeliverables: 4 },
    'Instructor evaluation: consistent early progress in the shared doc and the strongest uncertainty analysis in her section.',
    '2026-09-30T20:00:00Z'
  ),
];
