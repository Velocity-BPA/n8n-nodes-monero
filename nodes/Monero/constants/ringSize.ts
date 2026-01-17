/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Current mandatory ring size for Monero transactions
 * As of hardfork v15, ring size is fixed at 16
 */
export const CURRENT_RING_SIZE = 16;

/**
 * Historical ring sizes by hardfork version
 */
export const RING_SIZE_HISTORY = {
	v1: { min: 3, max: 100, default: 4 },
	v2: { min: 3, max: 100, default: 4 },
	v6: { min: 5, max: 100, default: 5 },
	v7: { min: 7, max: 100, default: 7 },
	v8: { min: 11, max: 11, default: 11 },
	v15: { min: 16, max: 16, default: 16 },
} as const;

/**
 * RingCT (Ring Confidential Transactions) constants
 */
export const RINGCT = {
	TYPE_NULL: 0,
	TYPE_FULL: 1,
	TYPE_SIMPLE: 2,
	TYPE_BULLETPROOF: 3,
	TYPE_BULLETPROOF2: 4,
	TYPE_CLSAG: 5,
	TYPE_BULLETPROOF_PLUS: 6,
} as const;

/**
 * Decoy selection parameters
 */
export const DECOY_SELECTION = {
	RECENT_SPEND_WINDOW: 50,
	GAMMA_SHAPE: 19.28,
	GAMMA_SCALE: 1 / 1.61,
	RECENT_OUTPUTS_PERCENTAGE: 0.25,
} as const;
