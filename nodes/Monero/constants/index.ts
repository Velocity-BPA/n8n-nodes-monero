/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export * from './networks';
export * from './addresses';
export * from './ringSize';
export * from './fees';

/**
 * Monero unit conversion constants
 */
export const MONERO_UNITS = {
	PICONERO_PER_XMR: 1000000000000n,
	DECIMALS: 12,
	SYMBOL: 'XMR',
	TICKER: 'XMR',
} as const;

/**
 * Mnemonic seed constants
 */
export const MNEMONIC = {
	WORD_COUNT: 25,
	LANGUAGES: [
		'English',
		'Spanish',
		'German',
		'Italian',
		'Portuguese',
		'Russian',
		'Japanese',
		'Chinese (Simplified)',
		'Dutch',
		'Esperanto',
		'French',
		'Lojban',
	],
	DEFAULT_LANGUAGE: 'English',
} as const;

/**
 * Key constants
 */
export const KEY_CONSTANTS = {
	PRIVATE_KEY_LENGTH: 64,
	PUBLIC_KEY_LENGTH: 64,
	KEY_IMAGE_LENGTH: 64,
	TX_HASH_LENGTH: 64,
} as const;

/**
 * Block constants
 */
export const BLOCK_CONSTANTS = {
	TARGET_TIME: 120,
	MAX_BLOCK_SIZE: 2000000,
	COINBASE_UNLOCK_TIME: 60,
} as const;
