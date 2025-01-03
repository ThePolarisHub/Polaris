import fs from "node:fs";
import path from "node:path";

interface SplitCSVOptions {
	inputFilePath: string;
	outputDir: string;
	rowsPerFile?: number;
}

function splitCSVIntoFiles({
	inputFilePath,
	outputDir,
	rowsPerFile = 1000,
}: SplitCSVOptions): void {
	// Read the input file
	const mainCSV = fs.readFileSync(inputFilePath, "utf-8");
	const rows = mainCSV.split("\n");

	// Extract headers
	const headers = rows[0];
	const dataRows = rows.slice(1);

	// Create output directory if it doesn't exist
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	// Split into chunks and write files
	for (let i = 0; i < dataRows.length; i += rowsPerFile) {
		const chunk = [headers, ...dataRows.slice(i, i + rowsPerFile)].join("\n");

		const fileName = `part-${Math.floor(i / rowsPerFile) + 1}.csv`;
		const outputPath = path.join(outputDir, fileName);

		fs.writeFileSync(outputPath, chunk);
	}
}

// Example usage
const inputPath = `${__dirname}/parse/brokers/trading-212/examples/james.csv`;
const outputDir = `${__dirname}/parse/brokers/trading-212/examples`;

splitCSVIntoFiles({
	inputFilePath: inputPath,
	outputDir: outputDir,
	rowsPerFile: 85, // Adjust this number based on your needs
});
