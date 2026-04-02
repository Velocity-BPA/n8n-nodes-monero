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

    it('should define 5 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(5);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(5);
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
describe('Wallet Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        walletRpcUrl: 'http://localhost:18082/json_rpc' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn() 
      },
    };
  });

  it('should create wallet successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'createWallet';
        case 'filename': return 'test-wallet';
        case 'password': return 'test-password';
        case 'language': return 'English';
        default: return undefined;
      }
    });
    
    const mockResponse = { 
      jsonrpc: '2.0', 
      id: '0', 
      result: {} 
    };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'http://localhost:18082/json_rpc',
      headers: { 'Content-Type': 'application/json' },
      json: true,
      body: {
        jsonrpc: '2.0',
        id: '0',
        method: 'create_wallet',
        params: {
          filename: 'test-wallet',
          password: 'test-password',
          language: 'English',
        },
      },
    });
  });

  it('should get balance successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getBalance';
        case 'accountIndex': return 0;
        case 'addressIndices': return '0,1';
        default: return undefined;
      }
    });

    const mockResponse = { 
      jsonrpc: '2.0', 
      id: '0', 
      result: { balance: 1000000000000, unlocked_balance: 1000000000000 } 
    };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('createWallet');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('createWallet');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects.toThrow('API Error');
  });
});

describe('Transaction Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        walletUrl: 'http://localhost:18082/json_rpc',
        username: 'testuser',
        password: 'testpass',
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

  describe('transfer operation', () => {
    it('should transfer XMR successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation':
            return 'transfer';
          case 'destinations.destination':
            return [{ address: 'test-address', amount: 1000000000000 }];
          case 'accountIndex':
            return 0;
          case 'priority':
            return 0;
          case 'ringSize':
            return 11;
          case 'unlockTime':
            return 0;
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        jsonrpc: '2.0',
        id: '0',
        result: { tx_hash: 'test-hash', tx_key: 'test-key', amount: 1000000000000, fee: 50000000000 },
      });

      const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.result.tx_hash).toBe('test-hash');
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          body: expect.objectContaining({
            method: 'transfer',
            params: expect.objectContaining({
              destinations: [{ address: 'test-address', amount: 1000000000000 }],
            }),
          }),
        }),
      );
    });

    it('should handle transfer error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('transfer');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Transfer failed'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Transfer failed');
    });
  });

  describe('getTransfers operation', () => {
    it('should get transfers successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation':
            return 'getTransfers';
          case 'in':
            return true;
          case 'out':
            return true;
          case 'pending':
            return false;
          case 'failed':
            return false;
          case 'pool':
            return false;
          case 'filterByHeight':
            return false;
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        jsonrpc: '2.0',
        id: '0',
        result: { in: [], out: [] },
      });

      const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.result).toHaveProperty('in');
      expect(result[0].json.result).toHaveProperty('out');
    });
  });

  describe('sweepAll operation', () => {
    it('should sweep all successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation':
            return 'sweepAll';
          case 'address':
            return 'test-sweep-address';
          case 'accountIndex':
            return 0;
          case 'priority':
            return 0;
          case 'ringSize':
            return 11;
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        jsonrpc: '2.0',
        id: '0',
        result: { tx_hash_list: ['hash1', 'hash2'], amount_list: [1000000000000, 500000000000] },
      });

      const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.result.tx_hash_list).toHaveLength(2);
    });
  });
});

describe('Address Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        walletUrl: 'http://localhost:18082/json_rpc',
        daemonUrl: 'http://localhost:18081/json_rpc' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  test('createAddress operation should create new subaddress', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createAddress')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce('Test Label');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
      jsonrpc: '2.0',
      id: '0',
      result: {
        address: '84QGrsZ...test_address',
        address_index: 1
      }
    });

    const result = await executeAddressOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'http://localhost:18082/json_rpc',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: '0',
        method: 'create_address',
        params: { account_index: 0, label: 'Test Label' }
      }),
      json: true
    });
    
    expect(result).toHaveLength(1);
    expect(result[0].json.result.address).toBe('84QGrsZ...test_address');
  });

  test('getAddresses operation should retrieve addresses for account', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAddresses')
      .mockReturnValueOnce(0);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
      jsonrpc: '2.0',
      id: '0',
      result: {
        addresses: [
          { address: '84QGrsZ...address1', address_index: 0, label: 'Primary' }
        ]
      }
    });

    const result = await executeAddressOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.result.addresses).toHaveLength(1);
  });

  test('validateAddress operation should validate address format', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('validateAddress')
      .mockReturnValueOnce('84QGrsZ...test_address')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
      jsonrpc: '2.0',
      id: '0',
      result: {
        valid: true,
        integrated: false,
        subaddress: true,
        nettype: 'mainnet'
      }
    });

    const result = await executeAddressOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.result.valid).toBe(true);
  });

  test('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createAddress')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValueOnce(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValueOnce(true);

    const result = await executeAddressOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  test('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    await expect(executeAddressOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('Blockchain Resource', () => {
  let mockExecuteFunctions: any;
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        daemonUrl: 'http://localhost:18081/json_rpc' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  it('should get block count successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getBlockCount');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      result: { count: 12345 }
    });

    const result = await executeBlockchainOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([
      { json: { result: { count: 12345 } }, pairedItem: { item: 0 } }
    ]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'http://localhost:18081/json_rpc',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: '0',
        method: 'get_block_count',
        params: {}
      }),
      json: true,
    });
  });

  it('should get block header by hash successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBlockHeaderByHash')
      .mockReturnValueOnce('test-hash')
      .mockReturnValueOnce(true);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      result: { block_header: {} }
    });

    const result = await executeBlockchainOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([
      { json: { result: { block_header: {} } }, pairedItem: { item: 0 } }
    ]);
  });

  it('should handle errors when continue on fail is enabled', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getBlockCount');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeBlockchainOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([
      { json: { error: 'Network error' }, pairedItem: { item: 0 } }
    ]);
  });

  it('should throw error when continue on fail is disabled', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getBlockCount');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);

    await expect(executeBlockchainOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Network error');
  });
});

describe('Mining Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        daemonUrl: 'http://localhost:18081',
        username: 'testuser',
        password: 'testpass'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  it('should start mining successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'startMining';
        case 'minerAddress': return '4AdUndXHHZ6cfufTMvppY6JwXNouMBzSkbLYfpAV5Usx3skxNgYeYTRj5UzqtReoS44qo9mtmXCqY45DJ852K5Jv2684Rge';
        case 'threadsCount': return 2;
        case 'doBackgroundMining': return false;
        default: return undefined;
      }
    });

    const mockResponse = {
      id: '0',
      jsonrpc: '2.0',
      result: {
        status: 'OK',
      },
    };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeMiningOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'http://localhost:18081/json_rpc',
      headers: { 'Content-Type': 'application/json' },
      body: {
        jsonrpc: '2.0',
        id: '0',
        method: 'start_mining',
        params: {
          miner_address: '4AdUndXHHZ6cfufTMvppY6JwXNouMBzSkbLYfpAV5Usx3skxNgYeYTRj5UzqtReoS44qo9mtmXCqY45DJ852K5Jv2684Rge',
          threads_count: 2,
          do_background_mining: false,
        },
      },
      json: true,
      auth: { user: 'testuser', pass: 'testpass' },
    });
  });

  it('should stop mining successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'stopMining';
      return undefined;
    });

    const mockResponse = {
      id: '0',
      jsonrpc: '2.0',
      result: {
        status: 'OK',
      },
    };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeMiningOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should get mining status successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getMiningStatus';
      return undefined;
    });

    const mockResponse = {
      id: '0',
      jsonrpc: '2.0',
      result: {
        active: true,
        speed: 1000,
        threads_count: 2,
        address: '4AdUndXHHZ6cfufTMvppY6JwXNouMBzSkbLYfpAV5Usx3skxNgYeYTRj5UzqtReoS44qo9mtmXCqY45DJ852K5Jv2684Rge',
        status: 'OK',
      },
    };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeMiningOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should submit block successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'submitBlock';
        case 'blockBlob': return '0707e6bdfedc053771c352e67fdbef8d64a169de85c7e4ac1e0b96521d1e5b4e';
        default: return undefined;
      }
    });

    const mockResponse = {
      id: '0',
      jsonrpc: '2.0',
      result: {
        status: 'OK',
      },
    };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeMiningOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should handle errors when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('startMining');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeMiningOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('startMining');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(executeMiningOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
  });
});
});
