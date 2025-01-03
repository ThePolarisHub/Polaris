import { z } from "zod";

export const schema = z.object({
	action: z
		.string()
		.toLowerCase()
		.refine((value) => value.includes("buy") || value.includes("sell"), {
			message: "Action must include 'buy' or 'sell'",
		}),
	time: z.string().transform((value) => new Date(value)),
	ticker: z.string().min(1, "Ticker cannot be empty").toUpperCase(),
	"no. of shares": z
		.string()
		.transform(Number)
		.refine((value) => !Number.isNaN(value) && value > 0, {
			message: "Number of shares must be a positive number",
		}),
	"price / share": z
		.string()
		.transform(Number)
		.refine((value) => !Number.isNaN(value) && value >= 0, {
			message: "Price per share must be a non-negative number",
		}),
});

export type Row = z.infer<typeof schema>;
