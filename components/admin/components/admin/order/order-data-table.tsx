"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  VisibilityState,
  OnChangeFn,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // Pagination Props
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  onPaginationChange: (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => void;
  // Filtering & Search Props
  globalFilter?: string; // For the general search input
  onGlobalFilterChange: (filter: string) => void;
  filterableOptions?: {
    id: string; 
    title: string; 
    options: {
      label: string;
      value: string;
    }[];
  }[];
  onFilterChange: (columnId: string, value: string) => void;
  // Sorting Props
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  isLoading: boolean; 
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageIndex,
  pageSize,
  totalRows,
  onPaginationChange,
  globalFilter,
  onGlobalFilterChange,
  filterableOptions,
  onFilterChange,
  sorting,
  onSortingChange,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onSortingChange: onSortingChange, // Propagate sort changes up
    onColumnFiltersChange: () => {},
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting, // Controlled by prop
      columnFilters: [], // Client-side column filters are not used for server-side filtering
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize,
      },
      globalFilter: globalFilter, // Control global filter state via prop
    },
    pageCount: Math.ceil(totalRows / pageSize), // Calculate total pages based on server total
  });

  return (
    <div className="w-full">
      {/* Toolbar for filtering and column visibility */}
      <div className="flex items-center py-4 gap-2 flex-wrap">
        {/* Global Search Input */}
        <Input
          placeholder="Search all orders..."
          value={globalFilter ?? ""}
          onChange={(event) => onGlobalFilterChange(event.target.value)}
          className="max-w-sm"
        />

        {/* Filterable Options (Status, Payment Status) */}
        {filterableOptions?.map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <label className="text-sm font-medium">{option.title}:</label>

            <Select
              value={
                (table.getColumn(option.id)?.getFilterValue() as string) ||
                "all"
              }
              onValueChange={(value) =>
                onFilterChange(option.id, value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={`Select ${option.title}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {option.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {/* This part might need adjustment if row selection is not used for server-side */}
          {table.getFilteredSelectedRowModel().rows.length} of {totalRows}{" "}
          row(s) displayed.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="store"
            onClick={() =>
              onPaginationChange({ pageIndex: pageIndex - 1, pageSize })
            }
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="store"
            onClick={() =>
              onPaginationChange({ pageIndex: pageIndex + 1, pageSize })
            }
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
        {/* Page size selector */}
        <Select
          value={String(pageSize)}
          onValueChange={(value) =>
            onPaginationChange({ pageIndex: 0, pageSize: Number(value) })
          }
        >
          <SelectTrigger className="h-8 w-[100px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40, 50].map((size) => (
              <SelectItem key={size} value={String(size)}>
                Show {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
