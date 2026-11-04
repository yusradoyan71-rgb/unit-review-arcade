import React, { useState } from 'react';
import { useArcade } from '../../context/ArcadeContext';
import type { GradeId, Unit, GameType } from '../../types/schema';
import { GAME_TYPE_METADATA } from '../../types/schema';
import { motion } from 'framer-motion';
import { sounds } from '../../services/soundEffects';
import { 
  X, 
  Settings, 
  Layers, 
  Download, 
  Upload, 
  Trash2, 
  RotateCcw, 
  PlusCircle, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  Copy, 
  FolderPlus, 
  AlertTriangle,
  Database,
  Globe,
  RefreshCw,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { ApiService } from '../../services/apiService';

interface TeacherPanelModalProps {
  initialTab?: 'units' | 'activities' | 'backup' | 'tracking';
  targetGradeId?: GradeId;
  onClose: () => void;
}

const ICONS = ['BookOpen', 'Compass', 'Award', 'Sparkles', 'Brain', 'Flame', 'Rocket'];

export const TeacherPanelModal: React.FC<TeacherPanelModalProps> = ({
  initialTab = 'units',
  targetGradeId = 'grade-7',
  onClose,
}) => {
  const { 
    data, 
    createUnit, 
    updateUnit, 
    deleteUnit, 
    reorderUnits, 
    createActivity, 
    deleteActivity,
    exportBackupJSON, 
    importBackupJSON, 
    resetAllData,
    addToast 
  } = useArcade();

  const [activeTab, setActiveTab] = useState<'units' | 'activities' | 'backup' | 'tracking'>(initialTab);
  const [selectedGrade, setSelectedGrade] = useState<GradeId>(targetGradeId);
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');

  // Google Sheets Tracking State
  const [apiUrlInput, setApiUrlInput] = useState(() => ApiService.getApiUrl() || '');
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiStatusMessage, setApiStatusMessage] = useState<string | null>(null);

  // Unit Form State
  const [unitTitle, setUnitTitle] = useState('');
  const [unitNumber, setUnitNumber] = useState<number | ''>('');
  const [unitDesc, setUnitDesc] = useState('');
  const [unitIcon, setUnitIcon] = useState('BookOpen');
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);

  // Activity Form State
  const [actTitle, setActTitle] = useState('');
  const [actGameType, setActGameType] = useState<GameType>('quiz_battle');
  const [actInstructions, setActInstructions] = useState('');

  // JSON Backup State
  const [importJsonText, setImportJsonText] = useState('');
  const [copied, setCopied] = useState(false);

  const unitsForGrade = data.units[selectedGrade] || [];
  const selectedUnit = unitsForGrade.find((u) => u.id === selectedUnitId) || unitsForGrade[0];

  // UNIT HANDLERS
  const handleSaveUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitTitle.trim()) {
      addToast('Unit title cannot be empty', 'warning');
      return;
    }

    if (editingUnitId) {
      updateUnit(editingUnitId, {
        title: unitTitle.trim(),
        unitNumber: typeof unitNumber === 'number' ? unitNumber : 1,
        description: unitDesc.trim() || undefined,
        icon: unitIcon,
      });
      setEditingUnitId(null);
    } else {
      createUnit(selectedGrade, {
        unitNumber: typeof unitNumber === 'number' ? unitNumber : unitsForGrade.length + 1,
        title: unitTitle.trim(),
        description: unitDesc.trim() || undefined,
        icon: unitIcon,
        colorTheme: selectedGrade === 'grade-7' ? 'cyan' : 'purple',
      });
    }

    setUnitTitle('');
    setUnitNumber('');
    setUnitDesc('');
  };

  const handleStartEditUnit = (unit: Unit) => {
    setEditingUnitId(unit.id);
    setUnitTitle(unit.title);
    setUnitNumber(unit.unitNumber);
    setUnitDesc(unit.description || '');
    setUnitIcon(unit.icon || 'BookOpen');
  };

  const handleCancelEdit = () => {
    setEditingUnitId(null);
    setUnitTitle('');
    setUnitNumber('');
    setUnitDesc('');
  };

  const handleMoveUnit = (index: number, direction: 'up' | 'down') => {
    sounds.playTap();
    const newUnits = [...unitsForGrade];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newUnits.length) return;

    const temp = newUnits[index];
    newUnits[index] = newUnits[targetIndex];
    newUnits[targetIndex] = temp;

    reorderUnits(selectedGrade, newUnits.map((u) => u.id));
  };

  // ACTIVITY HANDLERS
  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit) {
      addToast('Please select or create a unit first', 'warning');
      return;
    }
    if (!actTitle.trim()) {
      addToast('Activity title cannot be empty', 'warning');
      return;
    }

    createActivity(selectedUnit.id, {
      title: actTitle.trim(),
      gameType: actGameType,
      instructions: actInstructions.trim() || undefined,
      settings: {
        timeLimitSeconds: 30,
        showTimer: true,
        allowRevealAnswer: true,
      },
      questions: [],
    });

    setActTitle('');
    setActInstructions('');
  };

  // BACKUP HANDLERS
  const handleCopyJSON = () => {
    const json = exportBackupJSON();
    navigator.clipboard.writeText(json);
    setCopied(true);
    addToast('Backup JSON copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const json = exportBackupJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unit-review-arcade-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Backup file downloaded successfully!', 'success');
  };

  const handleImportJSON = () => {
    if (!importJsonText.trim()) {
      addToast('Please paste a JSON backup to restore', 'warning');
      return;
    }
    const ok = importBackupJSON(importJsonText.trim());
    if (ok) {
      setImportJsonText('');
    }
  };

  const handleSaveApiUrl = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playTap();
    const clean = apiUrlInput.trim();
    if (clean) {
      ApiService.setApiUrl(clean);
      addToast('Google Apps Script URL saved!', 'success');
      handleTestApiConnection();
    } else {
      ApiService.setApiUrl(null);
      addToast('Cleared custom API URL. Reverted to Local Demo Mode.', 'info');
      setApiStatusMessage(null);
    }
  };

  const handleTestApiConnection = async () => {
    const url = apiUrlInput.trim() || ApiService.getApiUrl();
    if (!url) {
      setApiStatusMessage('No URL provided. Running in Local Demo Mode.');
      return;
    }

    setIsTestingApi(true);
    setApiStatusMessage('Pinging Google Apps Script endpoint...');

    try {
      const response = await fetch(url, { method: 'GET' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      if (data && data.status === 'ok') {
        sounds.playSuccess();
        setApiStatusMessage(`✅ Connected successfully! ${data.message || 'Ready for student logins.'}`);
        addToast('Connected to Google Apps Script backend!', 'success');
      } else {
        throw new Error('Endpoint did not return standard Arcade healthcheck status.');
      }
    } catch (err) {
      sounds.playBack();
      const msg = err instanceof Error ? err.message : 'Network error';
      setApiStatusMessage(`❌ Connection failed: ${msg}. Check that the Web App is deployed with "Anyone" access.`);
      addToast(`Connection test failed (${msg})`, 'error');
    } finally {
      setIsTestingApi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-arcade text-xl sm:text-2xl font-bold text-white tracking-tight">
                Teacher Control Panel
              </h2>
              <p className="text-slate-400 text-xs">
                Manage units, activities, game configurations, and JSON backups
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playBack();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 gap-2">
          <button
            onClick={() => {
              sounds.playTap();
              setActiveTab('units');
            }}
            className={`py-3.5 px-4 font-semibold text-sm border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'units'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>Unit Management</span>
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              setActiveTab('activities');
            }}
            className={`py-3.5 px-4 font-semibold text-sm border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'activities'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Activity Management</span>
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              setActiveTab('backup');
            }}
            className={`py-3.5 px-4 font-semibold text-sm border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'backup'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Backup & Restore (JSON)</span>
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              setActiveTab('tracking');
            }}
            className={`py-3.5 px-4 font-semibold text-sm border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'tracking'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Tracking & Google Sheets</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: UNIT MANAGEMENT */}
          {activeTab === 'units' && (
            <div className="space-y-6">
              {/* Grade Selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Select Grade Level:
                </span>
                <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                  <button
                    onClick={() => {
                      sounds.playTap();
                      setSelectedGrade('grade-7');
                    }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedGrade === 'grade-7'
                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Grade 7 ({data.units['grade-7']?.length || 0})
                  </button>
                  <button
                    onClick={() => {
                      sounds.playTap();
                      setSelectedGrade('grade-8');
                    }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedGrade === 'grade-8'
                        ? 'bg-purple-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Grade 8 ({data.units['grade-8']?.length || 0})
                  </button>
                </div>
              </div>

              {/* Add / Edit Unit Form */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-arcade text-lg font-bold text-white flex items-center gap-2">
                    <FolderPlus className="w-5 h-5 text-indigo-400" />
                    <span>{editingUnitId ? 'Edit Unit' : `Create New Unit for ${selectedGrade === 'grade-7' ? 'Grade 7' : 'Grade 8'}`}</span>
                  </h3>
                  {editingUnitId && (
                    <button
                      onClick={handleCancelEdit}
                      className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveUnit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                      Unit Number
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder={`${unitsForGrade.length + 1}`}
                      value={unitNumber}
                      onChange={(e) => setUnitNumber(e.target.value ? parseInt(e.target.value) : '')}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                      Unit Title <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Friendship, Teen Life..."
                      value={unitTitle}
                      onChange={(e) => setUnitTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                      Optional Description
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Target vocabulary and speaking prompts"
                      value={unitDesc}
                      onChange={(e) => setUnitDesc(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="md:col-span-3 flex flex-wrap items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Icon:</span>
                      <div className="flex items-center gap-1.5">
                        {ICONS.map((iconName) => (
                          <button
                            key={iconName}
                            type="button"
                            onClick={() => setUnitIcon(iconName)}
                            className={`p-2 rounded-lg border text-xs font-mono transition-all ${
                              unitIcon === iconName
                                ? 'bg-indigo-600 border-indigo-400 text-white'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {iconName}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>{editingUnitId ? 'Update Unit' : 'Add Unit'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Units List */}
              <div>
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Existing Units in {selectedGrade === 'grade-7' ? 'Grade 7' : 'Grade 8'} ({unitsForGrade.length})
                </h4>

                {unitsForGrade.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center text-slate-500 text-sm">
                    No units created yet for this grade. Use the form above to add your first unit.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {unitsForGrade.map((u, idx) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            UNIT {String(u.unitNumber).padStart(2, '0')}
                          </span>
                          <div>
                            <p className="font-semibold text-white text-sm">{u.title}</p>
                            {u.description && <p className="text-xs text-slate-400">{u.description}</p>}
                          </div>
                          <span className="text-xs text-slate-500 ml-2">
                            ({u.activities.length} activities)
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleMoveUnit(idx, 'up')}
                            disabled={idx === 0}
                            title="Move Up"
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMoveUnit(idx, 'down')}
                            disabled={idx === unitsForGrade.length - 1}
                            title="Move Down"
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStartEditUnit(u)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 text-xs font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete unit "${u.title}"?`)) {
                                deleteUnit(u.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVITY MANAGEMENT */}
          {activeTab === 'activities' && (
            <div className="space-y-6">
              {/* Unit Selection dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                    Grade Level
                  </label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => {
                      setSelectedGrade(e.target.value as GradeId);
                      setSelectedUnitId('');
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="grade-7">Grade 7</option>
                    <option value="grade-8">Grade 8</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                    Target Unit
                  </label>
                  <select
                    value={selectedUnit?.id || ''}
                    onChange={(e) => setSelectedUnitId(e.target.value)}
                    disabled={unitsForGrade.length === 0}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-40"
                  >
                    {unitsForGrade.length === 0 ? (
                      <option value="">No units created yet</option>
                    ) : (
                      unitsForGrade.map((u) => (
                        <option key={u.id} value={u.id}>
                          Unit {u.unitNumber}: {u.title}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {unitsForGrade.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-950/40 border border-slate-800 text-center text-slate-400">
                  <p>Please create a unit in the "Unit Management" tab before adding activities.</p>
                </div>
              ) : selectedUnit ? (
                <>
                  {/* Create Activity Form */}
                  <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <h3 className="font-arcade text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <PlusCircle className="w-5 h-5 text-indigo-400" />
                      <span>Add Activity to Unit {selectedUnit.unitNumber}: {selectedUnit.title}</span>
                    </h3>

                    <form onSubmit={handleSaveActivity} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                            Activity Title <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Vocabulary Speed Drill"
                            value={actTitle}
                            onChange={(e) => setActTitle(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                            Classroom Instructions
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Teams take turns answering on the smartboard"
                            value={actInstructions}
                            onChange={(e) => setActInstructions(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      {/* Game Engine Selector */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                          Select Game Engine
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {(Object.keys(GAME_TYPE_METADATA) as GameType[]).map((gt) => {
                            const meta = GAME_TYPE_METADATA[gt];
                            const isSelected = actGameType === gt;
                            return (
                              <button
                                key={gt}
                                type="button"
                                onClick={() => setActGameType(gt)}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                  isSelected
                                    ? 'bg-indigo-600/20 border-indigo-400 ring-1 ring-indigo-400'
                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                                }`}
                              >
                                <span className="font-arcade font-bold text-sm block text-white mb-1">
                                  {meta.title}
                                </span>
                                <span className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                  {meta.shortDesc}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Save Activity</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* List of Activities in Selected Unit */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">
                      Activities in Unit {selectedUnit.unitNumber} ({selectedUnit.activities.length})
                    </h4>

                    {selectedUnit.activities.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center text-slate-500 text-sm">
                        No activities created in this unit yet.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedUnit.activities.map((act) => {
                          const meta = GAME_TYPE_METADATA[act.gameType];
                          return (
                            <div
                              key={act.id}
                              className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800"
                            >
                              <div className="flex items-center gap-3">
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase border ${meta?.badgeColor}`}>
                                  {meta?.title || act.gameType}
                                </span>
                                <div>
                                  <p className="font-semibold text-white text-sm">{act.title}</p>
                                  {act.instructions && (
                                    <p className="text-xs text-slate-400">{act.instructions}</p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-xs font-mono text-slate-400">
                                  {act.questions?.length || 0} Questions
                                </span>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Delete activity "${act.title}"?`)) {
                                      deleteActivity(selectedUnit.id, act.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          )}

          {/* TAB 3: BACKUP & RESTORE */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              {/* Export Section */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <Download className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-arcade text-lg font-bold text-white">Export Content Backup (JSON)</h3>
                </div>
                <p className="text-slate-400 text-xs mb-4">
                  Export all your customized Grade 7 and Grade 8 units, activities, and questions as a clean JSON backup file.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleDownloadJSON}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON File</span>
                  </button>

                  <button
                    onClick={handleCopyJSON}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all flex items-center gap-2 border border-slate-700"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                  </button>
                </div>
              </div>

              {/* Import Section */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-arcade text-lg font-bold text-white">Restore / Import Content (JSON)</h3>
                </div>
                <p className="text-slate-400 text-xs mb-3">
                  Paste a valid Arcade JSON schema string to restore previously authored units and activities.
                </p>

                <textarea
                  rows={5}
                  placeholder='Paste JSON data here (e.g. { "version": "1.0.0", "units": { "grade-7": [], "grade-8": [] } })'
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-500 mb-3"
                />

                <button
                  onClick={handleImportJSON}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Restore from JSON</span>
                </button>
              </div>

              {/* Danger Zone: Reset All Data */}
              <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/40">
                <div className="flex items-center gap-2 text-rose-400 mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="font-arcade text-lg font-bold">Reset Platform to Empty State</h3>
                </div>
                <p className="text-slate-400 text-xs mb-4">
                  Permanently erase all custom units and activities stored in your local browser cache, returning Grade 7 and Grade 8 to an empty state.
                </p>

                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset all units and activities to an empty state?')) {
                      resetAllData();
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset All Data to Empty</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: GOOGLE SHEETS & STUDENT TRACKING SETUP */}
          {activeTab === 'tracking' && (
            <div className="space-y-6">
              {/* Endpoint Connection Card */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <Database className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h3 className="font-arcade text-lg font-bold text-white">
                        Google Apps Script Web App Deployment
                      </h3>
                      <p className="text-slate-400 text-xs">
                        Connect this web app to your Google Spreadsheet backend to enable server-side student authentication.
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${
                    ApiService.hasLiveEndpoint()
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${ApiService.hasLiveEndpoint() ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    <span>{ApiService.hasLiveEndpoint() ? 'Live Server Connected' : 'Local Demo Mode Active'}</span>
                  </span>
                </div>

                <form onSubmit={handleSaveApiUrl} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Web App URL (from Apps Script Deployment):
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="url"
                          placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                          value={apiUrlInput}
                          onChange={(e) => setApiUrlInput(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow"
                      >
                        Save URL
                      </button>

                      <button
                        type="button"
                        onClick={handleTestApiConnection}
                        disabled={isTestingApi || !apiUrlInput.trim()}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isTestingApi ? 'animate-spin' : ''}`} />
                        <span>Test</span>
                      </button>

                      {apiUrlInput && (
                        <button
                          type="button"
                          onClick={() => {
                            setApiUrlInput('');
                            ApiService.setApiUrl(null);
                            setApiStatusMessage(null);
                            addToast('Reverted to Local Demo Mode.', 'info');
                          }}
                          className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-800 text-xs transition-all"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </form>

                {/* Status Box */}
                {apiStatusMessage && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                    <span className="leading-snug">{apiStatusMessage}</span>
                  </div>
                )}
              </div>

              {/* Security & Database Status Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-2 mb-2 text-indigo-400">
                    <ShieldCheck className="w-4 h-4" />
                    <h4 className="font-arcade text-sm font-bold uppercase tracking-wider">
                      Security Measures Active
                    </h4>
                  </div>
                  <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                    <li>Plaintext PINs are <strong className="text-slate-200">never stored</strong> in Google Sheets.</li>
                    <li>Salted SHA-256 key derivation with <strong className="text-slate-200">1,000 iterative rounds</strong>.</li>
                    <li><strong className="text-slate-200">5-attempt lockout</strong> defense against PIN guessing.</li>
                    <li>Cryptographic, unguessable session tokens (12h expiration).</li>
                    <li>Minimal student profile served: only first name and class.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-2 mb-2 text-cyan-400">
                    <Database className="w-4 h-4" />
                    <h4 className="font-arcade text-sm font-bold uppercase tracking-wider">
                      Prepared Database Sheets
                    </h4>
                  </div>
                  <ul className="text-xs text-slate-400 space-y-1.5">
                    <li><strong className="text-slate-200">Students</strong>: Enrolled student records & credentials</li>
                    <li><strong className="text-slate-200">Sessions</strong>: Login records, ping durations & active tokens</li>
                    <li><strong className="text-slate-200">Attempts</strong>: Activity score summaries (Phase 2)</li>
                    <li><strong className="text-slate-200">Answers</strong>: Diagnostic question telemetry (Phase 2)</li>
                    <li><strong className="text-slate-200">Dashboard</strong>: Class statistics for 7A, 7B, 8A, 8B</li>
                  </ul>
                </div>
              </div>

              {/* Demo Accounts Reference */}
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider mb-2">
                  <KeyRound className="w-4 h-4" />
                  <span>Demo Test Accounts Available Out of the Box:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="block font-bold text-cyan-400">Class 7A</span>
                    <span className="text-slate-300 text-[11px]">No: 701 (PIN: 1234)</span>
                    <span className="text-slate-300 text-[11px] block">No: 702 (PIN: 4321)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="block font-bold text-cyan-400">Class 7B</span>
                    <span className="text-slate-300 text-[11px]">No: 703 (PIN: 1111)</span>
                    <span className="text-slate-300 text-[11px] block">No: 704 (PIN: 2222)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="block font-bold text-purple-400">Class 8A</span>
                    <span className="text-slate-300 text-[11px]">No: 801 (PIN: 1234)</span>
                    <span className="text-slate-300 text-[11px] block">No: 802 (PIN: 4321)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="block font-bold text-purple-400">Class 8B</span>
                    <span className="text-slate-300 text-[11px]">No: 803 (PIN: 1111)</span>
                    <span className="text-slate-300 text-[11px] block">No: 804 (PIN: 2222)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/60 text-xs text-slate-500">
          <span>Unit Review Arcade Schema v1.0.0</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs"
          >
            Close Panel
          </button>
        </div>
      </motion.div>
    </div>
  );
};
