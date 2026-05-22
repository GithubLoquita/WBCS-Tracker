/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SubjectId = 
  | 'history' 
  | 'inm' 
  | 'geography' 
  | 'polity' 
  | 'economy' 
  | 'science' 
  | 'english' 
  | 'reasoning' 
  | 'current_affairs' 
  | 'optional_subject' 
  | 'general_studies' 
  | 'break';

export interface SubjectConfig {
  id: SubjectId;
  name: string;
  color: string; // Tailwind color class matching Microsoft palette
  darkColor: string;
  weightage: string; // WBCS Prelims weightage description
}

export interface StudyBlock {
  id: string;
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  subjectId: SubjectId;
  topics: string; // e.g., "Mughal Empire - Akbar's Administration"
  status: 'completed' | 'pending' | 'skipped';
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  isRecurring: boolean;
  recurrenceDay?: string; // "daily" | "weekdays" etc.
}

export interface RoutineTemplate {
  id: string;
  name: string;
  description: string;
  blocks: Omit<StudyBlock, 'id' | 'status'>[];
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  blocks: StudyBlock[];
  notes?: string;
  studiedMinutes: number;
  productivityRating: number; // 1-5 stars
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  goalCompletionRate: number; // in percent
  totalHoursStudied: number;
  lastActiveDate: string | null;
  history: { [date: string]: { completed: number; total: number; duration: number } };
}

export interface AlertNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'reminder' | 'warning' | 'info';
  isRead: boolean;
}

export const EXAM_SUBJECTS: SubjectConfig[] = [
  {
    id: 'history',
    name: 'Ancient & Medieval History',
    color: 'bg-amber-100 text-amber-900 border-amber-300',
    darkColor: 'dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    weightage: '25 Marks in Prelims'
  },
  {
    id: 'inm',
    name: 'Indian National Movement (INM)',
    color: 'bg-rose-100 text-rose-900 border-rose-300',
    darkColor: 'dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
    weightage: '25 Marks (Crucial for Rank)'
  },
  {
    id: 'geography',
    name: 'Geography of India & West Bengal',
    color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    darkColor: 'dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    weightage: '25 Marks (including WB Geography)'
  },
  {
    id: 'polity',
    name: 'Indian Polity (Constitution)',
    color: 'bg-blue-100 text-blue-950 border-blue-300',
    darkColor: 'dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60',
    weightage: 'Polity & Economy: 25 Marks'
  },
  {
    id: 'economy',
    name: 'Indian Economy & RBI Policy',
    color: 'bg-teal-100 text-teal-900 border-teal-300',
    darkColor: 'dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/60',
    weightage: 'Polity & Economy: 25 Marks'
  },
  {
    id: 'science',
    name: 'General Science & Tech',
    color: 'bg-violet-100 text-violet-900 border-violet-300',
    darkColor: 'dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800/60',
    weightage: '25 Marks (Physics/Chem/Bio)'
  },
  {
    id: 'english',
    name: 'English Composition',
    color: 'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300',
    darkColor: 'dark:bg-fuchsia-950/40 dark:text-fuchsia-300 dark:border-fuchsia-800/60',
    weightage: '25 Marks (Vocabulary & Grammer)'
  },
  {
    id: 'reasoning',
    name: 'Arithmetic & Test of Reasoning',
    color: 'bg-orange-100 text-orange-900 border-orange-300',
    darkColor: 'dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60',
    weightage: '25 Marks (Important Scoring Section)'
  },
  {
    id: 'current_affairs',
    name: 'Current Affairs & GK',
    color: 'bg-cyan-100 text-cyan-900 border-cyan-300',
    darkColor: 'dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800/60',
    weightage: '25 Marks (West Bengal & National)'
  },
  {
    id: 'optional_subject',
    name: 'Optional Subject / Paper Revision',
    color: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    darkColor: 'dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60',
    weightage: 'Group A & B Optional Papers (400 Marks)'
  },
  {
    id: 'general_studies',
    name: 'Mock Test & Consolidated Revision',
    color: 'bg-purple-100 text-purple-900 border-purple-300',
    darkColor: 'dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60',
    weightage: 'Key to clearing cutoffs'
  },
  {
    id: 'break',
    name: 'Break & Recharge Time',
    color: 'bg-slate-100 text-slate-700 border-slate-300',
    darkColor: 'dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    weightage: 'Essential for mental agility'
  }
];

export const INITIAL_ROUTINE_TEMPLATES: RoutineTemplate[] = [
  {
    id: 'morning_routine',
    name: 'Morning-Heavy Routine',
    description: 'Tailored for early risers focusing on heavy subjects (INM, History, Polity) in the morning when reading focus is sharpest.',
    blocks: [
      { startTime: '06:30', endTime: '08:30', subjectId: 'inm', topics: 'Indian National Movement: Early Freedom Struggles & Leaders', priority: 'high', isRecurring: true },
      { startTime: '08:45', endTime: '10:45', subjectId: 'polity', topics: 'Indian Polity: Fundamental Rights & Directive Principles (DPSP)', priority: 'high', isRecurring: true },
      { startTime: '11:00', endTime: '12:00', subjectId: 'english', topics: 'English Composition: Idioms, Synonyms & Spotting Errors', priority: 'medium', isRecurring: true },
      { startTime: '12:00', endTime: '13:00', subjectId: 'break', topics: 'Lunch & Relax', priority: 'low', isRecurring: true },
      { startTime: '14:00', endTime: '16:00', subjectId: 'reasoning', topics: 'Arithmetic: Percentage, Profit & Loss, Logical Puzzles', priority: 'high', isRecurring: true },
      { startTime: '16:30', endTime: '18:00', subjectId: 'science', topics: 'General Science: Biology - Human Physiology & Diseases', priority: 'medium', isRecurring: false },
      { startTime: '18:30', endTime: '20:30', subjectId: 'geography', topics: 'Geography of West Bengal: Physical & River systems', priority: 'high', isRecurring: true },
      { startTime: '21:00', endTime: '22:00', subjectId: 'current_affairs', topics: 'Daily Current Affairs & West Bengal Schemes review', priority: 'medium', isRecurring: true }
    ]
  },
  {
    id: 'revision_only',
    name: 'Intensive Revision Routine',
    description: 'Perfect for weekends or the final month before the Prelims exam. Focuses purely on revision questions, quizzes, and standard books scanning.',
    blocks: [
      { startTime: '07:00', endTime: '09:00', subjectId: 'history', topics: 'Modern Indian History Timeline & Charter Acts', priority: 'high', isRecurring: true },
      { startTime: '09:30', endTime: '11:30', subjectId: 'economy', topics: 'Five Year Plans, NITI Aayog & Inflation dynamics', priority: 'high', isRecurring: true },
      { startTime: '12:00', endTime: '13:30', subjectId: 'general_studies', topics: 'Solving Previous Years Papers (2018-2024)', priority: 'high', isRecurring: true },
      { startTime: '13:30', endTime: '14:30', subjectId: 'break', topics: 'Power Nap & Lunch', priority: 'low', isRecurring: true },
      { startTime: '15:00', endTime: '17:00', subjectId: 'science', topics: 'Science Revision: Physics laws & Chemistry organic compounds', priority: 'medium', isRecurring: true },
      { startTime: '17:30', endTime: '19:35', subjectId: 'optional_subject', topics: 'Optional Subject Paper I: Key theories & essay outlines', priority: 'medium', isRecurring: true },
      { startTime: '20:00', endTime: '22:00', subjectId: 'current_affairs', topics: 'Consolidated Current Affairs Quiz & Daily summary', priority: 'high', isRecurring: true }
    ]
  },
  {
    id: 'mock_test_day',
    name: 'Mock Test Simulation Day',
    description: 'Simulates the real WBCS exam timing and environment. High-pressure focus, review, and corrections strategy.',
    blocks: [
      { startTime: '08:30', endTime: '09:30', subjectId: 'break', topics: 'Pre-Exam Mental Warmup & Formulas list review', priority: 'medium', isRecurring: false },
      { startTime: '10:00', endTime: '12:30', subjectId: 'general_studies', topics: 'Full Length WBCS Prelims Mock Test (200 Questions / 150 mins)', priority: 'high', isRecurring: false },
      { startTime: '12:30', endTime: '14:00', subjectId: 'break', topics: 'Lunch & Complete Rest (Aesthetic offline buffer)', priority: 'low', isRecurring: false },
      { startTime: '14:00', endTime: '17:00', subjectId: 'general_studies', topics: 'Deep Analysis of Mock Test Mistakes & Mark Entry', priority: 'high', isRecurring: false },
      { startTime: '17:30', endTime: '19:30', subjectId: 'reasoning', topics: 'Focus on incorrect Reasoning & Quant answers from Mock', priority: 'medium', isRecurring: false },
      { startTime: '20:00', endTime: '21:30', subjectId: 'polity', topics: 'Polity & Economy weak areas correction', priority: 'medium', isRecurring: false }
    ]
  },
  {
    id: 'college_day',
    name: 'Working / College Day Routine',
    description: 'Optimized morning and late night buffers tailored for students or working professionals preparing for WBCS.',
    blocks: [
      { startTime: '06:00', endTime: '08:00', subjectId: 'inm', topics: 'Indian National Movement: Core textbooks highlights', priority: 'high', isRecurring: true },
      { startTime: '08:30', endTime: '17:00', subjectId: 'break', topics: 'College Lectures / Office Hours (Read CA in breaks!)', priority: 'low', isRecurring: true },
      { startTime: '18:00', endTime: '19:30', subjectId: 'reasoning', topics: 'Reasoning practice: Speed quizzes & Numerical reasoning', priority: 'medium', isRecurring: true },
      { startTime: '19:45', endTime: '21:45', subjectId: 'polity', topics: 'Polity: Laxmikanth chapters review & MCQ practice', priority: 'high', isRecurring: true },
      { startTime: '22:00', endTime: '23:00', subjectId: 'current_affairs', topics: 'Daily Current Affairs & Editorial analysis', priority: 'medium', isRecurring: true }
    ]
  }
];

export const INITIAL_ROUTINE: StudyBlock[] = [
  { id: 'sb-1', startTime: '06:30', endTime: '08:30', subjectId: 'inm', topics: 'Indian National Movement (1857 Revolts and Congress formation)', status: 'completed', priority: 'high', notes: 'Read spectrum chapters 4-6. Solved 15 MCQs.', isRecurring: true },
  { id: 'sb-2', startTime: '08:45', endTime: '10:30', subjectId: 'polity', topics: 'Indian Polity (Fundamental Rights, Articles 12-21)', status: 'completed', priority: 'high', notes: 'Read Laxmikanth. Focus on writ jurisdiction next time.', isRecurring: true },
  { id: 'sb-3', startTime: '11:00', endTime: '12:30', subjectId: 'geography', topics: 'Geography of West Bengal (River Systems - Ganga & Teesta)', status: 'pending', priority: 'high', notes: 'Memorize source and tributaries details.', isRecurring: true },
  { id: 'sb-4', startTime: '12:30', endTime: '13:30', subjectId: 'break', topics: 'Lunch, hydration, and active eyes rest', status: 'completed', priority: 'low', isRecurring: true },
  { id: 'sb-5', startTime: '14:00', endTime: '15:30', subjectId: 'reasoning', topics: 'Arithmetic - Data Interpretation & Series Solves', status: 'pending', priority: 'medium', notes: 'Practice 20 speed calculation drills.', isRecurring: true },
  { id: 'sb-6', startTime: '16:00', endTime: '18:00', subjectId: 'science', topics: 'General Science (Biology - Endocrine Glands & Hormones)', status: 'pending', priority: 'medium', isRecurring: false },
  { id: 'sb-7', startTime: '18:30', endTime: '20:00', subjectId: 'optional_subject', topics: 'Optional Paper Revision: Key questions formatting', status: 'skipped', priority: 'medium', notes: 'Skipped due to extra exhaustion. Revise tomorrow.', isRecurring: true },
  { id: 'sb-8', startTime: '21:00', endTime: '22:00', subjectId: 'current_affairs', topics: 'Bengal & National Current Affairs (Daily Quiz)', status: 'pending', priority: 'medium', isRecurring: true }
];

export function getMockHistory() {
  const history: { [date: string]: { completed: number; total: number; duration: number } } = {};
  const today = new Date();
  
  for (let i = 15; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Create random history
    const total = 5 + Math.floor(Math.random() * 4);
    const completed = total - Math.floor(Math.random() * 3);
    const duration = completed * 105 + Math.floor(Math.random() * 30); // in minutes
    
    history[dateStr] = {
      completed,
      total,
      duration
    };
  }
  return history;
}

export function formatTimeDifference(start: string, end: string): number {
  try {
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    const startMin = sH * 60 + sM;
    let endMin = eH * 60 + eM;
    if (endMin < startMin) {
      endMin += 24 * 60; // Next day fallback
    }
    return endMin - startMin;
  } catch (e) {
    return 60; // default 1 hour fallback
  }
}
