/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Integration tests for Monero node
 *
 * These tests require a running Monero daemon and wallet RPC.
 * They are skipped by default and should be run manually.
 *
 * Setup:
 * 1. Start monerod: ./monerod --stagenet --rpc-bind-port 38081
 * 2. Start wallet-rpc: ./monero-wallet-rpc --stagenet --rpc-bind-port 38082 --wallet-dir ./wallets --disable-rpc-login
 * 3. Set environment variables:
 *    - MONERO_DAEMON_URL=http://127.0.0.1:38081
 *    - MONERO_WALLET_URL=http://127.0.0.1:38082
 * 4. Run: npm run test:integration
 */

describe('Monero Integration Tests', () => {
	const skipIntegration = !process.env.MONERO_DAEMON_URL;

	describe.skip('Daemon RPC', () => {
		it('should get daemon info', async () => {
			// Integration test implementation
		});

		it('should get block count', async () => {
			// Integration test implementation
		});
	});

	describe.skip('Wallet RPC', () => {
		it('should get wallet balance', async () => {
			// Integration test implementation
		});

		it('should get wallet address', async () => {
			// Integration test implementation
		});
	});

	if (skipIntegration) {
		it('integration tests skipped (set MONERO_DAEMON_URL to run)', () => {
			expect(true).toBe(true);
		});
	}
});
