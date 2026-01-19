import React, { useState, useMemo } from "react";
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
  TrendingUpIcon,
  TrendingDownIcon,
  RefreshCwIcon,
  CalendarIcon,
} from "lucide-react";
import {
  useFxRates,
  useCreateFxRate,
  useUpdateFxRate,
  useDeleteFxRate,
} from "./useFxRates";
import { useCurrenciesAll } from "../currencies/useCurrencies";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { CreateFxRateModal } from "./CreateFxRateModal";
import { EditFxRateModal } from "./EditFxRateModal";
import { DeleteFxRateDialog } from "./DeleteFxRateDialog";

// Debounce hook
function useDebounced<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const FxRateListing: React.FC = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const q = useDebounced(search, 400);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFxRate, setSelectedFxRate] = useState<any>(null);
  const [fxRateToDelete, setFxRateToDelete] = useState<any>(null);

  // Fetch FX rates
  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useFxRates(page, perPage, q);

  // Fetch currencies for dropdowns
  const { data: currenciesData } = useCurrenciesAll();

  const createFxRateMutation = useCreateFxRate();
  const updateFxRateMutation = useUpdateFxRate();
  const deleteFxRateMutation = useDeleteFxRate();

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [perPage, q]);

  // Map rows
  const rows = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((fxRate, index) => ({
      sr: (page - 1) * perPage + index + 1,
      id: fxRate.id,
      base_currency_id: fxRate.base_currency_id,
      quote_currency_id: fxRate.quote_currency_id,
      rate: fxRate.rate,
      rate_date: fxRate.rate_date,
      base_currency: fxRate.base_currency,
      quote_currency: fxRate.quote_currency,
      created_at: fxRate.created_at,
      updated_at: fxRate.updated_at,
    }));
  }, [data, page, perPage]);

  // Get currency symbol by id
  const getCurrencyById = (id: number) => {
    if (!currenciesData) return null;
    return currenciesData.find((currency: any) => currency.id === id);
  };

  // Calculate rate change (if we had historical data)
  const calculateRateChange = (rate: string) => {
    // This is a placeholder - in real app, compare with previous rate
    const numRate = parseFloat(rate);
    return numRate > 275 ? "up" : "down";
  };

  // Handle create FX rate
  const handleCreateSubmit = async (values: any) => {
    try {
      await createFxRateMutation.mutateAsync(values);
      toast.success("FX Rate created successfully");
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error("Failed to create FX rate");
    }
  };

  // Handle edit FX rate
  const handleEditSubmit = async (values: any) => {
    if (!selectedFxRate) return;

    try {
      await updateFxRateMutation.mutateAsync({
        id: selectedFxRate.id.toString(),
        data: values,
      });
      toast.success("FX Rate updated successfully");
      setIsEditModalOpen(false);
      setSelectedFxRate(null);
    } catch (error) {
      toast.error("Failed to update FX rate");
    }
  };

  // Handle delete FX rate
  const handleDelete = async () => {
    if (!fxRateToDelete) return;

    try {
      await deleteFxRateMutation.mutateAsync(fxRateToDelete.id.toString());
      toast.success("FX Rate deleted successfully");
      setIsDeleteDialogOpen(false);
      setFxRateToDelete(null);
    } catch (error) {
      toast.error("Failed to delete FX rate");
    }
  };

  // Open edit modal
  const openEditModal = (fxRate: any) => {
    setSelectedFxRate(fxRate);
    setIsEditModalOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (fxRate: any) => {
    setFxRateToDelete(fxRate);
    setIsDeleteDialogOpen(true);
  };

  // Define columns for FX Rates
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
        accessorKey: "currency_pair",
        header: "Currency Pair",
        cell: ({ row }) => {
          const baseCurrency = row.original.base_currency;
          const quoteCurrency = row.original.quote_currency;
          return (
            <div className="flex items-center gap-2">
              <div className="font-semibold text-gray-900">
                {baseCurrency?.iso_code}/{quoteCurrency?.iso_code}
              </div>
              <Badge variant="outline" className="border-blue-200 text-blue-700">
                {baseCurrency?.iso_code} → {quoteCurrency?.iso_code}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: "rate",
        header: "Exchange Rate",
        cell: ({ row }) => {
          const rate = parseFloat(row.original.rate);
          const change = calculateRateChange(row.original.rate);
          return (
            <div className="flex items-center gap-2">
              <div className="font-bold text-gray-900 text-lg">
                {rate.toFixed(2)}
              </div>
              <div className={`flex items-center ${change === "up" ? "text-green-600" : "text-red-600"}`}>
                {change === "up" ? (
                  <TrendingUpIcon className="h-4 w-4" />
                ) : (
                  <TrendingDownIcon className="h-4 w-4" />
                )}
                <span className="text-sm ml-1">
                  {change === "up" ? "↑" : "↓"}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "rate_date",
        header: "Rate Date",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-400" />
            <div className="font-medium text-gray-900">
              {new Date(row.original.rate_date).toLocaleDateString()}
            </div>
            <Badge 
              variant="outline" 
              className={
                new Date(row.original.rate_date).toDateString() === new Date().toDateString()
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-gray-50 text-gray-600 border-gray-200"
              }
            >
              {new Date(row.original.rate_date).toDateString() === new Date().toDateString()
                ? "Today"
                : "Historical"}
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: "inverse_rate",
        header: "Inverse Rate",
        cell: ({ row }) => {
          const rate = parseFloat(row.original.rate);
          const inverseRate = rate !== 0 ? (1 / rate).toFixed(6) : "N/A";
          return (
            <div className="text-sm text-gray-600">
              1 {row.original.quote_currency?.iso_code} = {inverseRate} {row.original.base_currency?.iso_code}
            </div>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) => (
          <div className="text-sm text-gray-600">
            {new Date(row.original.created_at).toLocaleDateString()}
          </div>
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

  // Create table
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Calculate pagination
  const totalEntries = data?.meta?.total || 0;
  const totalPages = data?.meta?.last_page || 1;
  const currentPage = data?.meta?.current_page || 1;
  const showingFrom = totalEntries > 0 ? (currentPage - 1) * perPage + 1 : 0;
  const showingTo = totalEntries > 0 ? Math.min(currentPage * perPage, totalEntries) : 0;

  // Calculate some stats
  const latestRates = rows.slice(0, 3);
  const todayRates = rows.filter(rate => 
    new Date(rate.rate_date).toDateString() === new Date().toDateString()
  );

  return (
    <div className="p-6">
      {/* Modals */}
      <CreateFxRateModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateSubmit}
        isLoading={createFxRateMutation.isPending}
        currencies={currenciesData || []}
      />
      <EditFxRateModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={handleEditSubmit}
        isLoading={updateFxRateMutation.isPending}
        fxRate={selectedFxRate}
        currencies={currenciesData || []}
      />
      <DeleteFxRateDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        fxRateName={`${fxRateToDelete?.base_currency?.iso_code}/${fxRateToDelete?.quote_currency?.iso_code}`}
        isLoading={deleteFxRateMutation.isPending}
      />

      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUpIcon className="h-6 w-6 text-[#1E1B4B]" />
                Foreign Exchange Rates
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {totalEntries.toLocaleString()} FX rates • {todayRates.length} rates for today
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-[#1E1B4B] hover:bg-[#2A2675] gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add FX Rate
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-blue-900 hover:bg-blue-50"
              >
                <DownloadIcon className="h-4 w-4" />
                Export Rates
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Quick Stats */}
         

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by currency pair (e.g., PKR/USD)..."
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

          {/* Latest Rates Quick View */}
          

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
                <span className="text-gray-600">FX rates</span>
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
                          className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
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
                          <p className="text-gray-600">Loading FX rates...</p>
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
                          <p className="font-medium">No FX rates found</p>
                          <p className="text-sm mt-1">
                            Try adding your first exchange rate
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

export default FxRateListing;