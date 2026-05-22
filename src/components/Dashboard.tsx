/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Flame, Clock, ClipboardList, CheckSquare, Sparkles, TrendingUp, AlertTriangle, Moon, ArrowRight, Play, BookOpen, BellRing } from 'lucide-react';
import { StudyBlock, SubjectConfig, HabitStats, AlertNotification, EXAM_SUBJECTS, formatTimeDifference } from '../types';

interface DashboardProps {
  userName: string;
  blocks: StudyBlock[];
  stats: HabitStats;
  alerts: AlertNotification[];
  onToggleStatus: (id: string) => void;
  onFocusBlock: (block: StudyBlock) => void;
  onNavigateToTab: (tab: string) => void;
  subjects: SubjectConfig[];
  dailyGoalHours: number;
}

export default function Dashboard({
  userName,
  blocks,
  onToggleStatus,
  onFocusBlock,
  onNavigateToTab,
  stats,
  alerts,
  subjects,
  dailyGoalHours
}: DashboardProps) {

  // Calculate stats for today
  const totalTasks = blocks.length;
  const completedTasks = blocks.filter(b => b.status === 'completed').length;
  const pendingTasks = blocks.filter(b => b.status === 'pending').length;
  const skippedTasks = blocks.filter(b => b.status === 'skipped').length;
  
  // Completed studied minutes
  const totalStudiedMinutes = blocks
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + formatTimeDifference(b.startTime, b.endTime), 0);
  
  const studiedHours = (totalStudiedMinutes / 60).toFixed(1);
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Active or upcoming block
  const currentOrNextBlock = blocks.find(b => b.status === 'pending') || null;

  // Get subject config matching a block
  const getSubjectConfig = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId) || EXAM_SUBJECTS[EXAM_SUBJECTS.length - 1];
  };

  return (
    <div id="general-dashboard" className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Welcome Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50 tracking-tight">
            Assalam, {userName || "Aspirant"} • WBCS Workspace
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-medium">
            Plan, monitor, and master your day-to-day West Bengal Civil Service curriculum.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="quick-focus-btn"
            onClick={() => {
              if (currentOrNextBlock) {
                onFocusBlock(currentOrNextBlock);
              } else {
                onNavigateToTab('focus');
              }
            }}
            className="px-4 py-2 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>Launch focus workspace</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Streak Indicator */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md p-4 shadow-3xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">WBCS Study Streak</span>
            <div id="streak-metric" className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-500">
              {stats.currentStreak} Days
            </div>
            <p className="text-[10px] text-slate-500">Longest Streak: {stats.longestStreak} days</p>
          </div>
          <div className="p-2.5 bg-amber-50 rounded-full dark:bg-amber-950/40">
            <Flame className="h-6 w-6 text-amber-500" />
          </div>
        </div>

        {/* Study Hours indicator */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md p-4 shadow-3xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Time Studied Today</span>
            <div id="studied-hours-metric" className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-500">
              {studiedHours} Hrs
            </div>
            <p className="text-[10px] text-slate-500">Daily Target: {dailyGoalHours} hours</p>
          </div>
          <div className="p-2.5 bg-emerald-50 rounded-full dark:bg-emerald-950/40">
            <Clock className="h-6 w-6 text-emerald-500" />
          </div>
        </div>

        {/* Task Completion KPI */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md p-4 shadow-3xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Today&apos;s Checklist</span>
            <div id="tasks-kpi-metric" className="text-2xl font-bold font-mono text-[#0078d4]">
              {completedTasks}/{totalTasks}
            </div>
            <p className="text-[10px] text-slate-500">
              {pendingTasks} pending • {skippedTasks} skipped
            </p>
          </div>
          <div className="p-2.5 bg-[#f0f4f9] rounded-full dark:bg-slate-900">
            <ClipboardList className="h-6 w-6 text-[#0078d4]" />
          </div>
        </div>

        {/* Consistency Percent Rate */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md p-4 shadow-3xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Habit Consistency</span>
            <div id="habit-consistency-metric" className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-500">
              {completionRate}%
            </div>
            <p className="text-[10px] text-slate-500">Goal Completion Rate</p>
          </div>
          <div className="p-2.5 bg-purple-50 rounded-full dark:bg-purple-950/40">
            <TrendingUp className="h-6 w-6 text-purple-500" />
          </div>
        </div>

      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: ACTIVE ROUTINE TASKS (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active / Current Study Block Target Card */}
          {currentOrNextBlock ? (
            <div className="bg-gradient-to-r from-blue-500 to-[#0078d4] dark:from-sky-950 dark:to-blue-950 p-6 rounded-md text-white shadow-xs relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-white/20 p-1 rounded-full"><Sparkles className="h-3.5 w-3.5" /></span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-blue-100">Recommended Next Focus</span>
                </div>
                
                <div>
                  <h3 className="text-base font-bold font-mono block text-blue-100">
                    {currentOrNextBlock.startTime} - {currentOrNextBlock.endTime} ({formatTimeDifference(currentOrNextBlock.startTime, currentOrNextBlock.endTime)} mins)
                  </h3>
                  <h2 className="text-xl font-bold tracking-tight mt-1">{currentOrNextBlock.topics}</h2>
                  <p className="text-xs text-blue-100 mt-1 opacity-90 block">
                    Subject: {getSubjectConfig(currentOrNextBlock.subjectId).name}
                  </p>
                </div>

                <div className="flex gap-2.5 pt-1">
                  <button
                    id="dashboard-focus-trigger"
                    onClick={() => onFocusBlock(currentOrNextBlock)}
                    className="p-2 px-4 bg-white text-[#0078d4] hover:bg-slate-100 rounded text-xs font-semibold transition-all inline-flex items-center gap-1.5 shadow-sm active:scale-98 cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Study inside Focus Mode
                  </button>
                  <button
                    id="dashboard-quick-complete"
                    onClick={() => onToggleStatus(currentOrNextBlock.id)}
                    className="p-2 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-xs font-semibold transition-all cursor-pointer"
                  >
                    Direct done
                  </button>
                </div>
              </div>

              {/* Decorative Subtle MS Background Circle */}
              <div className="absolute -right-16 -bottom-16 w-56 h-56 rounded-full bg-white/5 border border-white/10 z-0"></div>
            </div>
          ) : (
            <div className="bg-[#f0f4f9] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-md text-center py-10 space-y-3">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">🎉 All study slots for today are resolved or completed!</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Clean work! Go to the Calendar to planning tomorrow or head to Settings to fine-tune your core metrics.
              </p>
            </div>
          )}

          {/* Today&apos;s Concise List View */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md shadow-3xs p-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4.5 w-4.5 text-[#0078d4]" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Today&apos;s Time Blocks</h3>
              </div>
              <button 
                id="dashboard-goto-today"
                onClick={() => onNavigateToTab('today')}
                className="text-xs font-semibold text-[#0078d4] hover:underline flex items-center gap-1"
              >
                Planner Workspace <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {blocks.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No slots configured for today. Apply a quick Template or create a customized block now.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-850 space-y-0.5">
                {blocks.map((block) => {
                  const subConfig = getSubjectConfig(block.subjectId);
                  return (
                    <div key={block.id} className="flex items-center justify-between py-3 group hover:bg-slate-50 dark:hover:bg-slate-900/60 px-2 rounded-md transition-all">
                      <div className="flex items-center gap-3">
                        {/* Checkbox */}
                        <button
                          id={`chk-status-${block.id}`}
                          onClick={() => onToggleStatus(block.id)}
                          className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition-all cursor-pointer ${
                            block.status === 'completed'
                              ? 'bg-emerald-650 border-emerald-600 text-white'
                              : block.status === 'skipped'
                              ? 'bg-rose-100 border-rose-300 text-rose-700 dark:bg-rose-950 dark:border-rose-900 dark:text-rose-400'
                              : 'border-slate-300 hover:border-[#0078d4] dark:border-slate-700'
                          }`}
                        >
                          {block.status === 'completed' && <CheckSquare className="h-3 w-3 fill-current" />}
                          {block.status === 'skipped' && <span className="text-[9px] font-bold">✖</span>}
                        </button>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-mono text-slate-600 dark:text-slate-400">
                              {block.startTime} - {block.endTime}
                            </span>
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border ${subConfig.color} ${subConfig.darkColor}`}>
                              {subConfig.name}
                            </span>
                          </div>
                          <p className={`text-xs font-medium ${
                            block.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                          }`}>
                            {block.topics}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {block.status === 'pending' && (
                          <button
                            id={`focus-icon-${block.id}`}
                            onClick={() => onFocusBlock(block)}
                            title="Start Focus on this block"
                            className="opacity-0 group-hover:opacity-100 p-1 text-[#0078d4] hover:bg-blue-50 dark:hover:bg-slate-800 rounded transition-all cursor-pointer"
                          >
                            <Play className="h-3.5 w-3.5 fill-current" />
                          </button>
                        )}
                        <span className={`text-[9px] font-bold uppercase px-1 py-0.2 rounded ${
                          block.priority === 'high' ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/20' : 'text-slate-400'
                        }`}>
                          {block.priority}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: ALERTS & STATS PANEL (4 COLS) */}
        <div id="dashboard-sidebar-panel" className="lg:col-span-4 space-y-6">
          
          {/* Smart Notifications Hub */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md shadow-3xs p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
              <div className="flex items-center gap-1.5">
                <BellRing className="h-4 w-4 text-[#0078d4]" />
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">WBCS Smart Assistant</h4>
              </div>
            </div>

            {alerts.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">All quiet. No urgent reminders.</p>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-3 bg-[#f8f9fa] dark:bg-slate-900 border-l-3 border-[#0078d4] rounded flex gap-2 w-full">
                    {alert.type === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    ) : alert.id.includes('bedtime') ? (
                      <Moon className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                    ) : (
                      <BellRing className="h-4 w-4 text-[#0078d4] shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-0.5">
                      <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {alert.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                        {alert.message}
                      </p>
                      <span className="text-[10px] font-mono text-slate-400 block mt-1">{alert.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pre-Exam Bulletins (Highly Context-Tailored) */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md p-5 shadow-3xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-800 dark:text-slate-100">Study Consistency Gauge</h4>
            
            {/* Horizontal custom bar gauge indicator */}
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Syllabus covered (Goals rate)</span>
                  <span className="font-bold text-[#0078d4]">{stats.goalCompletionRate}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#0078d4] h-full rounded-full transition-all duration-300"
                    style={{ width: `${stats.goalCompletionRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Weekly hour consistency</span>
                  <span className="font-bold text-amber-500">
                    {Math.min(100, Math.round((stats.totalHoursStudied / (dailyGoalHours * 7)) * 105))}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (stats.totalHoursStudied / (dailyGoalHours * 7)) * 105)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-normal bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded border border-slate-100 dark:border-slate-850">
              ⚡ <strong>West Bengal Civil Service (Exe.)</strong> syllabus demands continuous active recalls. Reviewing optional journals or papers on regional West Bengal agricultural schemes regularly during weekend revision slots maintains an edge.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
