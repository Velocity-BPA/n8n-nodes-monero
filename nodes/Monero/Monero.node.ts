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
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Wallet',
            value: 'wallet',
          },
          {
            name: 'Transaction',
            value: 'transaction',
          },
          {
            name: 'Address',
            value: 'address',
          },
          {
            name: 'Blockchain',
            value: 'blockchain',
          },
          {
            name: 'Mining',
            value: 'mining',
          }
        ],
        default: 'wallet',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['wallet'] } },
  options: [
    { name: 'Create Wallet', value: 'createWallet', description: 'Create a new wallet', action: 'Create a wallet' },
    { name: 'Open Wallet', value: 'openWallet', description: 'Open an existing wallet', action: 'Open a wallet' },
    { name: 'Close Wallet', value: 'closeWallet', description: 'Close the current wallet', action: 'Close a wallet' },
    { name: 'Get Balance', value: 'getBalance', description: 'Get wallet balance information', action: 'Get wallet balance' },
    { name: 'Get Address', value: 'getAddress', description: 'Get wallet address', action: 'Get wallet address' },
    { name: 'Create Account', value: 'createAccount', description: 'Create a new account in wallet', action: 'Create an account' },
    { name: 'Get Accounts', value: 'getAccounts', description: 'Get all accounts in wallet', action: 'Get accounts' },
    { name: 'Get Height', value: 'getHeight', description: 'Get wallet synchronization height', action: 'Get wallet height' },
    { name: 'Rescan Spent', value: 'rescanSpent', description: 'Rescan spent outputs', action: 'Rescan spent' },
  ],
  default: 'createWallet',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['transaction'] } },
  options: [
    { name: 'Transfer', value: 'transfer', description: 'Send XMR to address(es)', action: 'Send XMR to addresses' },
    { name: 'Transfer Split', value: 'transferSplit', description: 'Send XMR using multiple transactions', action: 'Send XMR using multiple transactions' },
    { name: 'Sweep All', value: 'sweepAll', description: 'Send all unlocked XMR to address', action: 'Send all unlocked XMR to address' },
    { name: 'Sweep Single', value: 'sweepSingle', description: 'Sweep single key image', action: 'Sweep single key image' },
    { name: 'Get Transfers', value: 'getTransfers', description: 'Get transaction history', action: 'Get transaction history' },
    { name: 'Get Transfer by TX ID', value: 'getTransferByTxid', description: 'Get specific transaction details', action: 'Get specific transaction details' },
    { name: 'Incoming Transfers', value: 'incomingTransfers', description: 'Get incoming transfers', action: 'Get incoming transfers' },
    { name: 'Get Payments', value: 'getPayments', description: 'Get payments by payment ID', action: 'Get payments by payment ID' },
    { name: 'Get TX Key', value: 'getTxKey', description: 'Get transaction private key', action: 'Get transaction private key' },
    { name: 'Check TX Key', value: 'checkTxKey', description: 'Verify transaction with private key', action: 'Verify transaction with private key' },
    { name: 'Get Transactions', value: 'getTransactions', description: 'Get transaction details by hash', action: 'Get transaction details' },
    { name: 'Get Transaction Pool', value: 'getTransactionPool', description: 'Get mempool transactions', action: 'Get mempool transactions' },
    { name: 'Send Raw Transaction', value: 'sendRawTransaction', description: 'Broadcast raw transaction', action: 'Broadcast raw transaction' },
    { name: 'Get Transaction Pool Stats', value: 'getTransactionPoolStats', description: 'Get mempool statistics', action: 'Get mempool statistics' },
    { name: 'Flush Transaction Pool', value: 'flushTransactionPool', description: 'Clear transaction pool', action: 'Clear transaction pool' },
    { name: 'Relay Transaction', value: 'relayTransaction', description: 'Relay transaction', action: 'Relay transaction' },
  ],
  default: 'transfer',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['address'] } },
  options: [
    { name: 'Create Address', value: 'createAddress', description: 'Create new subaddress', action: 'Create address' },
    { name: 'Get Addresses', value: 'getAddresses', description: 'Get all addresses for account', action: 'Get addresses' },
    { name: 'Label Address', value: 'labelAddress', description: 'Set label for address', action: 'Label address' },
    { name: 'Get Address Index', value: 'getAddressIndex', description: 'Get address index', action: 'Get address index' },
    { name: 'Validate Address', value: 'validateAddress', description: 'Validate Monero address format', action: 'Validate address' },
    { name: 'Get Address Book', value: 'getAddressBook', description: 'Get address book entries', action: 'Get address book' },
    { name: 'Add Address Book Entry', value: 'addAddressBook', description: 'Add an entry to the address book', action: 'Add address book entry' },
    { name: 'Delete Address Book Entry', value: 'deleteAddressBook', description: 'Delete an entry from the address book', action: 'Delete address book entry' },
  ],
  default: 'createAddress',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['blockchain'] } },
  options: [
    { name: 'Get Block Count', value: 'getBlockCount', description: 'Get current blockchain height', action: 'Get block count' },
    { name: 'Get Block Header By Hash', value: 'getBlockHeaderByHash', description: 'Get block header by hash', action: 'Get block header by hash' },
    { name: 'Get Block Header By Height', value: 'getBlockHeaderByHeight', description: 'Get block header by height', action: 'Get block header by height' },
    { name: 'Get Block', value: 'getBlock', description: 'Get complete block data', action: 'Get block' },
    { name: 'Get Connections', value: 'getConnections', description: 'Get peer connections', action: 'Get connections' },
    { name: 'Get Info', value: 'getInfo', description: 'Get general daemon info', action: 'Get info' },
    { name: 'Get Version', value: 'getVersion', description: 'Get daemon version', action: 'Get version' },
    { name: 'Hard Fork Info', value: 'hardForkInfo', description: 'Get hard fork information', action: 'Get hard fork info' },
    { name: 'Sync Info', value: 'syncInfo', description: 'Get synchronization status', action: 'Get sync info' }
  ],
  default: 'getBlockCount',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['mining'] } },
  options: [
    { name: 'Start Mining', value: 'startMining', description: 'Start mining operation', action: 'Start mining' },
    { name: 'Stop Mining', value: 'stopMining', description: 'Stop mining operation', action: 'Stop mining' },
    { name: 'Get Mining Status', value: 'getMiningStatus', description: 'Get current mining status', action: 'Get mining status' },
    { name: 'Set Miner Tx Relay', value: 'setMinerTxRelay', description: 'Set miner transaction relay', action: 'Set miner transaction relay' },
    { name: 'Get Last Block Header', value: 'getLastBlockHeader', description: 'Get last block header', action: 'Get last block header' },
    { name: 'Submit Block', value: 'submitBlock', description: 'Submit mined block', action: 'Submit block' },
    { name: 'Set Log Level', value: 'setLogLevel', description: 'Set the daemon log level', action: 'Set log level' },
    { name: 'Set Log Categories', value: 'setLogCategories', description: 'Set the daemon log categories', action: 'Set log categories' },
  ],
  default: 'startMining',
},
{
  displayName: 'Filename',
  name: 'filename',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['wallet'], operation: ['createWallet', 'openWallet'] } },
  default: '',
  description: 'The name of the wallet file',
},
{
  displayName: 'Password',
  name: 'password',
  type: 'string',
  typeOptions: { password: true },
  required: true,
  displayOptions: { show: { resource: ['wallet'], operation: ['createWallet', 'openWallet'] } },
  default: '',
  description: 'The password for the wallet',
},
{
  displayName: 'Language',
  name: 'language',
  type: 'options',
  options: [
    { name: 'English', value: 'English' },
    { name: 'Français', value: 'Français' },
    { name: 'Español', value: 'Español' },
    { name: 'Português', value: 'Português' },
    { name: '日本語', value: '日本語' },
    { name: '简体中文', value: '简体中文 (中国)' },
    { name: 'Deutsch', value: 'Deutsch' },
    { name: 'русский язык', value: 'русский язык' },
    { name: 'Esperanto', value: 'Esperanto' },
    { name: 'Lojban', value: 'Lojban' },
    { name: 'Nederlands', value: 'Nederlands' },
    { name: 'Italiano', value: 'Italiano' }
  ],
  displayOptions: { show: { resource: ['wallet'], operation: ['createWallet'] } },
  default: 'English',
  description: 'The language for the wallet mnemonic seed',
},
{
  displayName: 'Account Index',
  name: 'accountIndex',
  type: 'number',
  displayOptions: { show: { resource: ['wallet'], operation: ['getBalance', 'getAddress'] } },
  default: 0,
  description: 'Return balance or address for this account',
},
{
  displayName: 'Address Indices',
  name: 'addressIndices',
  type: 'string',
  displayOptions: { show: { resource: ['wallet'], operation: ['getBalance', 'getAddress'] } },
  default: '',
  description: 'Comma-separated list of address indices to query',
  placeholder: '0,1,2',
},
{
  displayName: 'Label',
  name: 'label',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['wallet'], operation: ['createAccount'] } },
  default: '',
  description: 'Label for the new account',
},
{
  displayName: 'Tag',
  name: 'tag',
  type: 'string',
  displayOptions: { show: { resource: ['wallet'], operation: ['getAccounts'] } },
  default: '',
  description: 'Tag to filter accounts',
},
{
  displayName: 'Destinations',
  name: 'destinations',
  type: 'fixedCollection',
  typeOptions: {
    multipleValues: true,
  },
  displayOptions: { show: { resource: ['transaction'], operation: ['transfer', 'transferSplit'] } },
  default: {},
  options: [
    {
      name: 'destination',
      displayName: 'Destination',
      values: [
        {
          displayName: 'Address',
          name: 'address',
          type: 'string',
          default: '',
          description: 'Destination address',
        },
        {
          displayName: 'Amount',
          name: 'amount',
          type: 'number',
          default: 0,
          description: 'Amount to send in atomic units',
        },
      ],
    },
  ],
  description: 'Array of destinations to send XMR to',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  displayOptions: { show: { resource: ['transaction'], operation: ['sweepAll', 'sweepSingle', 'checkTxKey'] } },
  default: '',
  description: 'Destination address',
  required: true,
},
{
  displayName: 'Key Image',
  name: 'key_image',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['sweepSingle'],
    },
  },
  default: '',
  description: 'Key image to sweep',
},
{
  displayName: 'Account Index',
  name: 'accountIndex',
  type: 'number',
  displayOptions: { show: { resource: ['transaction'], operation: ['transfer', 'transferSplit', 'sweepAll', 'getTransferByTxid', 'incomingTransfers'] } },
  default: 0,
  description: 'Account index to use',
},
{
  displayName: 'Priority',
  name: 'priority',
  type: 'options',
  displayOptions: { show: { resource: ['transaction'], operation: ['transfer', 'transferSplit', 'sweepAll', 'sweepSingle'] } },
  options: [
    { name: 'Default', value: 0 },
    { name: 'Unimportant', value: 1 },
    { name: 'Normal', value: 2 },
    { name: 'Elevated', value: 3 },
    { name: 'Priority', value: 4 },
  ],
  default: 0,
  description: 'Transaction priority',
},
{
  displayName: 'Ring Size',
  name: 'ringSize',
  type: 'number',
  displayOptions: { show: { resource: ['transaction'], operation: ['transfer', 'transferSplit', 'sweepAll'] } },
  default: 11,
  description: 'Number of outputs from the blockchain to mix with',
},
{
  displayName: 'Unlock Time',
  name: 'unlockTime',
  type: 'number',
  displayOptions: { show: { resource: ['transaction'], operation: ['transfer'] } },
  default: 0,
  description: 'Number of blocks before the monero can be spent (0 for no lock)',
},
{
  displayName: 'Get Transaction Key',
  name: 'get_tx_key',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['transfer'],
    },
  },
  default: true,
  description: 'Whether to return the transaction key',
},
{
  displayName: 'Include Incoming',
  name: 'in',
  type: 'boolean',
  displayOptions: { show: { resource: ['transaction'], operation: ['getTransfers'] } },
  default: true,
  description: 'Include incoming transfers',
},
{
  displayName: 'Include Outgoing',
  name: 'out',
  type: 'boolean',
  displayOptions: { show: { resource: ['transaction'], operation: ['getTransfers'] } },
  default: true,
  description: 'Include outgoing transfers',
},
{
  displayName: 'Include Pending',
  name: 'pending',
  type: 'boolean',
  displayOptions: { show: { resource: ['transaction'], operation: ['getTransfers'] } },
  default: false,
  description: 'Include pending transfers',
},
{
  displayName: 'Include Failed',
  name: 'failed',
  type: 'boolean',
  displayOptions: { show: { resource: ['transaction'], operation: ['getTransfers'] } },
  default: false,
  description: 'Include failed transfers',
},
{
  displayName: 'Include Pool',
  name: 'pool',
  type: 'boolean',
  displayOptions: { show: { resource: ['transaction'], operation: ['getTransfers'] } },
  default: false,
  description: 'Include pool transfers',
},
{
  displayName: 'Filter by Height',
  name: 'filter_by_height',
  type: 'boolean',
  displayOptions: { show: { resource: ['transaction'], operation: ['getTransfers'] } },
  default: false,
  description: 'Filter transfers by block height range',
},
{
  displayName: 'Min Height',
  name: 'min_height',
  type: 'number',
  displayOptions: { show: { resource: ['transaction'], operation: ['getTransfers'], filter_by_height: [true] } },
  default: 0,
  description: 'Minimum block height to filter by',
},
{
  displayName: 'Max Height',
  name: 'max_height',
  type: 'number',
  displayOptions: { show: { resource: ['transaction'], operation: ['getTransfers'], filter_by_height: [true] } },
  default: 0,
  description: 'Maximum block height to filter by',
},
{
  displayName: 'Transaction ID',
  name: 'txid',
  type: 'string',
  displayOptions: { show: { resource: ['transaction'], operation: ['getTransferByTxid', 'getTxKey', 'checkTxKey', 'flushTransactionPool', 'relayTransaction'] } },
  default: '',
  description: 'Transaction ID',
  required: true,
},
{
  displayName: 'Transfer Type',
  name: 'transfer_type',
  type: 'options',
  displayOptions: { show: { resource: ['transaction'], operation: ['incomingTransfers'] } },
  options: [
    { name: 'All', value: 'all' },
    { name: 'Available', value: 'available' },
    { name: 'Unavailable', value: 'unavailable' },
  ],
  default: 'all',
  description: 'Type of incoming transfers to retrieve',
},
{
  displayName: 'Subaddress Indices',
  name: 'subaddrIndices',
  type: 'string',
  displayOptions: { show: { resource: ['transaction'], operation: ['incomingTransfers'] } },
  default: '',
  description: 'Comma-separated list of subaddress indices to filter by',
},
{
  displayName: 'Payment ID',
  name: 'paymentId',
  type: 'string',
  displayOptions: { show: { resource: ['transaction'], operation: ['getPayments'] } },
  default: '',
  description: 'Payment ID to look up',
  required: true,
},
{
  displayName: 'TX Key',
  name: 'txKey',
  type: 'string',
  displayOptions: { show: { resource: ['transaction'], operation: ['checkTxKey'] } },
  default: '',
  description: 'Transaction private key',
  required: true,
},
{
  displayName: 'Transaction Hashes',
  name: 'txsHashes',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transaction'],
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
      resource: ['transaction'],
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
      resource: ['transaction'],
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
      resource: ['transaction'],
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
      resource: ['transaction'],
      operation: ['flushTransactionPool', 'relayTransaction'],
    },
  },
  default: '',
  description: 'Comma-separated list of transaction IDs',
  placeholder: 'txid1,txid2,txid3',
},
{
  displayName: 'Account Index',
  name: 'accountIndex',
  type: 'number',
  required: true,
  default: 0,
  displayOptions: {
    show: {
      resource: ['address'],
      operation: ['createAddress']
    }
  },
  description: 'Account index to create address for'
},
{
  displayName: 'Label',
  name: 'label',
  type: 'string',
  required: false,
  default: '',
  displayOptions: {
    show: {
      resource: ['address'],
      operation: ['createAddress', 'labelAddress']
    }
  },
  description: 'Optional label for the new address'
},
{
  displayName: 'Account Index',
  name: 'accountIndex',
  type: 'number',
  required: true,
  default: 0,
  displayOptions: {
    show: {
      resource: ['address'],
      operation: ['getAddresses']
    }
  },
  description: 'Account index to get addresses for'
},
{
  displayName: 'Address Index',
  name: 'index',
  type: 'number',
  required: true,
  default: 0,
  displayOptions: {
    show: {
      resource: ['address'],
      operation: ['labelAddress', 'deleteAddressBook']
    }
  },
  description: 'Index of address to label'
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  default: '',
  displayOptions: {
    show: {
      resource: ['address'],
      operation: ['getAddressIndex', 'validateAddress', 'addAddressBook']
    }
  },
  description: 'Monero address to process'
},
{
  displayName: 'Any Net Type',
  name: 'anyNetType',
  type: 'boolean',
  required: false,
  default: false,
  displayOptions: {
    show: {
      resource: ['address'],
      operation: ['validateAddress']
    }
  },
  description: 'Allow validation for any network type'
},
{
  displayName: 'Allow OpenAlias',
  name: 'allowOpenalias',
  type: 'boolean',
  required: false,
  default: false,
  displayOptions: {
    show: {
      resource: ['address'],
      operation: ['validateAddress']
    }
  },
  description: 'Allow OpenAlias addresses'
},
{
  displayName: 'Entries',
  name: 'entries',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['address'],
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
      resource: ['address'],
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
      resource: ['address'],
      operation: ['addAddressBook'],
    },
  },
  default: '',
  description: 'Description for the address book entry',
},
{
  displayName: 'Hash',
  name: 'hash',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['blockchain'], operation: ['getBlockHeaderByHash'] } },
  default: '',
  description: 'Block hash to retrieve header for',
},
{
  displayName: 'Fill PoW Hash',
  name: 'fill_pow_hash',
  type: 'boolean',
  displayOptions: { show: { resource: ['blockchain'], operation: ['getBlockHeaderByHash'] } },
  default: false,
  description: 'Whether to include PoW hash in response',
},
{
  displayName: 'Height',
  name: 'height',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['blockchain'], operation: ['getBlockHeaderByHeight', 'getBlock'] } },
  default: 0,
  description: 'Block height to retrieve',
},
{
  displayName: 'Fill PoW Hash',
  name: 'fill_pow_hash',
  type: 'boolean',
  displayOptions: { show: { resource: ['blockchain'], operation: ['getBlockHeaderByHeight', 'getBlock'] } },
  default: false,
  description: 'Whether to include PoW hash in response',
},
{
  displayName: 'Block Hash',
  name: 'hash',
  type: 'string',
  displayOptions: { show: { resource: ['blockchain'], operation: ['getBlock'] } },
  default: '',
  description: 'Block hash to retrieve (alternative to height)',
},
{
  displayName: 'Version',
  name: 'version',
  type: 'number',
  displayOptions: { show: { resource: ['blockchain'], operation: ['hardForkInfo'] } },
  default: 0,
  description: 'Hard fork version to get info for (0 for current)',
},
{
  displayName: 'Miner Address',
  name: 'minerAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['mining'], operation: ['startMining'] } },
  default: '',
  description: 'Address to receive mining rewards',
},
{
  displayName: 'Threads Count',
  name: 'threadsCount',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['mining'], operation: ['startMining'] } },
  default: 1,
  description: 'Number of mining threads to use',
},
{
  displayName: 'Do Background Mining',
  name: 'doBackgroundMining',
  type: 'boolean',
  required: false,
  displayOptions: { show: { resource: ['mining'], operation: ['startMining'] } },
  default: false,
  description: 'Whether to enable background mining',
},
{
  displayName: 'Ignore Battery',
  name: 'ignoreBattery',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['mining'],
      operation: ['startMining'],
    },
  },
  default: false,
  description: 'Ignore battery status when mining',
},
{
  displayName: 'Relay',
  name: 'relay',
  type: 'boolean',
  required: true,
  displayOptions: { show: { resource: ['mining'], operation: ['setMinerTxRelay'] } },
  default: true,
  description: 'Whether to relay miner transactions',
},
{
  displayName: 'Fill PoW Hash',
  name: 'fillPowHash',
  type: 'boolean',
  required: false,
  displayOptions: { show: { resource: ['mining'], operation: ['getLastBlockHeader'] } },
  default: false,
  description: 'Whether to fill proof of work hash',
},
{
  displayName: 'Block Blob',
  name: 'blockBlob',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['mining'], operation: ['submitBlock'] } },
  default: '',
  description: 'Hexadecimal string of the block blob to submit',
},
{
  displayName: 'Log Level',
  name: 'level',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['mining'],
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
      resource: ['mining'],
      operation: ['setLogCategories'],
    },
  },
  default: '',
  description: 'Log categories to set (comma-separated)',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'wallet':
        return [await executeWalletOperations.call(this, items)];
      case 'transaction':
        return [await executeTransactionOperations.call(this, items)];
      case 'address':
        return [await executeAddressOperations.call(this, items)];
      case 'blockchain':
        return [await executeBlockchainOperations.call(this, items)];
      case 'mining':
        return [await executeMiningOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeWalletOperations(
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
      const isWalletOperation = ['createWallet', 'openWallet', 'closeWallet', 'getBalance', 'getAddress', 'createAccount', 'getAccounts', 'getHeight', 'rescanSpent'].includes(operation);
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

        case 'getHeight': {
          const requestBody: any = {
            jsonrpc: '2.0',
            id: '0',
            method: 'get_height',
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

async function executeTransactionOperations(
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
          const destinations = this.getNodeParameter('destinations.destination', i, []) as any[];
          const accountIndex = this.getNodeParameter('accountIndex', i, 0) as number;
          const priority = this.getNodeParameter('priority', i, 0) as number;
          const ringSize = this.getNodeParameter('ringSize', i, 11) as number;
          const unlockTime = this.getNodeParameter('unlockTime', i, 0) as number;
          const get_tx_key = this.getNodeParameter('get_tx_key', i, true) as boolean;

          const requestBody = {
            jsonrpc: '2.0',
            id: '0',
            method: 'transfer',
            params: {
              destinations,
              account_index: accountIndex,
              priority,
              ring_size: ringSize,
              unlock_time: unlockTime,
              get_tx_key,
            },
          };

          const options: any = {
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
          const destinations = this.getNodeParameter('destinations.destination', i, []) as any[];
          const accountIndex = this.getNodeParameter('accountIndex', i, 0) as number;
          const priority = this.getNodeParameter('priority', i, 0) as number;
          const ringSize = this.getNodeParameter('ringSize', i, 11) as number;

          const requestBody = {
            jsonrpc: '2.0',
            id: '0',
            method: 'transfer_split',
            params: {
              destinations,
              account_index: accountIndex,
              priority,
              ring_size: ringSize,
            },
          };

          const options: any = {
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
          const accountIndex = this.getNodeParameter('accountIndex', i, 0) as number;
          const priority = this.getNodeParameter('priority', i, 0) as number;
          const ringSize = this.getNodeParameter('ringSize', i, 11) as number;

          const requestBody = {
            jsonrpc: '2.0',
            id: '0',
            method: 'sweep_all',
            params: {
              address,
              account_index: accountIndex,
              priority,
              ring_size: ringSize,
            },
          };

          const options: any = {
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
          const priority = this.getNodeParameter('priority', i, 0) as number;
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

          const options: any = {
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
          const inTransfers = this.getNodeParameter('in', i, true) as boolean;
          const outTransfers = this.getNodeParameter('out', i, true) as boolean;
          const pending = this.getNodeParameter('pending', i, false) as boolean;
          const failed = this.getNodeParameter('failed', i, false) as boolean;
          const pool = this.getNodeParameter('pool', i, false) as boolean;
          const filter_by_height = this.getNodeParameter('filter_by_height', i, false) as boolean;

          const params: any = {
            in: inTransfers,
            out: outTransfers,
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

          const options: any = {
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
          const accountIndex = this.getNodeParameter('accountIndex', i, 0) as number;

          const requestBody = {
            jsonrpc: '2.0',
            id: '0',
            method: 'get_transfer_by_txid',
            params: {
              txid,
              account_index: accountIndex,
            },
          };

          const options: any = {
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
          const transfer_type = this.getNodeParameter('transfer_type', i, 'all') as string;
          const accountIndex = this.getNodeParameter('accountIndex', i, 0) as number;
          const subaddrIndicesStr = this.getNodeParameter('subaddrIndices', i, '') as string;

          const params: any = {
            transfer_type,
            account_index: accountIndex,
          };

          if (subaddrIndicesStr) {
            params.subaddr_indices = subaddrIndicesStr.split(',').map((idx: string) => parseInt(idx.trim(), 10));
          }

          const requestBody = {
            jsonrpc: '2.0',
            id: '0',
            method: 'incoming_transfers',
            params,
          };

          const options: any = {
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

        case 'getPayments': {
          const paymentId = this.getNodeParameter('paymentId', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            id: '0',
            method: 'get_payments',
            params: {
              payment_id: paymentId,
            },
          };

          const options: any = {
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

        case 'getTxKey': {
          const txid = this.getNodeParameter('txid', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            id: '0',
            method: 'get_tx_key',
            params: {
              txid,
            },
          };

          const options: any = {
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

        case 'checkTxKey': {
          const txid = this.getNodeParameter('txid', i) as string;
          const txKey = this.getNodeParameter('txKey', i) as string;
          const address = this.getNodeParameter('address', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            id: '0',
            method: 'check_tx_key',
            params: {
              txid,
              tx_key: txKey,
              address,
            },
          };

          const options: any = {
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
            method: '