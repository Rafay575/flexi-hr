import React, { useState, useMemo } from "react";
import {
  Building2,
  Layers,
  Users,
  Filter,
  Search,
  ChevronRight,
  Check,
  X,
  Calendar,
  Clock,
  Briefcase,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Download,
} from "lucide-react";
import { Employee } from "./types";

type OrganizationLevel = "company" | "division" | "department" | "subDepartment";
type SelectionStage = "company" | "division" | "department" | "subDepartment" | "employees";

interface OrganizationNode {
  id: string;
  name: string;
  type: OrganizationLevel;
  parentId: string | null;
  employeeCount: number;
}

const ORGANIZATION_TREE: OrganizationNode[] = [
  {
    id: "company-1",
    name: "FlexiCorp Global",
    type: "company",
    parentId: null,
    employeeCount: 2450,
  },
  {
    id: "div-1",
    name: "Technology Division",
    type: "division",
    parentId: "company-1",
    employeeCount: 850,
  },
  {
    id: "div-2",
    name: "Operations Division",
    type: "division",
    parentId: "company-1",
    employeeCount: 620,
  },
  {
    id: "div-3",
    name: "Business Division",
    type: "division",
    parentId: "company-1",
    employeeCount: 980,
  },
  {
    id: "dept-1",
    name: "Engineering",
    type: "department",
    parentId: "div-1",
    employeeCount: 420,
  },
  {
    id: "dept-2",
    name: "Product",
    type: "department",
    parentId: "div-1",
    employeeCount: 180,
  },
  {
    id: "dept-3",
    name: "Design",
    type: "department",
    parentId: "div-1",
    employeeCount: 250,
  },
  {
    id: "dept-4",
    name: "Supply Chain",
    type: "department",
    parentId: "div-2",
    employeeCount: 320,
  },
  {
    id: "dept-5",
    name: "Logistics",
    type: "department",
    parentId: "div-2",
    employeeCount: 300,
  },
  {
    id: "dept-6",
    name: "Sales",
    type: "department",
    parentId: "div-3",
    employeeCount: 450,
  },
  {
    id: "dept-7",
    name: "Marketing",
    type: "department",
    parentId: "div-3",
    employeeCount: 350,
  },
  {
    id: "dept-8",
    name: "HR",
    type: "department",
    parentId: "div-3",
    employeeCount: 180,
  },
  {
    id: "sub-1",
    name: "Frontend Engineering",
    type: "subDepartment",
    parentId: "dept-1",
    employeeCount: 150,
  },
  {
    id: "sub-2",
    name: "Backend Engineering",
    type: "subDepartment",
    parentId: "dept-1",
    employeeCount: 170,
  },
  {
    id: "sub-3",
    name: "DevOps",
    type: "subDepartment",
    parentId: "dept-1",
    employeeCount: 100,
  },
  {
    id: "sub-4",
    name: "Product Management",
    type: "subDepartment",
    parentId: "dept-2",
    employeeCount: 120,
  },
  {
    id: "sub-5",
    name: "UX Research",
    type: "subDepartment",
    parentId: "dept-2",
    employeeCount: 60,
  },
  {
    id: "sub-6",
    name: "UI/UX Design",
    type: "subDepartment",
    parentId: "dept-3",
    employeeCount: 200,
  },
  {
    id: "sub-7",
    name: "Graphic Design",
    type: "subDepartment",
    parentId: "dept-3",
    employeeCount: 50,
  },
];

// Mock employees data
const MOCK_EMPLOYEES: Employee[] = [
  // Frontend Engineering
  { id: "FLX-001", name: "Sarah Jenkins", avatar: "SJ", dept: "Engineering", department: "Engineering", subDepartment: "Frontend Engineering", division: "Technology Division", company: "FlexiCorp Global", currentShift: "Morning (09:00-18:00)", location: "HQ Main" },
  { id: "FLX-024", name: "Michael Chen", avatar: "MC", dept: "Engineering", department: "Engineering", subDepartment: "Frontend Engineering", division: "Technology Division", company: "FlexiCorp Global", currentShift: "Morning (09:00-18:00)", location: "HQ Main" },
  { id: "FLX-152", name: "Priya Das", avatar: "PD", dept: "Engineering", department: "Engineering", subDepartment: "Frontend Engineering", division: "Technology Division", company: "FlexiCorp Global", currentShift: "Evening (13:00-22:00)", location: "HQ Main" },
  
  // Backend Engineering
  { id: "FLX-089", name: "David Miller", avatar: "DM", dept: "Engineering", department: "Engineering", subDepartment: "Backend Engineering", division: "Technology Division", company: "FlexiCorp Global", currentShift: "Morning (09:00-18:00)", location: "HQ Main" },
  { id: "FLX-012", name: "Alex Rivera", avatar: "AR", dept: "Engineering", department: "Engineering", subDepartment: "Backend Engineering", division: "Technology Division", company: "FlexiCorp Global", currentShift: "Night (22:00-06:00)", location: "Data Center" },
  
  // Product Management
  { id: "FLX-112", name: "Amara Okafor", avatar: "AO", dept: "Product", department: "Product", subDepartment: "Product Management", division: "Technology Division", company: "FlexiCorp Global", currentShift: "Flexi Hours", location: "Remote" },
  
  // UI/UX Design
  { id: "FLX-304", name: "Marcus Low", avatar: "ML", dept: "Design", department: "Design", subDepartment: "UI/UX Design", division: "Technology Division", company: "FlexiCorp Global", currentShift: "Morning (09:00-18:00)", location: "Creative Hub" },
  { id: "FLX-201", name: "James Wilson", avatar: "JW", dept: "Design", department: "Design", subDepartment: "UI/UX Design", division: "Technology Division", company: "FlexiCorp Global", currentShift: "Morning (09:00-18:00)", location: "Creative Hub" },
  
  // Operations
  { id: "FLX-045", name: "Elena Rodriguez", avatar: "ER", dept: "Operations", department: "Supply Chain", subDepartment: "", division: "Operations Division", company: "FlexiCorp Global", currentShift: "Morning (09:00-18:00)", location: "West Warehouse" },
  { id: "FLX-998", name: "Nina Simone", avatar: "NS", dept: "HR", department: "HR", subDepartment: "", division: "Business Division", company: "FlexiCorp Global", currentShift: "Standard (08:30-17:30)", location: "HQ Main" },
  
  // Contractors
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `FLX-EXT-${i}`,
    name: `Contractor ${i + 1}`,
    avatar: "EX",
    dept: "Operations",
    department: "Logistics",
    subDepartment: "",
    division: "Operations Division",
    company: "FlexiCorp Global",
    currentShift: i % 2 === 0 ? "Morning (09:00-18:00)" : "Evening (13:00-22:00)",
    location: "Distribution Center",
  })),
];

interface RosterSelectionProps {
  onProceedToPlanner: (selectedEmployees: Employee[]) => void;
}

export const RosterSelection: React.FC<RosterSelectionProps> = ({ onProceedToPlanner }) => {
  const [currentStage, setCurrentStage] = useState<SelectionStage>("company");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNodes, setSelectedNodes] = useState<Record<OrganizationLevel, string | null>>({
    company: null,
    division: null,
    department: null,
    subDepartment: null,
  });
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"hierarchy" | "grid">("hierarchy");

  // Filter organization nodes based on current selection
  const availableNodes = useMemo(() => {
    switch (currentStage) {
      case "company":
        return ORGANIZATION_TREE.filter(node => node.type === "company");
      case "division":
        return ORGANIZATION_TREE.filter(node => 
          node.type === "division" && node.parentId === selectedNodes.company
        );
      case "department":
        return ORGANIZATION_TREE.filter(node => 
          node.type === "department" && node.parentId === selectedNodes.division
        );
      case "subDepartment":
        return ORGANIZATION_TREE.filter(node => 
          node.type === "subDepartment" && node.parentId === selectedNodes.department
        );
      default:
        return [];
    }
  }, [currentStage, selectedNodes]);

  // Get filtered employees based on current selection
  const filteredEmployees = useMemo(() => {
    let employees = MOCK_EMPLOYEES;
    
    // Apply organization filters
    if (selectedNodes.company) {
      const companyName = ORGANIZATION_TREE.find(n => n.id === selectedNodes.company)?.name;
      employees = employees.filter(emp => emp.company === companyName);
    }
    if (selectedNodes.division) {
      const divisionName = ORGANIZATION_TREE.find(n => n.id === selectedNodes.division)?.name;
      employees = employees.filter(emp => emp.division === divisionName);
    }
    if (selectedNodes.department) {
      const deptName = ORGANIZATION_TREE.find(n => n.id === selectedNodes.department)?.name;
      employees = employees.filter(emp => emp.department === deptName);
    }
    if (selectedNodes.subDepartment) {
      const subDeptName = ORGANIZATION_TREE.find(n => n.id === selectedNodes.subDepartment)?.name;
      employees = employees.filter(emp => emp.subDepartment === subDeptName);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      employees = employees.filter(emp => 
        emp.name.toLowerCase().includes(query) ||
        emp.id.toLowerCase().includes(query) ||
        emp.dept.toLowerCase().includes(query) ||
        (emp.currentShift || "").toLowerCase().includes(query)
      );
    }
    
    return employees;
  }, [selectedNodes, searchQuery]);

  const selectedEmployeeObjects = useMemo(() => 
    MOCK_EMPLOYEES.filter(emp => selectedEmployees.includes(emp.id)),
    [selectedEmployees]
  );

  const handleNodeSelect = (node: OrganizationNode) => {
    setSelectedNodes(prev => ({
      ...prev,
      [node.type]: node.id,
      // Clear deeper levels when selecting a new level
      ...(node.type === "company" && { division: null, department: null, subDepartment: null }),
      ...(node.type === "division" && { department: null, subDepartment: null }),
      ...(node.type === "department" && { subDepartment: null }),
    }));
    
    // Move to next stage
    const stages: SelectionStage[] = ["company", "division", "department", "subDepartment", "employees"];
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex < stages.length - 1) {
      setCurrentStage(stages[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const stages: SelectionStage[] = ["company", "division", "department", "subDepartment", "employees"];
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex > 0) {
      setCurrentStage(stages[currentIndex - 1]);
    }
  };

  const handleEmployeeToggle = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id));
    }
  };

  const handleProceed = () => {
    onProceedToPlanner(selectedEmployeeObjects);
  };

  const getStageIcon = (stage: SelectionStage) => {
    switch (stage) {
      case "company": return <Building2 size={20} />;
      case "division": return <Layers size={20} />;
      case "department": return <Briefcase size={20} />;
      case "subDepartment": return <Users size={20} />;
      case "employees": return <Users size={20} />;
      default: return <Building2 size={20} />;
    }
  };

  const getStageTitle = (stage: SelectionStage) => {
    switch (stage) {
      case "company": return "Select Company";
      case "division": return "Select Division";
      case "department": return "Select Department";
      case "subDepartment": return "Select Sub-Department";
      case "employees": return "Select Employees";
      default: return "Select";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <Calendar className="text-[#3E3B6F]" size={28} /> Roster Planner Setup
          </h2>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Select organizational units and employees to plan rosters for</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
            <Download size={14} /> Export List
          </button>
          <button 
            onClick={handleProceed}
            disabled={selectedEmployees.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#3E3B6F] disabled:opacity-40 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#3E3B6F]/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Proceed to Planner <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* SELECTION PROGRESS */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Selection Progress</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("hierarchy")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                viewMode === "hierarchy" 
                  ? "bg-[#3E3B6F] text-white" 
                  : "bg-gray-100 text-gray-400 hover:text-gray-600"
              }`}
            >
              Hierarchy View
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                viewMode === "grid" 
                  ? "bg-[#3E3B6F] text-white" 
                  : "bg-gray-100 text-gray-400 hover:text-gray-600"
              }`}
            >
              Grid View
            </button>
          </div>
        </div>

        {/* PROGRESS STEPS */}
        <div className="flex items-center justify-between mb-8 relative">
          {(["company", "division", "department", "subDepartment", "employees"] as SelectionStage[]).map((stage, index) => {
            const isActive = currentStage === stage;
            const isCompleted = ["company", "division", "department", "subDepartment"].includes(stage) 
              ? selectedNodes[stage as OrganizationLevel] !== null
              : selectedEmployees.length > 0;
            
            return (
              <React.Fragment key={stage}>
                <div className="flex flex-col items-center relative z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 transition-all ${
                    isActive 
                      ? "bg-[#3E3B6F] text-white shadow-lg" 
                      : isCompleted 
                      ? "bg-green-100 text-green-600" 
                      : "bg-gray-100 text-gray-400"
                  }`}>
                    {isCompleted && !isActive ? <Check size={20} /> : getStageIcon(stage)}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    isActive ? "text-[#3E3B6F]" : "text-gray-400"
                  }`}>
                    {stage}
                  </span>
                </div>
                {index < 4 && (
                  <div className={`flex-1 h-0.5 ${
                    isCompleted ? "bg-green-500" : "bg-gray-200"
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* CURRENT STAGE SELECTION */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-gray-800 flex items-center gap-2">
              {getStageIcon(currentStage)}
              {getStageTitle(currentStage)}
            </h3>
            {currentStage !== "company" && (
              <button
                onClick={handleBack}
                className="text-xs font-bold text-gray-400 hover:text-gray-600 flex items-center gap-1"
              >
                <ChevronRight className="rotate-180" size={14} /> Back
              </button>
            )}
          </div>

          {currentStage !== "employees" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableNodes.map(node => (
                <button
                  key={node.id}
                  onClick={() => handleNodeSelect(node)}
                  className={`p-4 rounded-2xl border-2 transition-all text-left group ${
                    selectedNodes[node.type] === node.id
                      ? "border-[#3E3B6F] bg-[#3E3B6F]/5"
                      : "border-gray-200 hover:border-[#3E3B6F]/50 hover:bg-[#3E3B6F]/3"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-800 group-hover:text-[#3E3B6F]">
                        {node.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                        {node.type.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                    </div>
                    <ChevronRight className={`text-gray-300 group-hover:text-[#3E3B6F] ${
                      selectedNodes[node.type] === node.id ? "text-[#3E3B6F]" : ""
                    }`} size={16} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="font-bold">{node.employeeCount} employees</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* SEARCH AND FILTERS */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input
                    type="text"
                    placeholder="Search employees by name, ID, or shift..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#3E3B6F]/5 outline-none"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSelectAll}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    {selectedEmployees.length === filteredEmployees.length ? "Deselect All" : "Select All"}
                  </button>
                  <span className="text-xs font-bold text-gray-500">
                    {selectedEmployees.length} of {filteredEmployees.length} selected
                  </span>
                </div>
              </div>

              {/* EMPLOYEES GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmployees.map(employee => {
                  const isSelected = selectedEmployees.includes(employee.id);
                  
                  return (
                    <div
                      key={employee.id}
                      onClick={() => handleEmployeeToggle(employee.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all group ${
                        isSelected
                          ? "border-[#3E3B6F] bg-[#3E3B6F]/5"
                          : "border-gray-200 hover:border-[#3E3B6F]/30 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black border shadow-sm ${
                          isSelected
                            ? "bg-[#3E3B6F] text-white border-[#3E3B6F]"
                            : "bg-gray-100 text-gray-600 border-gray-200 group-hover:border-[#3E3B6F]/30"
                        }`}>
                          {employee.avatar}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="text-sm font-bold text-gray-800 truncate">
                              {employee.name}
                            </h4>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isSelected
                                ? "bg-[#3E3B6F] border-[#3E3B6F]"
                                : "bg-white border-gray-300"
                            }`}>
                              {isSelected && <Check size={10} className="text-white" />}
                            </div>
                          </div>
                          
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {employee.id}
                          </p>
                          
                          <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500">
                            <Briefcase size={10} />
                            <span>{employee.dept}</span>
                          </div>
                          
                          {employee.currentShift && (
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500">
                              <Clock size={10} />
                              <span>{employee.currentShift}</span>
                            </div>
                          )}
                          
                          {employee.location && (
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500">
                              <MapPin size={10} />
                              <span>{employee.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SELECTION SUMMARY */}
      {(selectedNodes.company || selectedEmployees.length > 0) && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Selection Summary</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ORGANIZATION SUMMARY */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Organization</h4>
              
              <div className="space-y-3">
                {Object.entries(selectedNodes).map(([type, id]) => {
                  if (!id) return null;
                  
                  const node = ORGANIZATION_TREE.find(n => n.id === id);
                  if (!node) return null;
                  
                  return (
                    <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                          {getStageIcon(type as OrganizationLevel)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">{node.name}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                            {type.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#3E3B6F]">{node.employeeCount}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* EMPLOYEES SUMMARY */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Employees</h4>
                <span className="text-xs font-black text-[#3E3B6F]">
                  {selectedEmployees.length} employees
                </span>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-100 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck size={20} className="text-green-600" />
                  <div>
                    <p className="text-xs font-black text-green-800">Ready for Roster Planning</p>
                    <p className="text-[10px] text-green-600 font-medium">
                      All selected employees are available for the upcoming planning cycle
                    </p>
                  </div>
                </div>
                
                {selectedEmployees.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedEmployeeObjects.slice(0, 6).map(emp => (
                      <div key={emp.id} className="flex items-center gap-2 px-2 py-1 bg-white border border-green-200 rounded-lg">
                        <div className="w-5 h-5 rounded bg-green-100 text-[8px] font-black text-green-600 flex items-center justify-center">
                          {emp.avatar}
                        </div>
                        <span className="text-[10px] font-bold text-gray-700">{emp.name.split(' ')[0]}</span>
                      </div>
                    ))}
                    {selectedEmployees.length > 6 && (
                      <div className="px-2 py-1 bg-white border border-green-200 rounded-lg">
                        <span className="text-[10px] font-bold text-green-600">
                          +{selectedEmployees.length - 6} more
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* PROCEED CARD */}
              <div className="p-6 bg-gradient-to-r from-[#3E3B6F] to-[#5A56A3] rounded-2xl text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Next Step</p>
                    <p className="text-sm font-bold text-white">Proceed to Roster Planner</p>
                  </div>
                  <Calendar size={24} className="text-white/30" />
                </div>
                
                <button
                  onClick={handleProceed}
                  disabled={selectedEmployees.length === 0}
                  className="w-full py-3 bg-white text-[#3E3B6F] rounded-xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  Open Roster Planner <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};