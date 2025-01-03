import type { BaseTransaction } from "./schemas";

export interface BrokerConfiguration<T> {
	readonly name: string;
	readonly requiredColumns: ReadonlyArray<string>;
	validateRow: (row: Record<string, string>) => T;
	parseTransaction: (row: T) => BaseTransaction;
}
