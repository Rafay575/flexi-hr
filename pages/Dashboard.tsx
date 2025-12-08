import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Building2, 
  GitFork, 
  Users, 
  MapPin, 
  Wallet, 
  BookUser,
  Layers,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/mockData';
import { PageHeader } from '../components/ui/PageHeader';
import { Skeleton } from '../components/ui/Skeleton';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  count?: number;
  isLoading: boolean;
  accent: 'accent1' | 'accent2';
}

const ModuleCard: React.FC<ModuleCardProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  path, 
  count, 
  isLoading,
  accent
}) => {
  const navigate = useNavigate();
  
  // Dynamic accent styles
  const iconBg = accent === 'accent1' ? 'bg-brand-accent1/20 text-orange-700' : 'bg-brand-accent2/20 text-rose-700';
  const hoverBorder = accent === 'accent1' ? 'hover:border-brand-accent1' : 'hover:border-brand-accent2';

  return (
    <div 
      onClick={() => navigate(path)}
      className={`group bg-white rounded-xl border border-slate-100 p-6 cursor-pointer shadow-card hover:shadow-card-hover ${hoverBorder} transition-all duration-300 relative overflow-hidden flex flex-col`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3.5 rounded-xl ${iconBg} transition-colors`}>
           <Icon size={24} />
        </div>
        {isLoading ? (
          <Skeleton className="h-8 w-12 rounded-lg" />
        ) : (
          <span className="text-3xl font-bold text-slate-900 tracking-tight">{count ?? 0}</span>
        )}
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-slate-500 mb-6 line-clamp-2 min-h-[40px] font-medium leading-relaxed">
        {description}
      </p>

      <div className="mt-auto flex items-center text-sm font-bold text-slate-400 group-hover:text-brand-primary transition-colors">
        Manage <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { data: companies, isLoading: loadingCompanies } = useQuery({ queryKey: ['companies'], queryFn: api.getCompanies });
  const { data: divisions, isLoading: loadingDivisions } = useQuery({ queryKey: ['divisions'], queryFn: api.getDivisions });
  const { data: depts, isLoading: loadingDepts } = useQuery({ queryKey: ['departments'], queryFn: api.getDepartments });
  const { data: designations, isLoading: loadingDesg } = useQuery({ queryKey: ['designations'], queryFn: api.getDesignations });
  const { data: grades, isLoading: loadingGrades } = useQuery({ queryKey: ['grades'], queryFn: api.getGrades });
  const { data: locations, isLoading: loadingLocs } = useQuery({ queryKey: ['locations'], queryFn: api.getLocations });
  const { data: costCenters, isLoading: loadingCosts } = useQuery({ queryKey: ['costCenters'], queryFn: api.getCostCenters });

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader 
        title="Flexi HQ" 
        description="Core Foundation & Organization Architecture"
        breadcrumbs={[{ label: 'Home' }]}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ModuleCard 
          title="Company Profile"
          description="Manage legal entities, subsidiaries, and registration details."
          icon={Building2}
          path="/companies"
          count={companies?.length}
          isLoading={loadingCompanies}
          accent="accent1"
        />
        <ModuleCard 
          title="Divisions & Groups"
          description="Define top-level business units and functional groups."
          icon={Layers}
          path="/divisions" 
          count={divisions?.length}
          isLoading={loadingDivisions}
          accent="accent2"
        />
        <ModuleCard 
          title="Departments & Lines"
          description="Structure operational departments, reporting lines, and teams."
          icon={GitFork}
          path="/departments"
          count={depts?.length}
          isLoading={loadingDepts}
          accent="accent1"
        />
        <ModuleCard 
          title="Designations"
          description="Maintain job titles directory and reporting hierarchy."
          icon={BookUser}
          path="/designations"
          count={designations?.length}
          isLoading={loadingDesg}
          accent="accent2"
        />
        <ModuleCard 
          title="Grades & Bands"
          description="Configure salary bands, levels, and compensation grades."
          icon={Users}
          path="/grades"
          count={grades?.length}
          isLoading={loadingGrades}
          accent="accent1"
        />
        <ModuleCard 
          title="Locations"
          description="Manage global offices, branches, and remote hubs."
          icon={MapPin}
          path="/locations"
          count={locations?.length}
          isLoading={loadingLocs}
          accent="accent2"
        />
        <ModuleCard 
          title="Cost Centers"
          description="Track financial cost codes and budget allocations."
          icon={Wallet}
          path="/cost-centers"
          count={costCenters?.length}
          isLoading={loadingCosts}
          accent="accent1"
        />
      </div>
    </div>
  );
};