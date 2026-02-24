/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-monero/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class Monero implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Monero',
    name: 'monero',
    icon: 'file:monero.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Monero API',
    defaults: {
      name: 'Monero',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'moneroApi',
        required: true,
      },
    ],
    properties: [
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'BlockchainInfo',
            value: 'blockchainInfo',
          },
          {
            name: 'TransactionOperations',
            value: 'transactionOperations',
          },
          {
            name: 'WalletManagement',
            value: 'walletManagement',
          },
          {
            name: 'WalletTransfers',
            value: 'walletTransfers',
          },
          {
            name: 'MiningOperations',
            value: 'miningOperations',
          },
          {
            name: 'AddressOperations',
            value: 'addressOperations',
          }
        ],
        default: 'blockchainInfo',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['blockchainInfo'],
    },
  },
  options: [
    {
      name: 'Get Block Count',
      value: 'getBlockCount',
      description: 'Get current blockchain height',
      action: 'Get block count',
    },
    {
      name: 'Get Block Header By Height',
      value: 'getBlockHeaderByHeight',
      description: 'Get block header by height',
      action: 'Get block header by height',
    },
    {
      name: 'Get Block Header By Hash',
      value: 'getBlockHeaderByHash',
      description: 'Get block header by hash',
      action: 'Get block header by hash',
    },
    {
      name: 'Get Block',
      value: 'getBlock',
      description: 'Get full block data',
      action: 'Get block',
    },
    {
      name: 'Get Info',
      value: 'getInfo',
      description: 'Get general network information',
      action: 'Get info',
    },
    {
      name: 'Get Connections',
      value: 'getConnections',
      description: 'Get peer connections',
      action: 'Get connections',
    },
    {
      name: 'Get Version',
      value: 'getVersion',
      description: 'Get daemon version',
      action: 'Get version',
    },
  ],
  default: 'getBlockCount',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['transactionOperations'],
    },
  },
  options: [
    {
      name: 'Get Transactions',
      value: 'getTransactions',
      description: 'Get transaction details by hash',
      action: 'Get transaction details',
    },
    {
      name: 'Get Transaction Pool',
      value: 'getTransactionPool',
      description: 'Get mempool transactions',
      action: 'Get mempool transactions',
    },
    {
      name: 'Send Raw Transaction',
      value: 'sendRawTransaction',
      description: 'Broadcast raw transaction',
      action: 'Broadcast raw transaction',
    },
    {
      name: 'Get Transaction Pool Stats',
      value: 'getTransactionPoolStats',
      description: 'Get mempool statistics',
      action: 'Get mempool statistics',
    },
    {
      name: 'Flush Transaction Pool',
      value: 'flushTransactionPool',
      description: 'Clear transaction pool',
      action: 'Clear transaction pool',
    },
    {
      name: 'Relay Transaction',
      value: 'relayTransaction',
      description: 'Relay transaction',
      action: 'Relay transaction',
    },
  ],
  default: 'getTransactions',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['walletManagement'],
    },
  },
  options: [
    {
      name: 'Create Wallet',
      value: 'createWallet',
      description: 'Create a new wallet',
      action: 'Create wallet',
    },
    {
      name: 'Open Wallet',
      value: 'openWallet',
      description: 'Open an existing wallet',
      action: 'Open wallet',
    },
    {
      name: 'Close Wallet',
      value: 'closeWallet',
      description: 'Close the current wallet',
      action: 'Close wallet',
    },
    {
      name: 'Get Balance',
      value: 'getBalance',
      description: 'Get wallet balance',
      action: 'Get balance',
    },
    {
      name: 'Get Address',
      value: 'getAddress',
      description: 'Get wallet addresses',
      action: 'Get address',
    },
    {
      name: 'Create Account',
      value: 'createAccount',
      description: 'Create a new account',
      action: 'Create account',
    },
    {
      name: 'Get Accounts',
      value: 'getAccounts',
      description: 'Get all accounts',
      action: 'Get accounts',
    },
    {
      name: 'Rescan Spent',
      value: 'rescanSpent',
      description: 'Rescan spent outputs',
      action: 'Rescan spent',
    },
  ],
  default: 'createWallet',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['walletTransfers'],
    },
  },
  options: [
    {
      name: 'Transfer',
      value: 'transfer',
      description: 'Send XMR to addresses',
      action: 'Send XMR to addresses',
    },
    {
      name: 'Transfer Split',
      value: 'transferSplit',
      description: 'Send XMR with multiple transactions',
      action: 'Send XMR with multiple transactions',
    },
    {
      name: 'Sweep All',
      value: 'sweepAll',
      description: 'Sweep all unlocked balance',
      action: 'Sweep all unlocked balance',
    },
    {
      name: 'Sweep Single',
      value: 'sweepSingle',
      description: 'Sweep single key image',
      action: 'Sweep single key image',
    },
    {
      name: 'Get Transfers',
      value: 'getTransfers',
      description: 'Get transfer history',
      action: 'Get transfer history',
    },
    {
      name: 'Get Transfer By Txid',
      value: 'getTransferByTxid',
      description: 'Get transfer by transaction ID',
      action: 'Get transfer by transaction ID',
    },
    {
      name: 'Incoming Transfers',
      value: 'incomingTransfers',
      description: 'Get incoming transfers',
      action: 'Get incoming transfers',
    },
  ],
  default: 'transfer',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['miningOperations'],
    },
  },
  options: [
    {
      name: 'Start Mining',
      value: 'startMining',
      description: 'Start mining on the daemon',
      action: 'Start mining',
    },
    {
      name: 'Stop Mining',
      value: 'stopMining',
      description: 'Stop mining on the daemon',
      action: 'Stop mining',
    },
    {
      name: 'Get Mining Status',
      value: 'getMiningStatus',
      description: 'Get current mining status and statistics',
      action: 'Get mining status',
    },
    {
      name: 'Set Log Level',
      value: 'setLogLevel',
      description: 'Set the daemon log level',
      action: 'Set log level',
    },
    {
      name: 'Set Log Categories',
      value: 'setLogCategories',
      description: 'Set the daemon log categories',
      action: 'Set log categories',
    },
    {
      name: 'Submit Block',
      value: 'submitBlock',
      description: 'Submit a mined block to the network',
      action: 'Submit block',
    },
    {
      name: 'Get Last Block Header',
      value: 'getLastBlockHeader',
      description: 'Get the last block header from the blockchain',
      action: 'Get last block header',
    },
  ],
  default: 'startMining',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['addressOperations'],
		},
	},
	options: [
		{
			name: 'Create Address',
			value: 'createAddress',
			description: 'Create a new address in the wallet',
			action: 'Create address',
		},
		{
			name: 'Label Address',
			value: 'labelAddress',
			description: 'Set or update the label for an address',
			action: 'Label address',
		},
		{
			name: 'Get Address Index',
			value: 'getAddressIndex',
			description: 'Get the index of an address in the wallet',
			action: 'Get address index',
		},
		{
			name: 'Validate Address',
			value: 'validateAddress',
			description: 'Validate an address format',
			action: 'Validate address',
		},
		{
			name: 'Get Address Book',
			value: 'getAddressBook',
			description: 'Get address book entries',
			action: 'Get address book',
		},
		{
			name: 'Add Address Book Entry',
			value: 'addAddressBook',
			description: 'Add an entry to the address book',
			action: 'Add address book entry',
		},
		{
			name: 'Delete Address Book Entry',
			value: 'deleteAddressBook',
			description: 'Delete an entry from the address book',
			action: 'Delete address book entry',
		},
	],
	default: 'createAddress',
},
      // Parameter definitions
{
  displayName: 'Height',
  name: 'height',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['blockchainInfo'],
      operation: ['getBlockHeaderByHeight'],
    },
  },
  default: 0,
  description: 'The block height to get header for',
},
{
  displayName: 'Hash',
  name: 'hash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['blockchainInfo'],
      operation: ['getBlockHeaderByHash'],
    },
  },
  default: '',
  description: 'The block hash to get header for',
},
{
  displayName: 'Height',
  name: 'height',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['blockchainInfo'],
      operation: ['getBlock'],
    },
  },
  default: 0,
  description: 'The block height (use height OR hash, not both)',
},
{
  displayName: 'Hash',
  name: 'hash',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['blockchainInfo'],
      operation: ['getBlock'],
    },
  },
  default: '',
  description: 'The block hash (use height OR hash, not both)',
},
{
  displayName: 'Transaction Hashes',
  name: 'txsHashes',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactionOperations'],
      operation: ['getTransactions'],
    },
  },
  default: '',
  description: 'Comma-separated list of transaction hashes to retrieve',
  placeholder: 'hash1,hash2,hash3',
},
{
  displayName: 'Decode as JSON',
  name: 'decodeAsJson',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['transactionOperations'],
      operation: ['getTransactions'],
    },
  },
  default: true,
  description: 'Whether to decode transaction as JSON',
},
{
  displayName: 'Transaction Hex',
  name: 'txAsHex',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactionOperations'],
      operation: ['sendRawTransaction'],
    },
  },
  default: '',
  description: 'Raw transaction in hexadecimal format',
},
{
  displayName: 'Do Not Relay',
  name: 'doNotRelay',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['transactionOperations'],
      operation: ['sendRawTransaction'],
    },
  },
  default: false,
  description: 'Whether to submit transaction without relaying to network',
},
{
  displayName: 'Transaction IDs',
  name: 'txids',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactionOperations'],
      operation: ['flushTransactionPool', 'relayTransaction'],
    },
  },
  default: '',
  description: 'Comma-separated list of transaction IDs',
  placeholder: 'txid1,txid2,txid3',
},
{
  displayName: 'Filename',
  name: 'filename',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['walletManagement'],
      operation: ['createWallet', 'openWallet'],
    },
  },
  default: '',
  description: 'The filename for the wallet',
},
{
  displayName: 'Password',
  name: 'password',
  type: 'string',
  typeOptions: {
    password: true,
  },
  required: true,
  displayOptions: {
    show: {
      resource: ['walletManagement'],
      operation: ['createWallet', 'openWallet'],
    },
  },
  default: '',
  description: 'The password for the wallet',
},
{
  displayName: 'Language',
  name: 'language',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['walletManagement'],
      operation: ['createWallet'],
    },
  },
  options: [
    {
      name: 'English',
      value: 'English',
    },
    {
      name: 'Français',
      value: 'Français',
    },
    {
      name: 'Español',
      value: 'Español',
    },
    {
      name: 'Português',
      value: 'Português',
    },
    {
      name: '日本語',
      value: '日本語',
    },
    {
      name: '中文',
      value: '中文',
    },
  ],
  default: 'English',
  description: 'The language for the wallet seed',
},
{
  displayName: 'Account Index',
  name: 'accountIndex',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['walletManagement'],
      operation: ['getBalance', 'getAddress'],
    },
  },
  default: 0,
  description: 'The account index to query',
},
{
  displayName: 'Address Indices',
  name: 'addressIndices',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['walletManagement'],
      operation: ['getBalance', 'getAddress'],
    },
  },
  default: '',
  placeholder: '0,1,2',
  description: 'Comma-separated list of address indices to query (leave empty for all)',
},
{
  displayName: 'Label',
  name: 'label',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['walletManagement'],
      operation: ['createAccount'],
    },
  },
  default: '',
  description: 'Label for the new account',
},
{
  displayName: 'Tag',
  name: 'tag',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['walletManagement'],
      operation: ['getAccounts'],
    },
  },
  default: '',
  description: 'Filter accounts by tag (leave empty for all accounts)',
},
{
  displayName: 'Destinations',
  name: 'destinations',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['walletTransfers'],
      operation: ['transfer', 'transferSplit'],
    },
  },
  default: '[]',
  description: 'Array of destinations with address and amount in atomic units. Example: [{"address": "4...", "amount": 1000000000000}]',
},
{
  displayName: 'Priority',
  name: 'priority',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['walletTransfers'],
      operation: ['transfer', 'transferSplit', 'sweepAll', 'sweepSingle'],
    },
  },
  options: [
    {
      name: 'Default',
      value: 0,
    },
    {
      name: 'Unimportant',
      value: 1,
    },
    {
      name: 'Normal',
      value: 2,
    },
    {
      name: 'Elevated',
      value: 3,
    },
    {
      name: 'Priority',
      value: 4,
    },
  ],
  default: 0,
  description: 'Transaction priority level',
},
{
  displayName: 'Ring Size',
  name: 'ring_size',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['walletTransfers'],
      operation: ['transfer', 'transferSplit', 'sweepAll'],
    },
  },
  default: 11,
  description: 'Ring size for the transaction',
},
{
  displayName: 'Get Transaction Key',
  name: 'get_tx_key',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['walletTransfers'],
      operation: ['transfer'],
    },
  },
  default: true,
  description: 'Whether to return the transaction key',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['walletTransfers'],
      operation: ['sweepAll', 'sweepSingle'],
    },
  },
  default: '',
  description: 'Destination address for sweep',
},
{
  displayName: 'Key Image',
  name: 'key_image',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['walletTransfers'],
      operation: ['sweepSingle'],
    },
  },
  default: '',
  description: 'Key image to sweep',
},
{
  displayName: 'Include Incoming',
  name: 'in',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['walletTransfers'],
      operation: ['getTransfers'],
    },
  },
  default: true,
  description: 'Include incoming transfers',
},
{
  displayName: 'Include Outgoing',
  name: 'out',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['walletTransfers'],
      operation: ['getTransfers'],
    },
  },
  default: true,
  description: 'Include outgoing transfers',
},
{
  displayName: 'Include Pending',
  name: 'pending',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['walletTransfers'],
      operation: ['getTransfers'],
    },
  },
  default: false,
  description: 'Include pending transfers',
},
{
  displayName: 'Include Failed',
  name: 'failed',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['walletTransfers'],
      operation: ['getTransfers'],
    },
  },
  default: false,
  description: 'Include failed transfers',
},
{
  displayName: 'Include Pool',
  name: 'pool',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['walletTransfers'],
      operation: ['getTransfers'],
    },
  },
  default: false,
  description: 'Include pool transfers',
},
{
  displayName: 'Filter by Height',
  name: 'filter_by_height',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['walletTransfers'],
      operation: ['getTransfers'],
    },
  },
  default: false,
  description: 'Filter transfers by block height',
},
{
  displayName: 'Min Height',
  name: 'min_height',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['walletTransfers'],
      operation: ['getTransfers'],
      filter_by_height: [true],
    },
  },
  default: 0,
  description: 'Minimum block height to filter transfers',
},
{
  displayName: 'Max Height',
  name: 'max_height',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['walletTransfers'],
      operation: ['getTransfers'],
      filter_by_height: [true],
    },
  },
  default: 0,
  description: 'Maximum block height to filter transfers',
},
{
  displayName: 'Transaction ID',
  name: 'txid',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['walletTransfers'],
      operation: ['getTransferByTxid'],
    },
  },
  default: '',
  description: 'Transaction ID to retrieve',
},
{
  displayName: 'Account Index',
  name: 'account_index',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['walletTransfers'],
      operation: ['getTransferByTxid', 'incomingTransfers'],
    },
  },
  default: 0,
  description: 'Account index to query',
},
{
  displayName: 'Transfer Type',
  name: 'transfer_type',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['walletTransfers'],
      operation: ['incomingTransfers'],
    },
  },
  options: [
    {
      name: 'All',
      value: 'all',
    },
    {
      name: 'Available',
      value: 'available',
    },
    {
      name: 'Unavailable',
      value: 'unavailable',
    },
  ],
  default: 'all',
  description: 'Type of incoming transfers to retrieve',
},
{
  displayName: 'Threads Count',
  name: 'threadsCount',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['miningOperations'],
      operation: ['startMining'],
    },
  },
  default: 1,
  description: 'Number of threads to use for mining',
},
{
  displayName: 'Background Mining',
  name: 'doBackgroundMining',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['miningOperations'],
      operation: ['startMining'],
    },
  },
  default: true,
  description: 'Enable background mining',
},
{
  displayName: 'Ignore Battery',
  name: 'ignoreBattery',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['miningOperations'],
      operation: ['startMining'],
    },
  },
  default: false,
  description: 'Ignore battery status when mining',
},
{
  displayName: 'Log Level',
  name: 'level',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['miningOperations'],
      operation: ['setLogLevel'],
    },
  },
  options: [
    { name: 'Fatal', value: 0 },
    { name: 'Error', value: 1 },
    { name: 'Warning', value: 2 },
    { name: 'Info', value: 3 },
    { name: 'Debug', value: 4 },
    { name: 'Trace', value: 5 },
  ],
  default: 3,
  description: 'Log level to set',
},
{
  displayName: 'Categories',
  name: 'categories',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['miningOperations'],
      operation: ['setLogCategories'],
    },
  },
  default: '',
  description: 'Log categories to set (comma-separated)',
},
{
  displayName: 'Block Blob',
  name: 'blockBlob',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['miningOperations'],
      operation: ['submitBlock'],
    },
  },
  default: '',
  description: 'The block blob data to submit',
},
{
	displayName: 'Account Index',
	name: 'accountIndex',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['addressOperations'],
			operation: ['createAddress'],
		},
	},
	default: 0,
	description: 'Index of the account to create the address for',
},
{
	displayName: 'Label',
	name: 'label',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['addressOperations'],
			operation: ['createAddress', 'labelAddress'],
		},
	},
	default: '',
	description: 'Label for the address',
},
{
	displayName: 'Address Index',
	name: 'index',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['addressOperations'],
			operation: ['labelAddress', 'deleteAddressBook'],
		},
	},
	default: 0,
	description: 'Index of the address or address book entry',
},
{
	displayName: 'Address',
	name: 'address',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['addressOperations'],
			operation: ['getAddressIndex', 'validateAddress', 'addAddressBook'],
		},
	},
	default: '',
	description: 'Monero address',
},
{
	displayName: 'Any Net Type',
	name: 'anyNetType',
	type: 'boolean',
	required: false,
	displayOptions: {
		show: {
			resource: ['addressOperations'],
			operation: ['validateAddress'],
		},
	},
	default: false,
	description: 'Whether to validate address on any network type',
},
{
	displayName: 'Allow OpenAlias',
	name: 'allowOpenalias',
	type: 'boolean',
	required: false,
	displayOptions: {
		show: {
			resource: ['addressOperations'],
			operation: ['validateAddress'],
		},
	},
	default: false,
	description: 'Whether to allow OpenAlias addresses',
},
{
	displayName: 'Entries',
	name: 'entries',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['addressOperations'],
			operation: ['getAddressBook'],
		},
	},
	default: '',
	description: 'Comma-separated list of entry indices to retrieve (leave empty for all)',
},
{
	displayName: 'Payment ID',
	name: 'paymentId',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['addressOperations'],
			operation: ['addAddressBook'],
		},
	},
	default: '',
	description: 'Payment ID for the address book entry',
},
{
	displayName: 'Description',
	name: 'description',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['addressOperations'],
			operation: ['addAddressBook'],
		},
	},
	default: '',
	description: 'Description for the address book entry',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'blockchainInfo':
        return [await executeBlockchainInfoOperations.call(this, items)];
      case 'transactionOperations':
        return [await executeTransactionOperationsOperations.call(this, items)];
      case 'walletManagement':
        return [await executeWalletManagementOperations.call(this, items)];
      case 'walletTransfers':
        return [await executeWalletTransfersOperations.call(this, items)];
      case 'miningOperations':
        return [await executeMiningOperationsOperations.call(this, items)];
      case 'addressOperations':
        return [await executeAddressOperationsOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeBlockchainInfoOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('moneroApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      // Helper function to create JSON-RPC request
      const createJsonRpcRequest = (method: string, params: any = {}): any => {
        return {
          jsonrpc: '2.0',
          id: '0',
          method,
          params,
        };
      };

      // Helper function to make JSON-RPC request
      const makeJsonRpcRequest = async (rpcRequest: any): Promise<any> => {
        const options: any = {
          method: 'POST',
          url: credentials.baseUrl || 'http://localhost:18081/json_rpc',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rpcRequest),
          json: false,
        };

        if (credentials.username && credentials.password) {
          options.auth = {
            user: credentials.username,
            password: credentials.password,
          };
        }

        const response = await this.helpers.httpRequest(options) as any;
        const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
        
        if (parsedResponse.error) {
          throw new NodeApiError(this.getNode(), parsedResponse.error, {
            message: `Monero RPC Error: ${parsedResponse.error.message}`,
          });
        }

        return parsedResponse.result;
      };

      switch (operation) {
        case 'getBlockCount': {
          const rpcRequest = createJsonRpcRequest('get_block_count');
          result = await makeJsonRpcRequest(rpcRequest);
          break;
        }

        case 'getBlockHeaderByHeight': {
          const height = this.getNodeParameter('height', i) as number;
          const rpcRequest = createJsonRpcRequest('get_block_header_by_height', { height });
          result = await makeJsonRpcRequest(rpcRequest);
          break;
        }

        case 'getBlockHeaderByHash': {
          const hash = this.getNodeParameter('hash', i) as string;
          const rpcRequest = createJsonRpcRequest('get_block_header_by_hash', { hash });
          result = await makeJsonRpcRequest(rpcRequest);
          break;
        }

        case 'getBlock': {
          const height = this.getNodeParameter('height', i, undefined) as number | undefined;
          const hash = this.getNodeParameter('hash', i, '') as string;
          
          let params: any = {};
          if (hash && hash.trim() !== '') {
            params.hash = hash;
          } else if (height !== undefined && height !== null) {
            params.height = height;
          } else {
            throw new NodeOperationError(this.getNode(), 'Either height or hash parameter must be provided');
          }

          const rpcRequest = createJsonRpcRequest('get_block', params);
          result = await makeJsonRpcRequest(rpcRequest);
          break;
        }

        case 'getInfo': {
          const rpcRequest = createJsonRpcRequest('get_info');
          result = await makeJsonRpcRequest(rpcRequest);
          break;
        }

        case 'getConnections': {
          const rpcRequest = createJsonRpcRequest('get_connections');
          result = await makeJsonRpcRequest(rpcRequest);
          break;
        }

        case 'getVersion': {
          const rpcRequest = createJsonRpcRequest('get_version');
          result = await makeJsonRpcRequest(rpcRequest);
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ 
        json: result, 
        pairedItem: { item: i } 
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeTransactionOperationsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('moneroApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getTransactions': {
          const txsHashesParam = this.getNodeParameter('txsHashes', i) as string;
          const decodeAsJson = this.getNodeParameter('decodeAsJson', i, true) as boolean;
          
          const txsHashes = txsHashesParam.split(',').map((hash: string) => hash.trim());
          
          const requestBody: any = {
            jsonrpc: '2.0',
            id: '0',
            method: 'get_transactions',
            params: {
              txs_hashes: txsHashes,
              decode_as_json: decodeAsJson,
            },
          };

          const options: any = {
            method: 'POST',
            url: credentials.daemonUrl || 'http://localhost:18081/json_rpc',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          if (credentials.username && credentials.password) {
            options.auth = {
              user: credentials.username,
              pass: credentials.password,
            };
          }

          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'getTransactionPool': {
          const requestBody: any = {
            jsonrpc: '2.0',
            id: '0',
            method: 'get_transaction_pool',
            params: {},
          };

          const options: any = {
            method: 'POST',
            url: credentials.daemonUrl || 'http://localhost:18081/json_rpc',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          if (credentials.username && credentials.password) {
            options.auth = {
              user: credentials.username,
              pass: credentials.password,
            };
          }

          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'sendRawTransaction': {
          const txAsHex = this.getNodeParameter('txAsHex', i) as string;
          const doNotRelay = this.getNodeParameter('doNotRelay', i, false) as boolean;
          
          const requestBody: any = {
            jsonrpc: '2.0',
            id: '0',
            method: 'send_raw_transaction',
            params: {
              tx_as_hex: txAsHex,
              do_not_relay: doNotRelay,
            },
          };

          const options: any = {
            method: 'POST',
            url: credentials.daemonUrl || 'http://localhost:18081/json_rpc',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          if (credentials.username && credentials.password) {
            options.auth = {
              user: credentials.username,
              pass: credentials.password,
            };
          }

          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'getTransactionPoolStats': {
          const requestBody: any = {
            jsonrpc: '2.0',
            id: '0',
            method: 'get_transaction_pool_stats',
            params: {},
          };

          const options: any = {
            method: 'POST',
            url: credentials.daemonUrl || 'http://localhost:18081/json_rpc',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          if (credentials.username && credentials.password) {
            options.auth = {
              user: credentials.username,
              pass: credentials.password,
            };
          }

          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'flushTransactionPool': {
          const txidsParam = this.getNodeParameter('txids', i) as string;
          const txids = txidsParam.split(',').map((txid: string) => txid.trim());
          
          const requestBody: any = {
            jsonrpc: '2.0',
            id: '0',
            method: 'flush_txpool',
            params: {
              txids: txids,
            },
          };

          const options: any = {
            method: 'POST',
            url: credentials.daemonUrl || 'http://localhost:18081/json_rpc',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          if (credentials.username && credentials.password) {
            options.auth = {
              user: credentials.username,
              pass: credentials.password,
            };
          }

          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'relayTransaction': {
          const txidsParam = this.getNodeParameter('txids', i) as string;
          const txids = txidsParam.split(',').map((txid: string) => txid.trim());
          
          const requestBody: any = {
            jsonrpc: '2.0',
            id: '0',
            method: 'relay_tx',
            params: {
              txids: txids,
            },
          };

          const options: any = {
            method: 'POST',
            url: credentials.daemonUrl || 'http://localhost:18081/json_rpc',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          if (credentials.username && credentials.password) {
            options.auth = {
              user: credentials.username,
              pass: credentials.password,
            };
          }

          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      if (result.error) {
        throw new NodeApiError(this.getNode(), result.error, {
          message: result.error.message || 'Monero API error',
          httpCode: result.error.code?.toString() || '500',
        });
      }

      returnData.push({ 
        json: result.result || result, 
        pairedItem: { item: i } 
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeWalletManagementOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('moneroApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      // Determine which endpoint to use based on operation
      const isWalletOperation = ['createWallet', 'openWallet', 'closeWallet', 'getBalance', 'getAddress', 'createAccount', 'getAccounts', 'rescanSpent'].includes(operation);
      const baseUrl = isWalletOperation ? credentials.walletRpcUrl || 'http://localhost:18083/json_rpc' : credentials.daemonUrl || 'http://localhost:18081/json_rpc';

      switch (operation) {
        case 'createWallet': {
          const filename = this.getNodeParameter('filename', i) as string;
          const password = this.getNodeParameter('password', i) as string;
          const language = this.getNodeParameter('language', i) as string;

          const requestBody: any = {
            jsonrpc: '2.0',
            id: '0',
            method: 'create_wallet',
            params: {
              filename,
              password,
              language,
            },
          };

          const options: any = {
            method: 'POST',
            url: baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          if (credentials.username && credentials.password) {
            options.auth = {
              user: credentials.username,
              pass: credentials.password,
            };
          }

          const response = await this.helpers.httpRequest(options) as any;
          const parsedResponse = JSON.parse(response);
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error, {
              message: `Monero API Error: ${parsedResponse.error.message}`,
              httpCode: '400',
            });
          }

          result = parsedResponse.result || { success: true, filename };
          break;
        }

        case 'openWallet': {
          const filename = this.getNodeParameter('filename', i) as string;
          const password = this.getNodeParameter('password', i) as string;

          const requestBody: any = {
            jsonrpc: '2.0',
            id: '0',
            method: 'open_wallet',
            params: {
              filename,
              password,
            },
          };

          const options: any = {
            method: 'POST',
            url: baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          if (credentials.username && credentials.password) {
            options.auth = {
              user: credentials.username,
              pass: credentials.password,
            };
          }

          const response = await this.helpers.httpRequest(options) as any;
          const parsedResponse = JSON.parse(response);
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error, {
              message: `Monero API Error: ${parsedResponse.error.message}`,
              httpCode: '400',
            });
          }

          result = parsedResponse.result || { success: true, filename };
          break;
        }

        case 'closeWallet': {
          const requestBody: any = {
            jsonrpc: '2.0',
            id: '0',
            method: 'close_wallet',
          };

          const options: any = {
            method: 'POST',
            url: baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          if (credentials.username && credentials.password) {
            options.auth = {
              user: credentials.username,
              pass: credentials.password,
            };
          }

          const response = await this.helpers.httpRequest(options) as any;
          const parsedResponse = JSON.parse(response);
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error, {
              message: `Monero API Error: ${parsedResponse.error.message}`,
              httpCode: '400',
            });
          }

          result = parsedResponse.result || { success: true };
          break;
        }

        case 'getBalance': {
          const accountIndex = this.getNodeParameter('accountIndex', i) as number;
          const addressIndicesStr = this.getNodeParameter('addressIndices', i) as string;

          const params: any = {
            account_index: accountIndex,
          };

          if (addressIndicesStr.trim()) {
            params.address_indices = addressIndicesStr.split(',').map((idx: string) => parseInt(idx.trim(), 10));
          }

          const requestBody: any = {
            jsonrpc: '2.0',
            id: '0',
            method: 'get_balance',
            params,
          };

          const options: any = {
            method: 'POST',
            url: baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          if (credentials.username && credentials.password) {
            options.auth = {
              user: credentials.username,
              pass: credentials.password,
            };
          }

          const response = await this.helpers.httpRequest(options) as any;
          const parsedResponse = JSON.parse(response);
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error, {
              message: `Monero API Error: ${parsedResponse.error.message}`,
              httpCode: '400',
            });
          }

          result = parsedResponse.result;
          break;
        }

        case 'getAddress': {
          const accountIndex = this.getNodeParameter('accountIndex', i) as number;
          const addressIndicesStr = this.getNodeParameter('addressIndices', i) as string;

          const params: any = {
            account_index: accountIndex,
          };

          if (addressIndicesStr.trim()) {
            params.address_index = addressIndicesStr.split(',').map((idx: string) => parseInt(idx.trim(), 10));
          }

          const requestBody: any = {
            jsonrpc: '2.0',
            id: '0',
            method: 'get_address',
            params,
          };

          const options: any = {
            method: 'POST',
            url: baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          if (credentials.username && credentials.password) {
            options.auth = {
              user: credentials.username,
              pass: credentials.password,
            };
          }

          const response = await this.helpers.httpRequest(options) as any;
          const parsedResponse = JSON.parse(response);
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error, {
              message: `Monero API Error: ${parsedResponse.error.message}`,
              httpCode: '400',
            });
          }

          result = parsedResponse.result;
          break;
        }

        case 'createAccount': {
          const label = this.getNodeParameter('label', i) as string;

          const requestBody: any = {
            jsonrpc: '2.0',
            id: '0',
            method: 'create_account',
            params: {
              label,
            },
          };

          const options: any = {
            method: 'POST',
            url: baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          if (credentials.username && credentials.password) {
            options.auth = {
              user: credentials.username,
              pass: credentials.password,
            };
          }

          const response = await this.helpers.httpRequest(options) as any;
          const parsedResponse = JSON.parse(response);
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error, {
              message: `Monero API Error: ${parsedResponse.error.message}`,
              httpCode: '400',
            });
          }

          result = parsedResponse.result;
          break;
        }

        case 'getAccounts': {
          const tag = this.getNodeParameter('tag', i) as string;

          const params: any = {};
          if (tag.trim()) {
            params.tag = tag;
          }

          const requestBody: any = {
            jsonrpc: '2.0',
            id: '0',
            method: 'get_accounts',
            params,
          };

          const options: any = {
            method: 'POST',
            url: baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          if (credentials.username && credentials.password) {
            options.auth = {
              user: credentials.username,
              pass: credentials.password,
            };
          }

          const response = await this.helpers.httpRequest(options) as any;
          const parsedResponse = JSON.parse(response);
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error, {
              message: `Monero API Error: ${parsedResponse.error.message}`,
              httpCode: '400',
            });
          }

          result = parsedResponse.result;
          break;
        }

        case 'rescanSpent': {
          const requestBody: any = {
            jsonrpc: '2.0',
            id: '0',
            method: 'rescan_spent',
          };

          const options: any = {
            method: 'POST',
            url: baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          if (credentials.username && credentials.password) {
            options.auth = {
              user: credentials.username,
              pass: credentials.password,
            };
          }

          const response = await this.helpers.httpRequest(options) as any;
          const parsedResponse = JSON.parse(response);
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error, {
              message: `Monero API Error: ${parsedResponse.error.message}`,
              httpCode: '400',
            });
          }

          result = parsedResponse.result || { success: true };
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeWalletTransfersOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('moneroApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'transfer': {
          const destinations = this.getNodeParameter('destinations', i) as any;
          const priority = this.getNodeParameter('priority', i) as number;
          const ring_size = this.getNodeParameter('ring_size', i) as number;
          const get_tx_key = this.getNodeParameter('get_tx_key', i) as boolean;

          const requestBody = {
            jsonrpc: '2.0',
            id: '0',
            method: 'transfer',
            params: {
              destinations: JSON.parse(destinations),
              priority,
              ring_size,
              get_tx_key,
            },
          };

          const options = {
            method: 'POST',
            url: credentials.walletRpcUrl || 'http://localhost:18083/json_rpc',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }
          
          result = responseData.result;
          break;
        }

        case 'transferSplit': {
          const destinations = this.getNodeParameter('destinations', i) as any;
          const priority = this.getNodeParameter('priority', i) as number;
          const ring_size = this.getNodeParameter('ring_size', i) as number;

          const requestBody = {
            jsonrpc: '2.0',
            id: '0',
            method: 'transfer_split',
            params: {
              destinations: JSON.parse(destinations),
              priority,
              ring_size,
            },
          };

          const options = {
            method: 'POST',
            url: credentials.walletRpcUrl || 'http://localhost:18083/json_rpc',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }
          
          result = responseData.result;
          break;
        }

        case 'sweepAll': {
          const address = this.getNodeParameter('address', i) as string;
          const priority = this.getNodeParameter('priority', i) as number;
          const ring_size = this.getNodeParameter('ring_size', i) as number;

          const requestBody = {
            jsonrpc: '2.0',
            id: '0',
            method: 'sweep_all',
            params: {
              address,
              priority,
              ring_size,
            },
          };

          const options = {
            method: 'POST',
            url: credentials.walletRpcUrl || 'http://localhost:18083/json_rpc',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }
          
          result = responseData.result;
          break;
        }

        case 'sweepSingle': {
          const address = this.getNodeParameter('address', i) as string;
          const priority = this.getNodeParameter('priority', i) as number;
          const key_image = this.getNodeParameter('key_image', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            id: '0',
            method: 'sweep_single',
            params: {
              address,
              priority,
              key_image,
            },
          };

          const options = {
            method: 'POST',
            url: credentials.walletRpcUrl || 'http://localhost:18083/json_rpc',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }
          
          result = responseData.result;
          break;
        }

        case 'getTransfers': {
          const incomingTransfers = this.getNodeParameter('in', i) as boolean;
          const outgoingTransfers = this.getNodeParameter('out', i) as boolean;
          const pending = this.getNodeParameter('pending', i) as boolean;
          const failed = this.getNodeParameter('failed', i) as boolean;
          const pool = this.getNodeParameter('pool', i) as boolean;
          const filter_by_height = this.getNodeParameter('filter_by_height', i) as boolean;

          const params: any = {
            in: incomingTransfers,
            out: outgoingTransfers,
            pending,
            failed,
            pool,
            filter_by_height,
          };

          if (filter_by_height) {
            const min_height = this.getNodeParameter('min_height', i) as number;
            const max_height = this.getNodeParameter('max_height', i) as number;
            params.min_height = min_height;
            params.max_height = max_height;
          }

          const requestBody = {
            jsonrpc: '2.0',
            id: '0',
            method: 'get_transfers',
            params,
          };

          const options = {
            method: 'POST',
            url: credentials.walletRpcUrl || 'http://localhost:18083/json_rpc',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }
          
          result = responseData.result;
          break;
        }

        case 'getTransferByTxid': {
          const txid = this.getNodeParameter('txid', i) as string;
          const account_index = this.getNodeParameter('account_index', i) as number;

          const requestBody = {
            jsonrpc: '2.0',
            id: '0',
            method: 'get_transfer_by_txid',
            params: {
              txid,
              account_index,
            },
          };

          const options = {
            method: 'POST',
            url: credentials.walletRpcUrl || 'http://localhost:18083/json_rpc',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }
          
          result = responseData.result;
          break;
        }

        case 'incomingTransfers': {
          const transfer_type = this.getNodeParameter('transfer_type', i) as string;
          const account_index = this.getNodeParameter('account_index', i) as number;

          const requestBody = {
            jsonrpc: '2.0',
            id: '0',
            method: 'incoming_transfers',
            params: {
              transfer_type,
              account_index,
            },
          };

          const options = {
            method: 'POST',
            url: credentials.walletRpcUrl || 'http://localhost:18083/json_rpc',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const responseData = JSON.parse(response);
          
          if (responseData.error) {
            throw new NodeApiError(this.getNode(), responseData.error);
          }
          
          result = responseData.result;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeMiningOperationsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('moneroApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'startMining': {
          const threadsCount = this.getNodeParameter('threadsCount', i) as number;
          const doBackgroundMining = this.getNodeParameter('doBackgroundMining', i) as boolean;
          const ignoreBattery = this.getNodeParameter('ignoreBattery', i) as boolean;

          const payload = {
            jsonrpc: '2.0',
            id: '0',
            method: 'start_mining',
            params: {
              threads_count: threadsCount,
              do_background_mining: doBackgroundMining,
              ignore_battery: ignoreBattery,
            },
          };

          const options: any = {
            method: 'POST',
            url: credentials.daemonUrl || 'http://localhost:18081/json_rpc',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'stopMining': {
          const payload = {
            jsonrpc: '2.0',
            id: '0',
            method: 'stop_mining',
            params: {},
          };

          const options: any = {
            method: 'POST',
            url: credentials.daemonUrl || 'http://localhost:18081/json_rpc',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getMiningStatus': {
          const payload = {
            jsonrpc: '2.0',
            id: '0',
            method: 'mining_status',
            params: {},
          };

          const options: any = {
            method: 'POST',
            url: credentials.daemonUrl || 'http://localhost:18081/json_rpc',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'setLogLevel': {
          const level = this.getNodeParameter('level', i) as number;

          const payload = {
            jsonrpc: '2.0',
            id: '0',
            method: 'set_log_level',
            params: {
              level: level,
            },
          };

          const options: any = {
            method: 'POST',
            url: credentials.daemonUrl || 'http://localhost:18081/json_rpc',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'setLogCategories': {
          const categories = this.getNodeParameter('categories', i) as string;

          const payload = {
            jsonrpc: '2.0',
            id: '0',
            method: 'set_log_categories',
            params: {
              categories: categories,
            },
          };

          const options: any = {
            method: 'POST',
            url: credentials.daemonUrl || 'http://localhost:18081/json_rpc',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'submitBlock': {
          const blockBlob = this.getNodeParameter('blockBlob', i) as string;

          const payload = {
            jsonrpc: '2.0',
            id: '0',
            method: 'submitblock',
            params: [blockBlob],
          };

          const options: any = {
            method: 'POST',
            url: credentials.daemonUrl || 'http://localhost:18081/json_rpc',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getLastBlockHeader': {
          const payload = {
            jsonrpc: '2.0',
            id: '0',
            method: 'getlastblockheader',
            params: {},
          };

          const options: any = {
            method: 'POST',
            url: credentials.daemonUrl || 'http://localhost:18081/json_rpc',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(
            this.getNode(),
            `Unknown operation: ${operation}`,
            { itemIndex: i }
          );
      }

      // Parse JSON response if it's a string
      if (typeof result === 'string') {
        result = JSON.parse(result);
      }

      // Check for JSON-RPC errors
      if (result.error) {
        throw new NodeApiError(this.getNode(), {
          message: result.error.message || 'Unknown RPC error',
          code: result.error.code,
        });
      }

      returnData.push({
        json: result.result || result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeAddressOperationsOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('moneroApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;
			let requestBody: any;

			switch (operation) {
				case 'createAddress': {
					const accountIndex = this.getNodeParameter('accountIndex', i) as number;
					const label = this.getNodeParameter('label', i, '') as string;

					requestBody = {
						jsonrpc: '2.0',
						id: '0',
						method: 'create_address',
						params: {
							account_index: accountIndex,
							...(label && { label }),
						},
					};

					const options: any = {
						method: 'POST',
						url: credentials.walletUrl || 'http://localhost:18083/json_rpc',
						headers: {
							'Content-Type': 'application/json',
						},
						body: requestBody,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'labelAddress': {
					const index = this.getNodeParameter('index', i) as number;
					const label = this.getNodeParameter('label', i) as string;

					requestBody = {
						jsonrpc: '2.0',
						id: '0',
						method: 'label_address',
						params: {
							index: {
								major: 0,
								minor: index,
							},
							label,
						},
					};

					const options: any = {
						method: 'POST',
						url: credentials.walletUrl || 'http://localhost:18083/json_rpc',
						headers: {
							'Content-Type': 'application/json',
						},
						body: requestBody,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getAddressIndex': {
					const address = this.getNodeParameter('address', i) as string;

					requestBody = {
						jsonrpc: '2.0',
						id: '0',
						method: 'get_address_index',
						params: {
							address,
						},
					};

					const options: any = {
						method: 'POST',
						url: credentials.walletUrl || 'http://localhost:18083/json_rpc',
						headers: {
							'Content-Type': 'application/json',
						},
						body: requestBody,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'validateAddress': {
					const address = this.getNodeParameter('address', i) as string;
					const anyNetType = this.getNodeParameter('anyNetType', i, false) as boolean;
					const allowOpenalias = this.getNodeParameter('allowOpenalias', i, false) as boolean;

					requestBody = {
						jsonrpc: '2.0',
						id: '0',
						method: 'validate_address',
						params: {
							address,
							any_net_type: anyNetType,
							allow_openalias: allowOpenalias,
						},
					};

					const options: any = {
						method: 'POST',
						url: credentials.daemonUrl || 'http://localhost:18081/json_rpc',
						headers: {
							'Content-Type': 'application/json',
						},
						body: requestBody,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getAddressBook': {
					const entriesParam = this.getNodeParameter('entries', i, '') as string;
					const params: any = {};

					if (entriesParam) {
						const entries = entriesParam.split(',').map(entry => parseInt(entry.trim()));
						params.entries = entries;
					}

					requestBody = {
						jsonrpc: '2.0',
						id: '0',
						method: 'get_address_book',
						params,
					};

					const options: any = {
						method: 'POST',
						url: credentials.walletUrl || 'http://localhost:18083/json_rpc',
						headers: {
							'Content-Type': 'application/json',
						},
						body: requestBody,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'addAddressBook': {
					const address = this.getNodeParameter('address', i) as string;
					const paymentId = this.getNodeParameter('paymentId', i, '') as string;
					const description = this.getNodeParameter('description', i, '') as string;

					requestBody = {
						jsonrpc: '2.0',
						id: '0',
						method: 'add_address_book',
						params: {
							address,
							...(paymentId && { payment_id: paymentId }),
							...(description && { description }),
						},
					};

					const options: any = {
						method: 'POST',
						url: credentials.walletUrl || 'http://localhost:18083/json_rpc',
						headers: {
							'Content-Type': 'application/json',
						},
						body: requestBody,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'deleteAddressBook': {
					const index = this.getNodeParameter('index', i) as number;

					requestBody = {
						jsonrpc: '2.0',
						id: '0',
						method: 'delete_address_book',
						params: {
							index,
						},
					};

					const options: any = {
						method: 'POST',
						url: credentials.walletUrl || 'http://localhost:18083/json_rpc',
						headers: {
							'Content-Type': 'application/json',
						},
						body: requestBody,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			if (result.error) {
				throw new NodeApiError(this.getNode(), result.error, {
					message: `Monero RPC Error: ${result.error.message}`,
				});
			}

			returnData.push({ 
				json: result.result || result, 
				pairedItem: { item: i } 
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({ 
					json: { error: error.message }, 
					pairedItem: { item: i } 
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}
