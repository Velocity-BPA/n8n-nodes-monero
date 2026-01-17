/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Fee priority levels
 */
export type FeePriority = 1 | 2 | 3 | 4;

export const FEE_PRIORITIES = {
	LOW: 1 as FeePriority,
	NORMAL: 2 as FeePriority,
	ELEVATED: 3 as FeePriority,
	HIGH: 4 as FeePriority,
} as const;

export const FEE_PRIORITY_LABELS: Record<FeePriority, string> = {
	1: 'Low (Slow)',
	2: 'Normal',
	3: 'Elevated',
	4: 'High (Fast)',
} as const;

/**
 * Fee multipliers by priority
 */
export const FEE_MULTIPLIERS: Record<FeePriority, number> = {
	1: 1,
	2: 4,
	3: 20,
	4: 166,
} as const;

/**
 * Dust threshold in piconero
 */
export const DUST_THRESHOLD = 2000000000;

/**
 * Default unlock time (0 = no lock, 10 = 10 blocks)
 */
export const DEFAULT_UNLOCK_TIME = 0;

/**
 * Transaction size estimates (bytes)
 */
export const TX_SIZE_ESTIMATES = {
	BASE: 2000,
	PER_INPUT: 80,
	PER_OUTPUT: 50,
	PER_MIXIN: 32,
} as const;
