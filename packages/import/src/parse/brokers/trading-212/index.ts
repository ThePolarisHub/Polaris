import type { BrokerConfiguration } from "../../types";
import { parseTransaction } from "./parser";
import { type Row, schema } from "./schema";

export const configuration: BrokerConfiguration<Row> = {
	name: "Trading 212",
	requiredColumns: Object.keys(schema.shape) as (keyof typeof schema.shape)[],
	validateRow: (row) => schema.parse(row),
	parseTransaction,
} as const;
