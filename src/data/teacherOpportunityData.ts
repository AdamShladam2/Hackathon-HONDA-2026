import { OpportunityApplication, TeacherOpportunity } from '../types';
import { DEMO_TEACHER_ENGR } from './teacherData';

// Seed opportunity so the student Opportunities page and the teacher view are not empty
export const INITIAL_TEACHER_OPPORTUNITIES: TeacherOpportunity[] = [
  {
    id: 'opportunity-lin-beam-lab',
    kind: 'Research',
    teacherId: DEMO_TEACHER_ENGR.id,
    teacherName: DEMO_TEACHER_ENGR.name,
    teacherAvatar: DEMO_TEACHER_ENGR.avatar,
    department: DEMO_TEACHER_ENGR.department,
    school: 'Ohio State University',
    title: 'Undergraduate Research Assistant: First-Year Lab Learning',
    description:
      'Help study how first-year engineering teams split work on lab reports. You will code anonymized lab report revision histories, run short surveys, and help summarize findings for an engineering education paper.',
    hoursPerWeek: '6-8 hrs/week',
    compensation: 'Paid',
    relatedCourse: 'ENGR 1181',
    openings: 2,
    deadline: '2026-11-20',
    status: 'open',
    createdAt: '2026-10-12T15:00:00.000Z',
  },
];

export const INITIAL_OPPORTUNITY_APPLICATIONS: OpportunityApplication[] = [];
