/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export type NetworkType = 'mainnet' | 'stagenet' | 'testnet';

export interface NetworkConfig {
	name: string;
	type: NetworkType;
	defaultDaemonPort: number;
	defaultWalletPort: number;
	addressPrefix: number;
	integratedAddressPrefix: number;
	subaddressPrefix: number;
}

export const NETWORKS: Record<NetworkType, NetworkConfig> = {
	mainnet: {
		name: 'Mainnet',
		type: 'mainnet',
		defaultDaemonPort: 18081,
		defaultWalletPort: 18082,
		addressPrefix: 18,
		integratedAddressPrefix: 19,
		subaddressPrefix: 42,
	},
	stagenet: {
		name: 'Stagenet',
		type: 'stagenet',
		defaultDaemonPort: 38081,
		defaultWalletPort: 38082,
		addressPrefix: 24,
		integratedAddressPrefix: 25,
		subaddressPrefix: 36,
	},
	testnet: {
		name: 'Testnet',
		type: 'testnet',
		defaultDaemonPort: 28081,
		defaultWalletPort: 28082,
		addressPrefix: 53,
		integratedAddressPrefix: 54,
		subaddressPrefix: 63,
	},
} as const;

export const PUBLIC_REMOTE_NODES: Record<NetworkType, string[]> = {
	mainnet: [
		'node.moneroworld.com:18089',
		'opennode.xmr-tw.org:18089',
		'node.xmr.to:18081',
	],
	stagenet: [
		'stagenet.xmr-tw.org:38081',
	],
	testnet: [
		'testnet.xmr-tw.org:28081',
	],
} as const;

export const HARDFORK_HEIGHTS = {
	mainnet: {
		v15: 2689608,
		v16: 2890000,
	},
	stagenet: {
		v15: 1151000,
		v16: 1200000,
	},
	testnet: {
		v15: 1151000,
		v16: 1200000,
	},
} as const;
