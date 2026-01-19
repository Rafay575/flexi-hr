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
  FileIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";
import {
  useDocumentTypes,
  useCreateDocumentType,
  useUpdateDocumentType,
  useDeleteDocumentType,
} from "./useDocumentTypes";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { CreateDocumentTypeModal } from "./CreateDocumentTypeModal";
import { EditDocumentTypeModal } from "./EditDocumentTypeModal";
import { DeleteDocumentTypeDialog } from "./DeleteDocumentTypeDialog";

const DEFAULT_PER_PAGE = 10;

function useDebounced<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// Types based on your API response
interface DocumentTypeFromAPI {
  id: number;
  code: string;
  label: string;
  active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface DocumentTypeResponse {
  data: DocumentTypeFromAPI[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

interface DocumentTypeRow {
  sr: number;
  id: string;
  code: string;
  label: string;
  active: boolean;
  created_at: string;
}
 interface editDocumentType {
  id: string;
  code: string;
  label: string;
  active: boolean;
  // You can add other fields if needed (createdAt, updatedAt, etc.)
}
const DocumentTypeListing: React.FC = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [search, setSearch] = useState("");
  const q = useDebounced(search, 400);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<editDocumentType | null>(null);
  const [documentTypeToDelete, setDocumentTypeToDelete] = useState<DocumentTypeFromAPI | null>(null);

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useDocumentTypes(
    page,
    perPage,
    q
  );

  const createDocumentTypeMutation = useCreateDocumentType();
  const updateDocumentTypeMutation = useUpdateDocumentType();
  const deleteDocumentTypeMutation = useDeleteDocumentType();

  React.useEffect(() => {
    setPage(1);
  }, [perPage, q]);

  const rows: DocumentTypeRow[] = React.useMemo(() => {
    if (!data) return [];
    return data.data.map((docType, index) => ({
      sr: (page - 1) * perPage + index + 1,
      id: docType.id.toString(),
      code: docType.code,
      label: docType.label,
      active: docType.active,
      created_at: docType.created_at,
    }));
  }, [data, page, perPage]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleCreateSubmit = async (values: any) => {
    try {
      await createDocumentTypeMutation.mutateAsync(values);
      toast.success("Document type created successfully");
      setIsCreateModalOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to create document type");
    }
  };

  const handleEditSubmit = async (values: any) => {
    if (!selectedDocumentType) return;

    try {
      await updateDocumentTypeMutation.mutateAsync({
        id: selectedDocumentType.id.toString(),
        data: values,
      });
      toast.success("Document type updated successfully");
      setIsEditModalOpen(false);
      setSelectedDocumentType(null);
      refetch();
    } catch (error) {
      toast.error("Failed to update document type");
    }
  };

  const handleDelete = async () => {
    if (!documentTypeToDelete) return;

    try {
      await deleteDocumentTypeMutation.mutateAsync(documentTypeToDelete.id.toString());
      toast.success("Document type deleted successfully");
      setIsDeleteDialogOpen(false);
      setDocumentTypeToDelete(null);
      refetch();
    } catch (error) {
      toast.error("Failed to delete document type");
    }
  };

  const openEditModal = (docType: editDocumentType) => {
    setSelectedDocumentType(docType);
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (docType: DocumentTypeFromAPI) => {
    setDocumentTypeToDelete(docType);
    setIsDeleteDialogOpen(true);
  };

  const columns: ColumnDef<DocumentTypeRow>[] = React.useMemo(
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
        header: "Document Code",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <FileIcon className="h-4 w-4 text-blue-500" />
            <div className="font-semibold text-gray-900 font-mono">{row.original.code}</div>
          </div>
        ),
      },
      {
        accessorKey: "label",
        header: "Document Label",
        cell: ({ row }) => (
          <div className="text-gray-900">{row.original.label}</div>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Created Date",
        cell: ({ row }) => (
          <div className="text-sm text-gray-600">
            {formatDate(row.original.created_at)}
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
              onClick={() => openEditModal(row.original as any)}
              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-900"
            >
              <Edit2Icon className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openDeleteDialog(row.original as any)}
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

  const totalEntries = data?.meta?.total || 0;
  const totalPages = data?.meta?.last_page || 1;
  const currentPage = data?.meta?.current_page || 1;
  const showingFrom = totalEntries > 0 ? (currentPage - 1) * perPage + 1 : 0;
  const showingTo =
    totalEntries > 0 ? Math.min(currentPage * perPage, totalEntries) : 0;

  return (
    <div className="p-6">
      <CreateDocumentTypeModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateSubmit}
        isLoading={createDocumentTypeMutation.isPending}
      />

      <EditDocumentTypeModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={handleEditSubmit}
        isLoading={updateDocumentTypeMutation.isPending}
        documentType={selectedDocumentType}
      />

      <DeleteDocumentTypeDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        documentInfo={`${documentTypeToDelete?.code} - ${documentTypeToDelete?.label}`}
        isLoading={deleteDocumentTypeMutation.isPending}
      />

      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileIcon className="h-6 w-6 text-[#1E1B4B]" />
                Document Types Catalog
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {totalEntries.toLocaleString()} document types • Configure employee document requirements
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-[#1E1B4B] hover:bg-[#2A2675] gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add Document Type
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
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search document types by code or label..."
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
                <span className="text-gray-600">document types</span>
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
                      <td colSpan={columns.length} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-[#1E1B4B] mb-2" />
                          <p className="text-gray-600">Loading document types...</p>
                        </div>
                      </td>
                    </tr>
                  ) : isError ? (
                    <tr>
                      <td colSpan={columns.length} className="py-12 text-center">
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
                      <td colSpan={columns.length} className="py-12 text-center">
                        <div className="text-gray-500">
                          <p className="font-medium">No document types found</p>
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

export default DocumentTypeListing;