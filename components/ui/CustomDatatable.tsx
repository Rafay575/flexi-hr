"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Loader from "../common/Loader";
import StateEmpty from "../common/StateEmpty";

export type DataTableQuery = {
  pageIndex: number; // 0-based
  pageSize: number;
  search: string;
};

export type DataTableProps<TData, TValue> = {
  /** TanStack column definitions (you customize render per column) */
  columns: ColumnDef<TData, TValue>[];

  /** Data to render (entire dataset in client mode, current page in server mode) */
  data: TData[];

  /** Total items count (required for server mode, optional for client) */
  totalItems?: number;

  /** If true, pagination & search are assumed to be handled by API */
  serverSide?: boolean;

  /** Called whenever page/search/per-page changes (for API fetch) */
  onQueryChange?: (query: DataTableQuery) => void;

  /** Optional custom filters (chips, selects, date range etc.) */
  filtersSlot?: React.ReactNode;

  /** Loading state for remote fetches */
  isLoading?: boolean;

  /** Custom message when table is empty */
  emptyMessage?: string;

  /** Initial page size */
  initialPageSize?: number;

  /** Extra className to style wrapper */
  className?: string;

  /** Show Sr # column as first column */
  showSrColumn?: boolean;
};

/** Small debounce hook so we don't spam the API on every keystroke */
function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

// Motion wrapper for rows
const MotionTableRow = motion(TableRow as any);

export function DataTable<TData, TValue>({
  columns,
  data,
  totalItems,
  serverSide = false,
  onQueryChange,
  filtersSlot,
  isLoading,
  emptyMessage = "No records found.",
  initialPageSize = 10,
  className,
  showSrColumn = true,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const [globalFilter, setGlobalFilter] = React.useState("");
  const debouncedSearch = useDebouncedValue(globalFilter, 500);

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      globalFilter,
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    // Client-side: filter + pagination handled in-memory
    ...(serverSide
      ? {}
      : {
          getFilteredRowModel: getFilteredRowModel(),
          getPaginationRowModel: getPaginationRowModel(),
        }),
    manualPagination: serverSide,
    pageCount:
      serverSide && typeof totalItems === "number"
        ? Math.max(1, Math.ceil(totalItems / pagination.pageSize))
        : undefined,
  });

  // === Notify parent in server mode whenever query changes ===
  React.useEffect(() => {
    if (!serverSide || !onQueryChange) return;

    onQueryChange({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      search: debouncedSearch,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverSide, pagination.pageIndex, pagination.pageSize, debouncedSearch]);

  // Derived values for footer text & pagination
  const pageCount = serverSide
    ? typeof totalItems === "number"
      ? Math.max(1, Math.ceil(totalItems / pagination.pageSize))
      : 1
    : table.getPageCount();

  const total =
    typeof totalItems === "number"
      ? totalItems
      : serverSide
      ? data.length
      : table.getFilteredRowModel().rows.length;

  const pageIndex = pagination.pageIndex;
  const pageSize = pagination.pageSize;

// Calculate start and end with boundary checks
let start = total === 0 ? 0 : pageIndex * pageSize + 1;
let end = total === 0 ? 0 : Math.min(total, (pageIndex + 1) * pageSize);

// Fix: If start > end, it means we're on a page that doesn't exist
// This happens when filtered results have fewer items
if (start > end && total > 0) {
  // Reset to first page
  start = 1;
  end = Math.min(total, pageSize);
}
// Adjust pageIndex if it's beyond available pages
let adjustedPageIndex = pageIndex;
if (total > 0 && pageIndex >= Math.ceil(total / pageSize)) {
  adjustedPageIndex = Math.max(0, Math.ceil(total / pageSize) - 1);
  
  // Update the table's pagination state
  if (adjustedPageIndex !== pageIndex) {
    setTimeout(() => {
      table.setPageIndex(adjustedPageIndex);
    }, 0);
  }
}
  const rowOffset = pageIndex * pageSize; // used for Sr #
  const currentRows = serverSide
    ? table.getCoreRowModel().rows
    : table.getRowModel().rows;

  // For page number buttons (max 5 visible)
  const getPageNumbers = React.useCallback(() => {
    const maxButtons = 5;
    const pages: number[] = [];

    if (pageCount <= maxButtons) {
      for (let i = 0; i < pageCount; i++) pages.push(i);
      return pages;
    }

    let startPage = Math.max(0, pageIndex - 2);
    let endPage = Math.min(pageCount - 1, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(0, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }, [pageIndex, pageCount]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={cn(
        "flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm",
        className
      )}
    >
      {/* TOP BAR: Search + Filters + PerPage */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
          <Input
            placeholder="Search..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Right side: custom filters & per-page */}
        <div className="flex flex-wrap items-center gap-3">
          {filtersSlot && (
            <div className="flex flex-wrap items-center gap-2">
              {filtersSlot}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Per page</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) =>
                setPagination((prev) => ({
                  ...prev,
                  pageSize: Number(value),
                  pageIndex: 0, // reset to first page
                }))
              }
            >
              <SelectTrigger className="h-8 w-[90px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {[10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-lg border bg-background">
        <Table>
          <TableHeader className="bg-muted/60">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-muted/60">
                {showSrColumn && (
                  <TableHead className="w-16 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Sr
                  </TableHead>
                )}

                {headerGroup.headers.map((header) => {
                  const meta = (header.column.columnDef.meta as any) || {};

                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                        // default center, but you can override per column via meta.headerClassName
                        meta.headerClassName ?? "text-center"
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (showSrColumn ? 1 : 0)}
                  className="h-24 text-sm text-muted-foreground"
                >
                  <div className="flex items-center gap-2">
                    <Loader />
                  </div>
                </TableCell>
              </TableRow>
            ) : currentRows.length ? (
              <AnimatePresence initial={false}>
                {currentRows.map((row) => (
                  <MotionTableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/40"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    layout
                  >
                    {/* Sr # column */}
                    {showSrColumn && (
                      <TableCell className="w-16 text-center text-sm font-medium">
                        {rowOffset + row.index + 1}
                      </TableCell>
                    )}

                    {/* Actual data cells */}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="align-middle text-sm">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </MotionTableRow>
                ))}
              </AnimatePresence>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (showSrColumn ? 1 : 0)}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  <StateEmpty />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* FOOTER: Entries info + Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="text-muted-foreground">
          {total > 0 ? (
            <>
              Showing <span className="font-medium">{start}</span> to{" "}
              <span className="font-medium">{end}</span> of{" "}
              <span className="font-medium">{total}</span> entries
            </>
          ) : (
            <>No entries to display</>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            disabled={pageIndex === 0 || pageCount <= 1}
            onClick={() => table.setPageIndex(pageIndex - 1)}
          >
            ‹
          </Button>

          {getPageNumbers().map((page) => (
            <Button
              key={page}
              variant={page === pageIndex ? "default" : "outline"}
              size="icon"
              className={cn(
                "min-w-[36px]",
                page === pageIndex && "font-semibold"
              )}
              onClick={() => table.setPageIndex(page)}
            >
              {page + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            disabled={pageIndex >= pageCount - 1 || pageCount <= 1}
            onClick={() => table.setPageIndex(pageIndex + 1)}
          >
            ›
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
