import React from "react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/button";
import { Division } from "../types";
import { StatusBadge } from "./ui/StatusBadge";
import { Layers } from "lucide-react";

interface DivisionViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  // We use the Division type, but extend it slightly if necessary for display
  division: (Division & { companyName?: string; regionName?: string | null }) | null;
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col space-y-1">
    <span className="text-xs font-medium text-gray-500">{label}</span>
    <span className="text-sm font-semibold text-gray-800">
      {value || "—"}
    </span>
  </div>
);

export const DivisionViewModal: React.FC<DivisionViewModalProps> = ({
  isOpen,
  onClose,
  division,
}) => {
  if (!division) return null;

  const status: "active" | "inactive" = division.active ? "active" : "inactive";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Division Details"
    >
      <div className="space-y-3 p-1 !mt-0 !pt-0">
        {/* Header/Title Section */}
        <div className="flex items-start space-x-4 border-b pb-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Layers size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{division.name}</h2>
            <div className="text-sm text-gray-600">
              Code: <span className="font-mono text-gray-700">{division.code}</span>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          
          <DetailItem label="Company" value={division.companyName} />
          <DetailItem 
            label="Region / Territory" 
            value={division.regionName || division.region_id} 
          />

          <DetailItem 
            label="Head of Division ID" 
            value={division.headOfDivisionId} 
          />
          <DetailItem 
            label="Internal ID" 
            value={division.id} 
          />
          
        </div>

        {/* Description Section */}
        <div className="md:col-span-2 pt-2">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </span>
          <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 border">
            {division.description || "No description provided."}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t mt-4">
        <Button onClick={onClose} variant="outline">
          Close
        </Button>
      </div>
    </Modal>
  );
};