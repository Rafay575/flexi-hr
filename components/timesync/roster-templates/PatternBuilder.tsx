import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Calendar,
  Save,
  Trash2,
  Copy,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  ChevronRight,
  ChevronLeft,
  Eye,
  Paintbrush,
  Grid3x3,
  Calculator,
  ShieldAlert,
  BarChart3,
  RotateCw,
} from 'lucide-react';
import {
  RosterTemplate,
  ShiftType,
  PatternType,
  RotationDirection,
  PatternInsights,
  ShiftTypeConfig,
  DayCell,
} from './types';

const SHIFT_TYPES: ShiftTypeConfig[] = [
  { code: 'M', label: 'Morning', color: '#3B82F6', bgColor: 'bg-blue-500', textColor: 'text-white' },
  { code: 'E', label: 'Evening', color: '#22C55E', bgColor: 'bg-green-500', textColor: 'text-white' },
  { code: 'N', label: 'Night', color: '#8B5CF6', bgColor: 'bg-purple-600', textColor: 'text-white' },
  { code: 'F', label: 'Flexi', color: '#14B8A6', bgColor: 'bg-teal-500', textColor: 'text-white' },
  { code: 'OFF', label: 'Day Off', color: '#9CA3AF', bgColor: 'bg-gray-100', textColor: 'text-gray-400', borderColor: 'border-gray-200' },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MAX_CYCLE_DAYS = 84; // 12 weeks
const MIN_CYCLE_DAYS = 1;

interface PatternBuilderProps {
  template?: RosterTemplate;
  onSave: (template: Omit<RosterTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
  mode: 'create' | 'edit';
}

export const PatternBuilder: React.FC<PatternBuilderProps> = ({
  template,
  onSave,
  onClose,
  mode,
}) => {
  // Basic Info
  const [name, setName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [patternType, setPatternType] = useState<PatternType>(template?.patternType || 'FIXED');
  const [cycleDays, setCycleDays] = useState(template?.cycleDays || 7);
  
  // Pattern Matrix
  const [patternMatrix, setPatternMatrix] = useState<ShiftType[][]>(
    template?.patternMatrix || Array.from({ length: Math.ceil((template?.cycleDays || 7) / 7) }, () => 
      Array(7).fill('OFF')
    )
  );
  
  // Team Allocation
  const [numberOfTeams, setNumberOfTeams] = useState(template?.numberOfTeams || 1);
  const [rotationDirection, setRotationDirection] = useState<RotationDirection>(template?.rotationDirection || 'FORWARD');
  
  // UI States
  const [selectedBrush, setSelectedBrush] = useState<ShiftType>('M');
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState<ShiftType>('M');
  
  const weeks = Math.ceil(cycleDays / 7);
  const totalCells = weeks * 7;

  // Initialize pattern matrix when cycle days change
  useEffect(() => {
    const newWeeks = Math.ceil(cycleDays / 7);
    if (newWeeks !== patternMatrix.length) {
      const newMatrix = Array.from({ length: newWeeks }, (_, weekIndex) => {
        if (weekIndex < patternMatrix.length) {
          return [...patternMatrix[weekIndex]];
        }
        return Array(7).fill('OFF');
      });
      
      // Truncate or extend days in last week
      const lastWeek = newWeeks - 1;
      const daysInLastWeek = cycleDays % 7 || 7;
      newMatrix[lastWeek] = newMatrix[lastWeek].slice(0, daysInLastWeek).concat(
        newMatrix[lastWeek].length > daysInLastWeek 
          ? newMatrix[lastWeek].slice(daysInLastWeek).map(() => 'OFF' as ShiftType)
          : []
      );
      
      setPatternMatrix(newMatrix);
    }
  }, [cycleDays]);

  // Calculate included shifts
  const includedShifts = useMemo(() => {
    const shifts = new Set<ShiftType>();
    patternMatrix.forEach(week => {
      week.forEach(shift => {
        if (shift !== 'OFF') {
          shifts.add(shift);
        }
      });
    });
    return Array.from(shifts);
  }, [patternMatrix]);

  // Calculate pattern insights
  const patternInsights = useMemo<PatternInsights>(() => {
    const insights: PatternInsights = {
      coverageType: 'Custom',
      weekendEquity: 'Low (Fixed)',
      restCompliance: {
        passed: true,
        violations: [],
      },
      summary: '',
    };

    // Check coverage type
    const hasNightShift = patternMatrix.some(week => week.includes('N'));
    const hasEveningShift = patternMatrix.some(week => week.includes('E'));
    const hasMorningShift = patternMatrix.some(week => week.includes('M'));
    
    if (hasNightShift && hasEveningShift && hasMorningShift) {
      insights.coverageType = '24/7 Continuity';
    } else if (hasMorningShift && hasEveningShift && !hasNightShift) {
      insights.coverageType = 'Business Hours';
    }

    // Check weekend equity
    const weekendDays = [5, 6]; // Sat, Sun (0-indexed)
    let weekendWorkCount = 0;
    let totalWeekendCells = 0;
    
    patternMatrix.forEach(week => {
      weekendDays.forEach(dayIndex => {
        if (dayIndex < week.length) {
          totalWeekendCells++;
          if (week[dayIndex] !== 'OFF') {
            weekendWorkCount++;
          }
        }
      });
    });
    
    const weekendWorkRatio = weekendWorkCount / totalWeekendCells;
    if (patternType === 'ROTATING' && weekendWorkRatio > 0.3) {
      insights.weekendEquity = 'High (Rotational)';
    } else if (weekendWorkRatio > 0) {
      insights.weekendEquity = 'Medium';
    }

    // Check rest compliance
    const maxConsecutiveShifts = 6; // Labor law: max 6 consecutive days
    const minRestBetweenShifts = 11; // Hours
    let consecutiveWorkDays = 0;
    
    patternMatrix.forEach(week => {
      week.forEach((shift, dayIndex) => {
        if (shift !== 'OFF') {
          consecutiveWorkDays++;
          if (consecutiveWorkDays > maxConsecutiveShifts) {
            insights.restCompliance.violations.push(
              `Exceeds maximum consecutive work days (${maxConsecutiveShifts})`
            );
          }
        } else {
          consecutiveWorkDays = 0;
        }
      });
    });

    // Check for day off per week
    patternMatrix.forEach((week, weekIndex) => {
      const hasDayOff = week.includes('OFF');
      if (!hasDayOff) {
        insights.restCompliance.violations.push(
          `Week ${weekIndex + 1}: No rest day in 7-day period`
        );
      }
    });

    insights.restCompliance.passed = insights.restCompliance.violations.length === 0;
    
    // Generate summary
    insights.summary = `${insights.coverageType} pattern with ${cycleDays}-day cycle. `;
    insights.summary += `Includes ${includedShifts.length} shift types. `;
    insights.summary += insights.restCompliance.passed 
      ? 'Complies with labor regulations.' 
      : 'Review rest compliance warnings.';

    return insights;
  }, [patternMatrix, patternType, cycleDays, includedShifts]);

  const handleCellClick = (weekIndex: number, dayIndex: number) => {
    if (dayIndex >= patternMatrix[weekIndex].length) return;
    
    const newMatrix = [...patternMatrix];
    newMatrix[weekIndex][dayIndex] = selectedBrush;
    setPatternMatrix(newMatrix);
  };

  const handleCellDragStart = (weekIndex: number, dayIndex: number) => {
    if (dayIndex >= patternMatrix[weekIndex].length) return;
    
    setIsDragging(true);
    setDragValue(patternMatrix[weekIndex][dayIndex]);
    const newMatrix = [...patternMatrix];
    newMatrix[weekIndex][dayIndex] = selectedBrush;
    setPatternMatrix(newMatrix);
  };

  const handleCellDragOver = (weekIndex: number, dayIndex: number, e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragging || dayIndex >= patternMatrix[weekIndex].length) return;
    
    const newMatrix = [...patternMatrix];
    newMatrix[weekIndex][dayIndex] = selectedBrush;
    setPatternMatrix(newMatrix);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleFillWeek = (weekIndex: number, shift: ShiftType) => {
    const newMatrix = [...patternMatrix];
    newMatrix[weekIndex] = newMatrix[weekIndex].map(() => shift);
    setPatternMatrix(newMatrix);
  };

  const handleClearAll = () => {
    const newMatrix = patternMatrix.map(week => week.map(() => 'OFF' as ShiftType));
    setPatternMatrix(newMatrix);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Template name is required');
      return;
    }

    if (!patternMatrix.some(week => week.some(shift => shift !== 'OFF'))) {
      alert('Please define at least one shift in the pattern');
      return;
    }

    const templateData: Omit<RosterTemplate, 'id' | 'createdAt' | 'updatedAt'> = {
      name: name.trim(),
      description: description.trim(),
      patternType,
      patternTypeLabel: patternType.charAt(0) + patternType.slice(1).toLowerCase(),
      cycleDays,
      includedShifts,
      activeTeamsCount: 0,
      status: 'DRAFT',
      patternMatrix,
      numberOfTeams: patternType === 'ROTATING' ? numberOfTeams : undefined,
      rotationDirection: patternType === 'ROTATING' ? rotationDirection : undefined,
    };

    onSave(templateData);
  };

  const getPatternTypeLabel = (type: PatternType) => {
    switch (type) {
      case 'FIXED': return 'Fixed Pattern';
      case 'ROTATING': return 'Rotating Pattern';
      case 'CUSTOM': return 'Custom Pattern';
      default: return type;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white shadow-lg">
              <Grid3x3 size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {mode === 'create' ? 'Create Roster Template' : 'Edit Template'}
              </h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {getPatternTypeLabel(patternType)} • {cycleDays}-day cycle
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-8 space-y-8">
            {/* SECTION A: BASIC INFO */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={16} /> Basic Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Factory 24/7 Rotation"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                    maxLength={100}
                  />
                  <p className="text-[10px] text-gray-400">{name.length}/100 characters</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Cycle Strategy *
                  </label>
                  <div className="flex gap-2">
                    {(['FIXED', 'ROTATING'] as PatternType[]).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPatternType(type)}
                        className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                          patternType === type
                            ? 'bg-[#3E3B6F] text-white border-[#3E3B6F]'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {type === 'FIXED' ? 'Fixed Pattern' : 'Rotating Pattern'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Description (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the purpose and usage of this template..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium min-h-[80px] focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                    maxLength={500}
                  />
                  <p className="text-[10px] text-gray-400">{description.length}/500 characters</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Cycle Length (Days) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={MIN_CYCLE_DAYS}
                      max={MAX_CYCLE_DAYS}
                      value={cycleDays}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value >= MIN_CYCLE_DAYS && value <= MAX_CYCLE_DAYS) {
                          setCycleDays(value);
                        }
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Days
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    {weeks} week{weeks !== 1 ? 's' : ''} ({cycleDays % 7 || 7} days in last week)
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION B: PATTERN SEQUENCE */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                  <Paintbrush size={16} /> Pattern Sequence
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearAll}
                    className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* SHIFT BRUSH SELECTOR */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Select Shift Type (Brush)
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-600">Click & drag to paint</span>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {SHIFT_TYPES.map(shift => (
                    <button
                      key={shift.code}
                      type="button"
                      onClick={() => setSelectedBrush(shift.code)}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center ${
                        selectedBrush === shift.code
                          ? 'ring-4 ring-offset-1 ring-opacity-20'
                          : 'border-gray-200 hover:border-opacity-50'
                      }`}
                      style={{
                        borderColor: selectedBrush === shift.code ? shift.color : undefined,
                        backgroundColor: shift.bgColor.replace('bg-', ''),
                      }}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black mb-1 ${
                        shift.bgColor
                      } ${shift.textColor}`}>
                        {shift.code}
                      </div>
                      <span className="text-[10px] font-bold text-gray-700">{shift.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* PATTERN GRID */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-3 text-[10px] font-black text-gray-400 uppercase tracking-widest border-r border-gray-200">
                          Week
                        </th>
                        {DAYS.map(day => (
                          <th 
                            key={day} 
                            className="p-3 text-[10px] font-black text-gray-400 uppercase tracking-widest border-r border-gray-200 min-w-[60px]"
                          >
                            {day}
                          </th>
                        ))}
                        <th className="p-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {patternMatrix.map((week, weekIndex) => {
                        const isLastWeek = weekIndex === weeks - 1;
                        const daysInWeek = isLastWeek ? (cycleDays % 7 || 7) : 7;
                        
                        return (
                          <tr key={weekIndex} className="border-t border-gray-100">
                            <td className="p-4 border-r border-gray-200 bg-gray-50">
                              <div className="text-center">
                                <p className="text-xs font-black text-gray-800">W{weekIndex + 1}</p>
                                <p className="text-[10px] text-gray-500">Week {weekIndex + 1}</p>
                              </div>
                            </td>
                            
                            {DAYS.map((_, dayIndex) => {
                              const isDisabled = dayIndex >= daysInWeek;
                              const shift = week[dayIndex] || 'OFF';
                              const shiftConfig = SHIFT_TYPES.find(s => s.code === shift) || SHIFT_TYPES[4];
                              
                              return (
                                <td
                                  key={dayIndex}
                                  className={`p-1 border-r border-gray-100 ${
                                    isDisabled ? 'bg-gray-50/50' : 'hover:bg-gray-50'
                                  }`}
                                >
                                  <div
                                    draggable={!isDisabled}
                                    onDragStart={() => !isDisabled && handleCellDragStart(weekIndex, dayIndex)}
                                    onDragOver={(e) => !isDisabled && handleCellDragOver(weekIndex, dayIndex, e)}
                                    onDragEnd={handleDragEnd}
                                    onClick={() => !isDisabled && handleCellClick(weekIndex, dayIndex)}
                                    className={`h-14 flex items-center justify-center rounded-lg cursor-pointer transition-all ${
                                      isDisabled 
                                        ? 'cursor-not-allowed opacity-30' 
                                        : 'hover:scale-95 active:scale-90'
                                    } ${shiftConfig.bgColor} ${shiftConfig.textColor} ${
                                      shiftConfig.borderColor ? `border ${shiftConfig.borderColor}` : ''
                                    }`}
                                    style={{
                                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                                    }}
                                  >
                                    <span className="text-sm font-black">{shift}</span>
                                  </div>
                                </td>
                              );
                            })}
                            
                            <td className="p-3">
                              <button
                                onClick={() => handleFillWeek(weekIndex, selectedBrush)}
                                className="w-full py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                              >
                                Fill Week
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* SECTION C: TEAM ALLOCATION (Only for ROTATING) */}
            {patternType === 'ROTATING' && (
              <div className="space-y-6">
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                  <Users size={16} /> Team Allocation
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Number of Teams *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max={weeks}
                          value={numberOfTeams}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value >= 1 && value <= weeks) {
                              setNumberOfTeams(value);
                            }
                          }}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">
                          Max: {weeks} teams
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {Array.from({ length: numberOfTeams }).map((_, i) => (
                        <div
                          key={i}
                          className="w-12 h-12 rounded-xl bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center"
                        >
                          <span className="text-sm font-black text-indigo-600">T{i + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                      Rotation Direction *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setRotationDirection('FORWARD')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                          rotationDirection === 'FORWARD'
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <ChevronRight size={24} className={
                          rotationDirection === 'FORWARD' ? 'text-green-600' : 'text-gray-400'
                        } />
                        <span className="text-xs font-bold mt-2">Forward</span>
                        <span className="text-[10px] text-gray-500">T1 → T2 → T3 → T1</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setRotationDirection('BACKWARD')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                          rotationDirection === 'BACKWARD'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <ChevronLeft size={24} className={
                          rotationDirection === 'BACKWARD' ? 'text-purple-600' : 'text-gray-400'
                        } />
                        <span className="text-xs font-bold mt-2">Backward</span>
                        <span className="text-[10px] text-gray-500">T1 → T3 → T2 → T1</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION D: PATTERN INSIGHTS */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <BarChart3 size={16} /> Pattern Insights
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">
                    Coverage Type
                  </p>
                  <p className="text-sm font-bold text-gray-800">{patternInsights.coverageType}</p>
                </div>
                
                <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl">
                  <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-2">
                    Weekend Equity
                  </p>
                  <p className="text-sm font-bold text-gray-800">{patternInsights.weekendEquity}</p>
                </div>
                
                <div className={`p-4 rounded-2xl border ${
                  patternInsights.restCompliance.passed
                    ? 'bg-green-50 border-green-100'
                    : 'bg-orange-50 border-orange-100'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${
                      patternInsights.restCompliance.passed ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      Rest Compliance
                    </p>
                    {patternInsights.restCompliance.passed ? (
                      <CheckCircle2 size={14} className="text-green-500" />
                    ) : (
                      <ShieldAlert size={14} className="text-orange-500" />
                    )}
                  </div>
                  <p className={`text-sm font-bold ${
                    patternInsights.restCompliance.passed ? 'text-gray-800' : 'text-orange-700'
                  }`}>
                    {patternInsights.restCompliance.passed ? 'Passed' : 'Review Required'}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">
                    Included Shifts
                  </p>
                  <div className="flex items-center gap-1">
                    {includedShifts.map(shift => {
                      const config = SHIFT_TYPES.find(s => s.code === shift);
                      return (
                        <div
                          key={shift}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${
                            config?.bgColor
                          } ${config?.textColor}`}
                          title={config?.label}
                        >
                          {shift}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* COMPLIANCE WARNINGS */}
              {patternInsights.restCompliance.violations.length > 0 && (
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-orange-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-orange-800 mb-2">
                        Labor Compliance Warnings
                      </p>
                      <ul className="space-y-1">
                        {patternInsights.restCompliance.violations.map((violation, index) => (
                          <li key={index} className="text-xs text-orange-700 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5" />
                            {violation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* SUMMARY */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                <p className="text-sm font-medium text-gray-700 leading-relaxed">
                  {patternInsights.summary}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col md:flex-row gap-4 shrink-0">
          <div className="flex-1 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              <span className="font-bold">Note:</span> Templates define the <span className="font-bold underline decoration-blue-200">Skeleton</span> of the Roster. Once published, you can assign these templates to departments where actual dates will be populated.
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim() || !patternMatrix.some(week => week.some(shift => shift !== 'OFF'))}
              className="px-8 py-3 bg-[#3E3B6F] disabled:opacity-40 disabled:hover:scale-100 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
            >
              <Save size={16} /> {mode === 'create' ? 'Save Template' : 'Update Template'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};