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

export class WalletRpcTransport {
	private client: AxiosInstance;
	private requestId = 0;

	constructor(baseUrl: string, username?: string, password?: string) {
		const auth = username && password ? { username, password } : undefined;
		this.client = axios.create({
			baseURL: baseUrl,
			headers: { 'Content-Type': 'application/json' },
			auth,
			timeout: 60000,
		});
	}

	static async fromCredentials(context: IExecuteFunctions): Promise<WalletRpcTransport> {
		const credentials = await context.getCredentials('moneroNetworkApi');
		const baseUrl = credentials.walletRpcUrl as string;
		const username = credentials.walletUsername as string | undefined;
		const password = credentials.walletPassword as string | undefined;
		return new WalletRpcTransport(baseUrl, username, password);
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
			throw new Error(`Wallet RPC Error: ${response.data.error.message}`);
		}

		return response.data.result as T;
	}

	async getBalance(params?: { account_index?: number }): Promise<{
		balance: number;
		unlocked_balance: number;
		multisig_import_needed: boolean;
		per_subaddress: Array<Record<string, unknown>>;
	}> {
		return this.call('get_balance', params);
	}

	async getAddress(params?: { account_index?: number; address_index?: number[] }): Promise<{
		address: string;
		addresses: Array<{ address: string; address_index: number; label: string; used: boolean }>;
	}> {
		return this.call('get_address', params);
	}

	async getHeight(): Promise<{ height: number }> {
		return this.call('get_height');
	}

	async createWallet(params: {
		filename: string;
		password?: string;
		language?: string;
	}): Promise<Record<string, unknown>> {
		return this.call('create_wallet', params);
	}

	async openWallet(params: { filename: string; password?: string }): Promise<Record<string, unknown>> {
		return this.call('open_wallet', params);
	}

	async closeWallet(): Promise<Record<string, unknown>> {
		return this.call('close_wallet');
	}

	async restoreWalletFromSeed(params: {
		filename: string;
		password?: string;
		seed: string;
		restore_height?: number;
		language?: string;
	}): Promise<{ address: string; info: string }> {
		return this.call('restore_deterministic_wallet', {
			filename: params.filename,
			password: params.password || '',
			seed: params.seed,
			restore_height: params.restore_height || 0,
			language: params.language || 'English',
		});
	}

	async refresh(): Promise<{ blocks_fetched: number; received_money: boolean }> {
		return this.call('refresh');
	}

	async getAccounts(params?: { tag?: string }): Promise<{
		subaddress_accounts: Array<{
			account_index: number;
			base_address: string;
			balance: number;
			unlocked_balance: number;
			label: string;
			tag: string;
		}>;
		total_balance: number;
		total_unlocked_balance: number;
	}> {
		return this.call('get_accounts', params);
	}

	async createAccount(params?: { label?: string }): Promise<{
		account_index: number;
		address: string;
	}> {
		return this.call('create_account', params);
	}

	async createAddress(params: { account_index: number; label?: string }): Promise<{
		address: string;
		address_index: number;
	}> {
		return this.call('create_address', params);
	}

	async transfer(params: {
		destinations: Array<{ amount: number; address: string }>;
		account_index?: number;
		subaddr_indices?: number[];
		priority?: number;
		ring_size?: number;
		unlock_time?: number;
		get_tx_key?: boolean;
		do_not_relay?: boolean;
		get_tx_hex?: boolean;
	}): Promise<{
		amount: number;
		fee: number;
		tx_hash: string;
		tx_key: string;
		tx_blob: string;
	}> {
		return this.call('transfer', params);
	}

	async sweepAll(params: {
		address: string;
		account_index?: number;
		subaddr_indices?: number[];
		priority?: number;
		ring_size?: number;
		unlock_time?: number;
		get_tx_keys?: boolean;
		below_amount?: number;
	}): Promise<{
		tx_hash_list: string[];
		tx_key_list: string[];
		amount_list: number[];
		fee_list: number[];
	}> {
		return this.call('sweep_all', params);
	}

	async getTransfers(params: {
		in?: boolean;
		out?: boolean;
		pending?: boolean;
		failed?: boolean;
		pool?: boolean;
		filter_by_height?: boolean;
		min_height?: number;
		max_height?: number;
		account_index?: number;
		subaddr_indices?: number[];
	}): Promise<{
		in?: Array<Record<string, unknown>>;
		out?: Array<Record<string, unknown>>;
		pending?: Array<Record<string, unknown>>;
		failed?: Array<Record<string, unknown>>;
		pool?: Array<Record<string, unknown>>;
	}> {
		return this.call('get_transfers', params);
	}

	async getTransferByTxid(params: { txid: string; account_index?: number }): Promise<{
		transfer: {
			amount: number;
			confirmations: number;
			height: number;
			fee: number;
			txid: string;
			[key: string]: unknown;
		};
	}> {
		return this.call('get_transfer_by_txid', params);
	}

	async validateAddress(params: { address: string; any_net_type?: boolean }): Promise<{
		valid: boolean;
		integrated: boolean;
		subaddress: boolean;
		nettype: string;
		openalias_address: string;
	}> {
		return this.call('validate_address', params);
	}

	async makeUri(params: {
		address: string;
		amount?: number;
		payment_id?: string;
		recipient_name?: string;
		tx_description?: string;
	}): Promise<{ uri: string }> {
		return this.call('make_uri', params);
	}

	async parseUri(uri: string): Promise<{
		uri: {
			address: string;
			amount: number;
			payment_id: string;
			recipient_name: string;
			tx_description: string;
		};
	}> {
		return this.call('parse_uri', { uri });
	}

	async queryKey(keyType: 'mnemonic' | 'view_key' | 'spend_key'): Promise<{ key: string }> {
		return this.call('query_key', { key_type: keyType });
	}

	async sign(data: string): Promise<{ signature: string }> {
		return this.call('sign', { data });
	}

	async verify(params: { data: string; address: string; signature: string }): Promise<{ good: boolean }> {
		return this.call('verify', params);
	}

	async exportKeyImages(all?: boolean): Promise<{
		signed_key_images: Array<{ key_image: string; signature: string }>;
	}> {
		return this.call('export_key_images', { all });
	}

	async importKeyImages(signed_key_images: Array<{ key_image: string; signature: string }>): Promise<{
		height: number;
		spent: number;
		unspent: number;
	}> {
		return this.call('import_key_images', { signed_key_images });
	}
}
