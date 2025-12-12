// src/context/CompanyContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface CompanyContextType {
  companyId: number | null;
  draftBatchId: string | null;
  setCompanyData: (id: number, draftBatchId: string) => void;
  clearCompanyData: () => void;
}

interface CompanyProviderProps {
  children: ReactNode;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<CompanyProviderProps> = ({ children }) => {
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [draftBatchId, setDraftBatchId] = useState<string | null>(null);

  useEffect(() => {
    // optional: load persisted data
  }, []);

  const setCompanyData = (id: number, draftId: string) => {
    console.log("Setting company data =>", id, draftId);
    setCompanyId(id);
    setDraftBatchId(draftId);
  };

  const clearCompanyData = () => {
    setCompanyId(null);
    setDraftBatchId(null);
  };

  return (
    <CompanyContext.Provider
      value={{ companyId, draftBatchId, setCompanyData, clearCompanyData }}
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
