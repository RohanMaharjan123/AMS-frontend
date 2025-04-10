// /components/ui/data-table.tsx
"use client";

import React, { useState } from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getFilteredRowModel,
    ColumnFiltersState,
    VisibilityState,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    enableFiltering?: boolean;
    filterColumnId?: string;
    filterPlaceholder?: string;
    enablePagination?: boolean;
    enableColumnVisibility?: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    enableFiltering = false,
    filterColumnId,
    filterPlaceholder = "Filter...",
    enablePagination = false,
    enableColumnVisibility = false,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
        getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
        onColumnFiltersChange: enableFiltering ? setColumnFilters : undefined,
        onColumnVisibilityChange: enableColumnVisibility ? setColumnVisibility : undefined,
        state: {
            columnFilters: enableFiltering ? columnFilters : undefined,
            columnVisibility: enableColumnVisibility ? columnVisibility : undefined,
        },
    });

    return (
        <div className="space-y-4">
            {/* Filters & Column Visibility */}
            {(enableFiltering || enableColumnVisibility) && (
                <div className="flex items-center justify-between">
                    {enableFiltering && filterColumnId && (
                        <div className="flex items-center">
                            <Input
                                placeholder={filterPlaceholder}
                                value={(table.getColumn(filterColumnId)?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn(filterColumnId)?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                            />
                        </div>
                    )}
                    {enableColumnVisibility && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    <SlidersHorizontal className="mr-2 h-4 w-4" />
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
                    )}
                </div>
            )}

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {enablePagination && (
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}