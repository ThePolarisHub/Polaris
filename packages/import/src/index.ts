import { createClient } from "@polaris/supabase/job";
import { insertTransactions, upsertTrade } from "@polaris/supabase/mutations";
import { getTradesQuery } from "@polaris/supabase/queries";
import type { TablesInsert } from "@polaris/supabase/types";
import { processCsv } from "./client-side-processing";
import type { BrokerId } from "./parse/configurations";
import { configurations } from "./parse/configurations";
import { reconstructTradeRecords } from "./reconstruction";

const supabase = createClient();

const journal = "e0a32365-b819-456a-8c65-915daa07c828";

async function processCSVFile(broker: BrokerId, path: string) {
	// Data we get from the client side
	const processed = processCsv({ broker, path });

	// Everything else we do on the server side
	const configuration = configurations[broker];
	const transactions = [];

	for (const row of processed) {
		try {
			const validated = configuration.validateRow(row);
			const transaction = configuration.parseTransaction(validated);
			transactions.push(transaction);
		} catch {
			// Skip invalid rows without continue
		}
	}

	const previousTrades = await getTradesQuery(supabase, journal);

	console.log(transactions.length);

	const trades = reconstructTradeRecords({
		existingTrades: previousTrades.data ?? [],
		importedTransactions: transactions,
		journalId: journal,
	});

	console.log(`Inserting ${trades.length} trades`);
	console.log(
		`Inserting ${trades.flatMap((t) => t.transactions).length} transactions`,
	);

	// Loop through trades and insert them into the database
	for (const trade of trades) {
		const insertedTrade = await upsertTrade(supabase, {
			...(trade.id ? { id: trade.id } : {}),
			symbol: trade.symbol as string,
			journal_id: journal,
		});

		if (insertedTrade.data) {
			// Add trade id to transactions and remove transactions with an id
			const transactionsWithTradeId: TablesInsert<"transactions">[] =
				trade.transactions.map((transaction) => ({
					...transaction,
					trade_id: insertedTrade.data.id,
				}));

			// Remove transactions with an id
			const transactionsWithoutId = transactionsWithTradeId.filter(
				(transaction) => !transaction.id,
			);

			await insertTransactions(supabase, transactionsWithoutId);
		}
	}
}

processCSVFile(
	"trading212",
	`${__dirname}/parse/brokers/trading-212/examples/part-1.csv`,
);
