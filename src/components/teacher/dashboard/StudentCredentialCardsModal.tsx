/**
 * UNIT REVIEW ARCADE — STUDENT CREDENTIAL CARDS MODAL (PHASE 3B)
 * 
 * Generates formatted, printable student login slips suitable for cutting out
 * and distributing to students in class.
 * Designed for standard A4 paper with dashed cut lines and classroom instructions.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StudentManagementRecord } from '../../../types/teacher';
import { 
  X, 
  Printer, 
  KeyRound
} from 'lucide-react';

export interface CredentialCardItem {
  student: StudentManagementRecord;
  pin?: string;
}

interface StudentCredentialCardsModalProps {
  cards: CredentialCardItem[];
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const StudentCredentialCardsModal: React.FC<StudentCredentialCardsModalProps> = ({
  cards,
  isOpen,
  onClose,
  title = 'Student Login Cards',
}) => {
  const [filterClass, setFilterClass] = useState<'all' | '7A' | '7B' | '8A' | '8B'>('all');

  if (!isOpen) return null;

  const filteredCards = cards.filter((c) => {
    if (filterClass === 'all') return true;
    return c.student.class === filterClass;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm print:p-0 print:bg-white print:static">
        
        {/* Print Stylesheet Injection */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-credential-cards, #printable-credential-cards * {
              visibility: visible;
            }
            #printable-credential-cards {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 10mm;
              background: white;
            }
            .no-print {
              display: none !important;
            }
            .card-page-break {
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }
        `}} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-5xl max-h-[92vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-800 print:border-none print:shadow-none print:max-h-none print:rounded-none"
        >
          {/* Modal Header (Hidden during print) */}
          <div className="no-print px-6 py-4 bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">{title}</h3>
                <p className="text-xs text-slate-500">
                  Ready to print for classroom distribution ({filteredCards.length} card{filteredCards.length === 1 ? '' : 's'})
                </p>
              </div>
            </div>

            {/* Class filter and print button */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                {(['all', '7A', '7B', '8A', '8B'] as const).map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setFilterClass(cls)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      filterClass === cls
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cls === 'all' ? 'All' : cls}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print All Cards</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Cards Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-100/50 print:bg-white print:p-0 print:overflow-visible">
            <div id="printable-credential-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 print:grid-cols-2 gap-4">
              {filteredCards.length === 0 ? (
                <div className="col-span-2 py-12 text-center text-slate-400">
                  No student login cards found for this class.
                </div>
              ) : (
                filteredCards.map(({ student, pin }) => (
                  <div
                    key={student.studentNumber}
                    className="card-page-break p-4 bg-white rounded-2xl border-2 border-dashed border-slate-300 print:border-slate-400 text-slate-800 flex flex-col justify-between shadow-xs print:shadow-none"
                  >
                    {/* Slip Top Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-[11px] font-bold">
                          UR
                        </div>
                        <span className="font-bold text-xs text-slate-900 uppercase tracking-wider font-sans">
                          Unit Review Arcade
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black font-mono">
                        Class {student.class}
                      </span>
                    </div>

                    {/* Student Info & Credentials */}
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-sans">Student Name:</span>
                        <strong className="text-slate-900 text-sm block leading-tight font-sans">
                          {student.fullName}
                        </strong>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-sans">Student Number:</span>
                        <strong className="text-indigo-900 text-sm block font-mono">
                          #{student.studentNumber}
                        </strong>
                      </div>
                    </div>

                    {/* Security PIN Box */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between font-mono mb-2.5">
                      <div>
                        <span className="block text-[9px] text-slate-400 uppercase font-sans">Security PIN:</span>
                        <span className="text-lg font-black text-emerald-700 tracking-widest">
                          {pin || '••••'}
                        </span>
                      </div>
                      <KeyRound className="w-4 h-4 text-slate-400" />
                    </div>

                    {/* Step by Step Instructions */}
                    <div className="text-[10px] text-slate-500 space-y-0.5 border-t border-slate-100 pt-2 font-sans">
                      <div className="flex items-center justify-between font-bold text-slate-700">
                        <span>How to Log In:</span>
                        <span className="text-[9px] text-indigo-600 font-mono">arcade website</span>
                      </div>
                      <ol className="list-decimal list-inside space-y-0.5 text-slate-600 text-[9px]">
                        <li>Open the Arcade on smartboard, tablet, or PC.</li>
                        <li>Click <strong>Student Sign In</strong> &amp; select Class <strong>{student.class}</strong>.</li>
                        <li>Enter your Student No (<strong>#{student.studentNumber}</strong>) &amp; PIN.</li>
                      </ol>
                    </div>

                    {/* Footer Warning */}
                    <div className="mt-2 pt-1 border-t border-dashed border-slate-200 text-[8px] text-slate-400 flex items-center justify-between">
                      <span>Keep this card in your English notebook.</span>
                      <span>Do not share your PIN.</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer (Hidden during print) */}
          <div className="no-print px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Tip: Print on standard A4 paper and cut along the dashed borders.</span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
