/**
 * UNIT REVIEW ARCADE — QUESTION ANALYTICS & DIAGNOSTICS VIEW (PHASE 9D)
 * Version: 9.4.0
 * 
 * Creative Campus Professional Educator Redesign.
 * Diagnostic leaderboard highlighting difficult questions, error rates,
 * and common incorrect response distributions with composite version keys.
 */

import React, { useState } from 'react';
import type { QuestionDiagnosticItem, CommonIncorrectResponse } from '../../../types/teacher';
import { 
  ChevronDown, 
  ChevronUp, 
  BarChart2,
  TrendingDown
} from 'lucide-react';

interface QuestionAnalyticsViewProps {
  analytics: QuestionDiagnosticItem[];
  isLoading: boolean;
}

export const QuestionAnalyticsView: React.FC<QuestionAnalyticsViewProps> = ({
  analytics,
  isLoading,
}) => {
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bubble font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-rose-500" />
            <span>Question Diagnostic Leaderboard</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Sorted by lowest accuracy rate first to highlight learning gaps and common misconceptions.
          </p>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          <strong className="text-slate-900 font-bold">{analytics.length}</strong> tracked question{analytics.length === 1 ? '' : 's'}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200 h-24" />
          ))}
        </div>
      ) : analytics.length === 0 ? (
        <div className="py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <BarChart2 className="w-10 h-10 mx-auto mb-2 text-slate-300" />
          <p className="text-xs font-bold text-slate-700">No question analytics data available.</p>
          <p className="text-[11px] text-slate-400 mt-1">Play through activities in student mode to collect diagnostic question telemetry.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {analytics.map((item) => {
            const isExpanded = Boolean(expandedKeys[item.compositeKey]);

            return (
              <div
                key={item.compositeKey}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden transition-all hover:border-slate-300 shadow-xs"
              >
                <div
                  onClick={() => toggleExpand(item.compositeKey)}
                  className="p-4 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                        {item.compositeKey}
                      </span>
                      {item.activityId && (
                        <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {item.activityId}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">
                        Version: {item.versionLabel}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-900">
                      {item.questionPrompt || item.questionId}
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500">
                      <span>
                        Answered <strong className="text-slate-800 font-bold">{item.timesAnswered}</strong> time{item.timesAnswered === 1 ? '' : 's'}
                        {item.distinctStudentsCount !== undefined && (
                          <span className="text-slate-400 font-medium"> ({item.distinctStudentsCount} student{item.distinctStudentsCount === 1 ? '' : 's'})</span>
                        )}
                      </span>
                      <span className="text-emerald-700 font-bold">✓ {item.correctCount} correct</span>
                      <span className="text-rose-700 font-bold">✗ {item.incorrectCount} incorrect</span>
                    </div>
                  </div>

                  {/* Accuracy Bar & Toggle */}
                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <div
                        className={`font-mono text-lg font-black ${
                          item.accuracyRate >= 80
                            ? 'text-emerald-600'
                            : item.accuracyRate >= 50
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {item.accuracyRate}%
                      </div>
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden mt-1 p-0.5">
                        <div
                          className={`h-full rounded-full ${
                            item.accuracyRate >= 80
                              ? 'bg-emerald-500'
                              : item.accuracyRate >= 50
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${item.accuracyRate}%` }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:text-slate-700"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Common Misconceptions / Incorrect Responses */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-3 border-t border-slate-100 bg-slate-50/70 text-xs">
                    <h5 className="font-bold text-slate-700 text-[11px] uppercase tracking-wider mb-2">
                      Common Incorrect Responses & Misconceptions:
                    </h5>

                    {item.commonIncorrectResponses.length === 0 ? (
                      <p className="text-slate-500 text-[11px] font-medium">
                        No incorrect responses logged for this question. All attempts were correct!
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {item.commonIncorrectResponses.map((resp: CommonIncorrectResponse, rIdx: number) => (
                          <div
                            key={rIdx}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] shadow-xs"
                          >
                            <span className="text-rose-700 font-semibold truncate max-w-md">
                              "{resp.response}"
                            </span>
                            <div className="flex items-center gap-2 font-mono text-slate-500 shrink-0">
                              <span>
                                {resp.count} {resp.count === 1 ? 'mistake' : 'mistakes'}
                                {resp.distinctStudentsCount !== undefined && (
                                  <span className="text-slate-400 font-sans"> ({resp.distinctStudentsCount} {resp.distinctStudentsCount === 1 ? 'student' : 'students'})</span>
                                )}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                                {resp.percentage}% of mistakes
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
