/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MoneroNetworkApi implements ICredentialType {
	name = 'moneroNetworkApi';
	displayName = 'Monero Network API';
	documentationUrl = 'https://www.getmonero.org/resources/developer-guides/';
	icon = 'file:monero.svg' as const;
	properties: INodeProperties[] = [
		{
			displayName: 'Network',
			name: 'network',
			type: 'options',
			options: [
				{ name: 'Mainnet', value: 'mainnet' },
				{ name: 'Stagenet', value: 'stagenet' },
				{ name: 'Testnet', value: 'testnet' },
			],
			default: 'mainnet',
		},
		{
			displayName: 'Connection Type',
			name: 'connectionType',
			type: 'options',
			options: [
				{ name: 'Daemon Only', value: 'daemon' },
				{ name: 'Wallet RPC Only', value: 'wallet' },
				{ name: 'Both', value: 'both' },
			],
			default: 'both',
		},
		{
			displayName: 'Daemon RPC URL',
			name: 'daemonRpcUrl',
			type: 'string',
			default: 'http://127.0.0.1:18081',
			placeholder: 'http://127.0.0.1:18081',
			displayOptions: {
				show: { connectionType: ['daemon', 'both'] },
			},
		},
		{
			displayName: 'Daemon Username',
			name: 'daemonUsername',
			type: 'string',
			default: '',
			displayOptions: {
				show: { connectionType: ['daemon', 'both'] },
			},
		},
		{
			displayName: 'Daemon Password',
			name: 'daemonPassword',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			displayOptions: {
				show: { connectionType: ['daemon', 'both'] },
			},
		},
		{
			displayName: 'Wallet RPC URL',
			name: 'walletRpcUrl',
			type: 'string',
			default: 'http://127.0.0.1:18082',
			placeholder: 'http://127.0.0.1:18082',
			displayOptions: {
				show: { connectionType: ['wallet', 'both'] },
			},
		},
		{
			displayName: 'Wallet RPC Username',
			name: 'walletUsername',
			type: 'string',
			default: '',
			displayOptions: {
				show: { connectionType: ['wallet', 'both'] },
			},
		},
		{
			displayName: 'Wallet RPC Password',
			name: 'walletPassword',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			displayOptions: {
				show: { connectionType: ['wallet', 'both'] },
			},
		},
		{
			displayName: 'SSL/TLS',
			name: 'ssl',
			type: 'boolean',
			default: false,
			description: 'Whether to use SSL/TLS for connections',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.daemonRpcUrl || $credentials.walletRpcUrl}}',
			url: '/json_rpc',
			method: 'POST',
			body: {
				jsonrpc: '2.0',
				id: '0',
				method: 'get_version',
			},
		},
	};
}
