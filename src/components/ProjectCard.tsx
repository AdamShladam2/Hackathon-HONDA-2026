import React from 'react';
import { Project } from '../types';
import { useApp } from '../context/AppContext';
import {
  GitBranch,
  KeyRound,
  Eye,
  Heart,
  Users,
  ExternalLink,
  Github,
  Star,
  GraduationCap,
  ShieldCheck,
  Briefcase,
  Paperclip,
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const { toggleInterest } = useApp();

  const getCodeBadge = () => {
    switch (project.codeAvailability) {
      case 'public':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded">
            <GitBranch className="w-3 h-3 text-emerald-600" />
            Code public
          </span>
        );
      case 'on_request':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded">
            <KeyRound className="w-3 h-3 text-amber-600" />
            Code on request
          </span>
        );
      case 'none':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
            <Eye className="w-3 h-3 text-slate-500" />
            No code (Demo only)
          </span>
        );
    }
  };

  const isStudent = project.author.identities?.includes('Student') || !!project.author.school;
  const authorSubtitle = isStudent
    ? `${project.author.school || 'University'}${project.author.major ? ` · ${project.author.major}` : ''}`
    : project.author.jobTitle
    ? `${project.author.jobTitle}${project.author.organization ? ` at ${project.author.organization}` : ''}`
    : project.author.organization || project.author.industry || 'Independent Developer';

  return (
    <div
      onClick={() => onSelect(project)}
      className="group relative flex flex-col justify-between bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-pointer text-left"
    >
      <div>
        {/* Top bar of card: Code badge, Hub tag & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {getCodeBadge()}

            {project.hubType === 'work' ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                <Briefcase className="w-3 h-3 text-blue-600" />
                Work Hub
              </span>
            ) : project.isClassProject ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded" title="Teacher-Managed Academic Project with Protected Solutions">
                <GraduationCap className="w-3 h-3 text-indigo-600" />
                Academic Project
              </span>
            ) : null}

            {project.openToStudents && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                <GraduationCap className="w-3 h-3 text-emerald-600" />
                Open to Students
              </span>
            )}

            {project.status === 'Looking for collaborators' && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                <Users className="w-3 h-3 text-blue-600" />
                Open roles
              </span>
            )}
          </div>

          {project.githubRepo && (
            <div className="flex items-center gap-1 text-xs font-mono text-slate-500 tabular-nums">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>{project.githubRepo.stargazers_count}</span>
            </div>
          )}
        </div>

        {/* Course & Professor metadata banner if academic project */}
        {(project.courseCode || project.professorName || (project.attachedFiles && project.attachedFiles.length > 0)) && (
          <div className="flex items-center gap-1.5 flex-wrap text-[11px] mb-2 font-medium">
            {project.courseCode && (
              <span className="font-bold font-mono px-1.5 py-0.2 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded">
                {project.courseCode}
              </span>
            )}
            {project.professorName && (
              <span className="text-slate-500 truncate">
                Prof: <strong className="font-semibold text-slate-700">{project.professorName.split(' ').slice(-1)[0]}</strong>
              </span>
            )}
            {project.attachedFiles && project.attachedFiles.length > 0 && (
              <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded font-medium">
                <Paperclip className="w-2.5 h-2.5 text-blue-600" />
                <span>{project.attachedFiles.length} file{project.attachedFiles.length > 1 ? 's' : ''}</span>
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1.5">
          {project.title}
        </h3>

        {/* Summary */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
          {project.summary}
        </p>

        {/* If looking for collaborators, list open roles */}
        {project.status === 'Looking for collaborators' && project.openRoles.length > 0 && (
          <div className="mb-4 p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs">
            <span className="font-semibold text-slate-700 block mb-1">Open roles:</span>
            <div className="flex flex-wrap gap-1.5">
              {project.openRoles.map((role, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded text-[11px] font-medium"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags: clean unboxed metadata with separators */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mb-4">
          {project.tags.slice(0, 4).map((tag, i) => (
            <React.Fragment key={tag}>
              <span className="hover:text-slate-700">#{tag}</span>
              {i < Math.min(project.tags.length - 1, 3) && (
                <span aria-hidden="true" className="text-slate-300">
                  ·
                </span>
              )}
            </React.Fragment>
          ))}
          {project.tags.length > 4 && (
            <span className="text-slate-400 text-[11px]">+{project.tags.length - 4} more</span>
          )}
        </div>
      </div>

      {/* Footer: Author info & Interactive Interest Heart */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={project.author.avatar}
            alt={project.author.name}
            referrerPolicy="no-referrer"
            className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
          />
          <div className="truncate">
            <span className="font-semibold text-slate-800 truncate block">
              {project.author.name}
            </span>
            <span className="text-[11px] text-slate-500 truncate block">
              {authorSubtitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleInterest(project.id);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              project.userInterested
                ? 'bg-rose-50 text-rose-600 border border-rose-200 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
            }`}
            title="Express interest"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                project.userInterested ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
              }`}
            />
            <span className="tabular-nums font-semibold">{project.interestCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
