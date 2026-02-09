import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  Pencil,
  Users,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { EligibilityGroupForm } from "./EligibilityGroupForm";

/** ---------------- Types ---------------- */

export type EligibilityGroup = {
  id: string;
  name: string;
  description?: string;
  priority: number;
  criteria: {
    employmentTypes: string[];
    grades: string[];
    gradeRange: { from: string; to: string };
    departments: string[];
    locations: string[];
    gender: "Any" | "Male" | "Female";
    minTenure: number;
    probationStatus: "Include" | "Exclude" | "Only Probation";
  };
  leaveTypes: string[];
  allTypes: boolean;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "eligibility_groups_v1";

const uid = () => `EG-${Math.floor(100000 + Math.random() * 900000)}`;

/** seed */
const seedGroups = (): EligibilityGroup[] => [
  {
    id: uid(),
    name: "HQ Permanent Staff",
    description: "For permanent HQ employees across core departments.",
    priority: 1,
    criteria: {
      employmentTypes: ["Permanent"],
      grades: [],
      gradeRange: { from: "L1", to: "L5" },
      departments: ["Engineering", "Product"],
      locations: ["HQ"],
      gender: "Any",
      minTenure: 0,
      probationStatus: "Include",
    },
    leaveTypes: ["ANNUAL", "CASUAL", "SICK"],
    allTypes: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uid(),
    name: "Contractors (Limited)",
    description: "Contract staff: only sick + casual.",
    priority: 2,
    criteria: {
      employmentTypes: ["Contract"],
      grades: [],
      gradeRange: { from: "L1", to: "L7" },
      departments: [],
      locations: [],
      gender: "Any",
      minTenure: 0,
      probationStatus: "Include",
    },
    leaveTypes: ["CASUAL", "SICK"],
    allTypes: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function loadGroups(): EligibilityGroup[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedGroups();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return seedGroups();
    return parsed;
  } catch {
    return seedGroups();
  }
}

function saveGroups(groups: EligibilityGroup[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
}

/** ---------------- Confirm Dialog ---------------- */

const ConfirmDialog: React.FC<{
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
}> = ({ open, title, description, onCancel, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/60">
          <h3 className="text-lg font-black text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500 font-medium mt-1">
            {description}
          </p>
        </div>
        <div className="p-6 flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/** ---------------- Page ---------------- */

export const EligibilityGroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<EligibilityGroup[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"priority" | "name" | "updatedAt">(
    "priority",
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EligibilityGroup | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const initial = loadGroups();
    setGroups(initial);
  }, []);

  useEffect(() => {
    if (!groups.length) return;
    saveGroups(groups);
  }, [groups]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = [...groups];

    if (q) {
      list = list.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          (g.description || "").toLowerCase().includes(q) ||
          g.id.toLowerCase().includes(q),
      );
    }

    if (sortBy === "priority") list.sort((a, b) => a.priority - b.priority);
    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "updatedAt")
      list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

    return list;
  }, [groups, search, sortBy]);

  const overlapsWarning = useMemo(() => {
    // dummy: if any duplicate priority exists -> show warning
    const seen = new Set<number>();
    for (const g of groups) {
      if (seen.has(g.priority)) return true;
      seen.add(g.priority);
    }
    return false;
  }, [groups]);

  /** CRUD actions */

  const onCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const onEdit = (g: EligibilityGroup) => {
    setEditing(g);
    setModalOpen(true);
  };

  const onSave = (payload: Omit<EligibilityGroup, "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();

    setGroups((prev) => {
      const exists = prev.some((x) => x.id === payload.id);
      if (exists) {
        return prev.map((x) =>
          x.id === payload.id ? { ...payload, createdAt: x.createdAt, updatedAt: now } : x,
        );
      }
      return [
        { ...payload, createdAt: now, updatedAt: now },
        ...prev,
      ];
    });

    setModalOpen(false);
    setEditing(null);
  };

  const onDelete = (id: string) => setDeleteId(id);

  const confirmDelete = () => {
    if (!deleteId) return;
    setGroups((prev) => prev.filter((x) => x.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="text-[#3E3B6F]" size={22} />
            Eligibility Groups
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Create groups and assign leave type eligibility based on criteria.
          </p>
        </div>

        <button
          onClick={onCreate}
          className="px-4 py-2 rounded-xl bg-[#3E3B6F] text-white text-xs font-black uppercase tracking-widest shadow-lg hover:opacity-90 flex items-center gap-2"
        >
          <Plus size={14} /> Create Group
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-gray-200 rounded-3xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm mb-4">
        <div className="relative w-full md:w-[360px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
            placeholder="Search by name / description / ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 justify-end">
          <select
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 outline-none focus:ring-4 focus:ring-[#3E3B6F]/5"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="priority">Sort: Priority</option>
            <option value="name">Sort: Name</option>
            <option value="updatedAt">Sort: Updated</option>
          </select>
        </div>
      </div>

      {/* Overlap warning */}
      {overlapsWarning && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-xl">
            <AlertTriangle className="text-amber-700" size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-900">
              Priority overlaps detected
            </p>
            <p className="text-xs text-amber-800/80 font-medium mt-1">
              Two or more groups share the same priority. Resolve it to keep deterministic matching.
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">Group</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Criteria</th>
                <th className="px-6 py-4">Leave Types</th>
                <th className="px-6 py-4">Updated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((g) => (
                <tr key={g.id} className="hover:bg-gray-50/60 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#3E3B6F] text-white flex items-center justify-center shadow-lg shadow-[#3E3B6F]/10">
                        <Users size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-gray-900 truncate">
                          {g.name}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase truncate">
                          {g.id} {g.description ? `• ${g.description}` : ""}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest">
                      {g.priority}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-xs text-gray-700 font-medium">
                    <div className="space-y-1">
                      <div>
                        <span className="text-gray-400 font-bold">Employment:</span>{" "}
                        {g.criteria.employmentTypes.length
                          ? g.criteria.employmentTypes.join(", ")
                          : "Any"}
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold">Grade:</span>{" "}
                        {g.criteria.gradeRange.from} → {g.criteria.gradeRange.to}
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold">Gender:</span>{" "}
                        {g.criteria.gender}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {g.allTypes ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                        ALL TYPES
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {g.leaveTypes.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="px-3 py-1 rounded-full border border-gray-200 bg-white text-[10px] font-black uppercase tracking-widest text-gray-600"
                          >
                            {t}
                          </span>
                        ))}
                        {g.leaveTypes.length > 3 && (
                          <span className="px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-500">
                            +{g.leaveTypes.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                    {new Date(g.updatedAt).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(g)}
                        className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-[#3E3B6F] hover:border-[#3E3B6F] transition-all"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(g.id)}
                        className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-300 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <p className="text-sm font-bold text-gray-500">
                      No eligibility groups found.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Try clearing the search or create a new group.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Total: {filtered.length}
          </p>

          <button
            onClick={() => {
              // reset storage (optional helper)
              localStorage.removeItem(STORAGE_KEY);
              const fresh = seedGroups();
              setGroups(fresh);
            }}
            className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#3E3B6F]"
          >
            Reset Demo Data
          </button>
        </div>
      </div>

      {/* Modal: Create/Edit */}
      <EligibilityGroupForm
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        initialData={editing}
        onSave={onSave}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteId}
        title="Delete eligibility group?"
        description="This will permanently remove the group (demo behavior)."
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
