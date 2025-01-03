"use client";

import { formatCurrency } from "@/utils/formatters";
import { cn } from "@polaris/ui/cn";
import { Icons } from "@polaris/ui/icons";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type Trade = {
	id: string;
	symbol: string;
	type: "long" | "short";
	status: "open" | "won" | "lost" | "breakeven";
	entryPrice: number;
	exitPrice: number | null;
	pnl: number | null;
	openedAt: string;
	closedAt: string | null;
	notes: string;
};

export const columns: ColumnDef<Trade>[] = [
	{
		id: "symbol",
		header: "Symbol",
		accessorKey: "symbol",
		size: 100,
		cell: ({ row }) => (
			<span className="font-medium">{row.getValue("symbol")}</span>
		),
		enableSorting: true,
	},
	{
		id: "type",
		header: "Type",
		accessorKey: "type",
		size: 80,
		enableSorting: true,
		cell: ({ row }) => {
			const type = row.getValue("type") as string;
			const Icon =
				type === "long" ? Icons.ArrowUpRightIcon : Icons.ArrowDownRightIcon;
			return (
				<div className="flex items-center gap-2">
					<div
						className={cn(
							"flex items-center justify-center rounded-sm h-[18px] w-[18px]",
							type === "long" && "bg-[#E3F3FE]",
							type === "short" && "bg-[#EFE3FB]",
						)}
					>
						<Icon
							className={cn(
								"size-2.5",
								type === "long" && "text-[#517EC9]",
								type === "short" && "text-[#6E4CC5]",
							)}
							strokeWidth={3}
						/>
					</div>
					<span className="text-sm capitalize">{type}</span>
				</div>
			);
		},
	},
	{
		id: "status",
		header: "Status",
		accessorKey: "status",
		enableSorting: true,
		size: 100,
		cell: ({ row }) => {
			const status = row.getValue("status") as string;

			return (
				<p
					className={cn(
						"text-sm capitalize",
						status === "won" && "text-success",
						status === "lost" && "text-destructive",
						status === "breakeven" && "text-muted-foreground",
					)}
				>
					{status}
				</p>
			);
		},
	},
	{
		accessorKey: "entryPrice",
		enableSorting: true,
		header: "Entry",
		size: 120,
		cell: ({ row }) => {
			const price = Number.parseFloat(row.getValue("entryPrice"));
			return (
				<span className="tabular-nums tracking-wide">
					{formatCurrency(price)}
				</span>
			);
		},
	},
	{
		accessorKey: "exitPrice",
		header: "Exit",
		enableSorting: true,
		size: 120,
		cell: ({ row }) => {
			const price = row.getValue("exitPrice") as number | null;
			return (
				<span className="tabular-nums tracking-wide">
					{price ? formatCurrency(price) : "-"}
				</span>
			);
		},
	},
	{
		accessorKey: "pnl",
		header: "P&L",
		enableSorting: true,
		size: 120,
		cell: ({ row }) => {
			const pnl = row.getValue("pnl") as number | null;
			if (pnl === null) return "-";
			const formatted = formatCurrency(pnl, true);
			return (
				<span
					className={cn(
						"tabular-nums tracking-wide",
						pnl > 0 && "text-success",
						pnl < 0 && "text-destructive",
						pnl === 0 && "text-muted-foreground",
					)}
				>
					{formatted}
				</span>
			);
		},
	},
	{
		accessorKey: "openedAt",
		header: "Opened",
		enableSorting: true,
		size: 160,
		cell: ({ row }) => {
			return (
				<span className="tabular-nums">
					{format(new Date(row.getValue("openedAt")), "MMM d, h:mm a")}
				</span>
			);
		},
	},
	{
		accessorKey: "closedAt",
		header: "Closed",
		enableSorting: true,
		size: 160,
		cell: ({ row }) => {
			return (
				<span className="tabular-nums">
					{format(new Date(row.getValue("closedAt")), "MMM d, h:mm a")}
				</span>
			);
		},
	},
	{
		accessorKey: "notes",
		header: "Notes",
		size: 200,
		cell: ({ row }) => (
			<span className="truncate">{row.getValue("notes")}</span>
		),
	},
];
