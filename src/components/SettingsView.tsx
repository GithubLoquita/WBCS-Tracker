/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { User, Bell, Clock, Trash2, ShieldAlert, Sparkles, Check, Save } from 'lucide-react';
import { SubjectConfig, EXAM_SUBJECTS } from '../types';

interface SettingsViewProps {
  userName: string;
  dailyGoalHours: number;
  alertSettings: {
    bedtime: boolean;
    nextDay: boolean;
    overdue: boolean;
    nextTask: boolean;
  };
  onUpdateUserName: (name: string) => void;
  onUpdateGoalHours: (hours: number) => void;
  onUpdateAlertSettings: (settings: { bedtime: boolean; nextDay: boolean; overdue: boolean; nextTask: boolean }) => void;
  onResetApp: () => void;
  subjects: SubjectConfig[];
}

export default function SettingsView({
  userName,
  dailyGoalHours,
  alertSettings,
  onUpdateUserName,
  onUpdateGoalHours,
  onUpdateAlertSettings,
  onResetApp,
  subjects
}: SettingsViewProps) {
  // Local form state
  const [localName, setLocalName] = useState(userName);
  const [localHours, setLocalHours] = useState(dailyGoalHours);
  
  const [bedtime, setBedtime] = useState(alertSettings.bedtime);
  const [nextDay, setNextDay] = useState(alertSettings.nextDay);
  const [overdue, setOverdue] = useState(alertSettings.overdue);
  const [nextTask, setNextTask] = useState(alertSettings.nextTask);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    onUpdateUserName(localName.trim());
    onUpdateGoalHours(localHours);
    onUpdateAlertSettings({
      bedtime,
      nextDay,
      overdue,
      nextTask
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  };

  return (
    <div id="settings-workspace" className="p-6 max-w-4xl mx-auto space-y-6">
      
      {/* Upper Title */}
      <div className="border-b border-slate-200 dark:border-slate-850 pb-5">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">System Preferences</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Configure parameters, customize indicators, and configure notifications triggers.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* PANEL A: USER PROFILE */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-850 pb-2">
            <User className="h-4.5 w-4.5 text-[#0078d4]" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Aspirant Profile Parameters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-500">Applicant Name</label>
              <input
                type="text"
                required
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                className="w-full text-xs p-2.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:border-[#0078d4] focus:outline-none"
                placeholder="Aspirant Name"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-500">Daily Study Target Goal (Hours)</label>
              <input
                type="number"
                min="2"
                max="18"
                required
                value={localHours}
                onChange={(e) => setLocalHours(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:border-[#0078d4] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* PANEL B: ALERT TRIGGER METRIC GUIDELINES */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-850 pb-2">
            <Bell className="h-4.5 w-4.5 text-[#0078d4]" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Smart Reminder Settings</h3>
          </div>

          <div className="space-y-3">
            
            {/* Alarm 1 */}
            <label className="flex items-start gap-3.5 cursor-pointer select-none py-1">
              <input 
                type="checkbox" 
                checked={nextTask} 
                onChange={(e) => setNextTask(e.target.checked)}
                className="rounded border-slate-300 text-[#0078d4] h-4.5 w-4.5 mt-0.5" 
              />
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Next Study Block Alerts</span>
                <span className="text-[11px] text-slate-400">Notifies you 10 minutes prior to your next scheduled WBCS subject slot.</span>
              </div>
            </label>

            {/* Alarm 2 */}
            <label className="flex items-start gap-3.5 cursor-pointer select-none py-1">
              <input 
                type="checkbox" 
                checked={overdue} 
                onChange={(e) => setOverdue(e.target.checked)}
                className="rounded border-slate-300 text-[#0078d4] h-4.5 w-4.5 mt-0.5" 
              />
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Pending Task Warnings</span>
                <span className="text-[11px] text-slate-400">Triggers an active alert notification if slot bounds expire and the block remains pending.</span>
              </div>
            </label>

            {/* Alarm 3 */}
            <label className="flex items-start gap-3.5 cursor-pointer select-none py-1">
              <input 
                type="checkbox" 
                checked={nextDay} 
                onChange={(e) => setNextDay(e.target.checked)}
                className="rounded border-slate-300 text-[#0078d4] h-4.5 w-4.5 mt-0.5" 
              />
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Next-Day Routine Planning Prompt</span>
                <span className="text-[11px] text-slate-400">Dispatches an active notification at 21:00 reminding you to map tomorrow&apos;s WBCS subjects.</span>
              </div>
            </label>

            {/* Alarm 4 */}
            <label className="flex items-start gap-3.5 cursor-pointer select-none py-1">
              <input 
                type="checkbox" 
                checked={bedtime} 
                onChange={(e) => setBedtime(e.target.checked)}
                className="rounded border-slate-300 text-[#0078d4] h-4.5 w-4.5 mt-0.5" 
              />
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Bedtime Sleep Monitor Triggers</span>
                <span className="text-[11px] text-slate-400">Enforces healthy sleep limits by prompting a shutdown review block warning at 22:30.</span>
              </div>
            </label>

          </div>
        </div>

        {/* SAVE TRIGGERS ROW */}
        <div className="flex items-center gap-3">
          <button
            id="btn-settings-save"
            type="submit"
            className="px-6 py-2.5 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-98 cursor-pointer"
          >
            <Save className="h-4.5 w-4.5" />
            <span>Save Preferences Settings</span>
          </button>

          {savedSuccess && (
            <span className="text-xs text-emerald-600 font-bold animate-pulse inline-flex items-center gap-1">
              <Check className="h-4 w-4" />
              <span>Preferences saved successfully!</span>
            </span>
          )}
        </div>

      </form>

      {/* PANEL C: WBCS SUBJECT REVIEWS (STATIC CONFIG) */}
      <div className="bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-850 pb-2">
          <Clock className="h-4.5 w-4.5 text-[#0078d4]" />
          <h3 className="text-xs font-bold uppercase tracking-wider">Exam Subject blue-prints & weights</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
          {subjects.map((sub) => (
            <div key={sub.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-850 flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full border ${sub.color} ${sub.darkColor}`}></span>
                <span className="font-semibold text-slate-705 dark:text-slate-300">{sub.name}</span>
              </div>
              <span className="text-[10px] text-slate-400 italic">
                {sub.weightage}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* PANEL D: CACHE RESET TRIGGER (DANGEROUS ZONE) */}
      <div className="bg-rose-50/20 dark:bg-rose-950/10 border-2 border-rose-100 dark:border-rose-900/60 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 border-b border-rose-100 dark:border-rose-900/40 pb-2">
          <ShieldAlert className="h-4.5 w-4.5" />
          <h3 className="text-xs font-bold uppercase tracking-wider">System Recovery Options</h3>
        </div>

        <p className="text-xs text-slate-500 leading-normal">
          If scheduling sequences become misconfigured or tracking meters require a completely pristine schedule block layout, executing recovery deletes all custom sessions and returns to mock states.
        </p>

        <button
          id="btn-wipe-cache"
          onClick={() => {
            if (confirm("Are you absolutely sure you want to wipe all local tracker data and return to baseline? This cannot be reversed.")) {
              onResetApp();
            }
          }}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
          <span>Wipe System Cache & Recovery States</span>
        </button>
      </div>

    </div>
  );
}
