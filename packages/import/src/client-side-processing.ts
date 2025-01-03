import fs from "node:fs";
import { parse } from "papaparse";
import { type BrokerId, configurations } from "./parse/configurations";

interface ProcessCSVParams {
	path: string;
	broker: BrokerId;
}

// Process the csv file using papaparse, will be used client side before sending to server
export function processCsv({ broker, path }: ProcessCSVParams) {
	const file = fs.readFileSync(path, "utf8");
	const configuration = configurations[broker];

	// Parse the csv file
	const result = parse<Record<string, string>>(file, {
		header: true,
		skipEmptyLines: "greedy",
		transformHeader: (header) => header.toLowerCase().trim(),
		transform: (value) => value.trim(),
		fastMode: true,
	});

	// Check for errors
	if (result.errors.length > 0) {
		// TODO: Implement error handling for client side
		console.error("CSV parsing errors:", result.errors);
	}

	// Check for missing columns
	const missingColumns = configuration.requiredColumns.filter(
		(column) => !result.data.some((row) => column in row),
	);

	// Check for missing columns
	if (missingColumns.length > 0) {
		// TODO: Implement feedback for client side
		console.error("Missing columns:", missingColumns);
	}

	// Filter the data to only include the required columns
	const filteredData = result.data.map((row) =>
		Object.fromEntries(
			configuration.requiredColumns.map((column) => {
				const value = row[column];
				if (value === undefined) {
					throw new Error(`Missing required column: ${column}`);
				}
				return [column, value];
			}),
		),
	);

	// Return the parsed data
	return filteredData;
}
