/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Plus, Trash, Edit2, Calendar, Check, Copy, ArrowUp, ArrowDown, Save, X, Star, Sparkles, Sliders, AlertCircle, Clock } from 'lucide-react';
import { StudyBlock, SubjectId, SubjectConfig, EXAM_SUBJECTS, formatTimeDifference } from '../types';

interface TodayRoutineProps {
  blocks: StudyBlock[];
  onAddBlock: (block: Omit<StudyBlock, 'id' | 'status'>) => void;
  onUpdateBlock: (id: string, updated: Partial<StudyBlock>) => void;
  onDeleteBlock: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onFocusBlock: (block: StudyBlock) => void;
  onApplyTemplate: (templateId: string) => void;
  subjects: SubjectConfig[];
}

export default function TodayRoutine({
  blocks,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onToggleStatus,
  onFocusBlock,
  onApplyTemplate,
  subjects
}: TodayRoutineProps) {
  // Local form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  // Form Fields
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>('inm');
  const [topics, setTopics] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [notes, setNotes] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  // Filter/Sort Configuration
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'time' | 'priority'>('time');

  // Today Summary metric values
  const totalSlots = blocks.length;
  const completedSlots = blocks.filter(b => b.status === 'completed').length;
  const pendingSlots = blocks.filter(b => b.status === 'pending').length;
  const skippedSlots = blocks.filter(b => b.status === 'skipped').length;
  const studiedMin = blocks
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + formatTimeDifference(b.startTime, b.endTime), 0);
  
  const studiedHr = (studiedMin / 60).toFixed(1);
  const productivityScore = totalSlots > 0 ? Math.round((completedSlots / totalSlots) * 100) : 0;

  // Submissions handle
  const handleAddNewBlock = (e: FormEvent) => {
    e.preventDefault();
    if (!topics.trim()) return;

    onAddBlock({
      startTime,
      endTime,
      subjectId: selectedSubjectId,
      topics,
      priority,
      notes: notes.trim(),
      isRecurring
    });

    // Reset Form
    setTopics('');
    setNotes('');
    setShowAddForm(false);
  };

  const handleStartEdit = (b: StudyBlock) => {
    setEditingBlockId(b.id);
    setStartTime(b.startTime);
    setEndTime(b.endTime);
    setSelectedSubjectId(b.subjectId);
    setTopics(b.topics);
    setPriority(b.priority);
    setNotes(b.notes || '');
    setIsRecurring(b.isRecurring);
  };

  const handleSaveEdit = (e: FormEvent) => {
    e.preventDefault();
    if (!editingBlockId || !topics.trim()) return;

    onUpdateBlock(editingBlockId, {
      startTime,
      endTime,
      subjectId: selectedSubjectId,
      topics,
      priority,
      notes: notes.trim(),
      isRecurring
    });

    setEditingBlockId(null);
  };

  const getSubConfig = (id: string) => {
    return subjects.find(s => s.id === id) || EXAM_SUBJECTS[EXAM_SUBJECTS.length - 1];
  };

  // Cron ordering chronologically
  const sortedBlocks = [...blocks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityWeights = { high: 3, medium: 2, low: 1 };
      return priorityWeights[b.priority] - priorityWeights[a.priority];
    }
    // Default: Sort by Start Time
    return a.startTime.localeCompare(b.startTime);
  });

  const filteredBlocks = sortedBlocks.filter(block => {
    if (filterPriority !== 'all' && block.priority !== filterPriority) return false;
    return true;
  });

  // Shifts blocks up/down in clock time manually by 15-minute intervals
  const handleShiftTime = (block: StudyBlock, minutes: number) => {
    const shiftTimeStr = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      let total = h * 60 + m + minutes;
      if (total < 0) total += 24 * 60;
      if (total >= 24 * 60) total -= 24 * 60;
      const newH = Math.floor(total / 60).toString().padStart(2, '0');
      const newM = (total % 60).toString().padStart(2, '0');
      return `${newH}:${newM}`;
    };

    onUpdateBlock(block.id, {
      startTime: shiftTimeStr(block.startTime),
      endTime: shiftTimeStr(block.endTime)
    });
  };

  return (
    <div id="timeline-planner" className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Upper Tracker Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Today&apos;s WBCS Tracker</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Map out sequence study sessions, resolve focus gaps, and review completion rates.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="planner-add-btn"
            onClick={() => {
              setEditingBlockId(null);
              setShowAddForm(!showAddForm);
            }}
            className="px-4 py-2 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Study Slot</span>
          </button>
        </div>
      </div>

      {/* QUICK STATS & TEMPLATE SHORTCUTS STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Today Studied Count */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-md shadow-3xs">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Assigned Slots</span>
          <div className="text-2xl font-bold font-mono text-[#0078d4] mt-1">{totalSlots} Blocks</div>
          <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-[#0078d4] h-full" style={{ width: `${totalSlots > 0 ? (totalSlots/8)*100 : 0}%` }}></div>
          </div>
        </div>

        {/* Study Hours Completed today */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-md shadow-3xs">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Focus time delivered</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{studiedHr} Hours</div>
          <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-emerald-505 h-full" style={{ width: `${Math.min(100, (Number(studiedHr)/8)*100)}%` }}></div>
          </div>
        </div>

        {/* Real-time status list overview */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-md shadow-3xs">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Tasks Done Ratio</span>
          <div className="text-2xl font-bold font-mono text-purple-600 mt-1">{completedSlots} / {totalSlots}</div>
          <div className="text-[10px] text-slate-500 mt-1.5">
            {pendingSlots} pending • {skippedSlots} skipped
          </div>
        </div>

        {/* Selection Rating Score metric info (Stars inside Today Log) */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-md shadow-3xs">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Productivity Rate</span>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1">{productivityScore}%</div>
          <div className="flex items-center gap-0.5 mt-1.5 text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => {
              const starRate = (productivityScore / 100) * 5;
              return (
                <Star 
                  key={star} 
                  className={`h-3 w-3 ${star <= starRate ? 'fill-current' : 'opacity-35'}`} 
                />
              );
            })}
          </div>
        </div>

      </div>

      {/* RETHINK FORM / EDITOR CONTAINER */}
      {(showAddForm || editingBlockId) && (
        <form 
          id="study-slot-form"
          onSubmit={editingBlockId ? handleSaveEdit : handleAddNewBlock}
          className="bg-[#f8f9fa] dark:bg-slate-900 border-2 border-[#0078d4]/20 p-5 rounded-md space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <h3 className="text-sm font-bold text-slate-950 dark:text-slate-100 uppercase tracking-wider">
              {editingBlockId ? "Modify Study Block" : "Configure Custom Study Block"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEditingBlockId(null);
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Start & End Times */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Slot Time Coordinates</label>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                />
                <span className="text-xs text-slate-400">to</span>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Choose Subject */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">WBCS Subject Tag</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value as SubjectId)}
                className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Set Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Core Priority</label>
              <div className="flex bg-white dark:bg-slate-950 p-1 border border-slate-300 dark:border-slate-700 rounded gap-1">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 text-center py-1 rounded text-[11px] font-bold uppercase transition-all ${
                      priority === p 
                        ? 'bg-[#0078d4] text-white' 
                        : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Topics Description & Recurring checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Specific Topics / Chapters</label>
              <input
                type="text"
                required
                placeholder="e.g., Bengal Partition 1905, Swadeshi Movement (Specific books & PYQ)"
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Custom Notes / Targets</label>
              <input
                type="text"
                placeholder="e.g., Memorize dates, solve Laxmikanth back-chapter questions"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="rounded border-slate-300 text-[#0078d4] focus:ring-[#0078d4] h-4 w-4"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Auto-renew this study block slot tomorrow</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingBlockId(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>{editingBlockId ? "Save Changes" : "Create Block"}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* FILTER & SORT RAIL */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-md flex flex-wrap items-center justify-between gap-4 shadow-3xs">
        <div id="planner-filter-and-sort" className="flex items-center gap-1">
          <Sliders className="h-4 w-4 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium mr-2">Filter Matrix:</span>
          
          <div className="flex items-center gap-1.5">
            {['all', 'high', 'medium', 'low'].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-3 py-1 rounded text-xs capitalize ${
                  filterPriority === p 
                    ? 'bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-bold text-[#0078d4]' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium">Sort sequence:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'time' | 'priority')}
            className="text-xs p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded text-slate-600 dark:text-slate-300"
          >
            <option value="time">Sort by timeline time</option>
            <option value="priority">Sort by top priority</option>
          </select>
        </div>
      </div>

      {/* CHRONOLOGICAL TIMELINE SLOTS */}
      <div className="space-y-4">
        {filteredBlocks.length === 0 ? (
          <div className="bg-white dark:bg-slate-950 rounded-md border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 space-y-2">
            <AlertCircle className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold">No active timeline study slots found</p>
            <p className="text-xs max-w-md mx-auto">Try selecting another filter or adding custom study slots above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBlocks.map((block) => {
              const sub = getSubConfig(block.subjectId);
              const duration = formatTimeDifference(block.startTime, block.endTime);
              return (
                <div 
                  key={block.id} 
                  className={`bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-2xs transition-all border-l-4 ${
                    block.status === 'completed'
                      ? 'border-l-emerald-600 opacity-80'
                      : block.status === 'skipped'
                      ? 'border-l-rose-500'
                      : 'border-l-[#0078d4]'
                  }`}
                >
                  
                  {/* Subject Badge & Details Column */}
                  <div className="flex items-start gap-3.5 md:w-3/5">
                    
                    {/* Tick Checkbox */}
                    <button
                      id={`list-chk-${block.id}`}
                      onClick={() => onToggleStatus(block.id)}
                      className={`h-5 w-5 rounded border flex items-center justify-center transition-all cursor-pointer shrink-0 mt-1 ${
                        block.status === 'completed'
                          ? 'bg-emerald-605 border-emerald-605 text-emerald-600 dark:text-emerald-400'
                          : block.status === 'skipped'
                          ? 'bg-rose-105 border-rose-300 text-rose-700'
                          : 'border-slate-300 hover:border-[#0078d4] dark:border-slate-600 bg-slate-50'
                      }`}
                    >
                      {block.status === 'completed' && <Check className="h-4 w-4 stroke-[3]" />}
                      {block.status === 'skipped' && <span className="text-xs font-bold leading-none">✖</span>}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Time coordinates */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono font-bold">
                          <Clock className="h-3.5 w-3.5 text-[#0078d4]" />
                          <span>{block.startTime} - {block.endTime}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({duration} mins)</span>
                        </div>
                        
                        {/* Subject color-code tag */}
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border leading-none ${sub.color} ${sub.darkColor}`}>
                          {sub.name}
                        </span>

                        {block.isRecurring && (
                          <span className="text-[9px] bg-slate-100 rounded text-slate-400 border px-1.5 uppercase font-bold py-0.2">
                            Auto-Renew
                          </span>
                        )}
                      </div>

                      <h3 className={`text-sm font-semibold tracking-tight ${
                        block.status === 'completed' ? 'line-through text-slate-400 dark:text-slate-600' : 'text-slate-800 dark:text-slate-100'
                      }`}>
                        {block.topics}
                      </h3>

                      {block.notes && (
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {block.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Manual Shifter Timers & Action Controls */}
                  <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-0 border-slate-105 dark:border-slate-850">
                    
                    {/* Shifters (Shifts times by 15 mins) */}
                    <div className="flex items-center gap-1">
                      <button
                        id={`shift-up-${block.id}`}
                        onClick={() => handleShiftTime(block, -15)}
                        title="Shift Slot 15 mins early"
                        className="p-1 px-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-400 hover:text-slate-700 text-[10px] flex items-center gap-0.5"
                      >
                        <ArrowUp className="h-3 w-3" />
                        <span>-15m</span>
                      </button>
                      <button
                        id={`shift-down-${block.id}`}
                        onClick={() => handleShiftTime(block, 15)}
                        title="Shift Slot 15 mins later"
                        className="p-1 px-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-400 hover:text-slate-700 text-[10px] flex items-center gap-0.5"
                      >
                        <ArrowDown className="h-3 w-3" />
                        <span>+15m</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Edit Button */}
                      <button
                        id={`btn-edit-block-${block.id}`}
                        onClick={() => handleStartEdit(block)}
                        className="p-1.5 hover:bg-slate-50 border hover:border-[#0078d4] dark:hover:bg-slate-900 dark:border-slate-800 rounded text-slate-500 transition-all cursor-pointer"
                        title="Edit study block"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>

                      {/* Alternate Status Picker option */}
                      <select
                        value={block.status}
                        onChange={(e) => onUpdateBlock(block.id, { status: e.target.value as any })}
                        className="text-[11px] font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded py-1 px-1 bg-none select-none text-slate-600 dark:text-slate-400"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="skipped">Skipped</option>
                      </select>

                      {/* Delete Block */}
                      <button
                        id={`btn-delete-${block.id}`}
                        onClick={() => onDeleteBlock(block.id)}
                        className="p-1.5 hover:bg-slate-50 hover:text-rose-600 border hover:border-rose-100 dark:border-slate-850 dark:hover:bg-slate-900 rounded text-slate-400 transition-all cursor-pointer"
                        title="Delete slot"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
