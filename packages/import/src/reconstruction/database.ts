/**
 * This file handles conversion between database stored trades and application trade models.
 * It provides functions to transform data both ways:
 * 1. From database format to application format
 * 2. From application format to database insertable format
 */

import type { BaseTransaction } from "@/parse/schemas";
import type { Tables, TablesInsert } from "@polaris/supabase/types";
import Decimal from "decimal.js";
import type { StoredTrade, Trade } from "./types";

/**
 * Converts a trade stored in the database into the application's trade format.
 * This includes:
 * - Calculating the total quantity
 * - Converting stored transactions to application format
 * - Mapping database IDs to the expected format
 */
export function convertStoredTradeToTrade(storedTrade: StoredTrade): Trade {
	// Destructure to separate transactions from other trade data
	const { transactions: storedTransactions, ...otherTradeData } = storedTrade;

	// Calculate the total quantity from all transactions
	const totalQuantity = storedTransactions.reduce(
		(runningTotal, transaction) => {
			const transactionQuantity = new Decimal(transaction.quantity);

			if (transaction.type === "buy") {
				return runningTotal.plus(transactionQuantity);
			}

			return runningTotal.minus(transactionQuantity);
		},
		new Decimal(0),
	);

	// Create the base trade object without transactions
	const baseTradeData: Omit<Trade, "transactions"> = {
		...otherTradeData,
		database_id: storedTrade.id,
		quantity: totalQuantity,
	};

	const convertedTransactions: BaseTransaction[] = storedTransactions.map(
		(storedTransaction) => {
			return {
				...storedTransaction,
				asset: "stock",
				database_id: storedTransaction.id,
				symbol: storedTrade.symbol,
			};
		},
	);

	// Combine everything into the final trade object
	return {
		...baseTradeData,
		transactions: convertedTransactions,
	};
}

/**
 * Converts a working trade object into a format that can be inserted into the database.
 * Handles both new trades and existing trades with database IDs.
 */
export function convertTradeToInsertableTrade(workingTrade: Trade) {
	const { transactions: processedTransactions, ...processedTrade } =
		workingTrade;

	const trade: Omit<TablesInsert<"trades">, "journal_id"> = {
		symbol: processedTrade.symbol,
		...(processedTrade.database_id ? { id: processedTrade.database_id } : {}),
	};

	const transactions: Omit<TablesInsert<"transactions">, "trade_id" | "id">[] =
		processedTransactions.map((tx) => {
			const baseTransaction = {
				timestamp: tx.timestamp,
				price: tx.price.toString(),
				quantity: tx.quantity.toString(),
				type: tx.type,
			};

			// Add optional fields only if they exist
			const optionalFields = {
				...(tx.database_id ? { id: tx.database_id } : {}),
				...(trade.id ? { trade_id: trade.id } : {}),
			};

			return {
				...baseTransaction,
				...optionalFields,
			};
		});

	return {
		...trade,
		transactions,
	};
}
