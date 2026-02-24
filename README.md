# n8n-nodes-monero

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for integrating with Monero blockchain operations. Features 6 core resources with full support for blockchain queries, transaction management, wallet operations, transfers, mining activities, and address utilities for privacy-focused cryptocurrency workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Monero](https://img.shields.io/badge/Monero-XMR-orange)
![Privacy](https://img.shields.io/badge/Privacy-Focused-green)
![Blockchain](https://img.shields.io/badge/Blockchain-Integration-purple)

## Features

- **Blockchain Information** - Query network status, block heights, difficulty, and chain statistics
- **Transaction Operations** - Create, broadcast, monitor, and analyze Monero transactions
- **Wallet Management** - Complete wallet lifecycle including creation, backup, restoration, and synchronization
- **Secure Transfers** - Execute private transfers with ring signatures and stealth addresses
- **Mining Operations** - Monitor mining status, hashrates, and pool connectivity
- **Address Utilities** - Generate, validate, and manage Monero addresses and subaddresses
- **Privacy-First** - Built-in support for Monero's privacy features including RingCT and bulletproofs
- **Real-time Monitoring** - Track confirmations, mempool status, and network events

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-monero`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-monero
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-monero.git
cd n8n-nodes-monero
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-monero
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| RPC Endpoint | Monero daemon RPC URL (e.g., http://localhost:18081) | Yes |
| Wallet RPC Endpoint | Monero wallet RPC URL (e.g., http://localhost:18083) | Yes |
| RPC Username | Username for RPC authentication | No |
| RPC Password | Password for RPC authentication | No |
| API Key | Custom API key for additional authentication | No |

## Resources & Operations

### 1. Blockchain Info

| Operation | Description |
|-----------|-------------|
| Get Block Count | Retrieve current blockchain height |
| Get Block Header | Get block header information by height or hash |
| Get Block | Retrieve complete block data |
| Get Chain Info | Get general blockchain information and statistics |
| Get Difficulty | Retrieve current network difficulty |
| Get Fee Estimate | Get estimated transaction fees |
| Get Transaction Pool | View pending transactions in mempool |

### 2. Transaction Operations

| Operation | Description |
|-----------|-------------|
| Get Transaction | Retrieve transaction details by hash |
| Send Raw Transaction | Broadcast a signed transaction to network |
| Create Transaction | Build unsigned transaction |
| Sign Transaction | Sign transaction with private keys |
| Verify Transaction | Validate transaction integrity |
| Get Transaction Status | Check confirmation status |
| Search Transactions | Query transactions by various criteria |

### 3. Wallet Management

| Operation | Description |
|-----------|-------------|
| Create Wallet | Generate new wallet with mnemonic seed |
| Open Wallet | Load existing wallet file |
| Close Wallet | Safely close wallet connection |
| Get Wallet Info | Retrieve wallet metadata and status |
| Backup Wallet | Export wallet keys and seed |
| Restore Wallet | Recover wallet from seed or keys |
| Refresh Wallet | Synchronize wallet with blockchain |
| Set Wallet Password | Update wallet encryption password |

### 4. Wallet Transfers

| Operation | Description |
|-----------|-------------|
| Transfer | Send XMR to one or more recipients |
| Transfer Split | Send with automatic input splitting |
| Sweep All | Transfer all available balance |
| Sweep Single | Transfer specific output |
| Get Transfers | Retrieve transfer history |
| Get Transfer Details | Get detailed transfer information |
| Create Unsigned Transfer | Build unsigned transfer |
| Submit Transfer | Submit signed transfer |

### 5. Mining Operations

| Operation | Description |
|-----------|-------------|
| Start Mining | Begin mining with specified threads |
| Stop Mining | Stop mining operations |
| Get Mining Status | Check current mining state |
| Set Mining Threads | Adjust number of mining threads |
| Get Hashrate | Retrieve current hashrate |
| Get Mining Stats | Get detailed mining statistics |

### 6. Address Operations

| Operation | Description |
|-----------|-------------|
| Get Address | Retrieve primary wallet address |
| Create Address | Generate new subaddress |
| Get Address Index | Find address index by address string |
| Label Address | Set label for address |
| Get Address Book | Retrieve saved addresses |
| Add Address Book Entry | Save new address to address book |
| Delete Address Book Entry | Remove address from address book |
| Validate Address | Check if address is valid |

## Usage Examples

```javascript
// Get current blockchain height
const blockHeight = await this.helpers.request({
  method: 'POST',
  url: 'http://localhost:18081/json_rpc',
  body: {
    jsonrpc: '2.0',
    id: '0',
    method: 'get_block_count'
  }
});

// Send XMR transfer
const transfer = await this.helpers.request({
  method: 'POST',
  url: 'http://localhost:18083/json_rpc',
  body: {
    jsonrpc: '2.0',
    id: '0',
    method: 'transfer',
    params: {
      destinations: [{
        amount: 1000000000000, // 1 XMR in atomic units
        address: '4AdUndXHHZ6cfufTMvppY6JwXNouMBzSkbLYfpAV5Usx3skxNgYeYTRJ5UGnWaVFMKKhTM6Xzwx5pB7KKTKzM1X8'
      }],
      priority: 1,
      mixin: 10
    }
  }
});

// Create new subaddress
const subaddress = await this.helpers.request({
  method: 'POST',
  url: 'http://localhost:18083/json_rpc',
  body: {
    jsonrpc: '2.0',
    id: '0',
    method: 'create_address',
    params: {
      account_index: 0,
      label: 'Payment Address #1'
    }
  }
});

// Get mining status
const miningStatus = await this.helpers.request({
  method: 'POST',
  url: 'http://localhost:18081/json_rpc',
  body: {
    jsonrpc: '2.0',
    id: '0',
    method: 'mining_status'
  }
});
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Connection Refused | Cannot connect to Monero daemon/wallet RPC | Verify daemon and wallet RPC are running and accessible |
| Invalid Address | Provided address format is incorrect | Validate address format and network type (mainnet/testnet) |
| Insufficient Funds | Wallet balance too low for transaction | Check wallet balance and reduce transaction amount |
| Transaction Too Large | Transaction exceeds maximum size limits | Use transfer_split to break into smaller transactions |
| Wrong Password | Wallet password is incorrect | Verify wallet password in credentials |
| Wallet Not Found | Specified wallet file doesn't exist | Check wallet file path and permissions |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-monero/issues)
- **Monero Documentation**: [getmonero.org/resources/developer-guides](https://www.getmonero.org/resources/developer-guides/)
- **RPC Documentation**: [getmonero.org/resources/developer-guides/daemon-rpc.html](https://www.getmonero.org/resources/developer-guides/daemon-rpc.html)