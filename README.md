# n8n-nodes-monero

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for integrating with Monero cryptocurrency operations. This node provides 5 resources covering wallet management, transaction handling, address operations, blockchain queries, and mining functionality to enable seamless Monero automation workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Monero](https://img.shields.io/badge/Monero-XMR-orange)
![Cryptocurrency](https://img.shields.io/badge/Crypto-Wallet-green)
![Privacy](https://img.shields.io/badge/Privacy-Coin-purple)

## Features

- **Wallet Management** - Create, manage, and query Monero wallets with full balance and transaction history access
- **Transaction Processing** - Send, receive, and track Monero transactions with comprehensive fee estimation
- **Address Operations** - Generate new addresses, validate address formats, and manage address labels
- **Blockchain Queries** - Access real-time blockchain data, block information, and network statistics
- **Mining Integration** - Monitor mining operations, hashrates, and pool statistics
- **Privacy Features** - Leverage Monero's privacy features including stealth addresses and ring signatures
- **Multi-Wallet Support** - Manage multiple wallets simultaneously with secure credential handling
- **Real-time Monitoring** - Track transaction confirmations and blockchain events in real-time

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
| API Key | Monero wallet RPC API key or authentication token | Yes |
| RPC Host | Monero wallet RPC server hostname or IP address | Yes |
| RPC Port | Monero wallet RPC server port (default: 18082) | Yes |
| Username | RPC authentication username (if required) | No |
| Password | RPC authentication password (if required) | No |
| SSL | Enable SSL/TLS for secure connections | No |

## Resources & Operations

### 1. Wallet

| Operation | Description |
|-----------|-------------|
| Create | Create a new Monero wallet with specified parameters |
| Open | Open an existing wallet for operations |
| Close | Close the currently opened wallet |
| Get Balance | Retrieve wallet balance including locked and unlocked amounts |
| Get Height | Get the current wallet sync height |
| Refresh | Refresh wallet data from the blockchain |
| Get Address | Retrieve the primary wallet address |
| Make URI | Create a Monero payment URI |
| Parse URI | Parse a Monero payment URI |

### 2. Transaction

| Operation | Description |
|-----------|-------------|
| Send | Send Monero to one or more addresses |
| Get Transfers | Retrieve transaction history with filtering options |
| Get Transfer by ID | Get detailed information about a specific transaction |
| Relay Transaction | Relay a previously created transaction to the network |
| Submit Transfer | Create and submit a transaction in one operation |
| Estimate Fee | Estimate transaction fees for a given transfer |
| Prove Payment | Generate cryptographic proof of payment |
| Check Payment | Verify a payment proof |

### 3. Address

| Operation | Description |
|-----------|-------------|
| Create | Generate a new subaddress |
| Get All | List all addresses in the wallet |
| Label | Set or update an address label |
| Get Index | Get the index of a specific address |
| Validate | Validate a Monero address format |
| Create Integrated | Create an integrated address with payment ID |
| Split Integrated | Extract address and payment ID from integrated address |

### 4. Blockchain

| Operation | Description |
|-----------|-------------|
| Get Height | Get current blockchain height |
| Get Block | Retrieve block information by height or hash |
| Get Block Header | Get block header information |
| Get Last Block | Get information about the most recent block |
| Get Connections | Get peer connection information |
| Get Info | Get general blockchain and network information |
| Hard Fork Info | Get hard fork status and information |
| Get Version | Get daemon version information |

### 5. Mining

| Operation | Description |
|-----------|-------------|
| Start | Start mining with specified number of threads |
| Stop | Stop mining operations |
| Get Status | Get current mining status and statistics |
| Get Hashrate | Retrieve current mining hashrate |
| Set Threads | Configure number of mining threads |
| Get Template | Get block template for mining |
| Submit Block | Submit a mined block to the network |

## Usage Examples

```javascript
// Send Monero to multiple recipients
{
  "destinations": [
    {
      "amount": 1000000000000, // 1 XMR in atomic units
      "address": "4AdUndXHHZ6cfufTMvppY6JwXNouMBzSkbLYfpAV5Usx3skxNgYeYTRJ5KqsZj8RXkRMCUP6t5tUdqsXs1v5RpSoMXNL5WD"
    }
  ],
  "priority": 1,
  "get_tx_key": true
}

// Get wallet transaction history
{
  "in": true,
  "out": true,
  "pending": false,
  "failed": false,
  "pool": true,
  "filter_by_height": true,
  "min_height": 2000000,
  "max_height": 2100000
}

// Create a new subaddress with label
{
  "account_index": 0,
  "label": "Payment Address for Client #123"
}

// Get current blockchain information
{
  "include_connections": true,
  "include_mining_info": true
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Wallet Not Open | Attempted operation without an open wallet | Open a wallet before performing operations |
| Insufficient Funds | Transaction amount exceeds available balance | Check wallet balance and reduce transaction amount |
| Invalid Address | Provided Monero address format is incorrect | Validate address format and ensure correct network |
| Connection Failed | Unable to connect to Monero daemon/wallet RPC | Verify RPC host, port, and network connectivity |
| Transaction Failed | Transaction could not be created or sent | Check network status, fees, and transaction parameters |
| Authentication Error | Invalid RPC credentials or API key | Verify username, password, and API key configuration |

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
- **Monero Documentation**: [getmonero.org/resources/developer-guides](https://getmonero.org/resources/developer-guides)
- **Monero RPC Reference**: [getmonero.org/resources/developer-guides/wallet-rpc.html](https://getmonero.org/resources/developer-guides/wallet-rpc.html)