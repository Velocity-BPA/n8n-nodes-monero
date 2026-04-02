import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class MoneroApi implements ICredentialType {
	name = 'moneroApi';
	displayName = 'Monero API';
	documentationUrl = 'https://docs.getmonero.org/interacting/monero-wallet-rpc-reference/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'http://localhost:18082/json_rpc',
			description: 'Base URL of the Monero RPC API (Wallet RPC: port 18082, Daemon RPC: port 18081)',
			required: true,
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			description: 'Username for HTTP Digest Authentication (optional)',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Password for HTTP Digest Authentication (optional)',
		},
	];
}