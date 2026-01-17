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

export class MoneroRemoteNodeApi implements ICredentialType {
	name = 'moneroRemoteNodeApi';
	displayName = 'Monero Remote Node API';
	documentationUrl = 'https://www.getmonero.org/resources/developer-guides/daemon-rpc.html';
	icon = 'file:monero.svg' as const;
	properties: INodeProperties[] = [
		{
			displayName: 'Remote Node URL',
			name: 'remoteNodeUrl',
			type: 'string',
			default: 'http://node.moneroworld.com:18089',
			placeholder: 'http://node.moneroworld.com:18089',
			required: true,
			description: 'URL of the remote Monero node',
		},
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
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			description: 'Username if the remote node requires authentication',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Password if the remote node requires authentication',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.remoteNodeUrl}}',
			url: '/json_rpc',
			method: 'POST',
			body: {
				jsonrpc: '2.0',
				id: '0',
				method: 'get_info',
			},
		},
	};
}
