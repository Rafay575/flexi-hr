
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Building2, 
  MapPin, 
  Globe, 
  CreditCard, 
  Users, 
  GitFork, 
  Layers, 
  Wallet,
  Pencil,
  ArrowUpRight,
  Briefcase,
  CheckCircle,
  Layout
} from 'lucide-react';
import { api } from '../services/mockData';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { CompanyWizard } from '../components/CompanyWizard';

// Sub-components
const MetricCard = ({ label, value, icon: Icon, accent }: { label: string; value: number | string; icon: any; accent: '1' | '2' }) => {
  const accentClass = accent === '1' ? 'bg-brand-accent1 text-brand-dark' : 'bg-brand-accent2 text-brand-dark';
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-card flex items-center gap-5 hover:shadow-card-hover transition-all">
      <div className={`p-4 rounded-xl ${accentClass} shadow-sm`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, icon }: { label: string; value?: string | React.ReactNode; icon?: React.ReactNode }) => (
  <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
    <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
      {icon}
      <span>{label}</span>
    </div>
    <div className="font-semibold text-slate-900 text-sm text-right max-w-[60%] break-words">
      {value || '-'}
    </div>
  </div>
);

export const CompanyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'structure' | 'branding'>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: company, isLoading, refetch } = useQuery({ 
    queryKey: ['company', id], 
    queryFn: () => api.getCompany(id!),
    enabled: !!id
  });

  const { data: divisions } = useQuery({
    queryKey: ['company-divisions', id],
    queryFn: () => api.getDivisionsByCompany(id!),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 bg-slate-100 animate-pulse rounded-xl"></div>
        <div className="grid grid-cols-4 gap-6">
           {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-xl font-bold text-slate-900">Company not found</h2>
        <Button className="mt-4" onClick={() => navigate('/companies')}>Return to List</Button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'structure', label: 'Org Structure' },
    { id: 'branding', label: 'Branding & Defaults' },
  ];

  return (
    <div>
      <PageHeader 
        title={company.name}
        description={`Entity ID: ${company.id} • ${company.domain || 'No domain'}`}
        breadcrumbs={[
          { label: 'Flexi HQ', href: '/' }, 
          { label: 'Companies', href: '/companies' },
          { label: 'Details' }
        ]}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status={company.status} className="px-4 py-1.5" />
            <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
              <Pencil size={16} className="mr-2" />
              Edit Company
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-8">
        <nav className="flex space-x-10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                py-4 px-2 border-b-[3px] font-bold text-sm transition-all tracking-wide
                ${activeTab === tab.id 
                  ? 'border-brand-primary text-brand-primary' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Metric Snapshot */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Entity Snapshot</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard 
                label="Divisions" 
                value={company._count?.divisions ?? 0} 
                icon={Layers} 
                accent="1" 
              />
              <MetricCard 
                label="Departments" 
                value={company._count?.departments ?? 0} 
                icon={GitFork} 
                accent="2" 
              />
              <MetricCard 
                label="Total Headcount" 
                value={company._count?.employees ?? 0} 
                icon={Users} 
                accent="1" 
              />
              <MetricCard 
                label="Locations" 
                value={company._count?.locations ?? 0} 
                icon={MapPin} 
                accent="2" 
              />
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Basic Info */}
            <Card className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Building2 size={20} className="text-brand-primary" />
                  Basic Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
                <DetailRow label="Legal Name" value={company.name} />
                <DetailRow label="Registration No." value={company.registrationNumber} />
                <DetailRow label="Industry Sector" value={company.sector} />
                <DetailRow label="Tax ID" value={company.taxId} />
                <DetailRow label="Incorporation Date" value={new Date(company.createdAt).toLocaleDateString()} />
              </div>

              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mt-10 mb-6 border-b border-slate-50 pb-4">
                <MapPin size={20} className="text-brand-primary" />
                Headquarters Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
                <DetailRow label="Address Line 1" value={company.addressLine1} />
                <DetailRow label="Address Line 2" value={company.addressLine2} />
                <DetailRow label="City" value={company.city} />
                <DetailRow label="State / Province" value={company.state} />
                <DetailRow label="Country" value={company.country} />
                <DetailRow label="Postal Code" value={company.postalCode} />
              </div>
            </Card>

            {/* Side Panel: Quick Links & Status */}
            <div className="space-y-6">
              <Card>
                <h3 className="font-bold text-slate-900 mb-6 text-lg">Quick Links</h3>
                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start text-slate-600 font-medium h-auto py-3 border border-slate-100" onClick={() => navigate('/departments')}>
                    <GitFork size={18} className="mr-3 text-brand-primary" /> Org Structure Tree
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-slate-600 font-medium h-auto py-3 border border-slate-100" onClick={() => navigate('/locations')}>
                    <MapPin size={18} className="mr-3 text-brand-primary" /> Manage Locations
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-slate-600 font-medium h-auto py-3 border border-slate-100" onClick={() => navigate('/cost-centers')}>
                    <Wallet size={18} className="mr-3 text-brand-primary" /> Cost Center Allocation
                  </Button>
                </div>
              </Card>

              <div className="bg-gradient-to-br from-brand-dark to-slate-900 rounded-xl p-6 text-white shadow-lg">
                <Globe className="mb-4 text-brand-accent1" size={32} />
                <h3 className="text-xl font-bold mb-2">Company Portal</h3>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">Manage employee-facing portal settings, access control and themes.</p>
                <Button variant="primary" size="sm" className="w-full bg-brand-accent1 text-brand-dark hover:bg-brand-accent2 border-0">
                  Configure Portal <ArrowUpRight size={14} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Org Structure Tab */}
      {activeTab === 'structure' && (
        <div className="space-y-6 animate-in fade-in duration-300">
           <div className="flex items-center justify-between">
             <h3 className="text-xl font-bold text-slate-900">Divisions & Business Units</h3>
             <Button variant="outline" onClick={() => navigate('/departments')}>View Full Hierarchy</Button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {divisions?.map(div => (
               <div key={div.id} className="bg-white p-6 rounded-xl border border-slate-100 hover:border-brand-primary hover:shadow-lg transition-all shadow-sm group">
                 <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-4">
                     <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-colors">
                        <Layers size={20} />
                     </div>
                     <div>
                       <h4 className="font-bold text-lg text-slate-900">{div.name}</h4>
                       <p className="text-xs text-slate-500 font-mono mt-0.5">{div.code}</p>
                     </div>
                   </div>
                   <StatusBadge status={div.status} />
                 </div>
                 <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-medium">Head of Division</span>
                    <span className="font-bold text-slate-900">Not Assigned</span>
                 </div>
               </div>
             ))}
             {(!divisions || divisions.length === 0) && (
               <div className="col-span-2 text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                 <p className="text-slate-500 font-medium">No divisions configured for this entity.</p>
                 <Button variant="ghost" className="mt-4 text-brand-primary font-bold">Add Division</Button>
               </div>
             )}
           </div>
        </div>
      )}

      {/* Branding Tab */}
      {activeTab === 'branding' && (
        <div className="space-y-6 animate-in fade-in duration-300">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <Card>
               <h3 className="font-bold text-lg text-slate-900 mb-8 flex items-center gap-3">
                 <Layout size={20} className="text-brand-primary" />
                 Brand Identity
               </h3>
               
               <div className="flex items-center gap-8 mb-8">
                  <div className="w-28 h-28 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center">
                    {company.logoUrl ? (
                      <img src={company.logoUrl} alt="Logo" className="w-full h-full object-contain p-4" />
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">No Logo</span>
                    )}
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-900">Primary Logo</p>
                    <p className="text-sm text-slate-500 mt-1 max-w-xs">Used on reports, portal headers, and email notifications.</p>
                  </div>
               </div>

               <div className="space-y-6">
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                   <span className="text-sm font-semibold text-slate-700">Brand Color</span>
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg border border-slate-200 shadow-sm" style={{ backgroundColor: company.brandColor }}></div>
                     <span className="text-sm font-mono font-bold text-slate-900">{company.brandColor || 'Not Set'}</span>
                   </div>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-sm font-medium text-slate-600">Website</span>
                   <a href={company.website} target="_blank" rel="noreferrer" className="text-sm font-bold text-brand-primary hover:underline">{company.website || '-'}</a>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-sm font-medium text-slate-600">Domain</span>
                   <span className="text-sm font-bold text-slate-900">{company.domain || '-'}</span>
                 </div>
               </div>
             </Card>

             <Card>
               <h3 className="font-bold text-lg text-slate-900 mb-8 flex items-center gap-3">
                 <Briefcase size={20} className="text-brand-primary" />
                 System Defaults
               </h3>
               <div className="space-y-4">
                 <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-4">
                       <CreditCard size={20} className="text-slate-400" />
                       <span className="text-sm font-semibold text-slate-700">Base Currency</span>
                    </div>
                    <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded text-sm">{company.currency}</span>
                 </div>
                 
                 <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-4">
                       <CheckCircle size={20} className="text-slate-400" />
                       <span className="text-sm font-semibold text-slate-700">Fiscal Year Start</span>
                    </div>
                    <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded text-sm">{new Date(0, (company.fiscalYearStartMonth || 1) - 1).toLocaleString('default', { month: 'long' })}</span>
                 </div>

                 <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-4">
                       <Globe size={20} className="text-slate-400" />
                       <span className="text-sm font-semibold text-slate-700">Timezone</span>
                    </div>
                    <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded text-sm">{company.timezone || 'UTC'}</span>
                 </div>
               </div>
             </Card>
           </div>
           </div>
      )}

      {/* Edit Wizard */}
      {isEditModalOpen && (
        <CompanyWizard 
          isOpen={isEditModalOpen} 
          onClose={() => {
            setIsEditModalOpen(false);
            refetch(); // Refresh data after edit
          }} 
          company={company} 
        />
      )}
       
    </div>
  )
}