export function formatCurrency(value: number, showSign = false): string {
	const options: Intl.NumberFormatOptions = {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
		signDisplay: showSign ? "always" : "never",
	};

	return new Intl.NumberFormat("en-US", options).format(value);
}
