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
  CalendarIcon,
  FlagIcon,
  MapPinIcon,
  FilterIcon,
  CalendarDaysIcon,
  PartyPopperIcon,
} from "lucide-react";
import {
  useHolidays,
} from "./useHolidays";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { toast } from "sonner";

// Debounce hook
function useDebounced<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const HolidayListing: React.FC = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("");
  const [countryFilter, setCountryFilter] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  const q = useDebounced(search, 400);

  // Fetch data
  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useHolidays(page, perPage, q, yearFilter, countryFilter, activeFilter);

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [perPage, q, yearFilter, countryFilter, activeFilter]);

  // Map rows
  const rows = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((holiday, index) => ({
      sr: (page - 1) * perPage + index + 1,
      id: holiday.id,
      country_id: holiday.country_id,
      state_id: holiday.state_id,
      year: holiday.year,
      name: holiday.name,
      date: holiday.date,
      is_optional: holiday.is_optional,
      active: holiday.active,
      created_at: holiday.created_at,
      updated_at: holiday.updated_at,
    }));
  }, [data, page, perPage]);

  // Get unique years from data for filter
  const availableYears = useMemo(() => {
    if (!data?.data) return [];
    const years = data.data.map(h => h.year);
    return Array.from(new Set(years)).sort((a, b) => b - a);
  }, [data]);

  // Calculate upcoming holidays
  const upcomingHolidays = useMemo(() => {
    if (!rows) return [];
    const today = new Date();
    return rows
      .filter(holiday => new Date(holiday.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, [rows]);

  // Define columns for Holidays
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
        header: "Holiday Name",
        cell: ({ row }) => (
          <div className="font-semibold text-gray-900 flex items-center gap-2">
            <PartyPopperIcon className="h-4 w-4 text-orange-500" />
            {row.original.name}
          </div>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
          const date = new Date(row.original.date);
          const today = new Date();
          const isPast = date < today;
          
          return (
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
              <div>
                <div className="font-medium">
                  {date.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="text-xs text-gray-500">
                  {date.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
              {isPast ? (
                <Badge variant="outline" className="border-gray-200 text-gray-600">
                  Past
                </Badge>
              ) : (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Upcoming
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "year",
        header: "Year",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className="border-blue-200 bg-blue-50 text-blue-700"
          >
            {row.original.year}
          </Badge>
        ),
      },
      {
        accessorKey: "country",
        header: "Location",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <FlagIcon className="h-4 w-4 text-gray-400" />
            <span className="font-medium">Country: {row.original.country_id}</span>
            {row.original.state_id && (
              <>
                <MapPinIcon className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">State: {row.original.state_id}</span>
              </>
            )}
          </div>
        ),
      },
      {
        accessorKey: "is_optional",
        header: "Type",
        cell: ({ row }) => (
          <Badge
            variant={row.original.is_optional ? "outline" : "default"}
            className={
              row.original.is_optional
                ? "border-purple-200 bg-purple-50 text-purple-700"
                : "bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
            }
          >
            {row.original.is_optional ? "Optional" : "Mandatory"}
          </Badge>
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
                : "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200"
            }
          >
            {row.original.active ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        accessorKey: "days_until",
        header: "Days Until",
        cell: ({ row }) => {
          const holidayDate = new Date(row.original.date);
          const today = new Date();
          const diffTime = holidayDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays < 0) {
            return <span className="text-gray-500">Passed</span>;
          } else if (diffDays === 0) {
            return (
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                Today
              </Badge>
            );
          } else {
            return (
              <div className="font-semibold text-gray-900">
                {diffDays} day{diffDays !== 1 ? 's' : ''}
              </div>
            );
          }
        },
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

  // Get current year for filter default
  const currentYear = new Date().getFullYear();

  return (
    <div className="p-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 text-[#1E1B4B]" />
                Holiday Calendar
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {totalEntries.toLocaleString()} holidays • Manage company holidays and observances
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-blue-900 hover:bg-blue-50"
              >
                <DownloadIcon className="h-4 w-4" />
                Export Calendar
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Total Holidays</p>
                  <p className="text-2xl font-bold text-gray-900">{totalEntries}</p>
                </div>
                <CalendarIcon className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Active Holidays</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {rows.filter(h => h.active).length}
                  </p>
                </div>
                <PartyPopperIcon className="h-8 w-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium">Mandatory</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {rows.filter(h => !h.is_optional).length}
                  </p>
                </div>
                <FlagIcon className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700 font-medium">This Year</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {rows.filter(h => h.year === currentYear).length}
                  </p>
                </div>
                <CalendarDaysIcon className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Upcoming Holidays */}
          {upcomingHolidays.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Upcoming Holidays</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {upcomingHolidays.map((holiday) => {
                  const date = new Date(holiday.date);
                  const today = new Date();
                  const diffTime = date.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={holiday.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{holiday.name}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {date.toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <Badge className={
                          diffDays === 0 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-blue-100 text-blue-800"
                        }>
                          {diffDays === 0 ? "Today" : `In ${diffDays} days`}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <Badge variant="outline" className={
                          holiday.is_optional
                            ? "border-purple-200 text-purple-700"
                            : "border-red-200 text-red-700"
                        }>
                          {holiday.is_optional ? "Optional" : "Mandatory"}
                        </Badge>
                        <Badge variant="outline" className="border-gray-200">
                          Country: {holiday.country_id}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Filters Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FilterIcon className="h-4 w-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search holidays by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 border-gray-300"
                />
              </div>

              {/* Year Filter */}
              {/* <div>
                <Select
                  value={yearFilter}
                  onValueChange={setYearFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Years</SelectItem>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

              {/* Country Filter */}
              {/* <div>
                <Select
                  value={countryFilter}
                  onValueChange={setCountryFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Countries</SelectItem>
                    <SelectItem value="70">Country ID: 70</SelectItem>
                
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select
                  value={activeFilter}
                  onValueChange={setActiveFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mt-3">
              {yearFilter && (
                <Badge variant="secondary" className="gap-1">
                  Year: {yearFilter}
                  <button onClick={() => setYearFilter("")} className="ml-1">×</button>
                </Badge>
              )}
              {countryFilter && (
                <Badge variant="secondary" className="gap-1">
                  Country: {countryFilter}
                  <button onClick={() => setCountryFilter("")} className="ml-1">×</button>
                </Badge>
              )}
              {activeFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Status: {activeFilter}
                  <button onClick={() => setActiveFilter("all")} className="ml-1">×</button>
                </Badge>
              )}
              {(yearFilter || countryFilter || activeFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setYearFilter("");
                    setCountryFilter("");
                    setActiveFilter("all");
                  }}
                  className="h-6 text-xs"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Entries per page */}
          <div className="flex items-center justify-between mb-4">
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
            
            {/* Stats Bar */}
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
              {" holidays"}
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
                          <p className="text-gray-600">Loading holidays...</p>
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
                          <PartyPopperIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="font-medium">No holidays found</p>
                          <p className="text-sm mt-1">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => {
                      const holidayDate = new Date(row.original.date);
                      const today = new Date();
                      const isToday = holidayDate.toDateString() === today.toDateString();
                      
                      return (
                        <tr
                          key={row.id}
                          className={`hover:bg-gray-50 transition-colors group ${
                            isToday ? 'bg-yellow-50 hover:bg-yellow-100' : ''
                          }`}
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
                      );
                    })
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

          {/* Calendar View Toggle (Optional) */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex rounded-lg border border-gray-200 p-1">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-md bg-gray-100 text-gray-900"
              >
                List View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-md"
                onClick={() => toast.info("Calendar view coming soon!")}
              >
                Calendar View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HolidayListing;