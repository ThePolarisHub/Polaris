import z from "zod";

const baseTransactionSchema = z.object({
	type: z.enum(["buy", "sell"]),
	timestamp: z.string().datetime(),
	asset: z.enum(["stock"]),
	symbol: z.string(),
	quantity: z.string(),
	price: z.string(),
});

export type BaseTransaction = z.infer<typeof baseTransactionSchema>;
