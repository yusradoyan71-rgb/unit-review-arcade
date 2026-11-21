import React, { useState } from 'react';
import type { TopicMasteryItem, TopicMasteryStatus } from '../../../../types/teacher';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  CheckCircle2, 
  TrendingDown, 
  HelpCircle,
  Clock,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

interface TopicMasteryTableProps {
  topics: TopicMasteryItem[];
  selectedGradeId: 'all' | 'grade-7' | 'grade-8';
  selectedSkill: string;
  onGradeChange: (gradeId: 'all' | 'grade-7' | 'grade-8') => void;
  onSkillChange?: (skill: 'all' | 'grammar' | 'vocabulary' | 'reading' | 'listening') => void;
}

export const TopicMasteryTable: React.FC<TopicMasteryTableProps> = ({
  topics,
  selectedGradeId,
  selectedSkill,
  onGradeChange,
  onSkillChange: _onSkillChange,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | TopicMasteryStatus>('all');
  const [sortBy, setSortBy] = useState<'weakness' | 'accuracy' | 'attempts'>('weakness');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  // Filter & Sort
  const filteredTopics = topics.filter((t) => {
    if (selectedGradeId !== 'all' && t.gradeId !== selectedGradeId) return false;
    if (selectedSkill !== 'all' && t.skill !== selectedSkill) return false;
    if (statusFilter !== 'all' && t.masteryStatus !== statusFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchTitle = t.topicTitle.toLowerCase().includes(term);
      const matchId = t.topicId.toLowerCase().includes(term);
      if (!matchTitle && !matchId) return false;
    }
    return true;
  });

  const sortedTopics = [...filteredTopics].sort((a, b) => {
    if (sortBy === 'weakness') {
      return b.weaknessScore - a.weaknessScore || b.totalAttempts - a.totalAttempts;
    }
    if (sortBy === 'accuracy') {
      return b.averageScore - a.averageScore;
    }
    return b.totalAttempts - a.totalAttempts;
  });

  const renderStatusBadge = (status: TopicMasteryStatus) => {
    switch (status) {
      case 'mastered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Mastered (≥85%)</span>
          </span>
        );
      case 'proficient':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-sky-100 text-sky-800 border border-sky-300">
            <Sparkles className="w-3 h-3 text-sky-600" />
            <span>Proficient (70-84%)</span>
          </span>
        );
      case 'needs_practice':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>Needs Practice (&lt;70%)</span>
          </span>
        );
      case 'struggling':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-300">
            <TrendingDown className="w-3 h-3 text-rose-600" />
            <span>Struggling (&lt;50%)</span>
          </span>
        );
      case 'not_started':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-600 border border-slate-200">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Not Started</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Table Toolbar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter topics by name or concept..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Grade Filter */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-[11px] font-bold">
              <button
                onClick={() => onGradeChange('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedGradeId === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Grades
              </button>
              <button
                onClick={() => onGradeChange('grade-7')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedGradeId === 'grade-7' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Grade 7
              </button>
              <button
                onClick={() => onGradeChange('grade-8')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedGradeId === 'grade-8' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Grade 8
              </button>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as unknown as 'all' | TopicMasteryStatus)}
              className="py-1.5 px-3 rounded-xl bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700 focus:outline-none"
            >
              <option value="all">All Mastery Levels</option>
              <option value="needs_practice">Needs Practice / Struggling</option>
              <option value="mastered">Mastered</option>
              <option value="proficient">Proficient</option>
              <option value="not_started">Not Started</option>
            </select>

            {/* Sort Filter */}
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-bold">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'weakness' | 'accuracy' | 'attempts')}
                className="py-1 px-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-bold focus:outline-none"
              >
                <option value="weakness">Weakness Urgency</option>
                <option value="accuracy">Highest Accuracy</option>
                <option value="attempts">Most Attempts</option>
              </select>
            </div>

          </div>

        </div>
      </div>

      {/* Topics Table Container */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-black">
                <th className="py-3 px-4">Topic &amp; Language Skill</th>
                <th className="py-3 px-4 text-center">Grade &amp; CEFR</th>
                <th className="py-3 px-4 text-center">Mastery Status</th>
                <th className="py-3 px-4 text-center">Average Accuracy</th>
                <th className="py-3 px-4 text-center">Weakness Urgency</th>
                <th className="py-3 px-4 text-center">Participation</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {sortedTopics.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-slate-600">No topics match the selected filters.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try clearing the search term or switching the skill filter.</p>
                  </td>
                </tr>
              ) : (
                sortedTopics.map((t) => {
                  const isExpanded = expandedTopicId === t.topicId;

                  return (
                    <React.Fragment key={t.topicId}>
                      <tr 
                        onClick={() => setExpandedTopicId(isExpanded ? null : t.topicId)}
                        className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                          isExpanded ? 'bg-indigo-50/30' : ''
                        }`}
                      >
                        {/* Topic & Skill */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-base">
                              {t.skill === 'grammar' ? '📘' : t.skill === 'vocabulary' ? '📙' : t.skill === 'reading' ? '📗' : '🎧'}
                            </span>
                            <div>
                              <strong className="block text-slate-900 font-bold leading-snug">
                                {t.topicTitle}
                              </strong>
                              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                                {t.skill} • {t.questionCount} Questions
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Grade & CEFR */}
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-slate-100 text-slate-700">
                              {t.gradeId === 'grade-7' ? 'Grade 7' : 'Grade 8'}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-slate-400 mt-0.5">
                              CEFR {t.cefrLevel}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 text-center">
                          {renderStatusBadge(t.masteryStatus)}
                        </td>

                        {/* Accuracy */}
                        <td className="py-3 px-4 text-center font-mono">
                          <span className={`text-sm font-black ${
                            t.averageScore >= 80 ? 'text-emerald-600' : t.averageScore >= 60 ? 'text-amber-600' : t.completedAttempts > 0 ? 'text-rose-600' : 'text-slate-400'
                          }`}>
                            {t.completedAttempts > 0 ? `${t.averageScore}%` : '—'}
                          </span>
                        </td>

                        {/* Weakness Urgency */}
                        <td className="py-3 px-4 text-center">
                          {t.completedAttempts > 0 ? (
                            <div className="inline-flex items-center gap-1.5">
                              <span className={`px-2 py-0.5 rounded-lg text-xs font-black font-mono ${
                                t.weaknessScore >= 50
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : t.weaknessScore >= 25
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}>
                                {t.weaknessScore}/100
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                        </td>

                        {/* Participation */}
                        <td className="py-3 px-4 text-center font-mono text-slate-600 text-xs">
                          <span className="font-bold text-slate-800">{t.uniqueStudentsCount}</span> students
                          <span className="block text-[10px] text-slate-400">({t.completedAttempts} completed)</span>
                        </td>

                        {/* Expand Toggle */}
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Diagnostic Drawer */}
                      {isExpanded && (
                        <tr className="bg-indigo-50/20">
                          <td colSpan={7} className="p-4 sm:p-5 border-t border-indigo-100">
                            <div className="space-y-3 max-w-3xl">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                                  <AlertCircle className="w-4 h-4 text-indigo-600" />
                                  Diagnostic Misconceptions &amp; Mistakes
                                </span>
                                <span className="text-xs font-bold text-slate-500">
                                  {t.commonMistakesCount} total incorrect responses logged
                                </span>
                              </div>

                              {t.commonMistakePrompts.length > 0 ? (
                                <div className="space-y-1.5">
                                  <p className="text-xs text-slate-600 font-medium">
                                    Top question prompts requiring classroom reinforcement:
                                  </p>
                                  <ul className="space-y-1 text-xs">
                                    {t.commonMistakePrompts.map((prompt, idx) => (
                                      <li key={idx} className="p-2 rounded-xl bg-white border border-indigo-100 text-slate-800 flex items-start gap-2 shadow-2xs">
                                        <span className="font-mono text-[10px] font-bold text-indigo-500 mt-0.5">#{idx + 1}</span>
                                        <span className="leading-snug">{prompt}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : (
                                <p className="text-xs text-slate-500 italic">
                                  No recurring misconceptions flagged for this topic yet.
                                </p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
