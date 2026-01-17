/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import axios, { AxiosInstance } from 'axios';
import type { IExecuteFunctions } from 'n8n-workflow';

interface JsonRpcRequest {
	jsonrpc: '2.0';
	id: string;
	method: string;
	params?: Record<string, unknown>;
}

interface JsonRpcResponse<T> {
	jsonrpc: '2.0';
	id: string;
	result?: T;
	error?: { code: number; message: string };
}

export class DaemonRpcTransport {
	private client: AxiosInstance;
	private requestId = 0;

	constructor(baseUrl: string, username?: string, password?: string) {
		const auth = username && password ? { username, password } : undefined;
		this.client = axios.create({
			baseURL: baseUrl,
			headers: { 'Content-Type': 'application/json' },
			auth,
			timeout: 30000,
		});
	}

	static async fromCredentials(context: IExecuteFunctions): Promise<DaemonRpcTransport> {
		const credentials = await context.getCredentials('moneroNetworkApi');
		const baseUrl = credentials.daemonRpcUrl as string;
		const username = credentials.daemonUsername as string | undefined;
		const password = credentials.daemonPassword as string | undefined;
		return new DaemonRpcTransport(baseUrl, username, password);
	}

	private getRequestId(): string {
		return String(this.requestId++);
	}

	private async call<T>(method: string, params?: Record<string, unknown>): Promise<T> {
		const request: JsonRpcRequest = {
			jsonrpc: '2.0',
			id: this.getRequestId(),
			method,
			params,
		};

		const response = await this.client.post<JsonRpcResponse<T>>('/json_rpc', request);

		if (response.data.error) {
			throw new Error(`Daemon RPC Error: ${response.data.error.message}`);
		}

		return response.data.result as T;
	}

	async getBlockCount(): Promise<{ count: number; status: string }> {
		return this.call('get_block_count');
	}

	async getBlockHash(height: number): Promise<string> {
		try {
			const response = await this.client.post<JsonRpcResponse<string>>('/json_rpc', {
				jsonrpc: '2.0',
				id: this.getRequestId(),
				method: 'on_get_block_hash',
				params: [height],
			});

			if (response.data.error) {
				throw new Error(`Daemon RPC Error: ${response.data.error.message}`);
			}

			return response.data.result as string;
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				throw new Error(`Daemon RPC Error: ${error.message}`);
			}
			throw error;
		}
	}

	async getBlock(params: { height?: number; hash?: string }): Promise<{
		block_header: Record<string, unknown>;
		tx_hashes: string[];
		blob: string;
		json: string;
	}> {
		return this.call('get_block', params);
	}

	async getLastBlockHeader(): Promise<{ block_header: Record<string, unknown> }> {
		return this.call('get_last_block_header');
	}

	async getBlockHeaderByHeight(height: number): Promise<{ block_header: Record<string, unknown> }> {
		return this.call('get_block_header_by_height', { height });
	}

	async getBlockHeaderByHash(hash: string): Promise<{ block_header: Record<string, unknown> }> {
		return this.call('get_block_header_by_hash', { hash });
	}

	async getBlockHeadersRange(startHeight: number, endHeight: number): Promise<{
		headers: Array<Record<string, unknown>>;
	}> {
		return this.call('get_block_headers_range', {
			start_height: startHeight,
			end_height: endHeight,
		});
	}

	async getInfo(): Promise<Record<string, unknown>> {
		return this.call('get_info');
	}

	async getVersion(): Promise<{ version: number; release: boolean }> {
		return this.call('get_version');
	}

	async getHeight(): Promise<{ height: number }> {
		const response = await this.client.get<{ height: number }>('/get_height');
		return response.data;
	}

	async getFeeEstimate(): Promise<{ fee: number; quantization_mask: number }> {
		return this.call('get_fee_estimate');
	}

	async getConnections(): Promise<{ connections: Array<Record<string, unknown>> }> {
		return this.call('get_connections');
	}

	async hardForkInfo(): Promise<Record<string, unknown>> {
		return this.call('hard_fork_info');
	}

	async syncInfo(): Promise<Record<string, unknown>> {
		return this.call('sync_info');
	}

	async getTxPool(): Promise<{
		transactions: Array<Record<string, unknown>>;
		spent_key_images: Array<Record<string, unknown>>;
	}> {
		return this.call('get_txpool_backlog');
	}

	async getTxPoolStats(): Promise<Record<string, unknown>> {
		return this.call('get_txpool_stats');
	}

	async flushTxPool(txids?: string[]): Promise<{ status: string }> {
		return this.call('flush_txpool', txids ? { txids } : undefined);
	}

	async getTransactions(params: {
		txs_hashes: string[];
		decode_as_json?: boolean;
	}): Promise<{ txs: Array<Record<string, unknown>>; status: string }> {
		const response = await this.client.post<{
			txs: Array<Record<string, unknown>>;
			status: string;
		}>('/get_transactions', params);
		return response.data;
	}

	async miningStatus(): Promise<Record<string, unknown>> {
		return this.call('mining_status');
	}

	async startMining(params: {
		miner_address: string;
		threads_count: number;
		do_background_mining: boolean;
		ignore_battery: boolean;
	}): Promise<{ status: string }> {
		return this.call('start_mining', params);
	}

	async stopMining(): Promise<{ status: string }> {
		return this.call('stop_mining');
	}

	async getOutputHistogram(params?: {
		amounts?: number[];
		min_count?: number;
		max_count?: number;
	}): Promise<{ histogram: Array<Record<string, unknown>> }> {
		return this.call('get_output_histogram', params);
	}

	async relayTx(txids: string[]): Promise<{ status: string }> {
		return this.call('relay_tx', { txids });
	}

	async getBans(): Promise<{ bans: Array<Record<string, unknown>> }> {
		return this.call('get_bans');
	}

	async setBans(bans: Array<{ host: string; ban: boolean; seconds: number }>): Promise<{ status: string }> {
		return this.call('set_bans', { bans });
	}
}
