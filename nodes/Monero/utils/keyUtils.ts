/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { KEY_CONSTANTS, MNEMONIC } from '../constants';

export function isValidPrivateKey(key: string): boolean {
	if (!key || typeof key !== 'string') return false;
	const hexRegex = /^[0-9a-fA-F]+$/;
	return key.length === KEY_CONSTANTS.PRIVATE_KEY_LENGTH && hexRegex.test(key);
}

export function isValidPublicKey(key: string): boolean {
	if (!key || typeof key !== 'string') return false;
	const hexRegex = /^[0-9a-fA-F]+$/;
	return key.length === KEY_CONSTANTS.PUBLIC_KEY_LENGTH && hexRegex.test(key);
}

export function isValidKeyImage(keyImage: string): boolean {
	if (!keyImage || typeof keyImage !== 'string') return false;
	const hexRegex = /^[0-9a-fA-F]+$/;
	return keyImage.length === KEY_CONSTANTS.KEY_IMAGE_LENGTH && hexRegex.test(keyImage);
}

export function isValidTxHash(txHash: string): boolean {
	if (!txHash || typeof txHash !== 'string') return false;
	const hexRegex = /^[0-9a-fA-F]+$/;
	return txHash.length === KEY_CONSTANTS.TX_HASH_LENGTH && hexRegex.test(txHash);
}

export function isValidMnemonicSeed(seed: string): boolean {
	if (!seed || typeof seed !== 'string') return false;
	const words = seed.trim().toLowerCase().split(/\s+/);
	return words.length === MNEMONIC.WORD_COUNT;
}

export function getMnemonicWordCount(seed: string): number {
	if (!seed || typeof seed !== 'string') return 0;
	return seed.trim().split(/\s+/).length;
}

export function maskKey(key: string, visibleChars: number = 8): string {
	if (!key || key.length <= visibleChars * 2) return key;
	const prefix = key.slice(0, visibleChars);
	const suffix = key.slice(-visibleChars);
	return `${prefix}...${suffix}`;
}

export function maskSeed(seed: string, visibleWords: number = 2): string {
	if (!seed) return seed;
	const words = seed.trim().split(/\s+/);
	if (words.length <= visibleWords * 2) return seed;
	const prefix = words.slice(0, visibleWords).join(' ');
	const suffix = words.slice(-visibleWords).join(' ');
	const hiddenCount = words.length - visibleWords * 2;
	return `${prefix} [${hiddenCount} words hidden] ${suffix}`;
}

export function getSupportedMnemonicLanguages(): readonly string[] {
	return MNEMONIC.LANGUAGES;
}

export function clearSensitiveString(_str: string): void {
	// JavaScript cannot securely clear strings from memory
	// This is a best-effort placeholder for documentation purposes
}
