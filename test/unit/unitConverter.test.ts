/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	piconeroToXmr,
	xmrToPiconero,
	formatXmr,
	formatXmrWithSymbol,
	isValidPiconeroAmount,
	isValidXmrAmount,
	addPiconero,
	subtractPiconero,
	comparePiconero,
} from '../../nodes/Monero/utils/unitConverter';

describe('Unit Converter', () => {
	describe('piconeroToXmr', () => {
		it('should convert piconero to XMR correctly', () => {
			expect(piconeroToXmr('1000000000000')).toBe('1.000000000000');
			expect(piconeroToXmr('500000000000')).toBe('0.500000000000');
			expect(piconeroToXmr('1')).toBe('0.000000000001');
			expect(piconeroToXmr('0')).toBe('0.000000000000');
		});

		it('should handle large amounts', () => {
			expect(piconeroToXmr('18446744073709551615')).toBeDefined();
		});
	});

	describe('xmrToPiconero', () => {
		it('should convert XMR to piconero correctly', () => {
			expect(xmrToPiconero('1')).toBe('1000000000000');
			expect(xmrToPiconero('0.5')).toBe('500000000000');
			expect(xmrToPiconero('0.000000000001')).toBe('1');
			expect(xmrToPiconero('0')).toBe('0');
		});

		it('should handle decimal precision', () => {
			expect(xmrToPiconero('1.123456789012')).toBe('1123456789012');
		});
	});

	describe('formatXmr', () => {
		it('should format XMR with correct decimals', () => {
			expect(formatXmr('1000000000000')).toBe('1.000000000000');
			expect(formatXmr('1000000000000', 4)).toBe('1.0000');
		});
	});

	describe('formatXmrWithSymbol', () => {
		it('should format XMR with symbol', () => {
			expect(formatXmrWithSymbol('1000000000000')).toBe('1.000000000000 XMR');
		});
	});

	describe('isValidPiconeroAmount', () => {
		it('should validate piconero amounts', () => {
			expect(isValidPiconeroAmount('1000000000000')).toBe(true);
			expect(isValidPiconeroAmount('0')).toBe(true);
			expect(isValidPiconeroAmount('-1')).toBe(false);
			expect(isValidPiconeroAmount('1.5')).toBe(false);
		});
	});

	describe('isValidXmrAmount', () => {
		it('should validate XMR amounts', () => {
			expect(isValidXmrAmount('1.5')).toBe(true);
			expect(isValidXmrAmount('0')).toBe(true);
			expect(isValidXmrAmount('-1')).toBe(false);
		});
	});

	describe('arithmetic operations', () => {
		it('should add piconero correctly', () => {
			expect(addPiconero('1000000000000', '500000000000')).toBe('1500000000000');
		});

		it('should subtract piconero correctly', () => {
			expect(subtractPiconero('1000000000000', '500000000000')).toBe('500000000000');
		});

		it('should compare piconero correctly', () => {
			expect(comparePiconero('1000000000000', '500000000000')).toBe(1);
			expect(comparePiconero('500000000000', '1000000000000')).toBe(-1);
			expect(comparePiconero('1000000000000', '1000000000000')).toBe(0);
		});
	});
});
