import React, { useEffect, useMemo, useState } from "react";
import {
  X,
  Users,
  Plus,
  Search,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  LayoutList,
  CheckCircle2,
  ChevronRight,
  Clock,
} from "lucide-react";
import type { EligibilityGroup } from "./EligibilityGroupsPage";

interface EligibilityGroupFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: EligibilityGroup | null;

  /** NEW: full CRUD hook */
  onSave: (payload: Omit<EligibilityGroup, "createdAt" | "updatedAt">) => void;
}

export const EligibilityGroupForm: React.FC<EligibilityGroupFormProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
}) => {
  const [activeSection, setActiveSection] = useState<
    "info" | "criteria" | "types" | "preview"
  >("info");

  const [formData, setFormData] = useState<Omit<
    EligibilityGroup,
    "createdAt" | "updatedAt"
  >>({
    id: initialData?.id || `EG-${Math.floor(100000 + Math.random() * 900000)}`,
    name: initialData?.name || "",
    description: initialData?.description || "",
    priority: initialData?.priority || 1,
    criteria: initialData?.criteria || {
      employmentTypes: ["Permanent", "Contract"],
      grades: [],
      gradeRange: { from: "L1", to: "L5" },
      departments: [],
      locations: [],
      gender: "Any",
      minTenure: 0,
      probationStatus: "Include",
    },
    leaveTypes: initialData?.leaveTypes || ["ANNUAL", "CASUAL", "SICK"],
    allTypes: initialData?.allTypes || false,
  });

  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewResults, setPreviewResults] = useState<{
    count: number;
    samples: any[];
  } | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setActiveSection("info");
    setPreviewResults(null);
    setIsPreviewLoading(false);

    setFormData({
      id:
        initialData?.id ||
        `EG-${Math.floor(100000 + Math.random() * 900000)}`,
      name: initialData?.name || "",
      description: initialData?.description || "",
      priority: initialData?.priority || 1,
      criteria: initialData?.criteria || {
        employmentTypes: ["Permanent", "Contract"],
        grades: [],
        gradeRange: { from: "L1", to: "L5" },
        departments: [],
        locations: [],
        gender: "Any",
        minTenure: 0,
        probationStatus: "Include",
      },
      leaveTypes: initialData?.leaveTypes || ["ANNUAL", "CASUAL", "SICK"],
      allTypes: initialData?.allTypes || false,
    });
  }, [isOpen, initialData]);

  
  const employmentTypes = ["Permanent", "Contract", "Intern", "Trainee", "Part-time"];
  const grades = ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "M1", "M2", "E1"];
  const leaveTypes = [
    { id: "ANNUAL", label: "Annual Leave" },
    { id: "CASUAL", label: "Casual Leave" },
    { id: "SICK", label: "Sick Leave" },
    { id: "MATERNITY", label: "Maternity Leave" },
    { id: "PATERNITY", label: "Paternity Leave" },
    { id: "COMPOFF", label: "Comp-Off" },
  ];

  const canSave = useMemo(() => {
    if (!formData.name.trim()) return false;
    if (formData.priority < 1) return false;
    if (!formData.allTypes && formData.leaveTypes.length === 0) return false;
    return true;
  }, [formData]);

  const handlePreview = () => {
    setIsPreviewLoading(true);
    setTimeout(() => {
      setPreviewResults({
        count: 156,
        samples: [
          { name: "Ahmed Khan", role: "Software Engineer", dept: "Engineering" },
          { name: "Sara Ahmed", role: "Product Lead", dept: "Product" },
          { name: "Zoya Malik", role: "UI Designer", dept: "Design" },
          { name: "Ali Raza", role: "DevOps Manager", dept: "Engineering" },
        ],
      });
      setIsPreviewLoading(false);
      setActiveSection("preview");
    }, 800);
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#3E3B6F]/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-[40px] w-full max-w-[650px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-white px-10 py-8 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-[#3E3B6F] rounded-2xl">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {initialData ? "Edit Group" : "Create Eligibility Group"}
              </h3>
              <p className="text-sm text-gray-400 font-medium">
                Define automated inclusion rules for leave policies.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-50/50 border-b border-gray-100 px-6 shrink-0">
          {[
            { id: "info", label: "1. Group Info" },
            { id: "criteria", label: "2. Criteria Builder" },
            { id: "types", label: "3. Leave Types" },
            { id: "preview", label: "4. Preview" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
                activeSection === tab.id ? "text-[#3E3B6F]" : "text-gray-400"
              }`}
            >
              {tab.label}
              {activeSection === tab.id && (
                <div className="absolute bottom-0 left-4 right-4 h-1 bg-[#3E3B6F] rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-form-scroll space-y-10">
          {/* INFO */}
          {activeSection === "info" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Group Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Headquarters Permanent Staff"
                  className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#3E3B6F] outline-none transition-all font-bold text-gray-800"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain who this group targets..."
                  className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#3E3B6F] outline-none transition-all text-sm resize-none"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="bg-indigo-50 p-6 rounded-[24px] border border-indigo-100 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-indigo-900">
                    Processing Priority
                  </p>
                  <p className="text-xs text-indigo-700 opacity-70">
                    Used when employees fall into multiple groups.
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-indigo-200">
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        priority: Math.max(1, formData.priority - 1),
                      })
                    }
                    className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold hover:bg-indigo-100"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold text-indigo-900 w-8 text-center">
                    {formData.priority}
                  </span>
                  <button
                    onClick={() =>
                      setFormData({ ...formData, priority: formData.priority + 1 })
                    }
                    className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold hover:bg-indigo-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CRITERIA */}
          {activeSection === "criteria" && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck size={16} className="text-[#3E3B6F]" />
                  <h4 className="text-sm font-bold text-gray-800">
                    Employment Filter
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {employmentTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        const types = formData.criteria.employmentTypes.includes(type)
                          ? formData.criteria.employmentTypes.filter((t) => t !== type)
                          : [...formData.criteria.employmentTypes, type];
                        setFormData({
                          ...formData,
                          criteria: { ...formData.criteria, employmentTypes: types },
                        });
                      }}
                      className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${
                        formData.criteria.employmentTypes.includes(type)
                          ? "bg-[#3E3B6F] border-[#3E3B6F] text-white shadow-md"
                          : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <LayoutList size={16} className="text-[#3E3B6F]" />
                  <h4 className="text-sm font-bold text-gray-800">
                    Grade / Level Range
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      From Grade
                    </p>
                    <select
                      value={formData.criteria.gradeRange.from}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          criteria: {
                            ...formData.criteria,
                            gradeRange: {
                              ...formData.criteria.gradeRange,
                              from: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-gray-200"
                    >
                      {grades.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      To Grade
                    </p>
                    <select
                      value={formData.criteria.gradeRange.to}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          criteria: {
                            ...formData.criteria,
                            gradeRange: {
                              ...formData.criteria.gradeRange,
                              to: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-gray-200"
                    >
                      {grades.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-2 gap-8">
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-[#3E3B6F]" />
                    <h4 className="text-sm font-bold text-gray-800">Gender</h4>
                  </div>

                  <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
                    {(["Any", "Male", "Female"] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            criteria: { ...formData.criteria, gender: g },
                          })
                        }
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                          formData.criteria.gender === g
                            ? "bg-white text-[#3E3B6F] shadow-sm"
                            : "text-gray-400"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-[#3E3B6F]" />
                    <h4 className="text-sm font-bold text-gray-800">Probation</h4>
                  </div>

                  <select
                    className="w-full p-3 bg-gray-50 rounded-xl text-xs font-bold outline-none"
                    value={formData.criteria.probationStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        criteria: {
                          ...formData.criteria,
                          probationStatus: e.target.value as any,
                        },
                      })
                    }
                  >
                    <option value="Include">Include</option>
                    <option value="Exclude">Exclude</option>
                    <option value="Only Probation">Only Probation</option>
                  </select>
                </section>
              </div>

              <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-xs font-bold text-gray-400 flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all">
                <Plus size={16} /> ADD ADVANCED CUSTOM CRITERIA
              </button>
            </div>
          )}

          {/* TYPES */}
          {activeSection === "types" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between p-6 bg-[#3E3B6F] rounded-3xl text-white shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <LayoutList size={24} />
                  </div>
                  <div>
                    <h5 className="font-bold">Assign All Leave Types?</h5>
                    <p className="text-xs text-white/50">
                      Grant access to every current and future leave type.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setFormData({ ...formData, allTypes: !formData.allTypes })
                  }
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    formData.allTypes ? "bg-[#E8D5A3]" : "bg-white/20"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      formData.allTypes ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {!formData.allTypes && (
                <div className="grid grid-cols-2 gap-4">
                  {leaveTypes.map((type) => (
                    <label
                      key={type.id}
                      className={`flex items-center justify-between p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                        formData.leaveTypes.includes(type.id)
                          ? "bg-indigo-50 border-[#3E3B6F]"
                          : "bg-white border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <span
                        className={`text-sm font-bold ${
                          formData.leaveTypes.includes(type.id)
                            ? "text-[#3E3B6F]"
                            : "text-gray-600"
                        }`}
                      >
                        {type.label}
                      </span>
                      <input
                        type="checkbox"
                        checked={formData.leaveTypes.includes(type.id)}
                        onChange={() => {
                          const types = formData.leaveTypes.includes(type.id)
                            ? formData.leaveTypes.filter((t) => t !== type.id)
                            : [...formData.leaveTypes, type.id];
                          setFormData({ ...formData, leaveTypes: types });
                        }}
                        className="w-5 h-5 rounded border-gray-200 text-[#3E3B6F] focus:ring-[#3E3B6F]"
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PREVIEW */}
          {activeSection === "preview" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {previewResults ? (
                <>
                  <div className="p-8 bg-emerald-50 rounded-[32px] border border-emerald-100 text-center space-y-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-emerald-500 mx-auto shadow-sm">
                      <CheckCircle2 size={32} />
                    </div>
                    <div>
                      <h4 className="text-3xl font-bold text-emerald-900">
                        {previewResults.count}
                      </h4>
                      <p className="text-sm font-bold text-emerald-700 uppercase tracking-widest">
                        Matching Employees
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Sample List (Top 5)
                    </h5>
                    <div className="space-y-3">
                      {previewResults.samples.map((s, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent-peach flex items-center justify-center text-[10px] font-bold text-[#3E3B6F]">
                              {s.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-800">
                                {s.name}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {s.role}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">
                            {s.dept}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-3 text-xs font-bold text-[#3E3B6F] hover:underline flex items-center justify-center gap-2">
                      View All Matched Employees <ChevronRight size={14} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-20 text-center space-y-6">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto">
                    <Search size={40} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">
                      Ready to test?
                    </h4>
                    <p className="text-sm text-gray-400">
                      Click below to see which employees match your criteria.
                    </p>
                  </div>
                  <button
                    onClick={handlePreview}
                    disabled={isPreviewLoading}
                    className="px-10 py-3 bg-[#3E3B6F] text-white font-bold rounded-2xl hover:bg-[#4A4680] shadow-xl shadow-[#3E3B6F]/20 transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
                  >
                    {isPreviewLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span className="inline-flex items-center justify-center w-5 h-5">
                        ⚡
                      </span>
                    )}
                    Preview Matching Staff
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-10 py-8 border-t border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-amber-600">
            <AlertTriangle size={16} />
            <p className="text-[10px] font-bold uppercase tracking-widest">
              Priority overlaps existing groups (demo warning)
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all"
            >
              Cancel
            </button>

            <button
              disabled={!canSave}
              onClick={() => onSave(formData)}
              className="px-8 py-2.5 bg-[#3E3B6F] text-white font-bold rounded-xl hover:bg-[#4A4680] shadow-lg shadow-[#3E3B6F]/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {initialData ? "Update Group Settings" : "Save Group Settings"}
            </button>
          </div>
        </div>
      </div>

      <style>
        {`
          .custom-form-scroll::-webkit-scrollbar { width: 4px; }
          .custom-form-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        `}
      </style>
    </div>
  );
};
