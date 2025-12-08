
import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Filter, ChevronDown, X, Save, Star, Trash2, Check, 
  LayoutTemplate, ChevronRight, SlidersHorizontal, RotateCcw
} from 'lucide-react';
import { FilterState, FilterCategory, SavedView } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  savedViews: SavedView[];
  onSaveView: (name: string) => void;
  onUpdateView: (view: SavedView) => void;
  onDeleteView: (id: string) => void;
  onApplyView: (view: SavedView) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  searchQuery,
  onSearchChange,
  savedViews,
  onSaveView,
  onUpdateView,
  onDeleteView,
  onApplyView
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeViewDropdown, setActiveViewDropdown] = useState(false);
  const [newViewName, setNewViewName] = useState('');
  const [isSavingView, setIsSavingView] = useState(false);
  const viewDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (viewDropdownRef.current && !viewDropdownRef.current.contains(event.target as Node)) {
        setActiveViewDropdown(false);
        setIsSavingView(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories: { key: FilterCategory; label: string; options: string[] }[] = [
    { key: 'department', label: 'Department', options: ['Engineering', 'Product', 'Sales', 'Marketing', 'HR', 'Operations'] },
    { key: 'location', label: 'Location', options: ['New York', 'London', 'Berlin', 'Singapore', 'Remote'] },
    { key: 'grade', label: 'Grade', options: ['L1', 'L2', 'L3', 'Senior', 'Lead', 'Principal', 'Manager', 'Director'] },
    { key: 'status', label: 'Status', options: ['Active', 'On Leave', 'Notice Period'] },
    { key: 'tags', label: 'Tags', options: ['High Performer', 'Flight Risk', 'New Joiner', 'Remote First'] },
  ];

  const handleCheckboxChange = (category: FilterCategory, value: string) => {
    const currentValues = filters[category];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange({ ...filters, [category]: newValues });
  };

  const clearFilters = () => {
    onFilterChange({
      department: [],
      location: [],
      grade: [],
      status: [],
      tags: [],
      designation: []
    });
  };

  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0);
  const activeFilterCount = Object.values(filters).reduce((acc, arr) => acc + arr.length, 0);

  const inputClass = "w-full pl-9 pr-4 py-2.5 rounded-lg border border-neutral-border bg-white text-sm text-neutral-primary focus:outline-none focus:ring-2 focus:ring-flexi-primary/20 focus:border-flexi-primary transition-all placeholder:text-neutral-muted";

  return (
    <div className="space-y-4 mb-6 relative">
      {/* Main Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white p-3 rounded-xl border border-neutral-border shadow-card">
        
        {/* Left Side */}
        <div className="flex flex-1 gap-3 items-center">
            {/* Search Input */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted h-4 w-4" />
                <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by name, ID, role, or dept..."
                className={inputClass}
                />
            </div>

            {/* Filter Toggle */}
            <button
                onClick={() => setIsDrawerOpen(true)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold border transition-all shrink-0 ${
                hasActiveFilters || isDrawerOpen
                    ? 'bg-flexi-primary text-white border-flexi-primary shadow-md'
                    : 'bg-white text-neutral-secondary border-neutral-border hover:bg-neutral-page hover:border-neutral-muted'
                }`}
            >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                    <span className="bg-flexi-gold text-flexi-primary text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center ml-0.5 shadow-sm">
                        {activeFilterCount}
                    </span>
                )}
            </button>
        </div>

        {/* Right Side: Saved Views */}
        <div className="relative shrink-0 border-t md:border-t-0 md:border-l border-neutral-border pt-3 md:pt-0 md:pl-3" ref={viewDropdownRef}>
            <button 
                onClick={() => setActiveViewDropdown(!activeViewDropdown)}
                className="w-full md:w-auto flex items-center justify-between md:justify-start gap-2 px-3 py-2.5 bg-neutral-page border border-neutral-border rounded-lg text-sm font-bold text-neutral-primary hover:bg-white hover:border-neutral-muted transition-all"
            >
                <div className="flex items-center gap-2">
                    <LayoutTemplate className="h-4 w-4 text-flexi-primary" />
                    <span>Saved Views</span>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-neutral-muted transition-transform ${activeViewDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Saved Views Dropdown */}
            {activeViewDropdown && (
                <div className="absolute top-full right-0 mt-2 w-full md:w-80 bg-white rounded-xl shadow-xl border border-neutral-border z-30 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
                    <div className="p-3 border-b border-neutral-border bg-neutral-page/50">
                        <h4 className="text-xs font-bold text-neutral-secondary uppercase tracking-wider mb-2">My Views</h4>
                        <div className="space-y-1">
                            {savedViews.map(view => (
                                <div key={view.id} className="group flex items-center justify-between p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-neutral-border transition-all cursor-pointer">
                                    <button 
                                        onClick={() => {
                                            onApplyView(view);
                                            setActiveViewDropdown(false);
                                        }}
                                        className="flex items-center gap-2 text-sm font-semibold text-neutral-primary flex-1 text-left"
                                    >
                                        <Star className={`h-3.5 w-3.5 ${view.isDefault ? 'fill-flexi-gold text-flexi-gold' : 'text-neutral-muted'}`} />
                                        {view.name}
                                    </button>
                                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onUpdateView({...view, isDefault: !view.isDefault});
                                            }}
                                            title="Set Default"
                                            className="p-1.5 text-neutral-muted hover:bg-neutral-page hover:text-flexi-gold rounded-md transition-colors"
                                        >
                                            <Star className={`h-3.5 w-3.5 ${view.isDefault ? 'fill-flexi-gold text-flexi-gold' : ''}`} />
                                        </button>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteView(view.id);
                                            }}
                                            title="Delete"
                                            className="p-1.5 text-neutral-muted hover:bg-flexi-coral-light hover:text-flexi-coral rounded-md transition-colors"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {savedViews.length === 0 && <p className="text-xs text-neutral-muted italic py-2">No saved views yet.</p>}
                    </div>
                    
                    {hasActiveFilters && (
                        <div className="p-3 bg-white">
                             {!isSavingView ? (
                                <button 
                                    onClick={() => setIsSavingView(true)}
                                    className="w-full py-2 flex items-center justify-center gap-2 text-sm font-bold text-flexi-primary bg-flexi-light/50 hover:bg-flexi-light rounded-lg border border-flexi-primary/10 hover:border-flexi-primary/30 transition-colors"
                                >
                                    <Save className="h-4 w-4" /> Save current filter set
                                </button>
                             ) : (
                                <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-neutral-secondary">View Name</label>
                                        <input 
                                            autoFocus
                                            value={newViewName}
                                            onChange={(e) => setNewViewName(e.target.value)}
                                            placeholder="e.g. Remote Engineers..."
                                            className="w-full px-4 py-2.5 bg-white border border-neutral-border rounded-lg text-sm text-neutral-primary focus:outline-none focus:ring-2 focus:ring-flexi-primary/20 focus:border-flexi-primary transition-all placeholder:text-neutral-muted"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => {
                                                if(newViewName) {
                                                    onSaveView(newViewName);
                                                    setNewViewName('');
                                                    setIsSavingView(false);
                                                }
                                            }}
                                            disabled={!newViewName}
                                            className="flex-1 py-2 bg-flexi-primary text-white text-xs font-bold rounded-lg hover:bg-flexi-secondary disabled:opacity-50 transition-colors shadow-sm"
                                        >
                                            Save View
                                        </button>
                                        <button 
                                            onClick={() => setIsSavingView(false)}
                                            className="px-4 py-2 bg-white text-neutral-primary text-xs font-bold rounded-lg border border-neutral-border hover:bg-neutral-page transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                             )}
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center animate-in fade-in slide-in-from-top-1 px-1">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-border text-neutral-secondary">
             <Filter className="h-3 w-3" />
          </div>
          {categories.map(cat => (
             filters[cat.key].map(value => (
                <div key={`${cat.key}-${value}`} className="group flex items-center gap-1.5 pl-3 pr-1 py-1 bg-white border border-neutral-border rounded-full shadow-sm text-sm text-neutral-primary hover:border-flexi-primary/40 transition-colors">
                    <span className="text-neutral-muted text-[10px] uppercase font-bold tracking-wide">{cat.label}:</span>
                    <span className="font-bold text-flexi-primary">{value}</span>
                    <button 
                        onClick={() => handleCheckboxChange(cat.key, value)}
                        className="p-0.5 hover:bg-flexi-coral-light rounded-full text-neutral-muted hover:text-flexi-coral transition-colors ml-1"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
             ))
          ))}
          <button 
            onClick={clearFilters} 
            className="flex items-center gap-1 text-xs font-bold text-neutral-secondary hover:text-flexi-coral px-2 py-1 rounded hover:bg-neutral-page transition-colors ml-1"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>
      )}

      {/* FILTER DRAWER */}
      {/* Overlay */}
      {isDrawerOpen && (
        <div 
            className="fixed inset-0 bg-neutral-primary/20 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
        />
      )}
      
      {/* Drawer Container */}
      <div className={`fixed inset-y-0 right-0 z-[60] w-full sm:w-[560px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-neutral-border flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-border bg-white">
                <div>
                    <h3 className="text-xl font-semibold text-flexi-primary tracking-tight font-sans">Filters</h3>
                    <p className="text-sm text-neutral-secondary mt-1">Refine your employee search results</p>
                </div>
                <button 
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 text-neutral-secondary hover:bg-neutral-page rounded-full transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                {categories.map((cat) => (
                    <div key={cat.key} className="space-y-3">
                        {/* Category Label */}
                        <div className="flex items-center justify-between">
                            <h4 className="text-[13px] font-medium text-neutral-secondary">{cat.label}</h4>
                            {filters[cat.key].length > 0 && (
                                <span className="text-[10px] font-bold bg-flexi-light text-flexi-primary px-2 py-0.5 rounded-full border border-flexi-primary/10">
                                    {filters[cat.key].length}
                                </span>
                            )}
                        </div>
                        {/* Options Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {cat.options.map(option => {
                                const isSelected = filters[cat.key].includes(option);
                                return (
                                    <label 
                                        key={option} 
                                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                            isSelected 
                                            ? 'bg-flexi-light/50 border-flexi-primary/40 shadow-sm' 
                                            : 'bg-white border-neutral-border hover:border-neutral-300'
                                        }`}
                                    >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                                            isSelected 
                                            ? 'bg-flexi-primary border-flexi-primary' 
                                            : 'border-neutral-muted bg-white'
                                        }`}>
                                            {isSelected && <Check className="h-3 w-3 text-white" />}
                                        </div>
                                        <span className={`text-sm truncate font-medium ${isSelected ? 'text-flexi-primary' : 'text-neutral-primary'}`}>
                                            {option}
                                        </span>
                                        <input 
                                            type="checkbox"
                                            className="hidden"
                                            checked={isSelected}
                                            onChange={() => handleCheckboxChange(cat.key, option)}
                                        />
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-neutral-border bg-white mt-auto">
                <div className="flex items-center justify-between">
                    <button 
                        onClick={clearFilters}
                        disabled={!hasActiveFilters}
                        className="text-[13px] font-medium text-flexi-secondary hover:text-flexi-primary disabled:opacity-50 transition-colors"
                    >
                        Reset All
                    </button>
                    <button 
                        onClick={() => setIsDrawerOpen(false)}
                        className="h-[44px] px-5 bg-flexi-primary text-white text-sm font-semibold rounded-lg hover:bg-flexi-secondary shadow-soft hover:shadow-lg transition-all active:scale-[0.98] w-auto flex items-center justify-center"
                    >
                        Show Results
                    </button>
                </div>
            </div>
      </div>
    </div>
  );
};

export default FilterBar;
