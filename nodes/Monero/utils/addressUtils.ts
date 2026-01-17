/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	ADDRESS_LENGTHS,
	ADDRESS_TYPES,
	ADDRESS_FIRST_CHARS,
	PAYMENT_ID_LENGTHS,
	type AddressType,
} from '../constants/addresses';
import type { NetworkType } from '../constants/networks';

export function isValidAddressFormat(address: string): boolean {
	if (!address || typeof address !== 'string') return false;
	const validLength = address.length === ADDRESS_LENGTHS.STANDARD || address.length === ADDRESS_LENGTHS.INTEGRATED;
	const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
	return validLength && base58Regex.test(address);
}

export function detectAddressType(address: string): AddressType {
	if (!isValidAddressFormat(address)) return 'unknown';
	if (address.length === ADDRESS_LENGTHS.INTEGRATED) return 'integrated';
	const firstChar = address[0];
	if (firstChar === '8' || firstChar === '7' || firstChar === 'B') return 'subaddress';
	return 'standard';
}

export function getAddressTypeLabel(type: AddressType): string {
	return ADDRESS_TYPES[type];
}

export function detectNetworkFromAddress(address: string): NetworkType | 'unknown' {
	if (!isValidAddressFormat(address)) return 'unknown';
	const firstChar = address[0];
	for (const [network, chars] of Object.entries(ADDRESS_FIRST_CHARS)) {
		if ((chars as readonly string[]).includes(firstChar)) {
			return network as NetworkType;
		}
	}
	return 'unknown';
}

export function isValidPaymentId(paymentId: string, type: 'short' | 'long' = 'long'): boolean {
	if (!paymentId || typeof paymentId !== 'string') return false;
	const expectedLength = type === 'short' ? PAYMENT_ID_LENGTHS.SHORT : PAYMENT_ID_LENGTHS.LONG;
	const hexRegex = /^[0-9a-fA-F]+$/;
	return paymentId.length === expectedLength && hexRegex.test(paymentId);
}

export function generateRandomPaymentId(type: 'short' | 'long' = 'long'): string {
	const length = type === 'short' ? PAYMENT_ID_LENGTHS.SHORT : PAYMENT_ID_LENGTHS.LONG;
	const bytes = new Uint8Array(length / 2);
	if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
		crypto.getRandomValues(bytes);
	} else {
		for (let i = 0; i < bytes.length; i++) {
			bytes[i] = Math.floor(Math.random() * 256);
		}
	}
	return Array.from(bytes)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

export function formatAddressForDisplay(address: string, prefixLength: number = 6, suffixLength: number = 6): string {
	if (!address || address.length < prefixLength + suffixLength + 3) return address;
	return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}
