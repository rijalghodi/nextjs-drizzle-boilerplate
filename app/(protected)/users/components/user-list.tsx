"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Download, Edit, Plus, Trash2 } from "lucide-react";
import { User, UserRole } from "@/types/user.type";
import { formatDate, getInitials } from "@/lib/helpers";
import { useUsers } from "@/hooks/users/use-users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTable } from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { DataGridBulkActions } from "@/components/ui/data-grid-bulk-actions";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from "@/components/ui/data-grid-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SearchInput } from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { ExcelIcon } from "@/components/logos/excel";
import { PdfIcon } from "@/components/logos/pdf";
import { RoleSelect } from "@/app/components/role-select";
import { getUserRoleProps } from "@/app/constants/roles";

const UserList = ({
  onEdit,
  onDelete,
  onBulkDelete,
  onRowClick,
  onAddUser,
  canAdd,
  canEdit,
  canDelete,
}: {
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onBulkDelete?: (users: User[]) => void;
  onRowClick?: (user: User) => void;
  onAddUser?: () => void;
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [exportingType, setExportingType] = useState<"excel" | "pdf" | null>(null);

  // Users query
  const { data, isLoading } = useUsers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: searchQuery,
    sort: sorting[0]?.id,
    dir: sorting[0]?.desc ? "desc" : "asc",
    role: selectedRole,
    // Add other filters as needed
  });

  const handleRoleSelection = (roleId: string | null) => {
    setSelectedRole(roleId);
    setPagination({ ...pagination, pageIndex: 0 });
  };

  const handleRowClick = (row: User) => {
    onRowClick?.(row);
  };

  const columns = useMemo<ColumnDef<User>[]>(() => {
    const baseCols: ColumnDef<User>[] = [
      {
        id: "select",
        accessorKey: "id",
        accessorFn: (row) => row.id,
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 50,
        meta: {
          cellClassName: "",
        },
      },
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => (
          <DataGridColumnHeader title="Nama" visibility={true} column={column} />
        ),
        cell: ({ row }) => {
          const user = row.original;
          const avatarUrl = user.avatarFile?.url || null;
          const initials = getInitials(user.name || user.email);

          return (
            <div className="flex items-center gap-3">
              <Avatar className="size-8">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={user.name || ""} />}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-px">
                <div className="font-medium text-sm">{user.name}</div>
                <div className="text-muted-foreground text-xs">{user.email}</div>
              </div>
            </div>
          );
        },
        size: 300,
        meta: {
          headerTitle: "Nama",
          skeleton: (
            <div className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ),
        },
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: "role",
        id: "role",
        header: ({ column }) => (
          <DataGridColumnHeader title="Peran" visibility={true} column={column} />
        ),
        cell: ({ row }) => {
          const roleProps = getUserRoleProps(row.original.role as UserRole);
          const variant = roleProps.variant as keyof BadgeProps["variant"];

          return (
            <div className="inline-flex gap-2.5">
              <Badge variant={variant} appearance="outline" shape="circle">
                {roleProps.label}
              </Badge>
            </div>
          );
        },
        size: 125,
        meta: {
          headerTitle: "Peran",
          skeleton: <Skeleton className="w-14 h-7" />,
        },
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: "createdAt",
        id: "createdAt",
        header: ({ column }) => (
          <DataGridColumnHeader title="Dibuat pada" visibility={true} column={column} />
        ),
        cell: (info) => formatDate(new Date(info.getValue() as string)),
        size: 150,
        meta: {
          headerTitle: "Dibuat pada",
          skeleton: <Skeleton className="w-20 h-7" />,
        },
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: "updatedAt",
        id: "updatedAt",
        header: ({ column }) => (
          <DataGridColumnHeader title="Diperbarui pada" visibility={true} column={column} />
        ),
        cell: (info) => formatDate(new Date(info.getValue() as string)),
        size: 150,
        meta: {
          headerTitle: "Diperbarui pada",
          skeleton: <Skeleton className="w-20 h-7" />,
        },
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: "actions",
        header: "",
        cell: ({ row }) => (
          <div>
            <div className="flex items-center gap-1 justify-end">
              {canEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(row.original);
                  }}
                  title="Edit"
                >
                  <Edit className="size-4" />
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="destructive"
                  appearance="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(row.original);
                  }}
                  title="Delete"
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
          </div>
        ),
        meta: {
          skeleton: <Skeleton className="size-4" />,
        },
        size: 40,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
      },
    ];

    let visibleCols = baseCols;
    if (!canDelete) {
      visibleCols = visibleCols.filter((col) => col.id !== "select");
    }
    if (!canEdit && !canDelete) {
      visibleCols = visibleCols.filter((col) => col.id !== "actions");
    }
    return visibleCols;
  }, [onEdit, onDelete, canDelete, canEdit]);

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string)
  );

  const table = useReactTable({
    columns,
    data: data?.data || [],
    pageCount: Math.ceil((data?.pagination.total || 0) / pagination.pageSize),
    getRowId: (row: User) => row.id,
    state: {
      pagination,
      sorting,
      columnOrder,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    columnResizeMode: "onChange",
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedUsers = selectedRows.map((r) => r.original);

  // Hoisted to outer scope to prevent SearchInput from remounting on every render
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value || "");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  return (
    <>
      <DataGrid
        table={table}
        recordCount={data?.pagination.total || 0}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        tableLayout={{
          columnsResizable: false,
          columnsPinnable: false,
          columnsMovable: false,
          columnsVisibility: true,
          rowsSelectable: !!canDelete,
        }}
        tableClassNames={{
          edgeCell: "px-5",
        }}
        bulkActions={
          !canDelete
            ? undefined
            : (selected) => (
                <Button variant="destructive" size="sm" onClick={() => onBulkDelete?.(selected)}>
                  <Trash2 className="size-4" />
                  Delete selected
                </Button>
              )
        }
      >
        <Card>
          <CardHeader className="flex-col flex-wrap sm:flex-row items-stretch sm:items-center py-5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <SearchInput
                onSearch={handleSearch}
                placeholder="Cari pengguna"
                className="w-full sm:w-40 md:w-64"
              />
              <RoleSelect
                value={selectedRole}
                onChange={handleRoleSelection}
                placeholder="Filter peran"
                className="w-56"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              {/* <DataGridColumnVisibility
                table={table}
                trigger={
                  <Button variant="outline" shape="circle">
                    <Settings2 />
                    Kolom
                  </Button>
                }
              /> */}
              {canAdd && (
                <Button disabled={isLoading} onClick={() => onAddUser?.()} shape="circle">
                  <Plus />
                  Tambah Pengguna
                </Button>
              )}
            </div>
          </CardHeader>
          <CardTable>
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardTable>
          <CardFooter>
            <DataGridPagination />
          </CardFooter>
        </Card>
        {canDelete && <DataGridBulkActions />}
      </DataGrid>
    </>
  );
};

export default UserList;
