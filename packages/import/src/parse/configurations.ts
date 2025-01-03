import { configuration as trading212Config } from "./brokers/trading-212";

export const configurations = {
	trading212: trading212Config,
} as const;

export type BrokerId = keyof typeof configurations;
export const brokerIds = Object.keys(configurations) as BrokerId[];
