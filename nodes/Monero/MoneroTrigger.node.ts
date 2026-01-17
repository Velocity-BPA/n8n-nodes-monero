/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IPollFunctions,
	INodeType,
	INodeTypeDescription,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

import { DaemonRpcTransport, WalletRpcTransport } from './transport';
import { piconeroToXmr } from './utils';

// Runtime licensing notice - logged once per node load
const LICENSING_NOTICE = `[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`;

let licensingNoticeLogged = false;

interface BlockHeader {
	hash: string;
	timestamp: number;
	difficulty: number;
	reward: number;
	num_txes: number;
	height: number;
	[key: string]: unknown;
}

interface Transfer {
	txid: string;
	amount: number;
	fee: number;
	address: string;
	height: number;
	timestamp: number;
	confirmations: number;
	[key: string]: unknown;
}

export class MoneroTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Monero Trigger',
		name: 'moneroTrigger',
		icon: 'file:monero.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Trigger on Monero blockchain events',
		defaults: { name: 'Monero Trigger' },
		inputs: [],
		outputs: ['main'],
		credentials: [{ name: 'moneroNetworkApi', required: true }],
		polling: true,
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				options: [
					{ name: 'New Block', value: 'newBlock', description: 'Trigger when a new block is mined' },
					{ name: 'Transaction Received', value: 'txReceived', description: 'Trigger when XMR is received' },
					{ name: 'Transaction Sent', value: 'txSent', description: 'Trigger when XMR is sent' },
					{ name: 'Balance Changed', value: 'balanceChanged', description: 'Trigger when balance changes' },
					{ name: 'Transaction Confirmed', value: 'txConfirmed', description: 'Trigger when TX reaches confirmations' },
				],
				default: 'newBlock',
				required: true,
			},
			{
				displayName: 'Confirmations Required',
				name: 'confirmations',
				type: 'number',
				default: 10,
				displayOptions: { show: { event: ['txConfirmed'] } },
				description: 'Number of confirmations to wait for',
			},
			{
				displayName: 'Account Index',
				name: 'accountIndex',
				type: 'number',
				default: 0,
				displayOptions: { show: { event: ['txReceived', 'txSent', 'balanceChanged'] } },
				description: 'Account to monitor',
			},
			{
				displayName: 'Minimum Amount (XMR)',
				name: 'minAmount',
				type: 'number',
				default: 0,
				typeOptions: { numberPrecision: 12 },
				displayOptions: { show: { event: ['txReceived', 'balanceChanged'] } },
				description: 'Minimum amount to trigger (0 = any)',
			},
		],
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		// Log licensing notice once per node load
		if (!licensingNoticeLogged) {
			console.warn(LICENSING_NOTICE);
			licensingNoticeLogged = true;
		}

		const event = this.getNodeParameter('event') as string;
		const webhookData = this.getWorkflowStaticData('node');
		const returnData: IDataObject[] = [];

		try {
			if (event === 'newBlock') {
				const daemonRpc = await DaemonRpcTransport.fromCredentials(this as unknown as Parameters<typeof DaemonRpcTransport.fromCredentials>[0]);
				const result = await daemonRpc.getBlockCount();
				const currentHeight = result.count;
				const lastHeight = (webhookData.lastHeight as number) || currentHeight;

				if (currentHeight > lastHeight) {
					for (let height = lastHeight + 1; height <= currentHeight; height++) {
						const headerResult = await daemonRpc.getBlockHeaderByHeight(height);
						const blockHeader = headerResult.block_header as BlockHeader;
						returnData.push({
							height,
							hash: blockHeader.hash,
							timestamp: blockHeader.timestamp,
							difficulty: blockHeader.difficulty,
							reward: piconeroToXmr(blockHeader.reward || 0),
							numTxs: blockHeader.num_txes || 0,
						});
					}
					webhookData.lastHeight = currentHeight;
				}
			} else if (event === 'txReceived' || event === 'txSent') {
				const walletRpc = await WalletRpcTransport.fromCredentials(this as unknown as Parameters<typeof WalletRpcTransport.fromCredentials>[0]);
				const accountIndex = this.getNodeParameter('accountIndex') as number;
				const minAmount = this.getNodeParameter('minAmount') as number;

				const result = await walletRpc.getTransfers({
					in: event === 'txReceived',
					out: event === 'txSent',
					pending: true,
					pool: true,
					account_index: accountIndex,
				});

				const transfers = (event === 'txReceived' ? (result.in || []) : (result.out || [])) as Transfer[];
				const lastTxIds = (webhookData.lastTxIds as string[]) || [];
				const newTxIds: string[] = [];

				for (const tx of transfers) {
					if (!lastTxIds.includes(tx.txid)) {
						const amountXmr = parseFloat(piconeroToXmr(tx.amount));
						if (minAmount === 0 || amountXmr >= minAmount) {
							returnData.push({
								txid: tx.txid,
								amount: piconeroToXmr(tx.amount),
								fee: piconeroToXmr(tx.fee),
								address: tx.address,
								height: tx.height,
								timestamp: tx.timestamp,
								confirmations: tx.confirmations,
								type: event === 'txReceived' ? 'incoming' : 'outgoing',
							});
						}
						newTxIds.push(tx.txid);
					}
				}

				webhookData.lastTxIds = [...lastTxIds, ...newTxIds].slice(-100);
			} else if (event === 'balanceChanged') {
				const walletRpc = await WalletRpcTransport.fromCredentials(this as unknown as Parameters<typeof WalletRpcTransport.fromCredentials>[0]);
				const accountIndex = this.getNodeParameter('accountIndex') as number;
				const minAmount = this.getNodeParameter('minAmount') as number;

				const result = await walletRpc.getBalance({ account_index: accountIndex });
				const currentBalance = result.balance;
				const currentUnlocked = result.unlocked_balance;
				const lastBalance = webhookData.lastBalance as number | undefined;
				const lastUnlocked = webhookData.lastUnlocked as number | undefined;

				if (lastBalance !== undefined) {
					const balanceDiff = currentBalance - lastBalance;
					const unlockedDiff = currentUnlocked - (lastUnlocked || 0);

					if (balanceDiff !== 0) {
						const diffXmr = Math.abs(parseFloat(piconeroToXmr(balanceDiff)));
						if (minAmount === 0 || diffXmr >= minAmount) {
							returnData.push({
								previousBalance: piconeroToXmr(lastBalance),
								currentBalance: piconeroToXmr(currentBalance),
								change: piconeroToXmr(balanceDiff),
								previousUnlocked: piconeroToXmr(lastUnlocked || 0),
								currentUnlocked: piconeroToXmr(currentUnlocked),
								unlockedChange: piconeroToXmr(unlockedDiff),
								direction: balanceDiff > 0 ? 'increased' : 'decreased',
							});
						}
					}
				}

				webhookData.lastBalance = currentBalance;
				webhookData.lastUnlocked = currentUnlocked;
			} else if (event === 'txConfirmed') {
				const walletRpc = await WalletRpcTransport.fromCredentials(this as unknown as Parameters<typeof WalletRpcTransport.fromCredentials>[0]);
				const requiredConfirmations = this.getNodeParameter('confirmations') as number;
				const pendingTxs = (webhookData.pendingTxs as Array<{ txid: string; targetConf: number }>) || [];

				const stillPending: Array<{ txid: string; targetConf: number }> = [];
				for (const pending of pendingTxs) {
					try {
						const txResult = await walletRpc.getTransferByTxid({ txid: pending.txid });
						if (txResult.transfer.confirmations >= pending.targetConf) {
							returnData.push({
								txid: pending.txid,
								amount: piconeroToXmr(txResult.transfer.amount),
								confirmations: txResult.transfer.confirmations,
								height: txResult.transfer.height,
								confirmed: true,
							});
						} else {
							stillPending.push(pending);
						}
					} catch {
						stillPending.push(pending);
					}
				}

				const result = await walletRpc.getTransfers({ in: true, pending: true, pool: true });
				const inTxs = (result.in || []) as Transfer[];
				const pendingTxsList = (result.pending || []) as Transfer[];
				const poolTxs = (result.pool || []) as Transfer[];
				const recentTxs = [...inTxs, ...pendingTxsList, ...poolTxs];
				const trackedTxIds = pendingTxs.map(p => p.txid);

				for (const tx of recentTxs) {
					if (!trackedTxIds.includes(tx.txid) && tx.confirmations < requiredConfirmations) {
						stillPending.push({ txid: tx.txid, targetConf: requiredConfirmations });
					}
				}

				webhookData.pendingTxs = stillPending;
			}
		} catch (error) {
			console.error('MoneroTrigger poll error:', (error as Error).message);
		}

		if (returnData.length === 0) {
			return null;
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
