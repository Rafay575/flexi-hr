import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, DataTableQuery } from "@/components/ui/CustomDatatable";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Eye, Pencil, MoreVertical, MapPin, Download, Upload, Plus } from "lucide-react";
import fetchLocations from "./fetchLocations";
import { LocationForUI } from "./types";
import { mapLocationData } from "./mapLocationData";
import LocationModal from "./Model";

interface LocationsTableProps {
  companyId: number;
}

const LocationsTable: React.FC<LocationsTableProps> = ({ companyId }) => {
  const [tableQuery, setTableQuery] = useState<DataTableQuery>({
    pageIndex: 0,
    pageSize: 10,
    search: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "create" | "edit">("view");
  const [selectedLocation, setSelectedLocation] = useState<LocationForUI | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | number>("");

  // Fetch data using react-query
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["locations", companyId, tableQuery.pageIndex, tableQuery.pageSize, tableQuery.search],
    queryFn: () => fetchLocations(
      companyId, 
      tableQuery.pageIndex + 1, 
      tableQuery.pageSize,
      tableQuery.search
    ),
    enabled: !!companyId,
  });

  // Map data for the table
  const locations: LocationForUI[] = data?.data ? mapLocationData(data.data) : [];

  // --- HANDLERS ---
  const handleCreate = () => {
    setModalMode("create");
    setSelectedLocation(null);
    setSelectedLocationId("");
    setIsModalOpen(true);
  };

  const handleEdit = (location: LocationForUI, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMode("edit");
    setSelectedLocation(location);
    setSelectedLocationId(location.id);
    setIsModalOpen(true);
  };
  
  const handleView = (location: LocationForUI, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMode("view");
    setSelectedLocation(location);
    setSelectedLocationId(location.id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLocation(null);
    setSelectedLocationId("");
  };

  const handleRefetchLocations = async () => {
    await refetch();
  };

  const handleExport = () => {
    if (!locations.length) return;
    const exportData = locations.map((location, index) => ({
      'Sr No': (tableQuery.pageIndex * tableQuery.pageSize) + index + 1,
      'Location Name': location.name,
      'Type': location.location_type_name,
      'City': location.city_name,
      'Country': location.country_name,
      'Status': location.active ? 'Active' : 'Inactive',
    }));
    
    // Use your CSV download utility
    console.log("Export data:", exportData);
  };

  // Prepare location data for the modal
 // In your LocationsTable.tsx, update the getLocationDataForModal function:
const getLocationDataForModal = (): any => {
  if (!selectedLocation) return null;
  
  // Use optional chaining and provide fallbacks
  return {
    // Try to get IDs from selectedLocation, or use empty strings
    location_type_id: selectedLocation.location_type_id?.toString() || "",
    country_id: selectedLocation.country_id?.toString() || "",
    state_id: selectedLocation.state_id?.toString() || "",
    city_id: selectedLocation.city_id?.toString() || "",
    
    // Other fields
    name: selectedLocation.name || "",
    location_code: selectedLocation.location_code || "",
    address: selectedLocation.address || "",
    timezone: selectedLocation.timezone || "UTC",
    is_virtual: selectedLocation.is_virtual || false,
    status: selectedLocation.active ? "Active" : "Inactive",
  };
};

  // Columns definition - Only required columns
  const columns: ColumnDef<LocationForUI>[] = [
    {
      id: "name",
      header: "Location Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
           <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="font-medium text-slate-900">{row.original.name}</div>
            <div className="text-xs text-slate-500">
              {row.original.location_code || "—"}
            </div>
          </div>
        </div>
      ),
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "location_type_name",
      header: "Type",
      cell: ({ row }) => (
        <span className="text-slate-600">
          {row.original.location_type_name || "—"}
        </span>
      ),
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "city_name",
      header: "City",
      cell: ({ row }) => (
        <span className="text-slate-600">
          {row.original.city_name || "—"}
        </span>
      ),
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "country_name",
      header: "Country",
      cell: ({ row }) => (
        <span className="text-slate-600">
          {row.original.country_name || "—"}
        </span>
      ),
      meta: { headerClassName: "text-left pl-2" },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.active === true ? "active" : "inactive"} />,
      meta: { headerClassName: "text-left" },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const location = row.original;
        return (
          <div className="flex justify-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-40 p-2 bg-white flex flex-col gap-1"
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full justify-start gap-2 text-sm"
                  onClick={(event) => handleView(location, event)}
                >
                  <Eye className="h-3 w-3" /> View
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full justify-start gap-2 text-sm"
                  onClick={(event) => handleEdit(location, event)}
                >
                  <Pencil className="h-3 w-3" /> Edit
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        );
      },
      meta: { headerClassName: "text-center" },
    },
  ];

  const handleQueryChange = (query: DataTableQuery) => {
    setTableQuery(query);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Locations</h1>
          <p className="text-sm text-gray-500">Manage company locations and addresses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="my-0" onClick={handleExport}>
            <Download size={16} className="mr-2" /> Export
          </Button>
          <Button
            variant="outline"
            className="my-0"
            // onClick={() => setIsImportOpen(true)}
          >
            <Upload size={16} className="mr-2" /> Import
          </Button>

          <Button
            variant="outline"
            onClick={handleCreate}
            className="my-0 transition-all duration-500 hover:bg-[#1E1B4B] hover:text-white"
          >
            <Plus size={18} className="mr-2" />
            Add Location
          </Button>
        </div>
      </div>

      <DataTable<LocationForUI, unknown>
        columns={columns}
        data={locations}
        totalItems={data?.meta.total || 0}
        serverSide={true}
        isLoading={isLoading}
        onQueryChange={handleQueryChange}
        emptyMessage="No locations found."
        initialPageSize={10}
        showSrColumn={true}
        className="mb-6"
      />

      {/* Location Modal */}
      <LocationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        mode={modalMode}
        locationData={getLocationDataForModal()}
        locationId={selectedLocationId}
        refetchLocations={handleRefetchLocations}
        companyId={companyId}
      />
    </div>
  );
};

export default LocationsTable;