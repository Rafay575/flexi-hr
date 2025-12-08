
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, MapPin, ChevronRight, Globe, Building, Pencil, Download, Upload, Search } from 'lucide-react';
import { api } from '../services/mockData';
import { downloadCSV } from '../services/csvUtils';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { StatusBadge } from '../components/ui/StatusBadge';
import { DataTable, Column } from '../components/ui/DataTable';
import { GeoCountry, GeoState, GeoCity, Location } from '../types';
import { GeoModal, GeoType } from '../components/GeoModal';
import { LocationModal } from '../components/LocationModal';
import { BulkImportDrawer } from '../components/BulkImportDrawer';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';

export const Locations: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'offices' | 'geography'>('offices');
  
  // Geography State
  const [selectedCountry, setSelectedCountry] = useState<GeoCountry | null>(null);
  const [selectedState, setSelectedState] = useState<GeoState | null>(null);
  const [geoModalOpen, setGeoModalOpen] = useState(false);
  const [geoModalType, setGeoModalType] = useState<GeoType>('country');
  const [geoModalParentId, setGeoModalParentId] = useState<string | undefined>(undefined);
  const [geoToDelete, setGeoToDelete] = useState<{id: string, type: GeoType, name: string} | null>(null);

  // Office Location State
  const [locModalOpen, setLocModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingLoc, setEditingLoc] = useState<Location | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locToDelete, setLocToDelete] = useState<Location | null>(null);

  // --- Queries ---
  const { data: countries, isLoading: loadingCountries } = useQuery({ 
    queryKey: ['geo', 'country'], 
    queryFn: api.getCountries 
  });

  const { data: states, isLoading: loadingStates } = useQuery({ 
    queryKey: ['geo', 'state', selectedCountry?.id], 
    queryFn: () => selectedCountry ? api.getStates(selectedCountry.id) : Promise.resolve([]),
    enabled: !!selectedCountry
  });

  const { data: cities, isLoading: loadingCities } = useQuery({ 
    queryKey: ['geo', 'city', selectedState?.id], 
    queryFn: () => selectedState ? api.getCities(selectedState.id) : Promise.resolve([]),
    enabled: !!selectedState
  });

  const { data: locations, isLoading: loadingLocations } = useQuery({
    queryKey: ['locations'],
    queryFn: api.getLocations
  });

  // --- Mutations ---
  const deleteGeoMutation = useMutation({
    mutationFn: (vars: { id: string; type: GeoType }) => {
      if (vars.type === 'country') return api.deleteCountry(vars.id);
      if (vars.type === 'state') return api.deleteState(vars.id);
      return api.deleteCity(vars.id);
    },
    onSuccess: (_, vars) => {
      if (vars.type === 'country') {
        setSelectedCountry(null);
        setSelectedState(null);
        queryClient.invalidateQueries({ queryKey: ['geo', 'country'] });
      } else if (vars.type === 'state') {
        setSelectedState(null);
        queryClient.invalidateQueries({ queryKey: ['geo', 'state'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['geo', 'city'] });
      }
      setGeoToDelete(null);
    },
    onError: (err: Error) => {
      alert(err.message);
      setGeoToDelete(null);
    }
  });

  const deleteLocMutation = useMutation({
    mutationFn: api.deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setLocToDelete(null);
    },
    onError: (err: Error) => {
      alert(err.message);
      setLocToDelete(null);
    }
  });

  // --- Handlers ---
  const handleAddGeo = (type: GeoType) => {
    setGeoModalType(type);
    if (type === 'state') setGeoModalParentId(selectedCountry?.id);
    if (type === 'city') setGeoModalParentId(selectedState?.id);
    setGeoModalOpen(true);
  };

  const handleDeleteGeo = (id: string, type: GeoType, name: string) => {
    setGeoToDelete({ id, type, name });
  };

  const confirmGeoDelete = () => {
    if (geoToDelete) {
      deleteGeoMutation.mutate({ id: geoToDelete.id, type: geoToDelete.type });
    }
  };

  const handleCreateLoc = () => {
    setEditingLoc(null);
    setLocModalOpen(true);
  };

  const handleEditLoc = (loc: Location, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingLoc(loc);
    setLocModalOpen(true);
  };

  const handleDeleteLoc = (loc: Location, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLocToDelete(loc);
  };

  const confirmLocDelete = () => {
    if (locToDelete) {
      deleteLocMutation.mutate(locToDelete.id);
    }
  };

  const handleExport = () => {
    if (locations) {
      const exportData = locations.map(l => ({
        name: l.name,
        code: l.code,
        type: l.type,
        addressLine1: l.addressLine1,
        city: l.city,
        state: l.state,
        country: l.country,
        timezone: l.timezone,
        isVirtual: l.isVirtual,
        status: l.status
      }));
      downloadCSV(exportData, `locations_export_${new Date().toISOString().slice(0,10)}.csv`);
    }
  };

  const handleBulkImport = async (rows: any[]) => {
    for (const row of rows) {
      const payload: any = {
        name: row.name,
        code: row.code,
        type: row.type || 'branch',
        addressLine1: row.addressLine1 || 'Unknown',
        city: row.city || 'Unknown',
        state: row.state || 'Unknown',
        country: row.country || 'USA',
        timezone: row.timezone || 'UTC',
        isVirtual: row.isVirtual === 'true',
        status: 'active'
      };
      await api.addLocation(payload);
    }
    queryClient.invalidateQueries({ queryKey: ['locations'] });
  };

  const validateImportRow = (row: any) => {
    const errors = [];
    if (!row.name) errors.push('Name is required');
    if (!row.code) errors.push('Code is required');
    return errors;
  };

  const filteredLocations = locations?.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Render Helpers ---
  const GeoListItem = ({ 
    item, 
    isSelected, 
    onClick, 
    type,
    icon: Icon 
  }: { item: any, isSelected: boolean, onClick?: () => void, type: GeoType, icon: any }) => (
    <div 
      onClick={onClick}
      className={`
        group flex items-center justify-between p-3 rounded-lg cursor-pointer border transition-all mb-2
        ${isSelected 
          ? 'bg-primary-50 border-primary-200 shadow-sm' 
          : 'bg-white border-slate-100 hover:border-primary-200 hover:shadow-sm'}
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-md ${isSelected ? 'bg-primary-100 text-primary-600' : 'bg-slate-50 text-slate-400 group-hover:text-primary-500'}`}>
          <Icon size={16} />
        </div>
        <div>
          <h4 className={`text-sm font-medium ${isSelected ? 'text-primary-900' : 'text-slate-700'}`}>{item.name}</h4>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">{item.code}</span>
            <StatusBadge status={item.status} className="scale-75 origin-left" />
          </div>
        </div>
      </div>
      <div className="flex items-center">
        {onClick && (
          <ChevronRight size={16} className={`text-slate-300 ${isSelected ? 'text-primary-400' : ''}`} />
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); handleDeleteGeo(item.id, type, item.name); }}
          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );

  const locationColumns: Column<Location>[] = [
    {
      header: 'Location Name',
      accessor: (l) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
             <MapPin size={16} />
          </div>
          <div>
            <div className="font-medium text-slate-900">{l.name}</div>
            <div className="text-xs text-slate-500">{l.code}</div>
          </div>
        </div>
      )
    },
    { header: 'Type', accessor: (l) => <span className="capitalize text-slate-600">{l.type.replace('_', ' ')}</span> },
    { header: 'City', accessor: (l) => <span className="text-slate-600">{l.city}</span> },
    { header: 'Country', accessor: (l) => <span className="text-slate-600">{l.country}</span> },
    { header: 'Status', accessor: (l) => <StatusBadge status={l.status} /> },
    {
      header: 'Actions',
      width: '100px',
      className: 'text-right',
      accessor: (l) => (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <button 
             className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
             onClick={(e) => handleEditLoc(l, e)}
             title="Edit"
           >
             <Pencil size={16} />
           </button>
           <button 
             className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
             onClick={(e) => handleDeleteLoc(l, e)}
             title="Delete"
           >
             <Trash2 size={16} />
           </button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <PageHeader 
        title="Location Manager" 
        description="Manage physical offices, remote hubs, and geography master data."
        breadcrumbs={[{ label: 'Flexi HQ', href: '/' }, { label: 'Locations' }]}
        actions={
          <div className="flex gap-2">
            {activeTab === 'offices' && (
              <>
                <Button variant="ghost" onClick={handleExport}>
                  <Download size={16} className="mr-2" /> Export
                </Button>
                <Button variant="outline" onClick={() => setIsImportOpen(true)}>
                  <Upload size={16} className="mr-2" /> Import
                </Button>
                <Button onClick={handleCreateLoc}>
                  <Plus size={16} className="mr-2" />
                  Add Location
                </Button>
              </>
            )}
          </div>
        }
      />
      
      {/* Tab Navigation */}
      <div className="mb-6 border-b border-slate-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('offices')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'offices' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Office Locations
          </button>
          <button
            onClick={() => setActiveTab('geography')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'geography' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Geography Master
          </button>
        </nav>
      </div>

      {/* Content Area */}
      {activeTab === 'offices' ? (
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
             <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search locations..." 
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all max-w-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
          </div>
          <DataTable 
            columns={locationColumns} 
            data={filteredLocations} 
            isLoading={loadingLocations} 
            onRowClick={(l) => handleEditLoc(l)}
            emptyState={
               <div className="flex flex-col items-center justify-center py-10">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <MapPin size={32} className="text-slate-300" />
                 </div>
                 <h3 className="text-lg font-medium text-slate-900">No locations found</h3>
                 <p className="text-slate-500 mt-1 mb-6">Add physical offices or remote hubs.</p>
                 <Button onClick={handleCreateLoc}>Add Location</Button>
               </div>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
          {/* Column 1: Countries */}
          <div className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Globe size={16} /> Countries
              </h3>
              <button 
                onClick={() => handleAddGeo('country')}
                className="p-1.5 bg-white border border-slate-200 rounded text-slate-500 hover:text-primary-600 hover:border-primary-300 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="p-3 overflow-y-auto flex-1 bg-slate-50/30">
              {loadingCountries ? (
                [1,2,3].map(i => <Skeleton key={i} className="h-14 mb-2" />)
              ) : (
                countries?.map(country => (
                  <GeoListItem 
                    key={country.id}
                    item={country}
                    type="country"
                    isSelected={selectedCountry?.id === country.id}
                    onClick={() => { setSelectedCountry(country); setSelectedState(null); }}
                    icon={Globe}
                  />
                ))
              )}
            </div>
          </div>

          {/* Column 2: States */}
          <div className={`bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-sm transition-opacity ${!selectedCountry ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <MapPin size={16} /> States
              </h3>
              <button 
                onClick={() => handleAddGeo('state')}
                disabled={!selectedCountry}
                className="p-1.5 bg-white border border-slate-200 rounded text-slate-500 hover:text-primary-600 hover:border-primary-300 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="p-3 overflow-y-auto flex-1 bg-slate-50/30">
              {!selectedCountry ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">Select a country</div>
              ) : loadingStates ? (
                [1,2,3].map(i => <Skeleton key={i} className="h-14 mb-2" />)
              ) : (
                states?.map(state => (
                  <GeoListItem 
                    key={state.id}
                    item={state}
                    type="state"
                    isSelected={selectedState?.id === state.id}
                    onClick={() => setSelectedState(state)}
                    icon={MapPin}
                  />
                ))
              )}
            </div>
          </div>

          {/* Column 3: Cities */}
          <div className={`bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-sm transition-opacity ${!selectedState ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Building size={16} /> Cities
              </h3>
              <button 
                onClick={() => handleAddGeo('city')}
                disabled={!selectedState}
                className="p-1.5 bg-white border border-slate-200 rounded text-slate-500 hover:text-primary-600 hover:border-primary-300 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="p-3 overflow-y-auto flex-1 bg-slate-50/30">
              {!selectedState ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">Select a state</div>
              ) : loadingCities ? (
                [1,2,3].map(i => <Skeleton key={i} className="h-14 mb-2" />)
              ) : (
                cities?.map(city => (
                  <GeoListItem 
                    key={city.id}
                    item={city}
                    type="city"
                    isSelected={false}
                    icon={Building}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {geoModalOpen && (
        <GeoModal 
          isOpen={geoModalOpen} 
          onClose={() => setGeoModalOpen(false)} 
          type={geoModalType} 
          parentId={geoModalParentId} 
        />
      )}

      {locModalOpen && (
        <LocationModal
          isOpen={locModalOpen}
          onClose={() => setLocModalOpen(false)}
          location={editingLoc}
        />
      )}

      <BulkImportDrawer
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Import Locations"
        entityName="Location"
        templateHeader="name,code,type,addressLine1,city,state,country"
        onValidate={validateImportRow}
        onImport={handleBulkImport}
      />

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={!!locToDelete}
        onClose={() => setLocToDelete(null)}
        onConfirm={confirmLocDelete}
        title="Delete Location"
        message={`Are you sure you want to delete "${locToDelete?.name}"? This will permanently remove the location.`}
        isLoading={deleteLocMutation.isPending}
      />

      <ConfirmationModal
        isOpen={!!geoToDelete}
        onClose={() => setGeoToDelete(null)}
        onConfirm={confirmGeoDelete}
        title={`Delete ${geoToDelete?.type}`}
        message={`Are you sure you want to delete "${geoToDelete?.name}"? This action cannot be undone.`}
        isLoading={deleteGeoMutation.isPending}
      />
    </div>
  );
};
