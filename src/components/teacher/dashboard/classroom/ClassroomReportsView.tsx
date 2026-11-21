/**
 * UNIT REVIEW ARCADE — CLASSROOM REPORTS & ANALYTICS VIEW (PHASE 3.4B)
 * 
 * Aggregated analytics and reporting for classroom behavior points:
 * 1. Academic Year KPI summary
 * 2. Class-by-class comparison (7A, 7B, 8A, 8B)
 * 3. Milestone reward distribution
 * 4. CSV export of student classroom behavior records
 * 
 * PRIVACY SHIELD:
 * When isProjectorPrivacyMode is TRUE, negative point sums and net point rankings
 * are shielded to protect student dignity on smartboard screens.
 */

import React from 'react';
import type { 
  ClassroomStudentSummary, 
  ClassroomCategory, 
  ClassroomRewardDefinition 
} from '../../../../types/classroomPoints';
import { 
  Download, 
  Award, 
  Star, 
  Users, 
  TrendingUp, 
  EyeOff, 
  Sparkles,
  Trophy
} from 'lucide-react';

interface ClassroomReportsViewProps {
  students: ClassroomStudentSummary[];
  categories?: ClassroomCategory[];
  rewardDefinitions: ClassroomRewardDefinition[];
  academicYear: string;
  isProjectorPrivacyMode: boolean;
}

export const ClassroomReportsView: React.FC<ClassroomReportsViewProps> = ({
  students,
  categories: _categories,
  rewardDefinitions,
  academicYear,
  isProjectorPrivacyMode,
}) => {
  // Aggregate KPIs
  const totalStudents = students.length;
  const totalPositivePoints = students.reduce((sum, s) => sum + s.positivePoints, 0);
  const totalNegativePoints = students.reduce((sum, s) => sum + s.negativePoints, 0);
  const totalNetPoints = students.reduce((sum, s) => sum + s.netPoints, 0);
  const totalUnlockedRewards = students.reduce((sum, s) => sum + s.unlockedRewardCount, 0);

  // Group by Class
  const classes = ['7A', '7B', '8A', '8B'] as const;
  const classStats = classes.map((cId) => {
    const classStudents = students.filter((s) => s.class === cId);
    const count = classStudents.length;
    const pos = classStudents.reduce((sum, s) => sum + s.positivePoints, 0);
    const neg = classStudents.reduce((sum, s) => sum + s.negativePoints, 0);
    const net = classStudents.reduce((sum, s) => sum + s.netPoints, 0);
    const rewards = classStudents.reduce((sum, s) => sum + s.unlockedRewardCount, 0);
    const avgPos = count > 0 ? (pos / count).toFixed(1) : '0.0';

    return {
      classId: cId,
      studentCount: count,
      positivePoints: pos,
      negativePoints: neg,
      netPoints: net,
      averagePositivePoints: avgPos,
      unlockedRewards: rewards,
    };
  });

  // Calculate Milestone Distribution
  const milestoneCounts = rewardDefinitions.map((rwd) => {
    const achievedCount = students.filter((s) => s.unlockedRewards.includes(rwd.id)).length;
    return {
      ...rwd,
      achievedCount,
      percent: totalStudents > 0 ? Math.round((achievedCount / totalStudents) * 100) : 0,
    };
  });

  // CSV Export Handler
  const handleExportCsv = () => {
    const headers = [
      'Academic Year',
      'Student Number',
      'Full Name',
      'Class',
      'Positive Points',
      ...(isProjectorPrivacyMode ? [] : ['Negative Points', 'Net Points']),
      'Unlocked Rewards Count',
    ];

    const rows = students.map((s) => [
      academicYear,
      s.studentNumber,
      `"${s.fullName.replace(/"/g, '""')}"`,
      s.class,
      s.positivePoints,
      ...(isProjectorPrivacyMode ? [] : [s.negativePoints, s.netPoints]),
      s.unlockedRewardCount,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `classroom_points_report_${academicYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Export Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Classroom Behavior Analytics &amp; Reports</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active Academic Year: <strong className="text-indigo-600">{academicYear || '2026-2027'}</strong> • Tracking permanent student milestones
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Students */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Students</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalStudents}</div>
          <p className="text-[11px] text-slate-400">Classes 7A, 7B, 8A, 8B</p>
        </div>

        {/* Positive Points */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[11px] font-bold uppercase tracking-wider">Positive Stars</span>
            <Star className="w-4 h-4 fill-emerald-500 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">+{totalPositivePoints}</div>
          <p className="text-[11px] text-emerald-600 font-medium">Reinforcement points awarded</p>
        </div>

        {/* Unlocked Milestones */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-[11px] font-bold uppercase tracking-wider">Milestones Earned</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-700">{totalUnlockedRewards}</div>
          <p className="text-[11px] text-amber-600 font-medium">Permanent cosmetics unlocked</p>
        </div>

        {/* Net / Shielded Metric */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Net Balance</span>
            {isProjectorPrivacyMode ? (
              <EyeOff className="w-4 h-4 text-amber-600" />
            ) : (
              <TrendingUp className="w-4 h-4 text-indigo-500" />
            )}
          </div>
          {isProjectorPrivacyMode ? (
            <div>
              <div className="text-sm font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 inline-block">
                Protected in Privacy Mode
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Hidden from classroom view</p>
            </div>
          ) : (
            <div>
              <div className="text-2xl font-black text-indigo-900">
                {totalNetPoints >= 0 ? `+${totalNetPoints}` : totalNetPoints}
              </div>
              <p className="text-[11px] text-slate-400">
                +{totalPositivePoints} / -{totalNegativePoints}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Class Comparison Table */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="font-bold text-sm text-slate-800">Class Performance Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4 text-center">Students</th>
                <th className="py-3 px-4 text-center">Positive Points</th>
                <th className="py-3 px-4 text-center">Avg / Student</th>
                {!isProjectorPrivacyMode && (
                  <>
                    <th className="py-3 px-4 text-center">Deductions</th>
                    <th className="py-3 px-4 text-center">Net Balance</th>
                  </>
                )}
                <th className="py-3 px-4 text-center">Milestones Unlocked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {classStats.map((cs) => (
                <tr key={cs.classId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <span className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Class {cs.classId}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-700">{cs.studentCount}</td>
                  <td className="py-3.5 px-4 text-center font-black text-emerald-700">+{cs.positivePoints}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-600">{cs.averagePositivePoints} pt</td>
                  {!isProjectorPrivacyMode && (
                    <>
                      <td className="py-3.5 px-4 text-center font-bold text-rose-600">-{cs.negativePoints}</td>
                      <td className="py-3.5 px-4 text-center font-black text-indigo-900">
                        {cs.netPoints >= 0 ? `+${cs.netPoints}` : cs.netPoints}
                      </td>
                    </>
                  )}
                  <td className="py-3.5 px-4 text-center font-bold text-amber-700">
                    <span className="inline-flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>{cs.unlockedRewards}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Milestone Rewards Distribution */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Milestone Reward Unlocks &amp; Permanent Retention</span>
          </h3>
          <span className="text-xs text-slate-400">Total Unlocked: {totalUnlockedRewards}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {milestoneCounts.map((m) => (
            <div
              key={m.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{m.icon || '⭐'}</span>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{m.name}</h4>
                    <span className="text-[10px] text-slate-400">{m.requiredPoints} pts required</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-xs text-amber-700 block">
                    {m.achievedCount} students
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">{m.percent}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all"
                  style={{ width: `${Math.min(m.percent, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
