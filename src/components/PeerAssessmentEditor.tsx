import React from 'react';
import { Star } from 'lucide-react';
import { PeerAssessment } from '../types';

export interface PeerRatingDraft {
  rating: number; // 0 = not rated yet
  comment: string;
}

interface PeerAssessmentEditorProps {
  people: { id: string; name: string; avatar?: string }[];
  value: Record<string, PeerRatingDraft>;
  onChange: (value: Record<string, PeerRatingDraft>) => void;
}

export const RATING_LABELS = ['', 'Did little', 'Below expectations', 'Met expectations', 'Strong work', 'Outstanding'];

// Turns the rated rows of a draft into saved assessments for one assignment
export function draftToAssessments(
  draft: Record<string, PeerRatingDraft>,
  people: { id: string; name: string }[],
  assignmentName: string,
  reviewer: { id: string; name: string }
): PeerAssessment[] {
  return people
    .filter((p) => (draft[p.id]?.rating || 0) > 0)
    .map((p) => ({
      id: `pa-${Date.now()}-${p.id}-${Math.random().toString(36).slice(2, 6)}`,
      assignmentName,
      reviewerId: reviewer.id,
      reviewerName: reviewer.name,
      revieweeId: p.id,
      revieweeName: p.name,
      rating: draft[p.id].rating,
      comment: draft[p.id].comment.trim() || undefined,
      createdAt: new Date().toISOString(),
    }));
}

// Rate each teammate's work (1-5 stars) with an optional comment
export const PeerAssessmentEditor: React.FC<PeerAssessmentEditorProps> = ({ people, value, onChange }) => {
  const update = (id: string, patch: Partial<PeerRatingDraft>) =>
    onChange({ ...value, [id]: { ...(value[id] || { rating: 0, comment: '' }), ...patch } });

  return (
    <div className="space-y-2">
      {people.map((p) => {
        const row = value[p.id] || { rating: 0, comment: '' };
        return (
          <div key={p.id} className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-800 min-w-0">
                {p.avatar && <img src={p.avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />}
                <span className="truncate">{p.name}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="flex" role="radiogroup" aria-label={`Rate ${p.name}`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={row.rating === n}
                      aria-label={`${n} star${n > 1 ? 's' : ''}: ${RATING_LABELS[n]}`}
                      onClick={() => update(p.id, { rating: row.rating === n ? 0 : n })}
                      className="p-0.5 cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${n <= row.rating ? 'text-amber-500 fill-amber-400' : 'text-slate-300'}`}
                      />
                    </button>
                  ))}
                </span>
                <span className="text-[10px] text-slate-500 w-24 text-right">
                  {row.rating ? RATING_LABELS[row.rating] : 'Not rated'}
                </span>
              </span>
            </div>
            <input
              type="text"
              value={row.comment}
              onChange={(e) => update(p.id, { comment: e.target.value })}
              placeholder={`What did ${p.name.split(' ')[0]} contribute to this assignment? (optional)`}
              className="w-full text-[11px] px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md"
            />
          </div>
        );
      })}
    </div>
  );
};
