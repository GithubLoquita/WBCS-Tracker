/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckSquare, 
  Calendar as CalendarIcon, 
  BookOpen, 
  Settings as SettingsIcon, 
  Flame, 
  LayoutDashboard, 
  History, 
  Search, 
  Bell, 
  HelpCircle, 
  User, 
  Moon, 
  Sun, 
  Sparkles, 
  Power,
  ChevronRight,
  ClipboardList,
  Bookmark
} from 'lucide-react';
import { 
  StudyBlock, 
  RoutineTemplate, 
  DailyLog, 
  HabitStats, 
  AlertNotification, 
  EXAM_SUBJECTS, 
  INITIAL_ROUTINE, 
  getMockHistory, 
  formatTimeDifference 
} from './types';

import Dashboard from './components/Dashboard';
import TodayRoutine from './components/TodayRoutine';
import CalendarView from './components/CalendarView';
import TemplatesManager from './components/TemplatesManager';
import AnalyticsView from './components/AnalyticsView';
import FocusMode from './components/FocusMode';
import SettingsView from './components/SettingsView';
import SyllabusView from './components/SyllabusView';

// Nav Tab types
type TabId = 'dashboard' | 'today' | 'calendar' | 'templates' | 'analytics' | 'focus' | 'settings' | 'syllabus';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabId>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState<string>('WBCS Aspirant');
  const [dailyGoalHours, setDailyGoalHours] = useState<number>(8);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Core local states
  const [blocks, setBlocks] = useState<StudyBlock[]>([]);
  const [historyLogs, setHistoryLogs] = useState<{ [date: string]: DailyLog }>({});
  const [stats, setStats] = useState<HabitStats>({
    currentStreak: 6,
    longestStreak: 14,
    goalCompletionRate: 85,
    totalHoursStudied: 148,
    lastActiveDate: null,
    history: {}
  });

  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('');
  const [activeFocusBlock, setActiveFocusBlock] = useState<StudyBlock | null>(null);

  // Settings for alert triggers
  const [alertSettings, setAlertSettings] = useState({
    bedtime: true,
    nextDay: true,
    overdue: true,
    nextTask: true
  });

  // Local state to track mastered topics
  const [masteredTopics, setMasteredTopics] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('wbcs_mastered_topics');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wbcs_mastered_topics', JSON.stringify(masteredTopics));
    } catch (e) {
      console.error("Error saving mastered topics", e);
    }
  }, [masteredTopics]);

  // INITIAL STATE CRON INITIALIZATION FROM STORAGE OR PRESETS
  useEffect(() => {
    // 1. Theme Check
    const localTheme = localStorage.getItem('wbcs_theme');
    if (localTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    // 2. Load Routine Tasks
    const storedBlocks = localStorage.getItem('wbcs_blocks');
    if (storedBlocks) {
      setBlocks(JSON.parse(storedBlocks));
    } else {
      setBlocks(INITIAL_ROUTINE);
      localStorage.setItem('wbcs_blocks', JSON.stringify(INITIAL_ROUTINE));
    }

    // 3. Load Stats or generate fresh historic compliance
    const storedStats = localStorage.getItem('wbcs_stats');
    if (storedStats) {
      setStats(JSON.parse(storedStats));
    } else {
      const initialHistoryHash = getMockHistory();
      const firstStats: HabitStats = {
        currentStreak: 7,
        longestStreak: 15,
        goalCompletionRate: 82,
        totalHoursStudied: 138,
        lastActiveDate: new Date().toISOString().split('T')[0],
        history: initialHistoryHash
      };
      setStats(firstStats);
      localStorage.setItem('wbcs_stats', JSON.stringify(firstStats));
    }

    // 4. Load Archive history logs
    const storedLogs = localStorage.getItem('wbcs_history_logs');
    if (storedLogs) {
      setHistoryLogs(JSON.parse(storedLogs));
    } else {
      // Re-map mock history coordinates into daily logs structure too for interactive calendars checks
      const mockHist = getMockHistory();
      const logsHash: { [date: string]: DailyLog } = {};
      Object.keys(mockHist).forEach(k => {
        logsHash[k] = {
          date: k,
          blocks: INITIAL_ROUTINE.map((b, idx) => ({
            ...b,
            id: `sb-mock-${idx}`,
            status: Math.random() > 0.3 ? 'completed' : 'skipped'
          })),
          studiedMinutes: mockHist[k].duration,
          productivityRating: 4,
          notes: "Historically synchronized review session."
        };
      });
      setHistoryLogs(logsHash);
      localStorage.setItem('wbcs_history_logs', JSON.stringify(logsHash));
    }

    // 5. Load Profile variables
    const storedName = localStorage.getItem('wbcs_username');
    if (storedName) setUserName(storedName);
    
    const storedGoal = localStorage.getItem('wbcs_daily_goal');
    if (storedGoal) setDailyGoalHours(Number(storedGoal));

    const storedAlertFlags = localStorage.getItem('wbcs_alerts_config');
    if (storedAlertFlags) setAlertSettings(JSON.parse(storedAlertFlags));

    // Define selected date as today initially YYYY-MM-DD
    const todayStr = new Date().toISOString().split('T')[0];
    setSelectedCalendarDate(todayStr);

    // Initial alert set
    setAlerts([
      { id: 'ca-rem', title: 'Next Study Session Up', message: 'Indian National Movement starting soon. Warmup core chapters spectrum.', time: '09:00', type: 'reminder', isRead: false },
      { id: 'bedtime-chk', title: 'Sleep Shutdown Alert', message: 'In order to preserve high focus indices, bedtime shutdown review is recommended at 22:30.', time: '22:30', type: 'info', isRead: false }
    ]);

  }, []);

  // Sync to local storage blocks
  const saveBlocksToStorage = (updatedBlocks: StudyBlock[]) => {
    setBlocks(updatedBlocks);
    localStorage.setItem('wbcs_blocks', JSON.stringify(updatedBlocks));
    
    // Auto sync dashboard widgets metrics inside stats config
    updateStreakStatsAndConsistency(updatedBlocks);
  };

  const updateStreakStatsAndConsistency = (currentBlocks: StudyBlock[]) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const completed = currentBlocks.filter(b => b.status === 'completed').length;
    const total = currentBlocks.length;
    const duration = currentBlocks
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + formatTimeDifference(b.startTime, b.endTime), 0);

    const updatedHistory = { ...stats.history };
    updatedHistory[todayStr] = {
      completed,
      total,
      duration
    };

    const newStats = {
      ...stats,
      history: updatedHistory
    };
    setStats(newStats);
    localStorage.setItem('wbcs_stats', JSON.stringify(newStats));
  };

  // ACTIONS METHOD HANDLERS
  const handleAddStudyBlock = (newBlockData: Omit<StudyBlock, 'id' | 'status'>) => {
    const newBlock: StudyBlock = {
      ...newBlockData,
      id: `sb-${Date.now()}`,
      status: 'pending'
    };
    saveBlocksToStorage([...blocks, newBlock]);
  };

  const handleUpdateStudyBlock = (id: string, updatedFields: Partial<StudyBlock>) => {
    const nextList = blocks.map((b) => {
      if (b.id === id) {
        return { ...b, ...updatedFields };
      }
      return b;
    });
    saveBlocksToStorage(nextList);

    // If active focus block matches this id, synchronize active state as well
    if (activeFocusBlock && activeFocusBlock.id === id) {
      setActiveFocusBlock({ ...activeFocusBlock, ...updatedFields });
    }
  };

  const handleDeleteStudyBlock = (id: string) => {
    const nextList = blocks.filter((b) => b.id !== id);
    saveBlocksToStorage(nextList);

    if (activeFocusBlock && activeFocusBlock.id === id) {
      setActiveFocusBlock(null);
    }
  };

  const handleToggleBlockStatus = (id: string) => {
    const nextList = blocks.map((b) => {
      if (b.id === id) {
        const nextStatus = b.status === 'completed' ? 'pending' : 'completed';
        
        // Push nice contextual notify log alerts if just completed is triggered
        if (nextStatus === 'completed') {
          const finishedAlerts = alerts.filter(a => a.id !== `comp-${id}`);
          setAlerts([
            { id: `comp-${id}`, title: 'Task Completed!', message: `Solved session: ${b.topics}`, time: 'Just details', type: 'info', isRead: false },
            ...finishedAlerts
          ]);
        }
        return { ...b, status: nextStatus as any };
      }
      return b;
    });
    saveBlocksToStorage(nextList);

    // Synchronize active timer if true
    const activeMatch = nextList.find(b => b.id === id);
    if (activeMatch && activeFocusBlock && activeFocusBlock.id === id) {
      setActiveFocusBlock(activeMatch);
    }
  };

  // Focus specific shortcuts launcher
  const handleLaunchFocusBlock = (targetBlock: StudyBlock) => {
    setActiveFocusBlock(targetBlock);
    setCurrentTab('focus');
  };

  const handleCompleteBlockInFocus = (id: string, resultStatus: 'completed' | 'skipped') => {
    handleUpdateStudyBlock(id, { status: resultStatus });
    
    // Automatically locate next pending study block immediately to keep candidate centered
    const remainingPending = blocks.find(b => b.id !== id && b.status === 'pending');
    if (remainingPending) {
      setActiveFocusBlock(remainingPending);
    } else {
      setActiveFocusBlock(null);
    }
  };

  const handleApplyStrategyTemplate = (templateId: string) => {
    const template = EXAM_SUBJECTS; // trigger mock template references
    // Fetch initial template configuration specs
    let targetBlocksData: Omit<StudyBlock, 'id' | 'status'>[] = [];
    
    if (templateId === 'morning_routine') {
      targetBlocksData = [
        { startTime: '06:30', endTime: '08:30', subjectId: 'inm', topics: 'INM: Early Freedom Movements & Congress foundation (1885-1905)', priority: 'high', notes: 'Study Spectrum core chapters. Match PYQs.', isRecurring: true },
        { startTime: '08:45', endTime: '10:45', subjectId: 'polity', topics: 'Polity: Preamble, Union and its Territory & Citizenship', priority: 'high', notes: 'Laxmikanth book referencing.', isRecurring: true },
        { startTime: '11:00', endTime: '12:00', subjectId: 'english', topics: 'English Vocab: Phrases, Idioms, Prepositions drill', priority: 'medium', isRecurring: true },
        { startTime: '12:00', endTime: '13:00', subjectId: 'break', topics: 'Lunch breaks & active mental focus cool-down', priority: 'low', isRecurring: true },
        { startTime: '14:00', endTime: '16:00', subjectId: 'reasoning', topics: 'Logical Puzzles & Arithmetic: Data Interpretation series', priority: 'high', isRecurring: true },
        { startTime: '16:30', endTime: '18:00', subjectId: 'science', topics: 'WBCS Biology: Endocrine system & endocrine glands hormones list', priority: 'medium', isRecurring: false },
        { startTime: '18:30', endTime: '20:30', subjectId: 'geography', topics: 'Bengal River Basin & Agriculture distributions (Bengal Census maps)', priority: 'high', isRecurring: true },
        { startTime: '21:00', endTime: '22:00', subjectId: 'current_affairs', topics: 'WB Central schemes, budget, and daily bulletin quiz scans', priority: 'medium', isRecurring: true }
      ];
    } else if (templateId === 'revision_only') {
      targetBlocksData = [
        { startTime: '07:00', endTime: '09:00', subjectId: 'history', topics: 'Indus Valley Civilisation, Maurya & Gupta Empire scanning', priority: 'high', isRecurring: true },
        { startTime: '09:30', endTime: '11:30', subjectId: 'economy', topics: 'WBCS Economy: Monitory policies details, RBI functions & SLR/CRR ratios', priority: 'high', isRecurring: true },
        { startTime: '12:00', endTime: '13:30', subjectId: 'general_studies', topics: 'Mock solving PYQ test questions series checks', priority: 'high', isRecurring: true },
        { startTime: '13:30', endTime: '14:30', subjectId: 'break', topics: 'Nap & hydration balance checks', priority: 'low', isRecurring: true },
        { startTime: '15:00', endTime: '17:00', subjectId: 'science', topics: 'Physics & Technology: Energy laws & Space centers references', priority: 'medium', isRecurring: true },
        { startTime: '17:30', endTime: '19:30', subjectId: 'optional_subject', topics: 'Optional Paper Revision: Layout essay outline structures', priority: 'medium', isRecurring: true },
        { startTime: '20:00', endTime: '22:00', subjectId: 'current_affairs', topics: 'Monthly GK capsule review & general knowledge drills', priority: 'high', isRecurring: true }
      ];
    } else if (templateId === 'mock_test_day') {
      targetBlocksData = [
        { startTime: '08:30', endTime: '09:30', subjectId: 'break', topics: 'Clean checklist verify & exam simulator mindset focus', priority: 'medium', isRecurring: false },
        { startTime: '10:00', endTime: '12:30', subjectId: 'general_studies', topics: 'WBCS prelims direct Mock Paper simulation (200 MCQs, 150 minutes)', priority: 'high', isRecurring: false },
        { startTime: '12:30', endTime: '14:00', subjectId: 'break', topics: 'Lunch, active eyes shutdown rest cycle', priority: 'low', isRecurring: false },
        { startTime: '14:00', endTime: '17:00', subjectId: 'general_studies', topics: 'Deep Analytics on mock test paper corrections & metrics logged', priority: 'high', isRecurring: false },
        { startTime: '17:30', endTime: '19:30', subjectId: 'reasoning', topics: 'Focus revisions on incorrect math calculations answered', priority: 'medium', isRecurring: false },
        { startTime: '20:00', endTime: '21:30', subjectId: 'polity', topics: 'Polity review corrections', priority: 'medium', isRecurring: false }
      ];
    } else {
      // Working professional fallback
      targetBlocksData = [
        { startTime: '06:00', endTime: '08:00', subjectId: 'inm', topics: 'INM: Indian Mutiny 1857 & Indigo rebellion details', priority: 'high', isRecurring: true },
        { startTime: '08:30', endTime: '17:00', subjectId: 'break', topics: 'Active Hours buffer limit (Revise flashcards in transit!)', priority: 'low', isRecurring: true },
        { startTime: '18:00', endTime: '19:30', subjectId: 'reasoning', topics: 'General Intelligence: Coding decoding & series logs practice', priority: 'medium', isRecurring: true },
        { startTime: '19:45', endTime: '21:45', subjectId: 'polity', topics: 'Polity standard texts Laxmikanth amendments lists review', priority: 'high', isRecurring: true },
        { startTime: '22:00', endTime: '23:00', subjectId: 'current_affairs', topics: 'Daily news bulletin analysis & WB state policies notes', priority: 'medium', isRecurring: true }
      ];
    }

    // Convert to StudyBlock types with IDs
    const formattedBlocks: StudyBlock[] = targetBlocksData.map((b, idx) => ({
      ...b,
      id: `sb-tpl-${Date.now()}-${idx}`,
      status: 'pending'
    }));

    saveBlocksToStorage(formattedBlocks);
  };

  // Clones active blocks to any targeted calendar date (saves in archive dictionary)
  const handleCloneBlocksToArchiveDate = (sources: StudyBlock[], destinationDate: string) => {
    const freshLog: DailyLog = {
      date: destinationDate,
      blocks: sources.map((b, i) => ({ ...b, id: `sb-archive-${destinationDate}-${i}`, status: 'pending' })),
      studiedMinutes: 0,
      productivityRating: 0,
      notes: `Pre-configured planning schedule for ${destinationDate}.`
    };

    const nextLogs = { ...historyLogs, [destinationDate]: freshLog };
    setHistoryLogs(nextLogs);
    localStorage.setItem('wbcs_history_logs', JSON.stringify(nextLogs));
  };

  // Setting handlers
  const handleUpdateUserName = (name: string) => {
    setUserName(name);
    localStorage.setItem('wbcs_username', name);
  };

  const handleUpdateGoalHours = (hours: number) => {
    setDailyGoalHours(hours);
    localStorage.setItem('wbcs_daily_goal', String(hours));
  };

  const handleUpdateAlertSettings = (updated: typeof alertSettings) => {
    setAlertSettings(updated);
    localStorage.setItem('wbcs_alerts_config', JSON.stringify(updated));
  };

  const handleResetSystem = () => {
    localStorage.clear();
    setBlocks(INITIAL_ROUTINE);
    setUserName('WBCS Aspirant');
    setDailyGoalHours(8);
    // Reload matching mock presets
    const defaultHist = getMockHistory();
    const cleanLogs: { [date: string]: DailyLog } = {};
    Object.keys(defaultHist).forEach(k => {
      cleanLogs[k] = {
        date: k,
        blocks: INITIAL_ROUTINE.map((b, i) => ({ ...b, id: `sb-mock-${i}`, status: Math.random() > 0.4 ? 'completed' : 'skipped' })),
        studiedMinutes: defaultHist[k].duration,
        productivityRating: 4
      };
    });
    setHistoryLogs(cleanLogs);
    setStats({
      currentStreak: 6,
      longestStreak: 12,
      goalCompletionRate: 80,
      totalHoursStudied: 120,
      lastActiveDate: null,
      history: defaultHist
    });
    setMasteredTopics({});
    setCurrentTab('dashboard');
    alert("Cache cleaned! Core system state has reset successfully.");
  };

  const handleToggleTheme = () => {
    const nextTheme = !darkMode;
    setDarkMode(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('wbcs_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('wbcs_theme', 'light');
    }
  };

  // Safe tab filter criteria query
  const filteredSearchBlocks = searchQuery.trim() === ''
    ? blocks
    : blocks.filter(b => b.topics.toLowerCase().includes(searchQuery.toLowerCase()) || EXAM_SUBJECTS.find(s => s.id === b.subjectId)?.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div id="application-container" className="flex h-screen bg-slate-50 dark:bg-[#1a1c1e] text-slate-800 dark:text-slate-100 font-sans overflow-hidden">
      
      {/* 1. LEFT SIDEBAR: MS THEME DESIGN NAVIGATION RAIL */}
      <aside className="w-64 bg-white dark:bg-[#202225] border-r border-slate-205 dark:border-slate-800 flex flex-col shrink-0">
        
        {/* App Title Header branding */}
        <div className="p-4 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#0078d4] p-1.5 rounded-md text-white">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-none tracking-tight">WBCS Tracker</h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mt-0.5">MS To-Do style</span>
            </div>
          </div>
        </div>

        {/* User stats indicator block inside sidebar */}
        <div className="p-4 bg-[#f8f9fa] dark:bg-[#2c2e33]/50 m-3 rounded-md border border-slate-200 dark:border-slate-800/60 text-xs">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-amber-50 rounded-full dark:bg-amber-950/40 shrink-0">
              <Flame className="h-4.5 w-4.5 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">{stats.currentStreak} Study Streak</p>
              <span className="text-[9px] text-[#0078d4] font-semibold">Active candidate mode</span>
            </div>
          </div>
        </div>

        {/* Links Navigation Row */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          
          <button
            id="tab-dashboard"
            onClick={() => setCurrentTab('dashboard')}
            className={`w-full flex items-center justify-between p-2.5 rounded text-xs font-semibold cursor-pointer transition-all ${
              currentTab === 'dashboard'
                ? 'bg-[#f3f4f6] dark:bg-slate-800 text-[#0078d4] dark:text-blue-405 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="h-4.5 w-4.5" />
              <span>Dashboard Overview</span>
            </div>
            <ChevronRight className="h-3 w-3 opacity-30" />
          </button>

          <button
            id="tab-today"
            onClick={() => setCurrentTab('today')}
            className={`w-full flex items-center justify-between p-2.5 rounded text-xs font-semibold cursor-pointer transition-all ${
              currentTab === 'today'
                ? 'bg-[#f3f4f6] dark:bg-slate-800 text-[#0078d4] dark:text-blue-405 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckSquare className="h-4.5 w-4.5" />
              <span>Planner Workspace</span>
            </div>
            {blocks.filter(b => b.status === 'pending').length > 0 && (
              <span className="bg-[#0078d4] text-white font-mono text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center leading-none">
                {blocks.filter(b => b.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            id="tab-calendar"
            onClick={() => setCurrentTab('calendar')}
            className={`w-full flex items-center justify-between p-2.5 rounded text-xs font-semibold cursor-pointer transition-all ${
              currentTab === 'calendar'
                ? 'bg-[#f3f4f6] dark:bg-slate-800 text-[#0078d4] dark:text-blue-405 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CalendarIcon className="h-4.5 w-4.5" />
              <span>Calendar Schedule</span>
            </div>
            <ChevronRight className="h-3 w-3 opacity-30" />
          </button>

          <button
            id="tab-templates"
            onClick={() => setCurrentTab('templates')}
            className={`w-full flex items-center justify-between p-2.5 rounded text-xs font-semibold cursor-pointer transition-all ${
              currentTab === 'templates'
                ? 'bg-[#f3f4f6] dark:bg-slate-800 text-[#0078d4] dark:text-blue-405 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="h-4.5 w-4.5" />
              <span>Routine Templates</span>
            </div>
            <ChevronRight className="h-3 w-3 opacity-30" />
          </button>

          <button
            id="tab-analytics"
            onClick={() => setCurrentTab('analytics')}
            className={`w-full flex items-center justify-between p-2.5 rounded text-xs font-semibold cursor-pointer transition-all ${
              currentTab === 'analytics'
                ? 'bg-[#f3f4f6] dark:bg-slate-800 text-[#0078d4] dark:text-blue-405 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <History className="h-4.5 w-4.5" />
              <span>Analytics & Trends</span>
            </div>
            <ChevronRight className="h-3 w-3 opacity-30" />
          </button>

          <button
            id="tab-syllabus"
            onClick={() => setCurrentTab('syllabus')}
            className={`w-full flex items-center justify-between p-2.5 rounded text-xs font-semibold cursor-pointer transition-all ${
              currentTab === 'syllabus'
                ? 'bg-[#f3f4f6] dark:bg-slate-800 text-[#0078d4] dark:text-blue-405 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bookmark className="h-4.5 w-4.5 text-[#0078d4] dark:text-blue-400" />
              <span className="font-semibold">WBCS Exam Syllabus</span>
            </div>
            <ChevronRight className="h-3 w-3 opacity-30" />
          </button>

          <button
            id="sidebar-focus-mode"
            onClick={() => setCurrentTab('focus')}
            className={`w-full flex items-center justify-between p-2.5 rounded text-xs font-semibold cursor-pointer transition-all ${
              currentTab === 'focus'
                ? 'bg-[#f3f4f6] dark:bg-slate-800 text-[#0078d4] dark:text-blue-305 font-bold border-l-2 border-l-[#0078d4]'
                : 'text-emerald-650 bg-emerald-50/20 hover:bg-emerald-50/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Power className="h-4.5 w-4.5 animate-pulse text-emerald-650 dark:text-emerald-400" />
              <span className="font-semibold text-emerald-650 dark:text-emerald-400">Launch Focus Engine</span>
            </div>
            <ChevronRight className="h-3 w-3 opacity-30" />
          </button>

          <button
            id="tab-settings"
            onClick={() => setCurrentTab('settings')}
            className={`w-full flex items-center justify-between p-2.5 rounded text-xs font-semibold cursor-pointer transition-all ${
              currentTab === 'settings'
                ? 'bg-[#f3f4f6] dark:bg-slate-800 text-[#0078d4] dark:text-blue-405 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <SettingsIcon className="h-4.5 w-4.5" />
              <span>System Settings</span>
            </div>
            <ChevronRight className="h-3 w-3 opacity-30" />
          </button>

        </nav>

        {/* Bottom Panel Actions */}
        <div className="p-3 border-t border-slate-150 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
          
          {/* Light / Dark Mode Controls */}
          <button
            id="appearance-theme-toggle"
            onClick={handleToggleTheme}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
          </button>

          <span className="text-[10px] font-mono select-none uppercase tracking-wider">Version 1.0.2</span>
        </div>

      </aside>

      {/* 2. MAIN LAYOUT ENGINE: TOPBAR & SCROLLING WORKSPACE PANEL */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f3f4f6] dark:bg-[#141517]">
        
        {/* TOP INTERACTIVE BAR */}
        <header className="h-14 bg-white dark:bg-[#202225] border-b border-slate-200 dark:border-slate-805 flex items-center justify-between px-6 shrink-0 shadow-3xs z-30">
          
          {/* Search Box */}
          <div className="relative w-80 max-w-lg hidden sm:block">
            <span className="absolute left-3 top-2.5 text-slate-400"><Search className="h-4 w-4" /></span>
            <input
              id="global-search-query"
              type="text"
              placeholder="Search WBCS study focus sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-100 dark:bg-[#2e3135] border border-transparent hover:border-slate-250 focus:border-[#0078d4] focus:bg-white dark:focus:bg-slate-950 p-2 pl-9.5 rounded-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            
            {/* Display Calendar Date indicator */}
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}
              </p>
              <span className="text-[10px] text-slate-400 font-bold block mt-0.5">WBCS Preparation Timeline</span>
            </div>

            {/* Quick add Study Task dropdown trigger */}
            <button
              onClick={() => {
                setCurrentTab('today');
              }}
              className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-[#0078d4] dark:text-blue-400 inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <CheckSquare className="h-4 w-4" />
              <span className="hidden lg:inline">Today&apos;s Workspace</span>
            </button>

            {/* Notification triggers alerts panel shortcut */}
            <button
              onClick={() => {
                // Return notification triggers logs
                setCurrentTab('dashboard');
              }}
              className="p-2 relative hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all text-slate-500"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1.5 h-1.5 w-1.5 bg-red-500 rounded-full"></span>
            </button>

          </div>

        </header>

        {/* WORKSPACE MIDDLE PORTAL VIEWPORT */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.11 }}
              className="h-full"
            >
              
              {currentTab === 'dashboard' && (
                <Dashboard
                  userName={userName}
                  blocks={filteredSearchBlocks}
                  onToggleStatus={handleToggleBlockStatus}
                  onFocusBlock={handleLaunchFocusBlock}
                  onNavigateToTab={(t) => setCurrentTab(t as TabId)}
                  stats={stats}
                  alerts={alerts}
                  subjects={EXAM_SUBJECTS}
                  dailyGoalHours={dailyGoalHours}
                />
              )}

              {currentTab === 'today' && (
                <TodayRoutine
                  blocks={filteredSearchBlocks}
                  onAddBlock={handleAddStudyBlock}
                  onUpdateBlock={handleUpdateStudyBlock}
                  onDeleteBlock={handleDeleteStudyBlock}
                  onToggleStatus={handleToggleBlockStatus}
                  onFocusBlock={handleLaunchFocusBlock}
                  onApplyTemplate={handleApplyStrategyTemplate}
                  subjects={EXAM_SUBJECTS}
                />
              )}

              {currentTab === 'calendar' && (
                <CalendarView
                  currentDate={selectedCalendarDate}
                  historyLogs={historyLogs}
                  stats={stats}
                  onSelectDate={(dateStr) => setSelectedCalendarDate(dateStr)}
                  onCloneRoutineToDate={handleCloneBlocksToArchiveDate}
                  todayBlocks={blocks}
                />
              )}

              {currentTab === 'templates' && (
                <TemplatesManager
                  onApplyTemplate={handleApplyStrategyTemplate}
                  subjects={EXAM_SUBJECTS}
                />
              )}

              {currentTab === 'analytics' && (
                <AnalyticsView
                  blocks={blocks}
                  stats={stats}
                  subjects={EXAM_SUBJECTS}
                />
              )}

              {currentTab === 'focus' && (
                <FocusMode
                  currentBlock={activeFocusBlock || (blocks.find(b => b.status === 'pending') || null)}
                  onCompleteBlock={handleCompleteBlockInFocus}
                  onNextBlock={() => {
                    const rem = blocks.find(b => b.status === 'pending');
                    if (rem) setActiveFocusBlock(rem);
                  }}
                  subjects={EXAM_SUBJECTS}
                />
              )}

              {currentTab === 'settings' && (
                <SettingsView
                  userName={userName}
                  dailyGoalHours={dailyGoalHours}
                  alertSettings={alertSettings}
                  onUpdateUserName={handleUpdateUserName}
                  onUpdateGoalHours={handleUpdateGoalHours}
                  onUpdateAlertSettings={handleUpdateAlertSettings}
                  onResetApp={handleResetSystem}
                  subjects={EXAM_SUBJECTS}
                />
              )}

              {currentTab === 'syllabus' && (
                <SyllabusView 
                  masteredTopics={masteredTopics}
                  setMasteredTopics={setMasteredTopics}
                />
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </main>

    </div>
  );
}
