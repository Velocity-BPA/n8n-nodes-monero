/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { CURRENT_RING_SIZE, RING_SIZE_HISTORY, DECOY_SELECTION, TX_SIZE_ESTIMATES } from '../constants';

export function getCurrentRingSize(): number {
	return CURRENT_RING_SIZE;
}

export function isValidRingSize(ringSize: number): boolean {
	return ringSize === CURRENT_RING_SIZE;
}

export function getRingSizeForHardfork(version: keyof typeof RING_SIZE_HISTORY): {
	min: number;
	max: number;
	default: number;
} {
	return RING_SIZE_HISTORY[version];
}

export function getDecoySelectionParameters(): typeof DECOY_SELECTION {
	return DECOY_SELECTION;
}

export function estimateTransactionSize(
	numInputs: number,
	numOutputs: number,
	ringSize: number = CURRENT_RING_SIZE,
): number {
	const baseSize = TX_SIZE_ESTIMATES.BASE;
	const inputSize = numInputs * TX_SIZE_ESTIMATES.PER_INPUT;
	const outputSize = numOutputs * TX_SIZE_ESTIMATES.PER_OUTPUT;
	const mixinSize = numInputs * (ringSize - 1) * TX_SIZE_ESTIMATES.PER_MIXIN;
	return baseSize + inputSize + outputSize + mixinSize;
}

export function calculateEffectiveRingSize(
	declaredRingSize: number,
	knownSpentOutputs: number = 0,
): number {
	return Math.max(1, declaredRingSize - knownSpentOutputs);
}

export function getRingPrivacyExplanation(): string {
	return `Monero uses ring signatures with ${CURRENT_RING_SIZE} members (1 real + ${CURRENT_RING_SIZE - 1} decoys) ` +
		`to obscure the true source of funds. This provides plausible deniability ` +
		`as any of the ${CURRENT_RING_SIZE} possible inputs could be the real one.`;
}
