"use client";

import React, { useState } from "react";
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
  ClockIcon,
  MoonIcon,
  SunIcon,
  CoffeeIcon,
  TimerIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";
import {
  useShiftArchetypes,
  useCreateShiftArchetype,
  useUpdateShiftArchetype,
  useDeleteShiftArchetype,
} from "./useShiftArchetypes";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import type { ShiftArchetypeRow, FrontendShiftArchetypesResponse } from "./types";
import type { UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateShiftArchetypeModal } from "./CreateShiftArchetypeModal";
import { EditShiftArchetypeModal } from "./EditShiftArchetypeModal";
import { DeleteShiftArchetypeDialog } from "./DeleteShiftArchetypeDialog";

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

const ShiftArchetypesListing: React.FC = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  const q = useDebounced(search, 400);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedShiftArchetype, setSelectedShiftArchetype] = useState<ShiftArchetypeRow | null>(null);
  const [shiftArchetypeToDelete, setShiftArchetypeToDelete] = useState<ShiftArchetypeRow | null>(null);

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  }: UseQueryResult<FrontendShiftArchetypesResponse, Error> = useShiftArchetypes(
    page,
    perPage,
    q,
    activeFilter
  );

  const createShiftArchetypeMutation = useCreateShiftArchetype();
  const updateShiftArchetypeMutation = useUpdateShiftArchetype();
  const deleteShiftArchetypeMutation = useDeleteShiftArchetype();

  // reset to page 1 when perPage or q changes
  React.useEffect(() => {
    setPage(1);
  }, [perPage, q, activeFilter]);

  const rows: ShiftArchetypeRow[] = React.useMemo(() => {
    if (!data) return [];
    return data.data.map((archetype, index) => ({
      sr: (page - 1) * perPage + index + 1, 
      id: archetype.id.toString(),
      code: archetype.code,
      name: archetype.name,
      start_time: archetype.start_time,
      end_time: archetype.end_time,
      break_min: archetype.break_min,
      night_shift: archetype.night_shift,
      ot_rule_json: archetype.ot_rule_json,
      active: archetype.active,
      created_at: archetype.created_at,
      updated_at: archetype.updated_at,
    }));
  }, [data, page, perPage]);

  // Handle create shift archetype
  const handleCreateSubmit = async (values: any) => {
    try {
      await createShiftArchetypeMutation.mutateAsync(values);
      toast.success("Shift archetype created successfully");
      setIsCreateModalOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to create shift archetype");
    }
  };

  // Handle edit shift archetype
  const handleEditSubmit = async (values: any) => {
    if (!selectedShiftArchetype) return;

    try {
      await updateShiftArchetypeMutation.mutateAsync({
        id: selectedShiftArchetype.id,
        data: values,
      });
      toast.success("Shift archetype updated successfully");
      setIsEditModalOpen(false);
      setSelectedShiftArchetype(null);
      refetch();
    } catch (error) {
      toast.error("Failed to update shift archetype");
    }
  };

  // Handle delete shift archetype
  const handleDelete = async () => {
    if (!shiftArchetypeToDelete) return;

    try {
      await deleteShiftArchetypeMutation.mutateAsync(shiftArchetypeToDelete.id);
      toast.success("Shift archetype deleted successfully");
      setIsDeleteDialogOpen(false);
      setShiftArchetypeToDelete(null);
      refetch();
    } catch (error) {
      toast.error("Failed to delete shift archetype");
    }
  };

  // Open edit modal
  const openEditModal = (archetype: ShiftArchetypeRow) => {
    setSelectedShiftArchetype(archetype);
    setIsEditModalOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (archetype: ShiftArchetypeRow) => {
    setShiftArchetypeToDelete(archetype);
    setIsDeleteDialogOpen(true);
  };

  // Calculate shift duration
  const calculateShiftDuration = (startTime: string, endTime: string, breakMin: number) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    let startInMinutes = startHour * 60 + startMin;
    let endInMinutes = endHour * 60 + endMin;
    
    // Handle overnight shifts
    if (endInMinutes < startInMinutes) {
      endInMinutes += 24 * 60;
    }
    
    const totalMinutes = endInMinutes - startInMinutes - breakMin;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return { hours, minutes, totalMinutes };
  };

  // Format time for display
  const formatTimeForDisplay = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Define columns
  const columns: ColumnDef<ShiftArchetypeRow>[] = React.useMemo(
    () => [
      {
        accessorKey: "sr",
        header: "Sr. No.",
        cell: ({ row }) => (
          <div className="font-medium text-gray-900">{row.original.sr}</div>
        ),
      },
      {
        accessorKey: "code",
        header: "Code",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-blue-500" />
            <div>
              <div className="font-bold text-gray-900">{row.original.code}</div>
              <div className="text-xs text-gray-500">ID: {row.original.id}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: "Shift Name",
        cell: ({ row }) => (
          <div className="font-medium text-gray-900">{row.original.name}</div>
        ),
      },
      {
        accessorKey: "timing",
        header: "Timing",
        cell: ({ row }) => {
          const duration = calculateShiftDuration(
            row.original.start_time,
            row.original.end_time,
            row.original.break_min
          );
          
          return (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <SunIcon className="h-3 w-3 text-yellow-500" />
                <span>Start: {formatTimeForDisplay(row.original.start_time)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MoonIcon className="h-3 w-3 text-indigo-500" />
                <span>End: {formatTimeForDisplay(row.original.end_time)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <CoffeeIcon className="h-3 w-3" />
                <span>Break: {row.original.break_min} mins</span>
                <span>•</span>
                <span>Duration: {duration.hours}h {duration.minutes}m</span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "night_shift",
        header: "Shift Type",
        cell: ({ row }) => (
          <Badge
            variant={row.original.night_shift ? "default" : "outline"}
            className={
              row.original.night_shift
                ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-indigo-200"
                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200"
            }
          >
            {row.original.night_shift ? (
              <span className="flex items-center gap-1">
                <MoonIcon className="h-3 w-3" />
                Night Shift
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <SunIcon className="h-3 w-3" />
                Day Shift
              </span>
            )}
          </Badge>
        ),
      },
      {
        accessorKey: "ot_rules",
        header: "OT Rules",
        cell: ({ row }) => (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <TimerIcon className="h-3 w-3 text-green-500" />
              <span>After: {row.original.ot_rule_json.ot_after_min} mins</span>
            </div>
            <div className="text-xs text-gray-600">
              Multiplier: {row.original.ot_rule_json.multiplier}x
            </div>
          </div>
        ),
      },
      {
        accessorKey: "active",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            variant={row.original.active ? "default" : "secondary"}
            className={
              row.original.active
                ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                : "bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
            }
          >
            {row.original.active ? (
              <span className="flex items-center gap-1">
                <CheckCircleIcon className="h-3 w-3" />
                Active
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <XCircleIcon className="h-3 w-3" />
                Inactive
              </span>
            )}
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

  // Calculate total entries and page count
  const totalEntries = data?.meta?.total || 0;
  const totalPages = data?.meta?.last_page || 1;
  const currentPage = data?.meta?.current_page || 1;
  const showingFrom = totalEntries > 0 ? (currentPage - 1) * perPage + 1 : 0;
  const showingTo = totalEntries > 0 ? Math.min(currentPage * perPage, totalEntries) : 0;

  return (
    <div className="p-6">
      {/* Modals and Dialogs */}
      <CreateShiftArchetypeModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateSubmit}
        isLoading={createShiftArchetypeMutation.isPending}
      />

      <EditShiftArchetypeModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={handleEditSubmit}
        isLoading={updateShiftArchetypeMutation.isPending}
        shiftArchetype={selectedShiftArchetype}
      />

      <DeleteShiftArchetypeDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        archetypeInfo={`${shiftArchetypeToDelete?.code} - ${shiftArchetypeToDelete?.name}`}
        isLoading={deleteShiftArchetypeMutation.isPending}
      />

      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <ClockIcon className="h-6 w-6 text-[#1E1B4B]" />
                Shift Archetypes Catalog
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {totalEntries.toLocaleString()} shift patterns • Configure work schedules and overtime rules
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-[#1E1B4B] hover:bg-[#2A2675] gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add Shift Archetype
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
                placeholder="Search by code, name, or timing..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-gray-300 focus:border-[#1E1B4B] focus:ring-[#1E1B4B]"
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

          {/* Status Filter */}
         

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
                <span className="text-gray-600">shift archetypes</span>
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
                          <p className="text-gray-600">Loading shift archetypes...</p>
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
                          <p className="font-medium">No shift archetypes found</p>
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

export default ShiftArchetypesListing;