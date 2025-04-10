// /app/dashboard/users/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
    id: string | number;
    name: string;
    email: string;
    role: 'artist' | 'artist_manager';
    status: 'active' | 'inactive';
    created_at: string;
}

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.getValue("role") as string;
            let color = "";

            switch (role) {
                case "artist":
                    color = "bg-blue-100 text-blue-800";
                    break;
                case "artist_manager":
                    color = "bg-purple-100 text-purple-800";
                    break;
                case "super_admin":
                    color = "bg-amber-100 text-amber-800";
                    break;
                default:
                    color = "bg-gray-100 text-gray-800";
            }

            return <Badge className={`${color}`}>{role.replace('_', ' ')}</Badge>;
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge
                    variant={status === "active" ? "default" : "outline"}
                    className={status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "created_at",
        header: "Joined",
        cell: ({ row }) => {
            const date = new Date(row.getValue("created_at"));
            return <div>{formatDistanceToNow(date, { addSuffix: true })}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(user.id.toString())}
                        >
                            Copy user ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit user</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                            {user.status === "active" ? "Deactivate user" : "Activate user"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];