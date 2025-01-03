"use client";

import { formatCurrency } from "@/utils/formatters";
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
	position: number;
	stopLoss: number | null;
	takeProfit: number | null;
	riskRewardRatio: number | null;
	fees: number;
	strategy: string;
	timeframe: string;
	setupQuality: 1 | 2 | 3 | 4 | 5;
	emotionalState: 1 | 2 | 3 | 4 | 5;
};

export const columns: ColumnDef<Trade>[] = [
	{
		id: "symbol",
		header: "Symbol",
		accessorKey: "symbol",
		minSize: 140,
		cell: ({ row }) => (
			<span className="font-medium text-foreground whitespace-nowrap">
				{row.getValue("symbol")}
			</span>
		),
		enableSorting: true,
	},
	{
		id: "type",
		header: "Type",
		accessorKey: "type",
		size: 140,
		minSize: 120,
		maxSize: 160,
		enableSorting: true,
		cell: ({ row }) => {
			const type = row.getValue("type") as string;
			const Icon =
				type === "long" ? Icons.ArrowUpRightIcon : Icons.ArrowDownRightIcon;
			return <div className="text-sm capitalize whitespace-nowrap">{type}</div>;
		},
	},
	{
		id: "status",
		header: "Status",
		accessorKey: "status",
		enableSorting: true,
		size: 165,
		minSize: 135,
		maxSize: 195,
		cell: ({ row }) => {
			const status = row.getValue("status") as string;

			return (
				<p className="tabular-nums tracking-wide whitespace-nowrap">{status}</p>
			);
		},
	},
	{
		accessorKey: "position",
		header: "Position Size",
		enableSorting: true,
		size: 180,
		minSize: 150,
		maxSize: 210,
		cell: ({ row }) => {
			const position = row.getValue("position") as number;
			return <span className="tabular-nums whitespace-nowrap">{position}</span>;
		},
	},
	{
		accessorKey: "entryPrice",
		enableSorting: true,
		header: "Entry",
		size: 180,
		minSize: 150,
		maxSize: 210,
		cell: ({ row }) => {
			const price = Number.parseFloat(row.getValue("entryPrice"));
			return (
				<span className="tabular-nums tracking-wide whitespace-nowrap">
					{formatCurrency(price)}
				</span>
			);
		},
	},
	{
		accessorKey: "exitPrice",
		header: "Exit",
		enableSorting: true,
		size: 180,
		minSize: 150,
		maxSize: 210,
		cell: ({ row }) => {
			const price = row.getValue("exitPrice") as number | null;
			return (
				<span className="tabular-nums tracking-wide whitespace-nowrap">
					{price ? formatCurrency(price) : "-"}
				</span>
			);
		},
	},
	{
		accessorKey: "stopLoss",
		header: "Stop Loss",
		enableSorting: true,
		size: 180,
		minSize: 150,
		maxSize: 210,
		cell: ({ row }) => {
			const sl = row.getValue("stopLoss") as number | null;
			return (
				<span className="tabular-nums tracking-wide text-destructive whitespace-nowrap">
					{sl ? formatCurrency(sl) : "-"}
				</span>
			);
		},
	},
	{
		accessorKey: "takeProfit",
		header: "Take Profit",
		enableSorting: true,
		size: 180,
		minSize: 150,
		maxSize: 210,
		cell: ({ row }) => {
			const tp = row.getValue("takeProfit") as number | null;
			return (
				<span className="tabular-nums tracking-wide text-success whitespace-nowrap">
					{tp ? formatCurrency(tp) : "-"}
				</span>
			);
		},
	},
	{
		accessorKey: "riskRewardRatio",
		header: "R:R",
		enableSorting: true,
		size: 120,
		minSize: 100,
		maxSize: 150,
		cell: ({ row }) => {
			const rr = row.getValue("riskRewardRatio") as number | null;
			return (
				<span className="tabular-nums whitespace-nowrap">
					{rr?.toFixed(2) ?? "-"}
				</span>
			);
		},
	},
	{
		accessorKey: "pnl",
		header: "P&L",
		enableSorting: true,
		size: 180,
		minSize: 150,
		maxSize: 210,
		cell: ({ row }) => {
			const pnl = row.getValue("pnl") as number | null;
			if (pnl === null) return "-";
			const formatted = formatCurrency(pnl, true);
			return (
				<span className="tabular-nums tracking-wide whitespace-nowrap">
					{formatted}
				</span>
			);
		},
	},
	{
		accessorKey: "fees",
		header: "Fees",
		enableSorting: true,
		size: 120,
		minSize: 90,
		maxSize: 150,
		cell: ({ row }) => {
			const fees = row.getValue("fees") as number;
			return (
				<span className="tabular-nums whitespace-nowrap">
					{formatCurrency(fees)}
				</span>
			);
		},
	},
	{
		accessorKey: "strategy",
		header: "Strategy",
		size: 180,
		minSize: 150,
		maxSize: 240,
		cell: ({ row }) => (
			<span className="whitespace-nowrap">{row.getValue("strategy")}</span>
		),
	},
	{
		accessorKey: "timeframe",
		header: "Timeframe",
		size: 120,
		minSize: 90,
		maxSize: 150,
		cell: ({ row }) => (
			<span className="whitespace-nowrap">{row.getValue("timeframe")}</span>
		),
	},
	{
		accessorKey: "setupQuality",
		header: "Setup",
		size: 105,
		minSize: 90,
		maxSize: 135,
		cell: ({ row }) => {
			const quality = row.getValue("setupQuality") as number;
			return <span className="whitespace-nowrap">{"⭐".repeat(quality)}</span>;
		},
	},
	{
		accessorKey: "emotionalState",
		header: "Emotion",
		size: 105,
		minSize: 90,
		maxSize: 135,
		cell: ({ row }) => {
			const state = row.getValue("emotionalState") as number;
			return <span className="whitespace-nowrap">{"🎯".repeat(state)}</span>;
		},
	},
	{
		accessorKey: "openedAt",
		header: "Opened",
		enableSorting: true,
		size: 210,
		minSize: 180,
		maxSize: 240,
		cell: ({ row }) => {
			return (
				<span className="tabular-nums whitespace-nowrap">
					{format(new Date(row.getValue("openedAt")), "MMM d, h:mm a")}
				</span>
			);
		},
	},
	{
		accessorKey: "closedAt",
		header: "Closed",
		enableSorting: true,
		size: 210,
		minSize: 180,
		maxSize: 240,
		cell: ({ row }) => {
			const closedAt = row.getValue("closedAt") as string | null;
			return (
				<span className="tabular-nums whitespace-nowrap">
					{closedAt ? format(new Date(closedAt), "MMM d, h:mm a") : "-"}
				</span>
			);
		},
	},
	{
		accessorKey: "notes",
		header: "Notes",
		size: 375,
		minSize: 225,
		maxSize: 600,
		cell: ({ row }) => (
			<span className="whitespace-nowrap">{row.getValue("notes")}</span>
		),
	},
];
