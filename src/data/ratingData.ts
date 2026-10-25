import { TeammateRating } from '../types';

export const INITIAL_TEAMMATE_RATINGS: TeammateRating[] = [
  // Ratings for Alex Chen (Average: 4.8 / 5 across 5 reviews)
  {
    id: 'rate-alex-1',
    projectId: 'proj-1',
    projectTitle: 'BuckeyeRover Autonomous Terrain Navigator',
    reviewerId: 'author_marcus_v',
    reviewerName: 'Marcus Vance',
    reviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    reviewerRole: 'Peer',
    targetUserId: 'user_alex_chen',
    targetUserName: 'Alex Chen',
    ratings: {
      communication: 5,
      reliability: 5,
      collaboration: 5,
      qualityOfDeliverables: 5,
    },
    overallScore: 5.0,
    writtenFeedback:
      'Alex built an outstanding 3D telemetry dashboard with Three.js. Super proactive on WebSocket bug fixes and always showed up to standups prepared.',
    createdAt: '2026-10-22T14:30:00Z',
  },
  {
    id: 'rate-alex-2',
    projectId: 'proj-1',
    projectTitle: 'BuckeyeRover Autonomous Terrain Navigator',
    reviewerId: 'dev_elena_r',
    reviewerName: 'Elena Ramos',
    reviewerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
    reviewerRole: 'Peer',
    targetUserId: 'user_alex_chen',
    targetUserName: 'Alex Chen',
    ratings: {
      communication: 5,
      reliability: 4,
      collaboration: 5,
      qualityOfDeliverables: 5,
    },
    overallScore: 4.8,
    writtenFeedback:
      'Excellent collaborator. He translated our complex LiDAR sensor accuracy data into intuitive color heatmaps without losing any precision.',
    createdAt: '2026-10-22T16:15:00Z',
  },
  {
    id: 'rate-alex-3',
    projectId: 'assign-cse3901-raft-kv',
    projectTitle: 'CSE 3901: Distributed Consensus & Key-Value Store',
    reviewerId: 'user_prof_robert_hayes',
    reviewerName: 'Prof. Robert Hayes',
    reviewerAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&auto=format&fit=crop&q=80',
    reviewerRole: 'Teacher / Instructor',
    targetUserId: 'user_alex_chen',
    targetUserName: 'Alex Chen',
    ratings: {
      communication: 5,
      reliability: 5,
      collaboration: 4,
      qualityOfDeliverables: 5,
    },
    overallScore: 4.8,
    writtenFeedback:
      'Instructor evaluation: Alex demonstrated exceptional mastery of RPC concurrency rollback patterns and verified benchmarks. High-integrity contribution.',
    createdAt: '2026-10-23T11:00:00Z',
  },
  {
    id: 'rate-alex-4',
    projectId: 'work-1',
    projectTitle: 'ScaleGrid Autonomous Cluster Orchestrator',
    reviewerId: 'user_david_park',
    reviewerName: 'David Park',
    reviewerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    reviewerRole: 'Project Owner',
    targetUserId: 'user_alex_chen',
    targetUserName: 'Alex Chen',
    ratings: {
      communication: 4,
      reliability: 5,
      collaboration: 5,
      qualityOfDeliverables: 4,
    },
    overallScore: 4.5,
    writtenFeedback:
      'Fast learner. Picked up eBPF packet headers and wrote solid frontend instrumentation charts in React.',
    createdAt: '2026-10-20T18:20:00Z',
  },
  {
    id: 'rate-alex-5',
    projectId: 'work-3',
    projectTitle: 'Forma Calibrated Design System Tokens',
    reviewerId: 'user_elena_rostova',
    reviewerName: 'Elena Rostova',
    reviewerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80',
    reviewerRole: 'Project Owner',
    targetUserId: 'user_alex_chen',
    targetUserName: 'Alex Chen',
    ratings: {
      communication: 5,
      reliability: 5,
      collaboration: 5,
      qualityOfDeliverables: 5,
    },
    overallScore: 5.0,
    writtenFeedback:
      'Delivered WCAG AAA token exports ahead of schedule. Very communicative about edge cases.',
    createdAt: '2026-10-18T10:00:00Z',
  },

  // Ratings for Marcus Vance
  {
    id: 'rate-marcus-1',
    projectId: 'proj-1',
    projectTitle: 'BuckeyeRover Autonomous Terrain Navigator',
    reviewerId: 'user_alex_chen',
    reviewerName: 'Alex Chen',
    reviewerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    reviewerRole: 'Peer',
    targetUserId: 'author_marcus_v',
    targetUserName: 'Marcus Vance',
    ratings: {
      communication: 4,
      reliability: 5,
      collaboration: 5,
      qualityOfDeliverables: 5,
    },
    overallScore: 4.7,
    writtenFeedback:
      'Marcus is a wizard with ROS2 nodes. His IPC ring buffer never drops a frame even under heavy simulator loads.',
    createdAt: '2026-10-22T14:45:00Z',
  },

  // Ratings for Elena Ramos
  {
    id: 'rate-elena-1',
    projectId: 'proj-1',
    projectTitle: 'BuckeyeRover Autonomous Terrain Navigator',
    reviewerId: 'user_alex_chen',
    reviewerName: 'Alex Chen',
    reviewerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    reviewerRole: 'Peer',
    targetUserId: 'dev_elena_r',
    targetUserName: 'Elena Ramos',
    ratings: {
      communication: 5,
      reliability: 5,
      collaboration: 5,
      qualityOfDeliverables: 5,
    },
    overallScore: 5.0,
    writtenFeedback:
      'Her documentation was the clearest on the whole team. The benchmarking charts made it so easy to catch camera calibration drift.',
    createdAt: '2026-10-22T15:00:00Z',
  },

  // Ratings for Devon Miller (Incomplete evidence / mixed feedback)
  {
    id: 'rate-devon-1',
    projectId: 'proj-1',
    projectTitle: 'BuckeyeRover Autonomous Terrain Navigator',
    reviewerId: 'author_marcus_v',
    reviewerName: 'Marcus Vance',
    reviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    reviewerRole: 'Peer',
    targetUserId: 'user_devon_miller',
    targetUserName: 'Devon Miller',
    ratings: {
      communication: 4,
      reliability: 3,
      collaboration: 4,
      qualityOfDeliverables: 3,
    },
    overallScore: 3.5,
    writtenFeedback:
      'Devon attended planning meetings reliably, but the automated test harness commits were not pushed to our main repo before the demo milestone.',
    createdAt: '2026-10-22T16:00:00Z',
  },

  // Ratings for Maya Lin
  {
    id: 'rate-maya-1',
    projectId: 'work-3',
    projectTitle: 'Forma Calibrated Design System Tokens',
    reviewerId: 'user_elena_rostova',
    reviewerName: 'Elena Rostova',
    reviewerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80',
    reviewerRole: 'Project Owner',
    targetUserId: 'user_maya_lin',
    targetUserName: 'Maya Lin',
    ratings: {
      communication: 5,
      reliability: 4,
      collaboration: 5,
      qualityOfDeliverables: 4,
    },
    overallScore: 4.5,
    writtenFeedback:
      'Maya has great design intuition. She mapped user personas quickly and contributed clean Figma token specs.',
    createdAt: '2026-10-21T10:00:00Z',
  },
];

/**
 * Calculates average rating and review count for an author.
 */
export function getUserRatingSummary(
  userId: string,
  allRatings: TeammateRating[] = INITIAL_TEAMMATE_RATINGS
): { averageScore: number; reviewCount: number; ratings: TeammateRating[] } {
  const userRatings = allRatings.filter((r) => r.targetUserId === userId && !r.flagged);
  if (userRatings.length === 0) {
    return { averageScore: 0, reviewCount: 0, ratings: [] };
  }
  const sum = userRatings.reduce((acc, r) => acc + r.overallScore, 0);
  const averageScore = Number((sum / userRatings.length).toFixed(1));
  return { averageScore, reviewCount: userRatings.length, ratings: userRatings };
}
