/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export type AddressType = 'standard' | 'integrated' | 'subaddress' | 'unknown';

export const ADDRESS_LENGTHS = {
	STANDARD: 95,
	INTEGRATED: 106,
	SUBADDRESS: 95,
} as const;

export const ADDRESS_PREFIXES = {
	mainnet: {
		standard: '4',
		integrated: '4',
		subaddress: '8',
	},
	stagenet: {
		standard: '5',
		integrated: '5',
		subaddress: '7',
	},
	testnet: {
		standard: '9',
		integrated: 'A',
		subaddress: 'B',
	},
} as const;

export const ADDRESS_TYPES: Record<AddressType, string> = {
	standard: 'Standard Address',
	integrated: 'Integrated Address',
	subaddress: 'Subaddress',
	unknown: 'Unknown',
} as const;

export const ADDRESS_FIRST_CHARS = {
	mainnet: ['4', '8'],
	stagenet: ['5', '7'],
	testnet: ['9', 'A', 'B'],
} as const;

export const PAYMENT_ID_LENGTHS = {
	SHORT: 16,
	LONG: 64,
} as const;

export const ADDRESS_VALIDATION_REGEX = /^[1-9A-HJ-NP-Za-km-z]{95,106}$/;

export const PAYMENT_ID_REGEX = {
	SHORT: /^[0-9a-fA-F]{16}$/,
	LONG: /^[0-9a-fA-F]{64}$/,
} as const;
