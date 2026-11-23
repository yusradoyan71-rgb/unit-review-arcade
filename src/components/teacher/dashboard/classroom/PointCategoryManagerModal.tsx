/**
 * UNIT REVIEW ARCADE — POINT CATEGORY MANAGER (PHASE 3.4B)
 * 
 * Allows teachers to customize positive and negative behavior categories:
 * - View existing categories
 * - Create new categories with non-zero points validation
 * - Edit existing category names, points, icons, and colors
 * - Toggle categories active/inactive
 */

import React, { useState } from 'react';
import type { ClassroomCategory } from '../../../../types/classroomPoints';
import { TeacherApiService } from '../../../../services/teacherApiService';
import { 
  X, 
  Plus, 
  Edit3, 
  Check, 
  AlertTriangle, 
  RefreshCw, 
  Sliders, 
  Power
} from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';

interface PointCategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherToken: string;
  categories: ClassroomCategory[];
  onCategoriesUpdated: () => void;
}

const PRESET_ICONS = [
  '🗣️', '🎯', '🤝', '📖', '💡', '🚀', 
  '⭐', '🏆', '👏', '🎨', '🌟', '📚',
  '⚠️', '📵', '⌛', '🚫', '💤', '🛑'
];

const PRESET_COLORS = [
  { name: 'Emerald', value: 'emerald', bg: 'bg-emerald-500' },
  { name: 'Blue', value: 'blue', bg: 'bg-blue-500' },
  { name: 'Violet', value: 'violet', bg: 'bg-violet-500' },
  { name: 'Amber', value: 'amber', bg: 'bg-amber-500' },
  { name: 'Yellow', value: 'yellow', bg: 'bg-yellow-500' },
  { name: 'Cyan', value: 'cyan', bg: 'bg-cyan-500' },
  { name: 'Rose', value: 'rose', bg: 'bg-rose-500' },
  { name: 'Orange', value: 'orange', bg: 'bg-orange-500' },
  { name: 'Slate', value: 'slate', bg: 'bg-slate-500' },
];

export const PointCategoryManagerModal: React.FC<PointCategoryManagerModalProps> = ({
  isOpen,
  onClose,
  teacherToken,
  categories,
  onCategoriesUpdated,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'positive' | 'negative'>('all');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<ClassroomCategory | null>(null);

  // Form Fields
  const [formName, setFormName] = useState<string>('');
  const [formType, setFormType] = useState<'positive' | 'negative'>('positive');
  const [formPoints, setFormPoints] = useState<number>(1);
  const [formIcon, setFormIcon] = useState<string>('🌟');
  const [formColor, setFormColor] = useState<string>('emerald');

  // Operation States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredCategories = categories.filter((c) => {
    if (filterType === 'all') return true;
    return c.type === filterType;
  });

  // Open Create Form
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormName('');
    setFormType('positive');
    setFormPoints(1);
    setFormIcon('🌟');
    setFormColor('emerald');
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsFormOpen(true);
  };

  // Open Edit Form
  const handleOpenEdit = (cat: ClassroomCategory) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormType(cat.type);
    setFormPoints(Math.abs(cat.defaultPoints));
    setFormIcon(cat.icon || (cat.type === 'positive' ? '🌟' : '⚠️'));
    setFormColor(cat.color || (cat.type === 'positive' ? 'emerald' : 'rose'));
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsFormOpen(true);
  };

  // Toggle active/inactive
  const handleToggleActive = async (categoryId: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await TeacherApiService.manageClassroomCategories({
        teacherToken,
        operation: 'toggle',
        categoryData: { categoryId },
      });

      if (response.success) {
        onCategoriesUpdated();
      } else {
        setErrorMessage(response.error || 'Failed to toggle category.');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Network error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save (Create or Update) Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = formName.trim();
    if (!cleanName) {
      setErrorMessage('Category name cannot be empty.');
      return;
    }

    const numericPoints = Number(formPoints);
    if (numericPoints === 0 || isNaN(numericPoints)) {
      setErrorMessage('Category points cannot be zero. Must be at least 1 point.');
      return;
    }

    // Determine signed points: negative categories must have negative points
    const finalPoints = formType === 'negative' ? -Math.abs(numericPoints) : Math.abs(numericPoints);

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (editingCategory) {
        // UPDATE OPERATION
        const response = await TeacherApiService.manageClassroomCategories({
          teacherToken,
          operation: 'update',
          categoryData: {
            categoryId: editingCategory.id,
            name: cleanName,
            defaultPoints: finalPoints,
            icon: formIcon,
            color: formColor,
          },
        });

        if (response.success) {
          setSuccessMessage('Category updated successfully!');
          onCategoriesUpdated();
          setTimeout(() => {
            setIsFormOpen(false);
            setSuccessMessage(null);
          }, 800);
        } else {
          setErrorMessage(response.error || 'Failed to update category.');
        }
      } else {
        // CREATE OPERATION
        const response = await TeacherApiService.manageClassroomCategories({
          teacherToken,
          operation: 'create',
          categoryData: {
            name: cleanName,
            type: formType,
            defaultPoints: finalPoints,
            icon: formIcon,
            color: formColor,
          },
        });

        if (response.success) {
          setSuccessMessage('Category created successfully!');
          onCategoriesUpdated();
          setTimeout(() => {
            setIsFormOpen(false);
            setSuccessMessage(null);
          }, 800);
        } else {
          setErrorMessage(response.error || 'Failed to create category.');
        }
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Network error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center text-base shadow-sm">
              <Sliders className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Classroom Behavior Categories
              </h2>
              <p className="text-xs text-indigo-200">
                Customize positive skills and behavior feedback for your classroom
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {isFormOpen ? (
            /* Category Create / Edit Form */
            <form onSubmit={handleSaveCategory} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                >
                  Cancel
                </button>
              </div>

              {/* Category Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Category Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., Active Listening, Reading Fluency..."
                  className="w-full min-h-[44px] px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Type & Points */}
              <div className="grid grid-cols-2 gap-3">
                {/* Type */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Type</label>
                  <select
                    value={formType}
                    disabled={!!editingCategory} // Type is fixed once created
                    onChange={(e) => {
                      const t = e.target.value as 'positive' | 'negative';
                      setFormType(t);
                      if (t === 'negative') {
                        setFormIcon('⚠️');
                        setFormColor('rose');
                      } else {
                        setFormIcon('🌟');
                        setFormColor('emerald');
                      }
                    }}
                    className="w-full min-h-[44px] px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="positive">Positive (+)</option>
                    <option value="negative">Behavior Correction (-)</option>
                  </select>
                </div>

                {/* Points */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Points ({formType === 'positive' ? '+1 to +5' : '-1 to -5'})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formPoints}
                    onChange={(e) => setFormPoints(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full min-h-[44px] px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold"
                    required
                  />
                  <p className="text-[10px] text-slate-400">Strictly non-zero value</p>
                </div>
              </div>

              {/* Icon Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Icon / Emoji</label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-xl border border-slate-200">
                  {PRESET_ICONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormIcon(emoji)}
                      className={`w-9 h-9 rounded-lg text-base flex items-center justify-center transition-all ${
                        formIcon === emoji
                          ? 'bg-indigo-100 ring-2 ring-indigo-500 scale-110'
                          : 'hover:bg-slate-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Theme Color</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((col) => (
                    <button
                      key={col.value}
                      type="button"
                      onClick={() => setFormColor(col.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                        formColor === col.value
                          ? 'ring-2 ring-indigo-500 border-indigo-500 text-slate-900 bg-white'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${col.bg}`} />
                      <span>{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>{editingCategory ? 'Update Category' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Category List View */
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                {/* Type Filter Pills */}
                <div className="flex items-center gap-1">
                  {(['all', 'positive', 'negative'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFilterType(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        filterType === t
                          ? 'bg-slate-800 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {t === 'all' ? 'All' : t === 'positive' ? 'Positive' : 'Corrections'}
                    </button>
                  ))}
                </div>

                {/* Add Category Button */}
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="space-y-2">
                {filteredCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      cat.isActive
                        ? 'bg-white border-slate-200 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CategoryIcon cat={cat} className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                            {cat.name}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                              cat.type === 'positive'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {cat.defaultPoints > 0 ? `+${cat.defaultPoints}` : cat.defaultPoints}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {cat.type === 'positive' ? 'Positive reinforcement' : 'Behavior correction'} • {cat.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cat)}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all"
                        title="Edit category"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Active Toggle Switch */}
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleToggleActive(cat.id)}
                        className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                          cat.isActive
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-rose-50 hover:text-rose-700'
                            : 'bg-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                        title={cat.isActive ? 'Deactivate' : 'Activate'}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{cat.isActive ? 'Active' : 'Inactive'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
