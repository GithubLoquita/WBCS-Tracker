/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, XCircle, AlertCircle, Clock, FileText, Sparkles, Plus } from 'lucide-react';
import { StudyBlock, DailyLog, HabitStats, EXAM_SUBJECTS, formatTimeDifference } from '../types';

interface CalendarViewProps {
  currentDate: string; // YYYY-MM-DD
  historyLogs: { [date: string]: DailyLog };
  stats: HabitStats;
  onSelectDate: (dateStr: string) => void;
  onCloneRoutineToDate: (sources: StudyBlock[], destinationDate: string) => void;
  todayBlocks: StudyBlock[];
}

export default function CalendarView({
  currentDate,
  historyLogs,
  stats,
  onSelectDate,
  onCloneRoutineToDate,
  todayBlocks
}: CalendarViewProps) {
  const [activeView, setActiveView] = useState<'month' | 'week' | 'day'>('month');
  const [currentNavMonth, setCurrentNavMonth] = useState(new Date().getMonth());
  const [currentNavYear, setCurrentNavYear] = useState(new Date().getFullYear());

  // Month metadata
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  const daysInCurrentMonthCount = new Date(currentNavYear, currentNavMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentNavYear, currentNavMonth, 1).getDay(); // day of week

  // Shifts navigation month
  const handlePrevMonth = () => {
    if (currentNavMonth === 0) {
      setCurrentNavMonth(11);
      setCurrentNavYear(curr => curr - 1);
    } else {
      setCurrentNavMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentNavMonth === 11) {
      setCurrentNavMonth(0);
      setCurrentNavYear(curr => curr + 1);
    } else {
      setCurrentNavMonth(m => m + 1);
    }
  };

  // Build dates cells mapping
  const calendarCells: (Date | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInCurrentMonthCount; d++) {
    calendarCells.push(new Date(currentNavYear, currentNavMonth, d));
  }

  // Selected date's info details
  const getSelectedDateLogs = () => {
    const defaultData = historyLogs[currentDate];
    if (defaultData) return defaultData;
    
    // Fallback: If currentDate is today, map mock data
    const todayStr = new Date().toISOString().split('T')[0];
    if (currentDate === todayStr) {
      const duration = todayBlocks
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + formatTimeDifference(b.startTime, b.endTime), 0);
      return {
        date: currentDate,
        blocks: todayBlocks,
        studiedMinutes: duration,
        productivityRating: 4,
        notes: "Today's current workspace active tracker data."
      };
    }
    return null;
  };

  const selectedLog = getSelectedDateLogs();

  // Helper to retrieve consistency rating color of a date cell
  const getCellStatus = (cellDateStr: string) => {
    // Check history logs
    const log = historyLogs[cellDateStr];
    if (log) {
      const ratio = log.blocks.filter(b => b.status === 'completed').length / (log.blocks.length || 1);
      if (ratio >= 0.75) return 'high-consistency';
      if (ratio > 0.4) return 'medium-consistency';
      return 'missed-days';
    }

    // Check stats.history mapping too
    const statHistory = stats.history[cellDateStr];
    if (statHistory) {
      const ratio = statHistory.completed / (statHistory.total || 1);
      if (ratio >= 0.75) return 'high-consistency';
      if (ratio > 0.4) return 'medium-consistency';
      return 'missed-days';
    }

    return 'no-history';
  };

  const handleDaySelect = (d: Date) => {
    const formatted = d.toISOString().split('T')[0];
    onSelectDate(formatted);
  };

  // Clones todays routine layout directly to clicked empty target date
  const handleCloneToSelected = () => {
    if (todayBlocks.length === 0) return;
    onCloneRoutineToDate(todayBlocks, currentDate);
  };

  return (
    <div id="calendar-scheduler" className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Dynamic Selector Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-850 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Calendar Workspace</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Navigate across timeline logs, schedule pre-exam dates, and analyze consistency.</p>
        </div>

        {/* Mode presets Tab layout */}
        <div className="flex bg-[#f3f4f6] dark:bg-slate-900 p-0.5 rounded border border-slate-200 dark:border-slate-800 self-start sm:self-center">
          {(['month', 'week', 'day'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`px-3 py-1 rounded-sm text-xs font-semibold uppercase ${
                activeView === view 
                  ? 'bg-white dark:bg-slate-800 text-[#0078d4] shadow-3xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {view} view
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* MONTH GRID (7 COLS) */}
        <div className="lg:col-span-12 xl:col-span-7 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
          
          {/* Nav Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4.5 w-4.5 text-[#0078d4]" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest">{monthNames[currentNavMonth]} {currentNavYear}</h3>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                id="cal-prev-month"
                onClick={handlePrevMonth}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                id="cal-next-month"
                onClick={handleNextMonth}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Day terms Headers */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Main cell grids */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarCells.map((cell, idx) => {
              if (!cell) {
                return (
                  <div key={`empty-${idx}`} className="aspect-square bg-slate-50/40 dark:bg-slate-900/10 rounded-sm"></div>
                );
              }

              const dateStr = cell.toISOString().split('T')[0];
              const isSelected = dateStr === currentDate;
              const cellStatus = getCellStatus(dateStr);
              
              // Today check
              const isToday = dateStr === new Date().toISOString().split('T')[0];

              return (
                <button
                  id={`cal-day-${dateStr}`}
                  key={`day-${dateStr}`}
                  onClick={() => handleDaySelect(cell)}
                  className={`aspect-square p-2 border flex flex-col justify-between rounded-sm relative text-left transition-all hover:scale-102 cursor-pointer ${
                    isSelected 
                      ? 'border-[#0078d4] ring-2 ring-blue-105 bg-blue-50/10 dark:bg-blue-950/20' 
                      : isToday 
                      ? 'border-[#0078d4] bg-[#f0f4f9] dark:bg-slate-900'
                      : 'border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-950'
                  }`}
                >
                  <span className={`text-xs font-bold leading-none select-none ${
                    isToday ? 'text-[#0078d4]' : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {cell.getDate()}
                  </span>

                  {/* Dot status code indicators */}
                  <div className="flex gap-1 justify-end items-center mt-auto">
                    {cellStatus === 'high-consistency' && (
                      <span className="h-2 w-2 rounded-full bg-emerald-550 border border-emerald-600 dark:bg-emerald-400" title="Completed routine"></span>
                    )}
                    {cellStatus === 'medium-consistency' && (
                      <span className="h-2 w-2 rounded-full bg-amber-500" title="Partially completed"></span>
                    )}
                    {cellStatus === 'missed-days' && (
                      <span className="h-2 w-2 rounded-full bg-rose-500" title="Missed too many slots"></span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Color Guides Footer */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-4 mt-5 border-t border-slate-150 dark:border-slate-850 text-[11px] text-slate-500 font-medium">
            <span className="text-slate-400">Consistency Index:</span>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-550 shrink-0"></span>
              <span>High (75%+)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0"></span>
              <span>Medium (40-75%)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0"></span>
              <span>Missed / Break</span>
            </div>
          </div>

        </div>

        {/* SIDE DETAILS VIEW PER SELECT DATE (5 COLS) */}
        <div id="calendar-detail-pane" className="lg:col-span-12 xl:col-span-5 space-y-4">
          
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
            
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-850 pb-3 mb-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Selected Target Calendar Date</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-150 font-mono mt-0.5">
                  {currentDate}
                </h3>
              </div>
              <span className="text-[10px] bg-slate-100 rounded text-slate-500 px-2 py-0.5 border uppercase font-bold">
                {currentDate === new Date().toISOString().split('T')[0] ? "Today" : "Archive View"}
              </span>
            </div>

            {selectedLog ? (
              <div className="space-y-4">
                
                {/* Stats Summary strip */}
                <div className="grid grid-cols-2 gap-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded p-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-medium">Study delivered</span>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {(selectedLog.studiedMinutes / 60).toFixed(1)} Hours
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-medium">Resolutions met</span>
                    <p className="text-xs font-bold text-[#0078d4] font-mono">
                      {selectedLog.blocks.filter(b => b.status === 'completed').length} / {selectedLog.blocks.length} Tasks
                    </p>
                  </div>
                </div>

                {/* Blocks details list */}
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Scheduled Routine Sessions</h4>
                  
                  {selectedLog.blocks.map((block) => (
                    <div key={block.id} className="p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded flex items-center justify-between gap-2.5 text-xs">
                      <div className="space-y-0.5">
                        <span className="font-mono text-[11px] font-bold text-[#0078d4]">{block.startTime} - {block.endTime}</span>
                        <p className="text-slate-800 dark:text-slate-200 font-medium leading-tight">{block.topics}</p>
                      </div>

                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                        block.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-650 border border-emerald-150'
                          : block.status === 'skipped'
                          ? 'bg-rose-50 text-rose-600 border border-rose-150'
                          : 'bg-slate-50 text-slate-400 border border-slate-150'
                      }`}>
                        {block.status}
                      </span>
                    </div>
                  ))}
                </div>

                {selectedLog.notes && (
                  <div className="p-3 bg-indigo-50/20 rounded border border-indigo-100 dark:border-indigo-950/20 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-950 dark:text-indigo-300 mb-1">
                      <FileText className="h-3.5 w-3.5" />
                      <span>Study Log Notes</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">{selectedLog.notes}</p>
                  </div>
                )}

              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <p className="text-xs text-slate-400">No study logs exist for this date in local storage yet.</p>
                
                {todayBlocks.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-850">
                    <button
                      id="cal-clone-today-btn"
                      onClick={handleCloneToSelected}
                      className="px-4 py-2 bg-[#f0f4f9] hover:bg-slate-100 border border-slate-250 dark:bg-slate-900 dark:border-slate-800 text-[#0078d4] hover:text-[#106ebe] text-xs font-semibold rounded inline-flex items-center gap-1.5 shadow-3xs cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Clone Today&apos;s Layout to this day</span>
                    </button>
                    <p className="text-[10px] text-slate-400 max-w-xs mx-auto mt-2">
                      Copies today&apos;s routine slot structure so you can program a future scheduled day in advance with 1 click.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Important WBCS Mock Exam countdown bulletin */}
          <div className="bg-[#fcf8e3] border border-[#faebcc] text-[#8a6d3b] p-4 rounded text-xs leading-normal">
            <h5 className="font-bold flex items-center gap-1 mb-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>Aspirant Calendar Reminder</span>
            </h5>
            <span>WBCS examination calendars are demanding. Map 3 consecutive months onto this visual scheduler to verify consistency indices remain consistently high without sudden blocks gaps.</span>
          </div>

        </div>

      </div>

    </div>
  );
}
