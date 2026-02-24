import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MoneroApi implements ICredentialType {
	name = 'moneroApi';
	displayName = 'Monero API';
	documentationUrl = 'https://www.getmonero.org/resources/developer-guides/daemon-rpc.html';
	properties: INodeProperties[] = [
		{
			displayName: 'Daemon URL',
			name: 'daemonUrl',
			type: 'string',
			default: 'http://localhost:18081/json_rpc',
			description: 'The URL of the Monero daemon RPC endpoint',
			required: true,
		},
		{
			displayName: 'Wallet RPC URL',
			name: 'walletUrl',
			type: 'string',
			default: 'http://localhost:18083/json_rpc',
			description: 'The URL of the Monero wallet RPC endpoint',
			required: false,
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			description: 'Username for HTTP digest authentication (if required)',
			required: false,
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'hidden',
			default: '',
			description: 'Password for HTTP digest authentication (if required)',
			required: false,
		},
		{
			displayName: 'Wallet Password',
			name: 'walletPassword',
			type: 'hidden',
			default: '',
			description: 'Password for wallet operations (if wallet is password protected)',
			required: false,
		},
	];
}