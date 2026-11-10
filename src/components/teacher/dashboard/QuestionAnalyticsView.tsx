/**
 * UNIT REVIEW ARCADE — QUESTION ANALYTICS & DIAGNOSTICS VIEW (PHASE 3B)
 * 
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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white font-arcade uppercase tracking-wider flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-rose-400" />
            <span>Question Diagnostic Leaderboard</span>
          </h3>
          <p className="text-xs text-slate-400">
            Sorted by lowest accuracy rate first to highlight learning gaps and common misconceptions.
          </p>
        </div>

        <span className="text-xs text-slate-400">
          <strong className="text-white">{analytics.length}</strong> tracked question{analytics.length === 1 ? '' : 's'}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 h-20" />
          ))}
        </div>
      ) : analytics.length === 0 ? (
        <div className="py-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
          <BarChart2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-xs font-semibold text-slate-400">No question analytics data available.</p>
          <p className="text-[11px] text-slate-500 mt-1">Play through activities in student mode to collect diagnostic question telemetry.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {analytics.map((item) => {
            const isExpanded = Boolean(expandedKeys[item.compositeKey]);

            return (
              <div
                key={item.compositeKey}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition-all hover:border-slate-700"
              >
                <div
                  onClick={() => toggleExpand(item.compositeKey)}
                  className="p-4 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {item.compositeKey}
                      </span>
                      {item.activityId && (
                        <span className="text-[10px] text-indigo-300 font-medium bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          {item.activityId}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 font-mono">
                        Version: {item.versionLabel}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-200">
                      {item.questionPrompt || item.questionId}
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400">
                      <span>Answered <strong className="text-slate-200">{item.timesAnswered}</strong> times</span>
                      <span className="text-emerald-400">✓ {item.correctCount} correct</span>
                      <span className="text-rose-400">✗ {item.incorrectCount} incorrect</span>
                    </div>
                  </div>

                  {/* Accuracy Bar & Toggle */}
                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <div
                        className={`font-arcade text-lg font-bold ${
                          item.accuracyRate >= 80
                            ? 'text-emerald-400'
                            : item.accuracyRate >= 50
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {item.accuracyRate}%
                      </div>
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${
                            item.accuracyRate >= 80
                              ? 'bg-emerald-400'
                              : item.accuracyRate >= 50
                              ? 'bg-amber-400'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${item.accuracyRate}%` }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Common Misconceptions / Incorrect Responses */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 bg-slate-950/40 text-xs">
                    <h5 className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-2">
                      Common Incorrect Responses & Misconceptions:
                    </h5>

                    {item.commonIncorrectResponses.length === 0 ? (
                      <p className="text-slate-500 text-[11px]">
                        No incorrect responses logged for this question. All students answered correctly!
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {item.commonIncorrectResponses.map((resp: CommonIncorrectResponse, rIdx: number) => (
                          <div
                            key={rIdx}
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px]"
                          >
                            <span className="text-rose-300 font-medium truncate max-w-md">
                              "{resp.response}"
                            </span>
                            <div className="flex items-center gap-2 font-mono text-slate-400 shrink-0">
                              <span>{resp.count} students</span>
                              <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold">
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
