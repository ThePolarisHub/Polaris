/**
 * This file handles the processing of trading transactions and managing trades.
 * It helps track when trades are opened, modified, and closed.
 */

import crypto from "node:crypto";
import Decimal from "decimal.js";
import {
	convertStoredTradeToTrade,
	convertTradeToInsertableTrade,
} from "./database";
import type {
	ReconstructTradeResultParams,
	Trade,
	TradeUpdateResult,
	WorkingTransaction,
} from "./types";

/**
 * Generates a unique ID for each trade using UUID v4
 */
function generateTradeId() {
	return crypto.randomUUID();
}

/**
 * Creates a unique identifier for an asset by combining asset type and symbol.
 * This helps group related transactions together.
 * Example: "stock-aapl" or "crypto-btc"
 */
function createAssetIdentifier(transaction: WorkingTransaction) {
	const asset = transaction.asset;
	const symbol = transaction.symbol.toLowerCase();
	return `${asset}-${symbol}`;
}

/**
 * Determines the quantity change for a transaction.
 * Buy transactions increase the quantity (positive)
 * Sell transactions decrease the quantity (negative)
 */
function calculateQuantityChange(transaction: WorkingTransaction) {
	const quantity = new Decimal(transaction.quantity);

	if (transaction.type === "sell") {
		return quantity.negated();
	}

	return quantity;
}

/**
 * Creates a new trade from an initial transaction
 */
function createNewTrade(transaction: WorkingTransaction): Trade {
	const initialQuantity = calculateQuantityChange(transaction);

	return {
		id: generateTradeId(),
		symbol: transaction.symbol,
		quantity: initialQuantity,
		transactions: [transaction],
	};
}

/**
 * Handles scenarios where a trade changes from long to short or vice versa.
 *
 * Example: If you have a long position of 100 shares and sell 150:
 * 1. The original 100 share long position is closed
 * 2. A new 50 share short position is created
 */
function handleTradeDirectionChange(
	existingTrade: Trade,
	transaction: WorkingTransaction,
	quantityChange: Decimal,
): TradeUpdateResult {
	// Split the transaction into two parts:
	// 1. The amount needed to close the existing position
	// 2. The remaining amount that will open a new position
	const quantityToClose = existingTrade.quantity.abs();
	const remainingQuantity = quantityChange.abs().minus(quantityToClose);

	// Create a transaction that closes the existing position
	const closingTransaction = {
		...transaction,
		quantity: quantityToClose.toString(),
	};

	// Close the existing trade
	const closedTrade: Trade = {
		...existingTrade,
		quantity: new Decimal(0),
		transactions: [...existingTrade.transactions, closingTransaction],
	};

	let newTrade: Trade | undefined;

	if (remainingQuantity.greaterThan(0)) {
		// If there's remaining quantity, create a new trade in the opposite direction
		const remainingTransaction = {
			...transaction,
			quantity: remainingQuantity.toString(),
		};
		newTrade = createNewTrade(remainingTransaction);
	}

	return {
		closedTrade: closedTrade,
		newTrade: newTrade,
	};
}

/**
 * Updates a trade's quantity based on a new transaction.
 * Handles three scenarios:
 * 1. Regular position increase/decrease
 * 2. Position closure (quantity becomes zero)
 * 3. Direction change (long to short or short to long)
 */
function updateTradeQuantity(
	existingTrade: Trade,
	transaction: WorkingTransaction,
): TradeUpdateResult {
	const quantityChange = calculateQuantityChange(transaction);
	const newQuantity = existingTrade.quantity.plus(quantityChange);

	// Check if the trade is changing direction
	const isChangingToShort =
		existingTrade.quantity.greaterThan(0) && newQuantity.lessThan(0);
	const isChangingToLong =
		existingTrade.quantity.lessThan(0) && newQuantity.greaterThan(0);

	if (isChangingToShort || isChangingToLong) {
		return handleTradeDirectionChange(
			existingTrade,
			transaction,
			quantityChange,
		);
	}

	// Regular update - just modify the quantity and add the transaction
	const updatedTrade: Trade = {
		...existingTrade,
		quantity: newQuantity,
		transactions: [...existingTrade.transactions, transaction],
	};

	return {
		updatedTrade: updatedTrade,
	};
}

/**
 * Main function that processes a list of transactions and reconstructs all trades.
 *
 * Steps:
 * 1. Sorts transactions by date (oldest first)
 * 2. Processes each transaction in order
 * 3. Either creates new trades or updates existing ones
 * 4. Handles direction changes and closures
 *
 * @returns Array of all trades, including both active and closed positions
 */
export function reconstructTradeRecords(params: ReconstructTradeResultParams) {
	// Convert previously stored trades and transactions to our internal format
	const allTrades = params.existingTrades.map(convertStoredTradeToTrade);

	// Sort transactions chronologically
	const sortedTransactions = [...params.importedTransactions].sort(
		(firstTransaction, secondTransaction) => {
			const firstDate = new Date(firstTransaction.timestamp).getTime();
			const secondDate = new Date(secondTransaction.timestamp).getTime();
			return firstDate - secondDate;
		},
	);

	// Track only currently active trades for quick lookup
	const activeTradesByAsset = new Map<string, Trade>();

	// Initialize active trades map with existing trades
	for (const trade of allTrades) {
		if (!trade.quantity.eq(0) && trade.transactions[0]) {
			const assetId = createAssetIdentifier(trade.transactions[0]);
			activeTradesByAsset.set(assetId, trade);
		}
	}

	// Process each transaction in chronological order
	for (const transaction of sortedTransactions) {
		const assetId = createAssetIdentifier(transaction);
		const existingTrade = activeTradesByAsset.get(assetId);

		// Case 1: No existing trade for this asset - create new trade
		if (!existingTrade) {
			const newTrade = createNewTrade(transaction);

			// Only track non-zero quantity trades
			if (!newTrade.quantity.isZero()) {
				allTrades.push(newTrade);
				activeTradesByAsset.set(assetId, newTrade);
			}
			continue;
		}

		// Case 2: Existing trade needs to be updated
		const updateResult = updateTradeQuantity(existingTrade, transaction);

		if (updateResult.closedTrade) {
			// Handle direction change scenario
			allTrades.push(updateResult.closedTrade);
			activeTradesByAsset.delete(assetId);

			if (updateResult.newTrade) {
				allTrades.push(updateResult.newTrade);
				activeTradesByAsset.set(assetId, updateResult.newTrade);
			}
		} else if (updateResult.updatedTrade) {
			// Handle normal position update
			const tradeIsNowClosed = updateResult.updatedTrade.quantity.isZero();

			if (tradeIsNowClosed) {
				activeTradesByAsset.delete(assetId);
			} else {
				activeTradesByAsset.set(assetId, updateResult.updatedTrade);
			}

			// Update the trade in our main array
			const tradeIndex = allTrades.findIndex((t) => t.id === existingTrade.id);
			allTrades[tradeIndex] = updateResult.updatedTrade;
		}
	}

	const insertableTrades = allTrades.map(convertTradeToInsertableTrade);

	return insertableTrades;
}
