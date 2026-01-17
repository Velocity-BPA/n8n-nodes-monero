/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export type ProofType = 'tx' | 'spend' | 'reserve';

export const PROOF_PREFIXES = {
	tx: 'OutProofV',
	spend: 'SpendProofV',
	reserve: 'ReserveProofV',
} as const;

export const PROOF_TYPES: Record<ProofType, string> = {
	tx: 'Transaction Proof',
	spend: 'Spend Proof',
	reserve: 'Reserve Proof',
} as const;

export const PROOF_PRIVACY_INFO = {
	tx: {
		reveals: ['Amount sent', 'Destination address', 'Transaction ID'] as const,
		protects: ['Sender address', 'Other outputs in transaction', 'Change amount'] as const,
		recommendation: 'Use only when necessary to prove payment',
	},
	spend: {
		reveals: ['That you spent a specific output', 'Key image'] as const,
		protects: ['Amount', 'Destination', 'Other transaction details'] as const,
		recommendation: 'Use to prove you made a specific spend',
	},
	reserve: {
		reveals: ['Total balance or portion', 'Address ownership'] as const,
		protects: ['Transaction history', 'Individual UTXOs'] as const,
		recommendation: 'Use for proof of funds verification',
	},
} as const;

export function detectProofType(proof: string): ProofType | null {
	if (!proof || typeof proof !== 'string') return null;
	for (const [type, prefix] of Object.entries(PROOF_PREFIXES)) {
		if (proof.startsWith(prefix)) {
			return type as ProofType;
		}
	}
	return null;
}

export function isValidProofFormat(proof: string): boolean {
	return detectProofType(proof) !== null;
}

export function getProofTypeLabel(type: ProofType): string {
	return PROOF_TYPES[type];
}

export function getProofPrivacyInfo(type: ProofType): {
	reveals: readonly string[];
	protects: readonly string[];
	recommendation: string;
} | undefined {
	return PROOF_PRIVACY_INFO[type as keyof typeof PROOF_PRIVACY_INFO];
}

export function formatProofForDisplay(proof: string, maxLength: number = 50): string {
	if (!proof || proof.length <= maxLength) return proof;
	return `${proof.slice(0, maxLength)}...`;
}
