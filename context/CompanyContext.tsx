// src/context/CompanyContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { api } from "@/components/api/client";

interface CompanyContextType {
  companyId: number | null;
  draftBatchId: string | null;
  isEditMode: boolean;
  
  // Actions
  setCompanyData: (id: number, draftBatchId: string) => void;
  setEditCompany: (id: number) => void; // Simple edit setter
  setCreateMode: () => void; // Create mode setter
  clearCompanyData: () => void;
  
  // API function
  startCompanyDraft: (companyId: number) => Promise<{
    company_id: number;
    draft_batch_id: string;
  }>;
}

interface CompanyProviderProps {
  children: ReactNode;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<CompanyProviderProps> = ({ children }) => {
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [draftBatchId, setDraftBatchId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Simple setter for edit mode
  const setEditCompany = (id: number) => {
    console.log("Setting edit company =>", id);
    setCompanyId(id);
    setDraftBatchId(null);
    setIsEditMode(true);
  };

  // Simple setter for create mode
  const setCreateMode = () => {
    console.log("Setting create mode");
    setCompanyId(null);
    setDraftBatchId(null);
    setIsEditMode(false);
  };

  // Original create mode setter (if you still need it)
  const setCompanyData = (id: number, draftId: string) => {
    console.log("Setting company data for create =>", id, draftId);
    setCompanyId(id);
    setDraftBatchId(draftId);
    setIsEditMode(false);
  };

  const clearCompanyData = () => {
    console.log("Clearing company data");
    setCompanyId(null);
    setDraftBatchId(null);
    setIsEditMode(false);
  };

  // API function to start draft
  const startCompanyDraft = async (companyId: number) => {
    try {
      console.log("Starting draft for company:", companyId);
      
      const response = await api.post(`/v1/companies/${companyId}/setup/draft/start`);
      const data = response.data;
      
      if (data.success && data.data) {
        const { company_id, draft_batch_id } = data.data;
        
        setCompanyId(company_id);
        setDraftBatchId(draft_batch_id);
        
        console.log("Draft started successfully:", {
          companyId: company_id,
          draftBatchId: draft_batch_id
        });
        
        return { company_id, draft_batch_id };
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error: any) {
      console.error("Error starting company draft:", error);
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      throw new Error(`Failed to start draft: ${errorMessage}`);
    }
  };

  return (
    <CompanyContext.Provider
      value={{
        companyId,
        draftBatchId,
        isEditMode,
        setCompanyData,
        setEditCompany,
        setCreateMode,
        clearCompanyData,
        startCompanyDraft,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompanyContext = (): CompanyContextType => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompanyContext must be used within a CompanyProvider");
  }
  return context;
};