import type { BaseTransaction } from "@/parse/schemas";
import type { Tables } from "@polaris/supabase/types";
import type Decimal from "decimal.js";

/**
 * Represents a trade as it is fetched from the database.
 */
export interface StoredTrade extends Tables<"trades"> {
	transactions: Tables<"transactions">[];
}

/**
 * Represents a transaction as it is processed by the reconstruction algorithm.
 * This includes an optional database_id if we've already stored this transaction.
 */
export interface WorkingTransaction extends BaseTransaction {
	database_id?: string; // Optional database id if we've already stored this transaction
}

/**
 * Represents a trade position with its current state and history.
 * Quantity is positive for long positions, negative for short positions.
 */
export interface Trade {
	id: string;
	database_id?: string; // Optional database id if we've already stored this trade
	symbol: string;
	quantity: Decimal;
	transactions: WorkingTransaction[];
}

export interface TradeUpdateResult {
	closedTrade?: Trade; // The original trade that was closed
	newTrade?: Trade; // A new trade created after direction change
	updatedTrade?: Trade; // The modified version of the original trade
}

export interface ReconstructTradeResultParams {
	existingTrades: StoredTrade[];
	importedTransactions: BaseTransaction[];
	journalId: string;
}
