/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Monero } from '../nodes/Monero/Monero.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Monero Node', () => {
  let node: Monero;

  beforeAll(() => {
    node = new Monero();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Monero');
      expect(node.description.name).toBe('monero');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('BlockchainInfo Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        baseUrl: 'http://localhost:18081/json_rpc',
        username: 'test-user',
        password: 'test-password',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should get block count successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getBlockCount';
      return undefined;
    });

    const mockResponse = {
      jsonrpc: '2.0',
      id: '0',
      result: {
        count: 2963742,
        status: 'OK',
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify(mockResponse));

    const result = await executeBlockchainInfoOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'http://localhost:18081/json_rpc',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: '0',
          method: 'get_block_count',
          params: {},
        }),
        auth: {
          user: 'test-user',
          password: 'test-password',
        },
      }),
    );
  });

  test('should get block header by height successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'getBlockHeaderByHeight';
      if (param === 'height') return 2963741;
      return undefined;
    });

    const mockResponse = {
      jsonrpc: '2.0',
      id: '0',
      result: {
        block_header: {
          block_size: 106,
          depth: 1,
          difficulty: 283689227720,
          hash: 'e22cf75f39ae720e8b71b3d120a5ac03f0db50bba6379e2850975b4859190bc6',
          height: 2963741,
          major_version: 16,
          minor_version: 16,
          nonce: 10041,
          num_txes: 0,
          orphan_status: false,
          prev_hash: 'b61c58b2e0be53fdd5ef9d4408a7c9b98f8f2b1c1fe0d3d4b7a5f6f5c7bfa5a5',
          reward: 600000000000,
          timestamp: 1637845651,
        },
        status: 'OK',
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify(mockResponse));

    const result = await executeBlockchainInfoOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
  });

  test('should handle RPC error response', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getBlockCount';
      return undefined;
    });

    const mockErrorResponse = {
      jsonrpc: '2.0',
      id: '0',
      error: {
        code: -1,
        message: 'Failed to connect to daemon',
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify(mockErrorResponse));

    await expect(
      executeBlockchainInfoOperations.call(mockExecuteFunctions, [{ json: {} }]),
    ).rejects.toThrow('Monero RPC Error: Failed to connect to daemon');
  });

  test('should get block by hash successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'getBlock';
      if (param === 'hash') return 'e22cf75f39ae720e8b71b3d120a5ac03f0db50bba6379e2850975b4859190bc6';
      if (param === 'height') return undefined;
      return undefined;
    });

    const mockResponse = {
      jsonrpc: '2.0',
      id: '0',
      result: {
        blob: '1010...',
        block_header: {
          hash: 'e22cf75f39ae720e8b71b3d120a5ac03f0db50bba6379e2850975b4859190bc6',
          height: 2963741,
        },
        json: '{"major_version": 16, "minor_version": 16}',
        miner_tx_hash: '...',
        tx_hashes: [],
        status: 'OK',
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify(mockResponse));

    const result = await executeBlockchainInfoOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
  });

  test('should handle continueOnFail for errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getBlockCount';
      return undefined;
    });

    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Connection failed'));

    const result = await executeBlockchainInfoOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'Connection failed' });
  });
});

describe('TransactionOperations Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        daemonUrl: 'http://localhost:18081/json_rpc',
        username: 'test-user',
        password: 'test-password',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getTransactions operation', () => {
    it('should successfully get transaction details', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: '0',
        result: {
          status: 'OK',
          txs: [
            {
              as_hex: 'transaction_hex_data',
              as_json: '{"version":2,"unlock_time":0}',
              block_height: 123456,
              tx_hash: 'test_hash_123',
            },
          ],
        },
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getTransactions';
          case 'txsHashes': return 'test_hash_123';
          case 'decodeAsJson': return true;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTransactionOperationsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.status).toBe('OK');
      expect(result[0].json.txs).toHaveLength(1);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'http://localhost:18081/json_rpc',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: '0',
          method: 'get_transactions',
          params: {
            txs_hashes: ['test_hash_123'],
            decode_as_json: true,
          },
        }),
        json: false,
        auth: { user: 'test-user', pass: 'test-password' },
      });
    });

    it('should handle API errors', async () => {
      const mockErrorResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: '0',
        error: {
          code: -1,
          message: 'Transaction not found',
        },
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getTransactions';
          case 'txsHashes': return 'invalid_hash';
          case 'decodeAsJson': return true;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockErrorResponse);

      const items = [{ json: {} }];
      
      await expect(
        executeTransactionOperationsOperations.call(mockExecuteFunctions, items)
      ).rejects.toThrow('Transaction not found');
    });
  });

  describe('getTransactionPool operation', () => {
    it('should successfully get transaction pool', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: '0',
        result: {
          status: 'OK',
          transactions: [
            {
              id_hash: 'pool_tx_hash_123',
              tx_json: '{"version":2}',
              blob_size: 1024,
              fee: 20000000000,
            },
          ],
        },
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getTransactionPool';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTransactionOperationsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.status).toBe('OK');
      expect(result[0].json.transactions).toHaveLength(1);
    });
  });

  describe('sendRawTransaction operation', () => {
    it('should successfully send raw transaction', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: '0',
        result: {
          status: 'OK',
          tx_hash: 'sent_tx_hash_123',
        },
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'sendRawTransaction';
          case 'txAsHex': return 'raw_transaction_hex_data';
          case 'doNotRelay': return false;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTransactionOperationsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.status).toBe('OK');
      expect(result[0].json.tx_hash).toBe('sent_tx_hash_123');
    });
  });

  describe('getTransactionPoolStats operation', () => {
    it('should successfully get transaction pool stats', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: '0',
        result: {
          status: 'OK',
          pool_stats: {
            bytes_total: 102400,
            bytes_min: 1024,
            bytes_max: 4096,
            bytes_med: 2048,
            fee_total: 200000000000,
            txs_total: 50,
          },
        },
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getTransactionPoolStats';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTransactionOperationsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.status).toBe('OK');
      expect(result[0].json.pool_stats.txs_total).toBe(50);
    });
  });

  describe('flushTransactionPool operation', () => {
    it('should successfully flush transaction pool', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: '0',
        result: {
          status: 'OK',
        },
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'flushTransactionPool';
          case 'txids': return 'txid1,txid2,txid3';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTransactionOperationsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.status).toBe('OK');
    });
  });

  describe('relayTransaction operation', () => {
    it('should successfully relay transaction', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: '0',
        result: {
          status: 'OK',
        },
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'relayTransaction';
          case 'txids': return 'relay_txid_123';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTransactionOperationsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.status).toBe('OK');
    });
  });
});

describe('WalletManagement Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        walletRpcUrl: 'http://localhost:18083/json_rpc',
        daemonUrl: 'http://localhost:18081/json_rpc',
        username: 'test-user',
        password: 'test-pass',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('createWallet operation', () => {
    it('should create wallet successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: '0',
        result: { success: true }
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation':
            return 'createWallet';
          case 'filename':
            return 'test-wallet';
          case 'password':
            return 'test-password';
          case 'language':
            return 'English';
          default:
            return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeWalletManagementOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ success: true });
    });
  });

  describe('getBalance operation', () => {
    it('should get balance successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: '0',
        result: {
          balance: 1000000000000,
          unlocked_balance: 800000000000,
          multisig_import_needed: false
        }
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation':
            return 'getBalance';
          case 'accountIndex':
            return 0;
          case 'addressIndices':
            return '0,1';
          default:
            return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeWalletManagementOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.balance).toBe(1000000000000);
      expect(result[0].json.unlocked_balance).toBe(800000000000);
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      const mockErrorResponse = JSON.stringify({
        jsonrpc: '2.0',
        id: '0',
        error: {
          code: -1,
          message: 'Wallet not found'
        }
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation':
            return 'openWallet';
          case 'filename':
            return 'nonexistent-wallet';
          case 'password':
            return 'wrong-password';
          default:
            return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockErrorResponse);

      const items = [{ json: {} }];
      
      await expect(executeWalletManagementOperations.call(mockExecuteFunctions, items))
        .rejects.toThrow('Monero API Error: Wallet not found');
    });

    it('should handle network errors with continueOnFail', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation':
            return 'closeWallet';
          default:
            return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executeWalletManagementOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Network error');
    });
  });
});

describe('WalletTransfers Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        walletRpcUrl: 'http://localhost:18083/json_rpc',
        daemonRpcUrl: 'http://localhost:18081/json_rpc',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should execute transfer operation successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'transfer';
        case 'destinations': return '[{"address": "4...", "amount": 1000000000000}]';
        case 'priority': return 0;
        case 'ring_size': return 11;
        case 'get_tx_key': return true;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue('{"jsonrpc": "2.0", "id": "0", "result": {"tx_hash": "abc123", "tx_key": "def456"}}');

    const items = [{ json: {} }];
    const result = await executeWalletTransfersOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ tx_hash: 'abc123', tx_key: 'def456' });
  });

  test('should execute getTransfers operation successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getTransfers';
        case 'in': return true;
        case 'out': return true;
        case 'pending': return false;
        case 'failed': return false;
        case 'pool': return false;
        case 'filter_by_height': return false;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue('{"jsonrpc": "2.0", "id": "0", "result": {"in": [], "out": []}}');

    const items = [{ json: {} }];
    const result = await executeWalletTransfersOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ in: [], out: [] });
  });

  test('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'transfer';
        case 'destinations': return '[{"address": "invalid", "amount": 1000}]';
        case 'priority': return 0;
        case 'ring_size': return 11;
        case 'get_tx_key': return true;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue('{"jsonrpc": "2.0", "id": "0", "error": {"code": -1, "message": "Invalid address"}}');

    const items = [{ json: {} }];

    await expect(executeWalletTransfersOperations.call(mockExecuteFunctions, items)).rejects.toThrow();
  });

  test('should execute sweepAll operation successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'sweepAll';
        case 'address': return '4...';
        case 'priority': return 0;
        case 'ring_size': return 11;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue('{"jsonrpc": "2.0", "id": "0", "result": {"tx_hash": "sweep123"}}');

    const items = [{ json: {} }];
    const result = await executeWalletTransfersOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ tx_hash: 'sweep123' });
  });

  test('should execute incomingTransfers operation successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'incomingTransfers';
        case 'transfer_type': return 'all';
        case 'account_index': return 0;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue('{"jsonrpc": "2.0", "id": "0", "result": {"transfers": []}}');

    const items = [{ json: {} }];
    const result = await executeWalletTransfersOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ transfers: [] });
  });
});

describe('MiningOperations Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        daemonUrl: 'http://localhost:18081/json_rpc',
        walletUrl: 'http://localhost:18083/json_rpc',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('startMining operation', () => {
    it('should start mining successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        switch (param) {
          case 'operation': return 'startMining';
          case 'threadsCount': return 2;
          case 'doBackgroundMining': return true;
          case 'ignoreBattery': return false;
          default: return undefined;
        }
      });

      const mockResponse = {
        jsonrpc: '2.0',
        id: '0',
        result: {
          status: 'OK'
        }
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMiningOperationsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ status: 'OK' });
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'http://localhost:18081/json_rpc',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: '0',
          method: 'start_mining',
          params: {
            threads_count: 2,
            do_background_mining: true,
            ignore_battery: false,
          },
        }),
      });
    });

    it('should handle API errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        switch (param) {
          case 'operation': return 'startMining';
          case 'threadsCount': return 2;
          case 'doBackgroundMining': return true;
          case 'ignoreBattery': return false;
          default: return undefined;
        }
      });

      const mockErrorResponse = {
        jsonrpc: '2.0',
        id: '0',
        error: {
          code: -1,
          message: 'Mining failed to start'
        }
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockErrorResponse);

      await expect(
        executeMiningOperationsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Mining failed to start');
    });
  });

  describe('getMiningStatus operation', () => {
    it('should get mining status successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        switch (param) {
          case 'operation': return 'getMiningStatus';
          default: return undefined;
        }
      });

      const mockResponse = {
        jsonrpc: '2.0',
        id: '0',
        result: {
          active: true,
          speed: 123,
          threads_count: 2,
          address: 'test_address'
        }
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMiningOperationsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({
        active: true,
        speed: 123,
        threads_count: 2,
        address: 'test_address'
      });
    });
  });

  describe('submitBlock operation', () => {
    it('should submit block successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        switch (param) {
          case 'operation': return 'submitBlock';
          case 'blockBlob': return 'test_block_blob_data';
          default: return undefined;
        }
      });

      const mockResponse = {
        jsonrpc: '2.0',
        id: '0',
        result: {
          status: 'OK'
        }
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMiningOperationsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ status: 'OK' });
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'http://localhost:18081/json_rpc',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: '0',
          method: 'submitblock',
          params: ['test_block_blob_data'],
        }),
      });
    });
  });

  describe('getLastBlockHeader operation', () => {
    it('should get last block header successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        switch (param) {
          case 'operation': return 'getLastBlockHeader';
          default: return undefined;
        }
      });

      const mockResponse = {
        jsonrpc: '2.0',
        id: '0',
        result: {
          block_header: {
            block_size: 210,
            depth: 0,
            difficulty: 982540729,
            hash: 'e22cf75f39ae720e8b71b3d120a5ac03f0db50bba6379e2850975b4859190bc6',
            height: 912345,
            timestamp: 1452793716
          }
        }
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMiningOperationsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.block_header).toBeDefined();
      expect(result[0].json.block_header.height).toBe(912345);
    });
  });

  describe('setLogLevel operation', () => {
    it('should set log level successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        switch (param) {
          case 'operation': return 'setLogLevel';
          case 'level': return 3;
          default: return undefined;
        }
      });

      const mockResponse = {
        jsonrpc: '2.0',
        id: '0',
        result: {
          status: 'OK'
        }
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMiningOperationsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ status: 'OK' });
    });
  });
});

describe('AddressOperations Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				daemonUrl: 'http://localhost:18081/json_rpc',
				walletUrl: 'http://localhost:18083/json_rpc',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('createAddress operation', () => {
		it('should create a new address successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'operation': return 'createAddress';
					case 'accountIndex': return 0;
					case 'label': return 'Test Address';
					default: return undefined;
				}
			});

			const mockResponse = {
				result: {
					address: '4BKjy1uVRTPiz4pHyaXXawb82XpzLiowSDd8rEQJGqvN6AD6kWuoATq45YP2dhnKTmhV7YrT9rnMZcLCJnbJNFcGCXNArXd',
					address_index: 1
				}
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAddressOperationsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			);

			expect(result[0].json).toEqual(mockResponse.result);
		});

		it('should handle API errors', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'operation': return 'createAddress';
					case 'accountIndex': return 0;
					default: return undefined;
				}
			});

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				error: { code: -1, message: 'Invalid account index' }
			});

			await expect(executeAddressOperationsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			)).rejects.toThrow();
		});
	});

	describe('validateAddress operation', () => {
		it('should validate address successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'operation': return 'validateAddress';
					case 'address': return '4BKjy1uVRTPiz4pHyaXXawb82XpzLiowSDd8rEQJGqvN6AD6kWuoATq45YP2dhnKTmhV7YrT9rnMZcLCJnbJNFcGCXNArXd';
					case 'anyNetType': return false;
					case 'allowOpenalias': return false;
					default: return undefined;
				}
			});

			const mockResponse = {
				result: {
					valid: true,
					integrated: false,
					subaddress: false,
					nettype: 'mainnet',
					openalias_address: ''
				}
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAddressOperationsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			);

			expect(result[0].json).toEqual(mockResponse.result);
		});
	});

	describe('getAddressBook operation', () => {
		it('should get address book entries successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'operation': return 'getAddressBook';
					case 'entries': return '';
					default: return undefined;
				}
			});

			const mockResponse = {
				result: {
					entries: [
						{
							address: '4BKjy1uVRTPiz4pHyaXXawb82XpzLiowSDd8rEQJGqvN6AD6kWuoATq45YP2dhnKTmhV7YrT9rnMZcLCJnbJNFcGCXNArXd',
							description: 'Test Entry',
							index: 0,
							payment_id: ''
						}
					]
				}
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAddressOperationsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			);

			expect(result[0].json).toEqual(mockResponse.result);
		});
	});

	describe('addAddressBook operation', () => {
		it('should add address book entry successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'operation': return 'addAddressBook';
					case 'address': return '4BKjy1uVRTPiz4pHyaXXawb82XpzLiowSDd8rEQJGqvN6AD6kWuoATq45YP2dhnKTmhV7YrT9rnMZcLCJnbJNFcGCXNArXd';
					case 'description': return 'Test Entry';
					case 'paymentId': return '';
					default: return undefined;
				}
			});

			const mockResponse = {
				result: {
					index: 0
				}
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAddressOperationsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			);

			expect(result[0].json).toEqual(mockResponse.result);
		});
	});
});
});
