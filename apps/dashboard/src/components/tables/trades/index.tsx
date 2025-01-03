"use client";

import { useQueryState } from "nuqs";
import { useMemo } from "react";
import { type Trade, columns } from "./columns";
import { DataTable } from "./data-table";

const trades: Trade[] = [
	{
		id: "728ed52f",
		symbol: "AAPL",
		type: "long",
		status: "open",
		entryPrice: 175.5,
		exitPrice: null,
		pnl: null,
		openedAt: "2024-03-15T10:30:00Z",
		closedAt: null,
		notes: "Bullish momentum trade",
	},
	{
		id: "489e1d42",
		symbol: "TSLA",
		type: "short",
		status: "lost",
		entryPrice: 190.25,
		exitPrice: 185.5,
		pnl: -237.5,
		openedAt: "2024-03-14T15:45:00Z",
		closedAt: "2024-03-14T16:00:00Z",
		notes: "Technical breakdown trade",
	},
	{
		id: "63a91de3",
		symbol: "NVDA",
		type: "long",
		status: "won",
		entryPrice: 850.0,
		exitPrice: 875.25,
		pnl: 632.5,
		openedAt: "2024-03-13T09:15:00Z",
		closedAt: "2024-03-13T09:20:00Z",
		notes: "Earnings momentum",
	},
	{
		id: "92b47f1c",
		symbol: "META",
		type: "short",
		status: "breakeven",
		entryPrice: 505.75,
		exitPrice: 505.75,
		pnl: 0,
		openedAt: "2024-03-12T14:20:00Z",
		closedAt: "2024-03-12T14:25:00Z",
		notes: "Breakeven trade",
	},
	{
		id: "15d8e94a",
		symbol: "MSFT",
		type: "long",
		status: "open",
		entryPrice: 425.5,
		exitPrice: null,
		pnl: null,
		openedAt: "2024-03-11T11:10:00Z",
		closedAt: null,
		notes: "Long term position",
	},
	{
		id: "a1b2c3d4",
		symbol: "AMD",
		type: "long",
		status: "won",
		entryPrice: 180.25,
		exitPrice: 195.5,
		pnl: 915,
		openedAt: "2024-03-10T13:45:00Z",
		closedAt: "2024-03-10T15:30:00Z",
		notes: "Semiconductor rally",
	},
	{
		id: "e5f6g7h8",
		symbol: "GOOGL",
		type: "short",
		status: "lost",
		entryPrice: 147.75,
		exitPrice: 152.25,
		pnl: -135,
		openedAt: "2024-03-09T10:15:00Z",
		closedAt: "2024-03-09T11:00:00Z",
		notes: "Failed breakdown",
	},
	{
		id: "i9j0k1l2",
		symbol: "AMZN",
		type: "long",
		status: "open",
		entryPrice: 178.5,
		exitPrice: null,
		pnl: null,
		openedAt: "2024-03-08T14:30:00Z",
		closedAt: null,
		notes: "E-commerce growth",
	},
	{
		id: "m3n4o5p6",
		symbol: "JPM",
		type: "short",
		status: "won",
		entryPrice: 195.75,
		exitPrice: 188.25,
		pnl: 412.5,
		openedAt: "2024-03-07T09:45:00Z",
		closedAt: "2024-03-07T10:30:00Z",
		notes: "Banking sector weakness",
	},
	{
		id: "q7r8s9t0",
		symbol: "DIS",
		type: "long",
		status: "breakeven",
		entryPrice: 112.5,
		exitPrice: 112.5,
		pnl: 0,
		openedAt: "2024-03-06T11:20:00Z",
		closedAt: "2024-03-06T12:15:00Z",
		notes: "Entertainment sector",
	},
	{
		id: "u1v2w3x4",
		symbol: "NFLX",
		type: "short",
		status: "lost",
		entryPrice: 625.25,
		exitPrice: 645.75,
		pnl: -410,
		openedAt: "2024-03-05T15:10:00Z",
		closedAt: "2024-03-05T16:00:00Z",
		notes: "Streaming competition",
	},
	{
		id: "y5z6a7b8",
		symbol: "INTC",
		type: "long",
		status: "won",
		entryPrice: 42.75,
		exitPrice: 45.5,
		pnl: 412.5,
		openedAt: "2024-03-04T10:45:00Z",
		closedAt: "2024-03-04T11:30:00Z",
		notes: "Chip manufacturing",
	},
	{
		id: "c9d0e1f2",
		symbol: "BA",
		type: "short",
		status: "open",
		entryPrice: 187.25,
		exitPrice: null,
		pnl: null,
		openedAt: "2024-03-03T13:15:00Z",
		closedAt: null,
		notes: "Aviation concerns",
	},
	{
		id: "g3h4i5j6",
		symbol: "PFE",
		type: "long",
		status: "lost",
		entryPrice: 27.5,
		exitPrice: 26.75,
		pnl: -150,
		openedAt: "2024-03-02T09:30:00Z",
		closedAt: "2024-03-02T10:15:00Z",
		notes: "Healthcare sector",
	},
	{
		id: "k7l8m9n0",
		symbol: "PYPL",
		type: "short",
		status: "won",
		entryPrice: 62.25,
		exitPrice: 59.75,
		pnl: 225,
		openedAt: "2024-03-01T14:45:00Z",
		closedAt: "2024-03-01T15:30:00Z",
		notes: "Fintech decline",
	},
	{
		id: "o1p2q3r4",
		symbol: "CRM",
		type: "long",
		status: "breakeven",
		entryPrice: 295.5,
		exitPrice: 295.5,
		pnl: 0,
		openedAt: "2024-02-29T11:00:00Z",
		closedAt: "2024-02-29T11:45:00Z",
		notes: "Cloud computing",
	},
	{
		id: "s5t6u7v8",
		symbol: "ADBE",
		type: "short",
		status: "open",
		entryPrice: 575.25,
		exitPrice: null,
		pnl: null,
		openedAt: "2024-02-28T15:30:00Z",
		closedAt: null,
		notes: "Software valuation",
	},
	{
		id: "w9x0y1z2",
		symbol: "CSCO",
		type: "long",
		status: "won",
		entryPrice: 48.75,
		exitPrice: 51.25,
		pnl: 300,
		openedAt: "2024-02-27T10:15:00Z",
		closedAt: "2024-02-27T11:00:00Z",
		notes: "Network infrastructure",
	},
	{
		id: "a3b4c5d6",
		symbol: "V",
		type: "short",
		status: "lost",
		entryPrice: 275.5,
		exitPrice: 280.25,
		pnl: -308.75,
		openedAt: "2024-02-26T13:45:00Z",
		closedAt: "2024-02-26T14:30:00Z",
		notes: "Payment processing",
	},
	{
		id: "e7f8g9h0",
		symbol: "WMT",
		type: "long",
		status: "open",
		entryPrice: 175.25,
		exitPrice: null,
		pnl: null,
		openedAt: "2024-02-25T09:00:00Z",
		closedAt: null,
		notes: "Retail sector",
	},
];

export function TradesTable() {
	const [sortBy, setSortBy] = useQueryState("sortBy", {
		defaultValue: "openedAt",
	});
	const [sortOrder, setSortOrder] = useQueryState("sortOrder", {
		defaultValue: "desc",
		parse: (value) => (value === "asc" ? "asc" : "desc"),
	});

	// Memoize sorted data to prevent unnecessary re-renders
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const sortedData = useMemo(() => {
		if (!sortBy) return trades;

		return [...trades].sort((a, b) => {
			const aValue = a[sortBy as keyof Trade];
			const bValue = b[sortBy as keyof Trade];

			// Handle null values
			if (aValue === null) return sortOrder === "asc" ? -1 : 1;
			if (bValue === null) return sortOrder === "asc" ? 1 : -1;

			// Special handling for dates
			if (sortBy === "openedAt" || sortBy === "closedAt") {
				return sortOrder === "asc"
					? new Date(aValue as string).getTime() -
							new Date(bValue as string).getTime()
					: new Date(bValue as string).getTime() -
							new Date(aValue as string).getTime();
			}

			// Regular sorting
			return sortOrder === "asc"
				? String(aValue).localeCompare(String(bValue))
				: String(bValue).localeCompare(String(aValue));
		});
	}, [sortBy, sortOrder, trades]);

	return (
		<DataTable
			columns={columns}
			data={sortedData.slice(0, 14)}
			sortableColumns={[
				"symbol",
				"type",
				"status",
				"entryPrice",
				"exitPrice",
				"pnl",
				"openedAt",
				"closedAt",
			]}
			sortBy={sortBy}
			sortOrder={sortOrder as "asc" | "desc"}
			onSortChange={({ sortBy, sortOrder }) => {
				setSortBy(sortBy ?? "status");
				setSortOrder(sortOrder);
			}}
		/>
	);
}
