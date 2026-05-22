/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { CheckCircle, Info, Calendar, Sparkles, Clipboard, ArrowRight, Star } from 'lucide-react';
import { RoutineTemplate, INITIAL_ROUTINE_TEMPLATES, SubjectConfig, EXAM_SUBJECTS } from '../types';

interface TemplatesManagerProps {
  onApplyTemplate: (templateId: string) => void;
  subjects: SubjectConfig[];
}

export default function TemplatesManager({ onApplyTemplate, subjects }: TemplatesManagerProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(INITIAL_ROUTINE_TEMPLATES[0].id);
  const [justApplied, setJustApplied] = useState(false);

  // Find active template
  const activeTemplate = INITIAL_ROUTINE_TEMPLATES.find((t) => t.id === selectedTemplateId) || INITIAL_ROUTINE_TEMPLATES[0];

  const handleApply = () => {
    onApplyTemplate(activeTemplate.id);
    setJustApplied(true);
    setTimeout(() => {
      setJustApplied(false);
    }, 3000);
  };

  const getSubConfig = (id: string) => {
    return subjects.find(s => s.id === id) || EXAM_SUBJECTS[EXAM_SUBJECTS.length - 1];
  };

  return (
    <div id="templates-workspace" className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Upper Title */}
      <div className="border-b border-slate-200 dark:border-slate-850 pb-5">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Routine Presets Library</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Instantly configure your entire active Day with highly structured, pre-optimized WBCS exam routines.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* TEMPLATE QUICK SELECTOR (4 COLS) */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-450 mb-1">Select Preset Strategy</h3>
          
          <div className="space-y-3">
            {INITIAL_ROUTINE_TEMPLATES.map((tpl) => {
              const isSelected = tpl.id === selectedTemplateId;
              return (
                <button
                  id={`btn-template-select-${tpl.id}`}
                  key={tpl.id}
                  onClick={() => {
                    setSelectedTemplateId(tpl.id);
                  }}
                  className={`w-full text-left p-4.5 border rounded-lg transition-all relative cursor-pointer ${
                    isSelected 
                      ? 'bg-blue-50/5 border-[#0078d4] ring-1 ring-[#0078d4]/10' 
                      : 'bg-white dark:bg-slate-950 border-slate-205 dark:border-slate-850 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Clipboard className={`h-4.5 w-4.5 ${isSelected ? 'text-[#0078d4]' : 'text-slate-405'}`} />
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {tpl.name}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    {tpl.description.substring(0, 95)}...
                  </p>
                  
                  {isSelected && (
                    <span className="absolute right-3.5 top-3.5 h-1.5 w-1.5 rounded-full bg-[#0078d4]"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Informational Notice */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs leading-normal flex items-start gap-2 text-slate-500 dark:text-slate-405">
            <Info className="h-4.5 w-4.5 text-[#0078d4] shrink-0 fill-current mt-0.5" />
            <span><strong>Please Note:</strong> Applying any routine preset replaces your current active Today list. Be sure to mark outstanding items completed before overriding layouts.</span>
          </div>

        </div>

        {/* TEMPLATE DETAIL PREVIEW (8 COLS) */}
        <div id="template-detail-preview-panel" className="lg:col-span-12 xl:col-span-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-xs space-y-5">
          
          {/* Preset Top Section with Apply triggers */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Selected Strategy</span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {activeTemplate.name}
              </h2>
            </div>

            <button
              id="btn-apply-template-trigger"
              onClick={handleApply}
              disabled={justApplied}
              className={`px-5 py-2.5 rounded font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-98 text-white ${
                justApplied 
                  ? 'bg-emerald-600' 
                  : 'bg-[#0078d4] hover:bg-[#106ebe]'
              }`}
            >
              <CheckCircle className="h-4.5 w-4.5" />
              <span>{justApplied ? "Strategy Deployed!" : "Apply This Routine Strategy"}</span>
            </button>
          </div>

          {justApplied && (
            <div className="p-3 bg-emerald-50 text-emerald-805 rounded text-xs border border-emerald-200 animate-fadeIn">
              <strong>Success!</strong> Today&apos;s active study list has been updated and structured per the <strong>{activeTemplate.name}</strong> layout parameters. Navigate to the **Today** workspace to view.
            </div>
          )}

          {/* Slots List Block preview timeline */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Scheduled Routine Session sequence ({activeTemplate.blocks.length} Tasks)</h4>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-850 space-y-1">
              {activeTemplate.blocks.map((block, idx) => {
                const sub = getSubConfig(block.subjectId);
                return (
                  <div key={`tpl-block-${idx}`} className="flex items-start justify-between py-3.5">
                    <div className="flex items-start gap-4">
                      {/* Chrono timeline marker */}
                      <span className="font-mono text-xs font-bold text-[#0078d4] dark:text-blue-400 shrink-0 mt-0.5">
                        {block.startTime} - {block.endTime}
                      </span>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.2 rounded border leading-none ${sub.color} ${sub.darkColor}`}>
                            {sub.name}
                          </span>
                          
                          <span className={`text-[9px] font-bold rounded px-1.5 uppercase ${
                            block.priority === 'high' ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/20' : 'text-slate-400'
                          }`}>
                            {block.priority} Priority
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {block.topics}
                        </h5>
                      </div>
                    </div>

                    {idx === 0 && (
                      <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-0.5 pr-2 pt-0.5">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span>Core opener</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strategic value bulletin */}
          <div className="p-4 bg-[#f8f9fa] dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>WBCS Academic Notes</span>
            </div>
            <p className="leading-relaxed">
              Applying a layout structures consecutive sessions to optimize focus levels. Ensure standard texts (e.g., Laxmikanth, Poonam Dalal, or regional geography atlases) are positioned adjacent to current study slots to maintain instant continuity.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
