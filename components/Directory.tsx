
import React, { useState, useEffect, useRef } from 'react';
import { 
  MoreHorizontal, MapPin, Briefcase, Search, ArrowUpDown, 
  ArrowUp, ArrowDown, Edit, ArrowRightLeft, LogOut, UserCircle,
  LayoutGrid, List, Rows, Download, RefreshCw, ChevronLeft, ChevronRight, Settings2, Loader
} from 'lucide-react';
import { Employee, FilterState, SavedView } from '../types';
import FilterBar from './FilterBar';

type SortConfig = {
  key: keyof Employee | 'role'; 
  direction: 'asc' | 'desc';
};

interface DirectoryProps {
  employees: Employee[];
}

const Directory: React.FC<DirectoryProps> = ({ employees }) => {
  // View States
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'mini'>('list');
  const [showSettings, setShowSettings] = useState(false);
  
  // Pagination & Loading States
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    department: [],
    location: [],
    grade: [],
    status: [],
    tags: [],
    designation: []
  });

  const [savedViews, setSavedViews] = useState<SavedView[]>([
    {
      id: 'v1',
      name: 'Remote Engineers',
      filters: { department: ['Engineering'], location: ['Remote'], grade: [], status: [], tags: [], designation: [] },
      isDefault: false
    },
    {
      id: 'v2',
      name: 'High Risks (Notice/Exit)',
      filters: { department: [], location: [], grade: [], status: ['Notice Period'], tags: ['Flight Risk'], designation: [] },
      isDefault: false
    }
  ]);

  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const [activeActionRow, setActiveActionRow] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setActiveActionRow(null);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 600); 
    return () => clearTimeout(timer);
  }, [currentPage, itemsPerPage, filters, searchQuery, sortConfig, viewMode]);

  useEffect(() => {
    setCurrentPage(1);
    setVisibleCount(itemsPerPage);
  }, [filters, searchQuery, itemsPerPage]);

  const handleSaveView = (name: string) => {
    const newView: SavedView = { id: Date.now().toString(), name, filters: { ...filters } };
    setSavedViews([...savedViews, newView]);
  };

  const handleUpdateView = (updatedView: SavedView) => {
    setSavedViews(savedViews.map(v => v.id === updatedView.id ? updatedView : v));
  };

  const handleDeleteView = (id: string) => {
    setSavedViews(savedViews.filter(v => v.id !== id));
  };

  const handleApplyView = (view: SavedView) => {
    setFilters(view.filters);
  };

  const handleSort = (key: keyof Employee) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredEmployees = employees.filter(emp => {
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
            emp.name.toLowerCase().includes(query) || 
            emp.employeeId.toLowerCase().includes(query) ||
            emp.role.toLowerCase().includes(query) ||
            emp.department.toLowerCase().includes(query);
        if (!matchesSearch) return false;
    }
    if (filters.department.length && !filters.department.includes(emp.department)) return false;
    if (filters.location.length && !filters.location.includes(emp.location)) return false;
    if (filters.grade.length && !filters.grade.includes(emp.grade)) return false;
    if (filters.status.length && !filters.status.includes(emp.status)) return false;
    if (filters.tags.length && !filters.tags.some(tag => emp.tags.includes(tag))) return false;
    return true;
  });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue === undefined || bValue === undefined) return 0;
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const getDisplayData = () => {
      if (isInfiniteScroll) {
          return sortedEmployees.slice(0, visibleCount);
      }
      const start = (currentPage - 1) * itemsPerPage;
      return sortedEmployees.slice(start, start + itemsPerPage);
  };

  const displayedEmployees = getDisplayData();
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);

  useEffect(() => {
    if (!isInfiniteScroll || isLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < sortedEmployees.length) {
          setIsLoading(true);
          setTimeout(() => {
             setVisibleCount(prev => Math.min(prev + itemsPerPage, sortedEmployees.length));
             setIsLoading(false);
          }, 500);
        }
      },
      { threshold: 1.0 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [isInfiniteScroll, isLoading, sortedEmployees.length, visibleCount, itemsPerPage]);

  const handleSelectAll = () => {
    if (selectedIds.length === displayedEmployees.length && displayedEmployees.length > 0) {
        setSelectedIds([]);
    } else {
        setSelectedIds(displayedEmployees.map(emp => emp.id));
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
        setSelectedIds([...selectedIds, id]);
    }
  };

  const columns: { key: keyof Employee, label: string, sortable: boolean }[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'employeeId', label: 'Employee ID', sortable: true },
    { key: 'role', label: 'Designation', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { key: 'joinDate', label: 'Joining Date', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ];

  const ActionMenu = ({ empId }: { empId: string }) => (
    <div 
        ref={actionMenuRef}
        className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-neutral-border z-30 animate-in fade-in zoom-in-95 duration-100 origin-top-right overflow-hidden"
        onClick={(e) => e.stopPropagation()}
    >
        <div className="py-1">
            <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-neutral-primary hover:bg-neutral-page flex items-center gap-2">
                <UserCircle className="w-4 h-4 text-neutral-muted" /> View 360 Profile
            </button>
            <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-neutral-primary hover:bg-neutral-page flex items-center gap-2">
                <Edit className="w-4 h-4 text-neutral-muted" /> Edit Details
            </button>
            <div className="h-px bg-neutral-border my-1"></div>
            <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-neutral-primary hover:bg-flexi-gold-light hover:text-flexi-primary flex items-center gap-2 transition-colors">
                <ArrowRightLeft className="w-4 h-4" /> Start Transfer
            </button>
            <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-flexi-coral hover:bg-flexi-coral-light flex items-center gap-2 transition-colors">
                <LogOut className="w-4 h-4" /> Start Exit
            </button>
        </div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center text-neutral-muted py-16">
        <div className="w-16 h-16 bg-neutral-page rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-neutral-muted" />
        </div>
        <h3 className="text-lg font-bold text-neutral-primary">No employees found</h3>
        <p className="text-sm mt-1">Try adjusting your filters or search terms.</p>
        <button 
            onClick={() => {
                setFilters({department: [], location: [], grade: [], status: [], tags: [], designation: []});
                setSearchQuery('');
            }}
            className="mt-4 px-4 py-3 text-sm font-bold text-white bg-flexi-primary rounded-lg hover:bg-flexi-secondary transition-colors shadow-sm"
        >
            Clear filters & search
        </button>
    </div>
  );

  const TableSkeleton = () => (
      <>
        {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="animate-pulse border-b border-neutral-border/50">
                <td className="p-4"><div className="w-4 h-4 bg-flexi-light rounded"></div></td>
                <td className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-flexi-light"></div>
                    <div className="space-y-2">
                        <div className="w-24 h-3 bg-flexi-light rounded"></div>
                        <div className="w-32 h-2 bg-neutral-page rounded"></div>
                    </div>
                </td>
                <td className="p-4"><div className="w-20 h-4 bg-neutral-page rounded"></div></td>
                <td className="p-4"><div className="w-24 h-4 bg-neutral-page rounded"></div></td>
                <td className="p-4"><div className="w-20 h-4 bg-neutral-page rounded"></div></td>
                <td className="p-4"><div className="w-20 h-4 bg-neutral-page rounded"></div></td>
                <td className="p-4"><div className="w-16 h-4 bg-neutral-page rounded"></div></td>
                <td className="p-4"><div className="w-16 h-6 bg-flexi-light rounded-full"></div></td>
                <td className="p-4 text-right"><div className="w-8 h-8 bg-neutral-page rounded ml-auto"></div></td>
            </tr>
        ))}
      </>
  );

  const CardSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
             <div key={i} className="rounded-xl border border-neutral-border bg-white p-6 animate-pulse shadow-sm">
                 <div className="flex flex-col items-center mb-4">
                     <div className="w-20 h-20 rounded-full bg-flexi-light mb-3"></div>
                     <div className="w-32 h-4 bg-flexi-light rounded mb-2"></div>
                     <div className="w-24 h-3 bg-neutral-page rounded"></div>
                 </div>
                 <div className="space-y-3">
                     <div className="w-full h-4 bg-neutral-page rounded"></div>
                     <div className="w-2/3 h-4 bg-neutral-page rounded"></div>
                 </div>
             </div>
        ))}
    </div>
  );

  const isAllSelected = displayedEmployees.length > 0 && selectedIds.length === displayedEmployees.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < displayedEmployees.length;
  const isMini = viewMode === 'mini';

  return (
    <div className="space-y-8 relative min-h-screen pb-32">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h2 className="text-3xl font-bold text-neutral-primary tracking-tight mb-2">Employee Directory</h2>
            <p className="text-sm text-neutral-secondary font-medium opacity-80">Manage and view all employee records across the organization.</p>
        </div>
        
        <div className="flex gap-2">
            <div className="relative" ref={settingsRef}>
                 <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex items-center gap-2 px-4 py-3 bg-white border border-neutral-border rounded-lg text-sm font-bold text-neutral-secondary hover:text-flexi-primary hover:border-flexi-primary/30 transition-all shadow-sm"
                 >
                    <Settings2 className="w-4 h-4" />
                    <span className="hidden sm:inline">View Settings</span>
                 </button>
                 {showSettings && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-border z-30 animate-in fade-in zoom-in-95 p-2">
                         <div className="px-3 py-2 text-xs font-bold text-neutral-muted uppercase tracking-wider">Pagination</div>
                         <div className="px-2 space-y-1">
                             <div className="flex items-center justify-between p-2 rounded hover:bg-neutral-page">
                                 <span className="text-sm font-medium text-neutral-primary">Infinite Scroll</span>
                                 <button 
                                    onClick={() => setIsInfiniteScroll(!isInfiniteScroll)}
                                    className={`w-9 h-5 rounded-full relative transition-colors ${isInfiniteScroll ? 'bg-flexi-primary' : 'bg-neutral-300'}`}
                                 >
                                     <span className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform ${isInfiniteScroll ? 'translate-x-4' : ''}`} />
                                 </button>
                             </div>
                             {!isInfiniteScroll && (
                                <div className="p-2">
                                    <span className="text-sm text-neutral-primary font-medium block mb-2">Rows per page</span>
                                    <div className="flex gap-2">
                                        {[20, 50, 100].map(num => (
                                            <button 
                                                key={num}
                                                onClick={() => setItemsPerPage(num)}
                                                className={`flex-1 py-1 text-xs font-bold rounded-md border ${itemsPerPage === num ? 'bg-flexi-primary text-white border-flexi-primary' : 'bg-white text-neutral-secondary border-neutral-border'}`}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                             )}
                         </div>
                    </div>
                 )}
            </div>

            <div className="flex items-center bg-neutral-card p-1 rounded-lg border border-neutral-border shadow-sm">
                <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-flexi-light text-flexi-primary shadow-sm' : 'text-neutral-secondary hover:text-neutral-primary'}`}
                    title="List View"
                >
                    <List className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => setViewMode('mini')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'mini' ? 'bg-flexi-light text-flexi-primary shadow-sm' : 'text-neutral-secondary hover:text-neutral-primary'}`}
                    title="Mini Compact View"
                >
                    <Rows className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-flexi-light text-flexi-primary shadow-sm' : 'text-neutral-secondary hover:text-neutral-primary'}`}
                    title="Grid View"
                >
                    <LayoutGrid className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>

      <div className="sticky top-0 z-20 bg-neutral-page/95 backdrop-blur-md pt-4 pb-4 -mx-6 px-6 md:-mx-8 md:px-8 border-b border-neutral-border/60 shadow-sm">
        <FilterBar 
            filters={filters}
            onFilterChange={setFilters}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            savedViews={savedViews}
            onSaveView={handleSaveView}
            onUpdateView={handleUpdateView}
            onDeleteView={handleDeleteView}
            onApplyView={handleApplyView}
        />
      </div>

      {viewMode === 'list' || viewMode === 'mini' ? (
        <div className="bg-white rounded-xl border border-neutral-border shadow-card overflow-visible">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                <thead className="bg-neutral-page/50 border-b border-neutral-border">
                    <tr>
                    <th className={`p-4 ${viewMode === 'mini' ? 'w-8 py-2 px-3' : 'w-12'}`}>
                        <div className="flex items-center">
                            <input 
                                type="checkbox" 
                                checked={isAllSelected}
                                ref={input => { if (input) input.indeterminate = isIndeterminate; }}
                                onChange={handleSelectAll}
                                className="w-4 h-4 rounded border-flexi-secondary text-flexi-primary focus:ring-flexi-primary cursor-pointer"
                            />
                        </div>
                    </th>
                    {columns.map((col) => {
                        if (viewMode === 'mini' && ['joinDate'].includes(col.key)) return null;
                        return (
                            <th 
                                key={col.key}
                                className={`
                                    ${viewMode === 'mini' ? 'px-3 py-2 text-[10px]' : 'p-4 text-xs'}
                                    font-semibold text-neutral-secondary uppercase tracking-wider
                                    ${col.sortable ? 'cursor-pointer hover:bg-neutral-border/50 transition-colors group select-none' : ''}
                                `}
                                onClick={() => col.sortable && handleSort(col.key)}
                            >
                                <div className="flex items-center gap-1">
                                    {col.label}
                                    {col.sortable && (
                                        <span className="text-neutral-muted group-hover:text-flexi-primary">
                                            {sortConfig.key === col.key ? (
                                                sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                            ) : (
                                                <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />
                                            )}
                                        </span>
                                    )}
                                </div>
                            </th>
                        )
                    })}
                    <th className={`text-xs font-semibold text-neutral-secondary uppercase tracking-wider text-right ${viewMode === 'mini' ? 'px-3 py-2' : 'p-4'}`}>Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-border">
                    {isLoading && !isInfiniteScroll ? (
                        <TableSkeleton />
                    ) : displayedEmployees.length > 0 ? (
                        displayedEmployees.map(emp => {
                            const isSelected = selectedIds.includes(emp.id);
                            return (
                                <tr 
                                    key={emp.id} 
                                    className={`transition-colors group relative ${isSelected ? 'bg-flexi-light/40' : 'hover:bg-[#F0EFF6]'}`}
                                >
                                    <td className={isMini ? "px-3 py-1.5" : "p-4"}>
                                        <div className="flex items-center">
                                            <input 
                                                type="checkbox" 
                                                checked={isSelected}
                                                onChange={() => handleSelectRow(emp.id)}
                                                className="w-4 h-4 rounded border-flexi-secondary text-flexi-primary focus:ring-flexi-primary cursor-pointer"
                                            />
                                        </div>
                                    </td>

                                    <td className={isMini ? "px-3 py-1.5" : "p-4"}>
                                        <div className="flex items-center gap-3">
                                            <img src={emp.avatar} alt={emp.name} className={`${isMini ? 'w-6 h-6' : 'w-10 h-10'} rounded-full border border-neutral-border object-cover shadow-sm`} />
                                            <div>
                                                <div className={`font-semibold text-neutral-primary ${isMini ? 'text-xs' : 'text-sm'}`}>{emp.name}</div>
                                                {!isMini && <div className="text-xs text-neutral-muted font-medium">{emp.email}</div>}
                                            </div>
                                        </div>
                                    </td>

                                    <td className={isMini ? "px-3 py-1.5" : "p-4"}>
                                        <span className={`${isMini ? 'text-[10px]' : 'text-xs'} text-neutral-secondary font-mono bg-neutral-page px-2 py-0.5 rounded border border-neutral-border`}>
                                            {emp.employeeId}
                                        </span>
                                    </td>

                                    <td className={isMini ? "px-3 py-1.5" : "p-4"}>
                                        <div className={`${isMini ? 'text-xs' : 'text-sm'} font-medium text-neutral-primary`}>{emp.role}</div>
                                        {!isMini && <div className="text-xs text-neutral-muted mt-0.5">{emp.grade}</div>}
                                    </td>

                                    <td className={isMini ? "px-3 py-1.5" : "p-4"}>
                                        <div className={`${isMini ? 'text-xs' : 'text-sm'} text-neutral-secondary flex items-center gap-1.5`}>
                                            <Briefcase className="w-3.5 h-3.5 text-neutral-muted" />
                                            {emp.department}
                                        </div>
                                    </td>

                                    <td className={isMini ? "px-3 py-1.5" : "p-4"}>
                                        <div className={`${isMini ? 'text-xs' : 'text-sm'} text-neutral-secondary flex items-center gap-1.5`}>
                                            <MapPin className="w-3.5 h-3.5 text-neutral-muted" />
                                            {emp.location}
                                        </div>
                                    </td>

                                    {!isMini && (
                                        <td className="p-4">
                                            <div className="text-sm font-medium text-neutral-primary">{emp.joinDate}</div>
                                        </td>
                                    )}

                                    <td className={isMini ? "px-3 py-1.5" : "p-4"}>
                                        {isMini ? (
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-2 h-2 rounded-full ${
                                                    emp.status === 'Active' ? 'bg-state-success' :
                                                    emp.status === 'On Leave' ? 'bg-flexi-gold' :
                                                    'bg-flexi-coral'
                                                }`}></div>
                                                <span className="text-xs text-neutral-primary font-medium">{emp.status}</span>
                                            </div>
                                        ) : (
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                                emp.status === 'Active' ? 'bg-green-50 text-state-success border-green-200' :
                                                emp.status === 'On Leave' ? 'bg-flexi-gold-light text-flexi-gold border-flexi-gold/30' :
                                                'bg-flexi-coral-light text-flexi-coral border-flexi-coral/30'
                                            }`}>
                                                {emp.status}
                                            </span>
                                        )}
                                    </td>

                                    <td className={`${isMini ? "px-3 py-1.5" : "p-4"} text-right relative`}>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveActionRow(activeActionRow === emp.id ? null : emp.id);
                                            }}
                                            className={`p-2 rounded-lg transition-colors ${activeActionRow === emp.id ? 'bg-flexi-light text-flexi-primary' : 'text-neutral-muted hover:bg-neutral-page hover:text-flexi-primary'}`}
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                        {activeActionRow === emp.id && <ActionMenu empId={emp.id} />}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={9} className="p-12">
                                <EmptyState />
                            </td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>
            {/* Infinite Scroll Sentinel for List */}
            {isInfiniteScroll && (
                <div ref={observerTarget} className="h-10 flex items-center justify-center p-4">
                     {isLoading && <Loader className="w-6 h-6 animate-spin text-flexi-primary" />}
                </div>
            )}
            
            {!isInfiniteScroll && totalPages > 1 && (
                <div className="p-4 border-t border-neutral-border flex items-center justify-between bg-neutral-page/30">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className="p-2 border border-neutral-border rounded-lg bg-white disabled:opacity-50 hover:bg-neutral-page transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium text-neutral-secondary">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className="p-2 border border-neutral-border rounded-lg bg-white disabled:opacity-50 hover:bg-neutral-page transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
      ) : (
        /* GRID VIEW */
        <div className="space-y-6">
            {isLoading && !isInfiniteScroll ? (
                <CardSkeleton />
            ) : displayedEmployees.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayedEmployees.map(emp => (
                        <div key={emp.id} className="group relative bg-white border border-neutral-border rounded-xl p-6 shadow-card hover:shadow-soft hover:border-flexi-primary/50 transition-all flex flex-col items-center text-center">
                           <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveActionRow(activeActionRow === emp.id ? null : emp.id);
                                    }}
                                    className="p-1.5 text-neutral-muted hover:bg-neutral-page rounded-md"
                                >
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                                {activeActionRow === emp.id && (
                                    <div className="absolute right-0 top-full mt-1 z-20 text-left">
                                         <div className="w-48 bg-white rounded-xl shadow-xl border border-neutral-border overflow-hidden">
                                            <div className="py-1">
                                                <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-neutral-primary hover:bg-neutral-page flex items-center gap-2">
                                                    <UserCircle className="w-4 h-4 text-neutral-muted" /> View Profile
                                                </button>
                                                <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-neutral-primary hover:bg-neutral-page flex items-center gap-2">
                                                    <Edit className="w-4 h-4 text-neutral-muted" /> Edit
                                                </button>
                                            </div>
                                         </div>
                                    </div>
                                )}
                           </div>

                           <div className="relative mb-4">
                                <img src={emp.avatar} alt={emp.name} className="w-20 h-20 rounded-full border-4 border-neutral-page object-cover" />
                                <span className={`absolute bottom-1 right-1 w-4 h-4 border-2 border-white rounded-full ${
                                    emp.status === 'Active' ? 'bg-state-success' : 
                                    emp.status === 'On Leave' ? 'bg-flexi-gold' : 'bg-flexi-coral'
                                }`}></span>
                           </div>
                           
                           <h3 className="font-bold text-neutral-primary text-lg mb-1">{emp.name}</h3>
                           <p className="text-sm text-flexi-primary font-medium mb-3">{emp.role}</p>
                           
                           <div className="w-full space-y-2 border-t border-neutral-border pt-4 mt-auto">
                                <div className="flex items-center justify-between text-xs text-neutral-secondary">
                                    <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> Dept</span>
                                    <span className="font-semibold text-neutral-primary">{emp.department}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-neutral-secondary">
                                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Location</span>
                                    <span className="font-semibold text-neutral-primary">{emp.location}</span>
                                </div>
                           </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState />
            )}

            {isInfiniteScroll && (
                 <div ref={observerTarget} className="h-10 flex items-center justify-center p-4">
                     {isLoading && <Loader className="w-6 h-6 animate-spin text-flexi-primary" />}
                 </div>
            )}
             {!isInfiniteScroll && totalPages > 1 && (
                <div className="flex justify-center pt-4">
                     <div className="flex items-center gap-4">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="p-2 border border-neutral-border rounded-lg bg-white disabled:opacity-50 hover:bg-neutral-page transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium text-neutral-secondary">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="p-2 border border-neutral-border rounded-lg bg-white disabled:opacity-50 hover:bg-neutral-page transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default Directory;
