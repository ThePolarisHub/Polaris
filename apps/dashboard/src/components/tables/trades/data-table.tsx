"use client";

import { isClickOnInteractiveChild } from "@polaris/ui/is-click-on-interactive-child";
import {
	type Cell,
	type Column,
	type ColumnDef,
	type ColumnMeta,
	type Row,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

import { cn } from "@polaris/ui/cn";
import { Icons } from "@polaris/ui/icons";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@polaris/ui/table";
import type { CSSProperties, ReactNode } from "react";
import SortOrder from "../sort-order";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	onSortChange?: (props: {
		sortBy?: string;
		sortOrder: "asc" | "desc";
	}) => void;
	sortableColumns?: string[];
	onRowClick?: (
		row: Row<TData>,
		e: React.MouseEvent<HTMLTableRowElement>,
	) => void;
}

function tableCellClassName(columnId: string, clickable?: boolean) {
	return cn([
		"py-2.5 text-left text-sm leading-6 whitespace-nowrap border-border px-4 relative",
		"border-l border-b",
		columnId === "menu" && "bg-white border-l-transparent py-0 px-1",
		clickable && "group-hover/row:bg-muted transition-colors duration-75",
	]);
}

const getCommonPinningClassNames = (
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	column: Column<any>,
	isLastRow: boolean,
): string => {
	const isPinned = column.getIsPinned();
	return cn(
		isPinned &&
			!isLastRow &&
			"animate-table-pinned-shadow [animation-timeline:scroll(inline)]",
	);
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const getCommonPinningStyles = (column: Column<any>): CSSProperties => {
	const isPinned = column.getIsPinned();

	return {
		left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
		right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
		position: isPinned ? "sticky" : "relative",
	};
};

export function DataTable<TData, TValue>({
	columns,
	data,
	onSortChange,
	sortBy,
	sortOrder,
	sortableColumns,
	onRowClick,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		defaultColumn: {
			minSize: 120,
			maxSize: 300,
			size: 0,
		},
		manualSorting: true,
	});

	return (
		<div className="relative rounded-xl border bg-white">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								const isSortableColumn = sortableColumns?.includes(
									header.column.id,
								);
								const ButtonOrDiv = isSortableColumn ? "button" : "div";

								return (
									<TableHead
										key={header.id}
										className={cn(
											tableCellClassName(header.id),
											"select-none font-medium text-foreground",
											getCommonPinningClassNames(
												header.column,
												!table.getRowModel().rows.length,
											),
										)}
										style={{
											minWidth: header.column.columnDef.minSize,
											maxWidth: header.column.columnDef.maxSize,
											width: header.column.columnDef.size || "auto",
											...getCommonPinningStyles(header.column),
										}}
									>
										<div className="flex items-center justify-between gap-6 !pr-0">
											<ButtonOrDiv
												className="flex items-center gap-2"
												{...(isSortableColumn && {
													type: "button",
													disabled: !isSortableColumn,
													"aria-label": "Sort by column",
													onClick: () =>
														onSortChange?.({
															sortBy: header.column.id,
															sortOrder:
																sortBy !== header.column.id
																	? "desc"
																	: sortOrder === "asc"
																		? "desc"
																		: "asc",
														}),
												})}
											>
												<span>
													{header.isPlaceholder
														? null
														: flexRender(
																header.column.columnDef.header,
																header.getContext(),
															)}
												</span>
												{isSortableColumn && (
													<SortOrder
														order={
															sortBy === header.column.id
																? sortOrder || "desc"
																: null
														}
													/>
												)}
											</ButtonOrDiv>
										</div>
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows.map((row) => (
						<TableRow
							key={row.id}
							className={cn(
								"group/row",
								onRowClick && "cursor-pointer select-none",
								// hacky fix: if there are more than 8 rows, remove the bottom border from the last row
								table.getRowModel().rows.length > 3 &&
									row.index === table.getRowModel().rows.length - 1 &&
									"[&_td]:border-b-0",
							)}
							onClick={
								onRowClick
									? (e) => {
											// Ignore if click is on an interactive child
											if (isClickOnInteractiveChild(e)) return;
											onRowClick(row, e);
										}
									: undefined
							}
							data-state={row.getIsSelected() && "selected"}
						>
							{row.getVisibleCells().map((cell) => (
								<TableCell
									key={cell.id}
									className={cn(
										tableCellClassName(cell.column.id, !!onRowClick),
										"group",
										getCommonPinningClassNames(
											cell.column,
											row.index === table.getRowModel().rows.length - 1,
										),
									)}
									style={{
										minWidth: cell.column.columnDef.minSize,
										maxWidth: cell.column.columnDef.maxSize,
										width: cell.column.columnDef.size || "auto",
										...getCommonPinningStyles(cell.column),
									}}
								>
									<div className="flex w-full items-center justify-between overflow-hidden truncate">
										<div className="min-w-0 shrink grow truncate text-muted-foreground">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</div>
									</div>
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
