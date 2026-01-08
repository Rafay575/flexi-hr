'use client';

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DownloadIcon,
  SearchIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  PlusIcon,
  Edit2Icon,
  Trash2Icon,
} from "lucide-react";
import {
  useCities,
  useCreateCity,
  useUpdateCity,
  useDeleteCity,
  useCountries,
  useStates,
} from "./useCities";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { toast } from "sonner";
import SearchableSelect from "@/components/common/SearchableSelect";
import { CreateCityModal } from "./CreateCityModal";
import { EditCityModal } from "./EditCityModal";
import { DeleteCityDialog } from "./DeleteCityDialog";
const DEFAULT_PER_PAGE = 10;

// debounce hook
function useDebounced<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const CityListing: React.FC = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [search, setSearch] = useState("");
  const q = useDebounced(search, 400);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [cityToDelete, setCityToDelete] = useState<any>(null);
  const [countrySelected, setCountrySelected] = useState<string>("");
  const [stateSelected, setStateSelected] = useState<string>("");

  // Fetch data
  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useCities(page, perPage, q, countrySelected, stateSelected);

  const createCityMutation = useCreateCity();
  const updateCityMutation = useUpdateCity();
  const deleteCityMutation = useDeleteCity();

  // Fetch countries and states for dropdowns
  const { data: countries, isLoading: countriesLoading } = useCountries();
  const { data: states, isLoading: statesLoading } = useStates(countrySelected);

  // reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [perPage, q, countrySelected, stateSelected]);

  // Clear state filter when country changes
  useEffect(() => {
    setStateSelected("");
  }, [countrySelected]);

  const rows = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((city, index) => ({
      sr: (page - 1) * perPage + index + 1,
      id: city.id,
      name: city.name,
      country_id: city.country_id,
      state_code: city.state_code,
      state_name: city.state_name || "N/A", // Assuming API returns state_name
      country_code: city.country_code,
      state_id: city.state_id,
      latitude: city.latitude,
      longitude: city.longitude,
      is_active: city.flag === 1 || city.is_active,
    }));
  }, [data, page, perPage]);

  // Handle create city
  const handleCreateSubmit = async (values: any) => {
    try {
      await createCityMutation.mutateAsync(values);
      toast.success("City created successfully");
      setIsCreateModalOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to create city");
    }
  };

  // Handle edit city
  const handleEditSubmit = async (values: any) => {
    if (!selectedCity) return;

    try {
      await updateCityMutation.mutateAsync({
        id: selectedCity.id,
        data: values,
      });
      toast.success("City updated successfully");
      setIsEditModalOpen(false);
      setSelectedCity(null);
      refetch();
    } catch (error) {
      toast.error("Failed to update city");
    }
  };

  // Handle delete city
  const handleDelete = async () => {
    if (!cityToDelete) return;

    try {
      await deleteCityMutation.mutateAsync(cityToDelete.id);
      toast.success("City deleted successfully");
      setIsDeleteDialogOpen(false);
      setCityToDelete(null);
      refetch();
    } catch (error) {
      toast.error("Failed to delete city");
    }
  };

  // Open edit modal
  const openEditModal = (city: any) => {
    setSelectedCity(city);
    setIsEditModalOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (city: any) => {
    setCityToDelete(city);
    setIsDeleteDialogOpen(true);
  };

  // Define columns
  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: "sr",
        header: "Sr. No.",
        cell: ({ row }) => (
          <div className="font-medium text-gray-900">{row.original.sr}</div>
        ),
      },
      {
        accessorKey: "name",
        header: "City Name",
        cell: ({ row }) => (
          <div className="font-semibold text-gray-900">{row.original.name}</div>
        ),
      },
      {
        accessorKey: "state_name",
        header: "State",
        cell: ({ row }) => (
          <div className="text-gray-700">{row.original.state_name}</div>
        ),
      },
      {
        accessorKey: "country_code",
        header: "Country Code",
        cell: ({ row }) => (
          <div className="font-mono bg-gray-50 px-3 py-1 rounded-md text-sm inline-block">
            {row.original.country_code}
          </div>
        ),
      },
      {
        accessorKey: "latitude",
        header: "Latitude",
        cell: ({ row }) => (
          <div className="text-gray-700">{row.original.latitude}</div>
        ),
      },
      {
        accessorKey: "longitude",
        header: "Longitude",
        cell: ({ row }) => (
          <div className="text-gray-700">{row.original.longitude}</div>
        ),
      },
      {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            variant={row.original.is_active ? "default" : "secondary"}
            className={
              row.original.is_active
                ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                : "bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
            }
          >
            {row.original.is_active ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEditModal(row.original)}
              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-900"
            >
              <Edit2Icon className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openDeleteDialog(row.original)}
              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2Icon className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  // Create the table using useReactTable hook
  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
  });

  // Map countries and states for dropdowns
  const countryOptions = useMemo(() => {
    return Array.isArray(countries)
      ? countries.map((country) => ({
          value: country.id.toString(),
          label: country.name,
          iso2: country.iso2,
        }))
      : [];
  }, [countries]);

  const stateOptions = useMemo(() => {
    return Array.isArray(states)
      ? states.map((state) => ({
          value: state.id.toString(),
          label: state.name,
        }))
      : [];
  }, [states]);

  // Calculate total entries and page count
  const totalEntries = data?.meta?.total || 0;
  const totalPages = data?.meta?.last_page || 1;
  const currentPage = data?.meta?.current_page || 1;
  const showingFrom = totalEntries > 0 ? (currentPage - 1) * perPage + 1 : 0;
  const showingTo =
    totalEntries > 0 ? Math.min(currentPage * perPage, totalEntries) : 0;
  console.log("Cities - Showing from:", selectedCity);
  return (
    <div className="p-6">
      {/* Modals for Create, Edit, and Delete */}
      {/* Uncomment when you create these components */}
      <CreateCityModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateSubmit}
        isLoading={createCityMutation.isPending}
      />
      <EditCityModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={handleEditSubmit}
        isLoading={updateCityMutation.isPending}
        city={selectedCity}
      />
      <DeleteCityDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        cityName={cityToDelete?.name || ""}
        isLoading={deleteCityMutation.isPending}
      />

      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Cities Directory
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {totalEntries.toLocaleString()} cities registered • Server-side
                pagination & search
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-[#1E1B4B] hover:bg-[#2A2675] gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add City
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-blue-900 hover:bg-blue-50"
              >
                <DownloadIcon className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search cities by name, country code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-gray-300 focus:border-[#1E1B4B] focus:ring-[#1E1B4B]"
              />
            </div>
            
            {/* Country Filter */}
            <div className="w-full md:w-48">
              <SearchableSelect
                className="w-full"
                options={countryOptions}
                placeholder="Select Country"
                searchPlaceholder="Search Countries..."
                onChange={(value) => {
                  setCountrySelected(value);
                }}
                value={countrySelected}
                multiple={false}
                allowAll={false}
                isLoading={countriesLoading}
              />
            </div>
            
            {/* State Filter */}
            <div className="w-full md:w-48">
              <SearchableSelect
                className="w-full"
                options={stateOptions}
                placeholder="Select State"
                searchPlaceholder="Search States..."
                onChange={(value) => {
                  setStateSelected(value);
                }}
                value={stateSelected}
                multiple={false}
                allowAll={false}
                isLoading={statesLoading}
                disabled={!countrySelected}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <Select
                value={perPage.toString()}
                onValueChange={(value) => {
                  const newPerPage = Number(value);
                  setPerPage(newPerPage);
                }}
              >
                <SelectTrigger className="w-20 border-gray-300">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {[10, 25, 50, 100].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">entries</span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-600">Showing</span>
                <span className="font-semibold mx-1 text-gray-900">
                  {showingFrom.toLocaleString()}
                </span>
                <span className="text-gray-600">to</span>
                <span className="font-semibold mx-1 text-gray-900">
                  {showingTo.toLocaleString()}
                </span>
                <span className="text-gray-600">of</span>
                <span className="font-semibold mx-1 text-gray-900">
                  {totalEntries.toLocaleString()}
                </span>
                <span className="text-gray-600">entries</span>
              </div>
              {isFetching && (
                <Badge
                  variant="outline"
                  className="gap-1 border-blue-200 bg-blue-50"
                >
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Updating...
                </Badge>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div className="flex items-center gap-1">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getIsSorted() === "asc" ? (
                              <ChevronRight className="h-4 w-4" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ChevronLeft className="h-4 w-4" />
                            ) : null}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>

                <tbody className="bg-white divide-y divide-gray-100">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="py-12 text-center"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-[#1E1B4B] mb-2" />
                          <p className="text-gray-600">Loading cities...</p>
                        </div>
                      </td>
                    </tr>
                  ) : isError ? (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="py-12 text-center"
                      >
                        <div className="text-red-600">
                          <p className="font-medium">Failed to load data</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Please try again later
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="py-12 text-center"
                      >
                        <div className="text-gray-500">
                          <p className="font-medium">No cities found</p>
                          <p className="text-sm mt-1">
                            Try adjusting your search criteria
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-gray-50 transition-colors group"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="py-4 px-6 text-sm">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!isLoading && !isError && rows.length > 0 && (
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Page{" "}
                    <span className="font-semibold text-gray-900">
                      {currentPage}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-900">
                      {totalPages}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(1)}
                      disabled={currentPage === 1 || isLoading}
                      className="border-gray-300"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1 || isLoading}
                      className="border-gray-300"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center space-x-1 mx-2">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={
                                currentPage === pageNum ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setPage(pageNum)}
                              disabled={isLoading}
                              className={
                                currentPage === pageNum
                                  ? "bg-[#1E1B4B] hover:bg-[#2A2675] border-[#1E1B4B]"
                                  : "border-gray-300 hover:bg-gray-100"
                              }
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages || isLoading}
                      className="border-gray-300"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(totalPages)}
                      disabled={currentPage === totalPages || isLoading}
                      className="border-gray-300"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">
                      {showingFrom.toLocaleString()}
                    </span>
                    {" - "}
                    <span className="font-semibold text-gray-900">
                      {showingTo.toLocaleString()}
                    </span>
                    {" of "}
                    <span className="font-semibold text-gray-900">
                      {totalEntries.toLocaleString()}
                    </span>
                    {" entries"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CityListing;