/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import BigNumber from 'bignumber.js';

const PICONERO_PER_XMR = new BigNumber('1000000000000');
const DECIMALS = 12;

BigNumber.config({
	DECIMAL_PLACES: DECIMALS,
	ROUNDING_MODE: BigNumber.ROUND_DOWN,
});

export function piconeroToXmr(piconero: string | number | bigint): string {
	const bn = new BigNumber(piconero.toString());
	return bn.dividedBy(PICONERO_PER_XMR).toFixed(DECIMALS);
}

export function xmrToPiconero(xmr: string | number): string {
	const bn = new BigNumber(xmr.toString());
	return bn.multipliedBy(PICONERO_PER_XMR).integerValue(BigNumber.ROUND_DOWN).toString();
}

export function formatXmr(piconero: string | number | bigint, decimals: number = DECIMALS): string {
	const xmr = piconeroToXmr(piconero);
	const bn = new BigNumber(xmr);
	return bn.toFixed(decimals);
}

export function formatXmrWithSymbol(piconero: string | number | bigint, decimals: number = DECIMALS): string {
	return `${formatXmr(piconero, decimals)} XMR`;
}

export function isValidPiconeroAmount(amount: string | number): boolean {
	try {
		const bn = new BigNumber(amount.toString());
		return bn.isInteger() && bn.isGreaterThanOrEqualTo(0);
	} catch {
		return false;
	}
}

export function isValidXmrAmount(amount: string | number): boolean {
	try {
		const bn = new BigNumber(amount.toString());
		return bn.isGreaterThanOrEqualTo(0) && bn.decimalPlaces()! <= DECIMALS;
	} catch {
		return false;
	}
}

export function addPiconero(a: string | number, b: string | number): string {
	const bnA = new BigNumber(a.toString());
	const bnB = new BigNumber(b.toString());
	return bnA.plus(bnB).toString();
}

export function subtractPiconero(a: string | number, b: string | number): string {
	const bnA = new BigNumber(a.toString());
	const bnB = new BigNumber(b.toString());
	return bnA.minus(bnB).toString();
}

export function comparePiconero(a: string | number, b: string | number): number {
	const bnA = new BigNumber(a.toString());
	const bnB = new BigNumber(b.toString());
	const result = bnA.comparedTo(bnB);
	return result === null ? 0 : result;
}
