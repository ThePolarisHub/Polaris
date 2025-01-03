import type { BaseTransaction } from "../../schemas";
import type { Row } from "./schema";

export function parseTransaction(row: Row): BaseTransaction {
	return {
		type: extractType(row),
		timestamp: extractTimestamp(row),
		symbol: extractSymbol(row),
		quantity: extractQuantity(row),
		price: extractPrice(row),
		asset: extractAsset(row),
	};
}

function extractType(row: Row): BaseTransaction["type"] {
	return row.action.includes("buy") ? "buy" : "sell";
}

function extractTimestamp(row: Row): BaseTransaction["timestamp"] {
	return row.time.toISOString();
}

function extractSymbol(row: Row): BaseTransaction["symbol"] {
	return row.ticker;
}

function extractQuantity(row: Row): BaseTransaction["quantity"] {
	return row["no. of shares"].toString();
}

function extractPrice(row: Row): BaseTransaction["price"] {
	return row["price / share"].toString();
}

function extractAsset(row: Row): BaseTransaction["asset"] {
	return "stock";
}
