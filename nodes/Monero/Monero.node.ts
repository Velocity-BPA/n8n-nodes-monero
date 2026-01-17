/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { DaemonRpcTransport, WalletRpcTransport } from './transport';
import { piconeroToXmr, xmrToPiconero, formatXmrWithSymbol, isValidAddressFormat, detectAddressType, detectNetworkFromAddress } from './utils';
import { CURRENT_RING_SIZE } from './constants';

// Runtime licensing notice - logged once per node load
const LICENSING_NOTICE = `[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`;

let licensingNoticeLogged = false;

export class Monero implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Monero',
		name: 'monero',
		icon: 'file:monero.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Monero blockchain - transactions, wallets, mining, and more',
		defaults: { name: 'Monero' },
		inputs: ['main'],
		outputs: ['main'],
		credentials: [{ name: 'moneroNetworkApi', required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Wallet', value: 'wallet' },
					{ name: 'Account', value: 'account' },
					{ name: 'Transaction', value: 'transaction' },
					{ name: 'Block', value: 'block' },
					{ name: 'Daemon', value: 'daemon' },
					{ name: 'Mining', value: 'mining' },
					{ name: 'Utility', value: 'utility' },
				],
				default: 'wallet',
			},
			// WALLET OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['wallet'] } },
				options: [
					{ name: 'Get Balance', value: 'getBalance', action: 'Get wallet balance' },
					{ name: 'Get Address', value: 'getAddress', action: 'Get address' },
					{ name: 'Get Height', value: 'getHeight', action: 'Get wallet height' },
					{ name: 'Create Wallet', value: 'createWallet', action: 'Create wallet' },
					{ name: 'Open Wallet', value: 'openWallet', action: 'Open wallet' },
					{ name: 'Close Wallet', value: 'closeWallet', action: 'Close wallet' },
					{ name: 'Restore From Seed', value: 'restoreFromSeed', action: 'Restore from seed' },
					{ name: 'Refresh', value: 'refresh', action: 'Refresh wallet' },
				],
				default: 'getBalance',
			},
			// ACCOUNT OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['account'] } },
				options: [
					{ name: 'Get Accounts', value: 'getAccounts', action: 'Get accounts' },
					{ name: 'Create Account', value: 'createAccount', action: 'Create account' },
					{ name: 'Create Subaddress', value: 'createSubaddress', action: 'Create subaddress' },
				],
				default: 'getAccounts',
			},
			// TRANSACTION OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['transaction'] } },
				options: [
					{ name: 'Transfer', value: 'transfer', action: 'Transfer XMR' },
					{ name: 'Sweep All', value: 'sweepAll', action: 'Sweep all' },
					{ name: 'Get Transfers', value: 'getTransfers', action: 'Get transfers' },
					{ name: 'Get Transfer By ID', value: 'getTransferById', action: 'Get transfer by ID' },
				],
				default: 'transfer',
			},
			// BLOCK OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['block'] } },
				options: [
					{ name: 'Get Block', value: 'getBlock', action: 'Get block' },
					{ name: 'Get Block Count', value: 'getBlockCount', action: 'Get block count' },
					{ name: 'Get Last Block Header', value: 'getLastBlockHeader', action: 'Get last block header' },
				],
				default: 'getBlockCount',
			},
			// DAEMON OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['daemon'] } },
				options: [
					{ name: 'Get Info', value: 'getInfo', action: 'Get daemon info' },
					{ name: 'Get Version', value: 'getVersion', action: 'Get daemon version' },
					{ name: 'Get Height', value: 'getHeight', action: 'Get height' },
					{ name: 'Get Fee Estimate', value: 'getFeeEstimate', action: 'Get fee estimate' },
				],
				default: 'getInfo',
			},
			// MINING OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['mining'] } },
				options: [
					{ name: 'Get Mining Status', value: 'getMiningStatus', action: 'Get mining status' },
					{ name: 'Start Mining', value: 'startMining', action: 'Start mining' },
					{ name: 'Stop Mining', value: 'stopMining', action: 'Stop mining' },
				],
				default: 'getMiningStatus',
			},
			// UTILITY OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['utility'] } },
				options: [
					{ name: 'Convert Units', value: 'convertUnits', action: 'Convert units' },
					{ name: 'Validate Address', value: 'validateAddress', action: 'Validate address' },
					{ name: 'Make URI', value: 'makeUri', action: 'Make URI' },
					{ name: 'Parse URI', value: 'parseUri', action: 'Parse URI' },
				],
				default: 'convertUnits',
			},
			// PARAMETERS
			{
				displayName: 'Wallet Filename',
				name: 'walletFilename',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { resource: ['wallet'], operation: ['createWallet', 'openWallet', 'restoreFromSeed'] } },
			},
			{
				displayName: 'Wallet Password',
				name: 'walletPassword',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				displayOptions: { show: { resource: ['wallet'], operation: ['createWallet', 'openWallet', 'restoreFromSeed'] } },
			},
			{
				displayName: 'Mnemonic Seed',
				name: 'mnemonicSeed',
				type: 'string',
				typeOptions: { password: true, rows: 3 },
				default: '',
				required: true,
				displayOptions: { show: { resource: ['wallet'], operation: ['restoreFromSeed'] } },
				description: '25-word Monero mnemonic seed phrase',
			},
			{
				displayName: 'Restore Height',
				name: 'restoreHeight',
				type: 'number',
				default: 0,
				displayOptions: { show: { resource: ['wallet'], operation: ['restoreFromSeed'] } },
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'options',
				options: [
					{ name: 'English', value: 'English' },
					{ name: 'Spanish', value: 'Spanish' },
					{ name: 'German', value: 'German' },
					{ name: 'Japanese', value: 'Japanese' },
				],
				default: 'English',
				displayOptions: { show: { resource: ['wallet'], operation: ['createWallet', 'restoreFromSeed'] } },
			},
			{
				displayName: 'Account Index',
				name: 'accountIndex',
				type: 'number',
				default: 0,
				displayOptions: { show: { resource: ['account', 'transaction'], operation: ['createSubaddress', 'transfer', 'sweepAll', 'getTransfers'] } },
			},
			{
				displayName: 'Label',
				name: 'label',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['account'], operation: ['createAccount', 'createSubaddress'] } },
			},
			{
				displayName: 'Destination Address',
				name: 'destinationAddress',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { resource: ['transaction'], operation: ['transfer', 'sweepAll'] } },
			},
			{
				displayName: 'Amount (XMR)',
				name: 'amount',
				type: 'number',
				default: 0,
				required: true,
				typeOptions: { numberPrecision: 12 },
				displayOptions: { show: { resource: ['transaction'], operation: ['transfer'] } },
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options',
				options: [
					{ name: 'Low Fee', value: 1 },
					{ name: 'Normal', value: 2 },
					{ name: 'Elevated', value: 3 },
					{ name: 'High Fee', value: 4 },
				],
				default: 2,
				displayOptions: { show: { resource: ['transaction'], operation: ['transfer', 'sweepAll'] } },
			},
			{
				displayName: 'Transaction ID',
				name: 'txid',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { resource: ['transaction'], operation: ['getTransferById'] } },
			},
			{
				displayName: 'Block Height',
				name: 'blockHeight',
				type: 'number',
				default: 0,
				displayOptions: { show: { resource: ['block'], operation: ['getBlock'] } },
			},
			{
				displayName: 'Miner Address',
				name: 'minerAddress',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { resource: ['mining'], operation: ['startMining'] } },
			},
			{
				displayName: 'Threads',
				name: 'threads',
				type: 'number',
				default: 1,
				displayOptions: { show: { resource: ['mining'], operation: ['startMining'] } },
			},
			{
				displayName: 'Conversion Direction',
				name: 'conversionDirection',
				type: 'options',
				options: [
					{ name: 'XMR to Piconero', value: 'xmrToPiconero' },
					{ name: 'Piconero to XMR', value: 'piconeroToXmr' },
				],
				default: 'xmrToPiconero',
				displayOptions: { show: { resource: ['utility'], operation: ['convertUnits'] } },
			},
			{
				displayName: 'Value',
				name: 'conversionValue',
				type: 'string',
				default: '0',
				required: true,
				displayOptions: { show: { resource: ['utility'], operation: ['convertUnits'] } },
			},
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { resource: ['utility'], operation: ['validateAddress', 'makeUri'] } },
			},
			{
				displayName: 'URI',
				name: 'uri',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { resource: ['utility'], operation: ['parseUri'] } },
			},
			{
				displayName: 'URI Amount (XMR)',
				name: 'uriAmount',
				type: 'number',
				default: 0,
				typeOptions: { numberPrecision: 12 },
				displayOptions: { show: { resource: ['utility'], operation: ['makeUri'] } },
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Log licensing notice once per node load
		if (!licensingNoticeLogged) {
			console.warn(LICENSING_NOTICE);
			licensingNoticeLogged = true;
		}

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		let daemonRpc: DaemonRpcTransport | undefined;
		let walletRpc: WalletRpcTransport | undefined;

		try {
			const daemonResources = ['block', 'daemon', 'mining'];
			const walletResources = ['wallet', 'account', 'transaction'];

			if (daemonResources.includes(resource)) {
				daemonRpc = await DaemonRpcTransport.fromCredentials(this);
			}
			if (walletResources.includes(resource) || resource === 'utility') {
				walletRpc = await WalletRpcTransport.fromCredentials(this);
			}

			for (let i = 0; i < items.length; i++) {
				try {
					let responseData: IDataObject = {};

					// WALLET
					if (resource === 'wallet') {
						if (operation === 'getBalance') {
							const result = await walletRpc!.getBalance();
							responseData = {
								balance: piconeroToXmr(result.balance),
								unlockedBalance: piconeroToXmr(result.unlocked_balance),
								formatted: formatXmrWithSymbol(result.balance),
							};
						} else if (operation === 'getAddress') {
							const result = await walletRpc!.getAddress();
							responseData = {
								address: result.address,
								addressType: detectAddressType(result.address),
								network: detectNetworkFromAddress(result.address),
							};
						} else if (operation === 'getHeight') {
							const result = await walletRpc!.getHeight();
							responseData = { height: result.height };
						} else if (operation === 'createWallet') {
							const filename = this.getNodeParameter('walletFilename', i) as string;
							const password = this.getNodeParameter('walletPassword', i) as string;
							const language = this.getNodeParameter('language', i) as string;
							await walletRpc!.createWallet({ filename, password, language });
							responseData = { success: true, filename };
						} else if (operation === 'openWallet') {
							const filename = this.getNodeParameter('walletFilename', i) as string;
							const password = this.getNodeParameter('walletPassword', i) as string;
							await walletRpc!.openWallet({ filename, password });
							responseData = { success: true, filename };
						} else if (operation === 'closeWallet') {
							await walletRpc!.closeWallet();
							responseData = { success: true };
						} else if (operation === 'restoreFromSeed') {
							const filename = this.getNodeParameter('walletFilename', i) as string;
							const password = this.getNodeParameter('walletPassword', i) as string;
							const seed = this.getNodeParameter('mnemonicSeed', i) as string;
							const restoreHeight = this.getNodeParameter('restoreHeight', i) as number;
							const language = this.getNodeParameter('language', i) as string;
							const result = await walletRpc!.restoreWalletFromSeed({ filename, password, seed, restore_height: restoreHeight, language });
							responseData = { address: result.address, info: result.info };
						} else if (operation === 'refresh') {
							const result = await walletRpc!.refresh();
							responseData = { blocksFetched: result.blocks_fetched, receivedMoney: result.received_money };
						}
					}

					// ACCOUNT
					else if (resource === 'account') {
						if (operation === 'getAccounts') {
							const result = await walletRpc!.getAccounts();
							responseData = {
								accounts: result.subaddress_accounts.map(acc => ({
									...acc,
									balance: piconeroToXmr(acc.balance),
									unlockedBalance: piconeroToXmr(acc.unlocked_balance),
								})),
								totalBalance: piconeroToXmr(result.total_balance),
							};
						} else if (operation === 'createAccount') {
							const label = this.getNodeParameter('label', i) as string;
							const result = await walletRpc!.createAccount({ label });
							responseData = { accountIndex: result.account_index, address: result.address };
						} else if (operation === 'createSubaddress') {
							const accountIndex = this.getNodeParameter('accountIndex', i) as number;
							const label = this.getNodeParameter('label', i) as string;
							const result = await walletRpc!.createAddress({ account_index: accountIndex, label });
							responseData = { address: result.address, addressIndex: result.address_index };
						}
					}

					// TRANSACTION
					else if (resource === 'transaction') {
						if (operation === 'transfer') {
							const address = this.getNodeParameter('destinationAddress', i) as string;
							const amountXmr = this.getNodeParameter('amount', i) as number;
							const priority = this.getNodeParameter('priority', i) as number;
							const accountIndex = this.getNodeParameter('accountIndex', i) as number;
							if (!isValidAddressFormat(address)) {
								throw new NodeOperationError(this.getNode(), 'Invalid destination address format', { itemIndex: i });
							}
							const amountPiconero = parseInt(xmrToPiconero(amountXmr), 10);
							const result = await walletRpc!.transfer({
								destinations: [{ amount: amountPiconero, address }],
								account_index: accountIndex,
								priority,
								ring_size: CURRENT_RING_SIZE,
								get_tx_key: true,
							});
							responseData = { txHash: result.tx_hash, txKey: result.tx_key, amount: piconeroToXmr(result.amount), fee: piconeroToXmr(result.fee) };
						} else if (operation === 'sweepAll') {
							const address = this.getNodeParameter('destinationAddress', i) as string;
							const priority = this.getNodeParameter('priority', i) as number;
							const accountIndex = this.getNodeParameter('accountIndex', i) as number;
							const result = await walletRpc!.sweepAll({ address, account_index: accountIndex, priority, ring_size: CURRENT_RING_SIZE, get_tx_keys: true });
							responseData = { txHashes: result.tx_hash_list, amounts: result.amount_list.map(a => piconeroToXmr(a)) };
						} else if (operation === 'getTransfers') {
							const accountIndex = this.getNodeParameter('accountIndex', i) as number;
							const result = await walletRpc!.getTransfers({ in: true, out: true, pending: true, pool: true, account_index: accountIndex });
							responseData = {
								incoming: (result.in || []).map(tx => ({ ...tx, amount: piconeroToXmr((tx as { amount: number }).amount) })),
								outgoing: (result.out || []).map(tx => ({ ...tx, amount: piconeroToXmr((tx as { amount: number }).amount) })),
							};
						} else if (operation === 'getTransferById') {
							const txid = this.getNodeParameter('txid', i) as string;
							const result = await walletRpc!.getTransferByTxid({ txid });
							responseData = { ...result.transfer, amount: piconeroToXmr(result.transfer.amount) };
						}
					}

					// BLOCK
					else if (resource === 'block') {
						if (operation === 'getBlock') {
							const height = this.getNodeParameter('blockHeight', i) as number;
							const result = await daemonRpc!.getBlock({ height });
							responseData = { blockHeader: result.block_header, txHashes: result.tx_hashes };
						} else if (operation === 'getBlockCount') {
							const result = await daemonRpc!.getBlockCount();
							responseData = { count: result.count };
						} else if (operation === 'getLastBlockHeader') {
							const result = await daemonRpc!.getLastBlockHeader();
							responseData = { blockHeader: result.block_header };
						}
					}

					// DAEMON
					else if (resource === 'daemon') {
						if (operation === 'getInfo') {
							const result = await daemonRpc!.getInfo();
							responseData = result as unknown as IDataObject;
						} else if (operation === 'getVersion') {
							const result = await daemonRpc!.getVersion();
							responseData = { version: result.version, release: result.release };
						} else if (operation === 'getHeight') {
							const result = await daemonRpc!.getHeight();
							responseData = { height: result.height };
						} else if (operation === 'getFeeEstimate') {
							const result = await daemonRpc!.getFeeEstimate();
							responseData = { fee: result.fee, feeXmrPerKb: piconeroToXmr(result.fee * 1000) };
						}
					}

					// MINING
					else if (resource === 'mining') {
						if (operation === 'getMiningStatus') {
							const result = await daemonRpc!.miningStatus();
							responseData = result as unknown as IDataObject;
						} else if (operation === 'startMining') {
							const minerAddress = this.getNodeParameter('minerAddress', i) as string;
							const threads = this.getNodeParameter('threads', i) as number;
							await daemonRpc!.startMining({ miner_address: minerAddress, threads_count: threads, do_background_mining: false, ignore_battery: false });
							responseData = { success: true };
						} else if (operation === 'stopMining') {
							await daemonRpc!.stopMining();
							responseData = { success: true };
						}
					}

					// UTILITY
					else if (resource === 'utility') {
						if (operation === 'convertUnits') {
							const direction = this.getNodeParameter('conversionDirection', i) as string;
							const value = this.getNodeParameter('conversionValue', i) as string;
							if (direction === 'xmrToPiconero') {
								responseData = { piconero: xmrToPiconero(value), xmr: value };
							} else {
								responseData = { xmr: piconeroToXmr(value), piconero: value };
							}
						} else if (operation === 'validateAddress') {
							const address = this.getNodeParameter('address', i) as string;
							const result = await walletRpc!.validateAddress({ address });
							responseData = { valid: result.valid, integrated: result.integrated, subaddress: result.subaddress, nettype: result.nettype };
						} else if (operation === 'makeUri') {
							const address = this.getNodeParameter('address', i) as string;
							const amount = this.getNodeParameter('uriAmount', i) as number;
							const result = await walletRpc!.makeUri({ address, amount: amount ? parseInt(xmrToPiconero(amount), 10) : undefined });
							responseData = { uri: result.uri };
						} else if (operation === 'parseUri') {
							const uri = this.getNodeParameter('uri', i) as string;
							const result = await walletRpc!.parseUri(uri);
							responseData = { ...result.uri, amount: result.uri.amount ? piconeroToXmr(result.uri.amount) : '0' };
						}
					}

					returnData.push({ json: responseData, pairedItem: { item: i } });
				} catch (error) {
					if (this.continueOnFail()) {
						returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
						continue;
					}
					throw error;
				}
			}
		} catch (error) {
			throw new NodeOperationError(this.getNode(), (error as Error).message);
		}

		return [returnData];
	}
}
