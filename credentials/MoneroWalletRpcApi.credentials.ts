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

export class MoneroWalletRpcApi implements ICredentialType {
	name = 'moneroWalletRpcApi';
	displayName = 'Monero Wallet RPC API';
	documentationUrl = 'https://www.getmonero.org/resources/developer-guides/wallet-rpc.html';
	icon = 'file:monero.svg' as const;
	properties: INodeProperties[] = [
		{
			displayName: 'Wallet RPC URL',
			name: 'walletRpcUrl',
			type: 'string',
			default: 'http://127.0.0.1:18082',
			placeholder: 'http://127.0.0.1:18082',
			required: true,
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.walletRpcUrl}}',
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
