# n8n-nodes-monero

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

---

A comprehensive n8n community node for **Monero (XMR)** blockchain operations. This production-ready toolkit provides full wallet management, transaction handling, mining operations, and privacy-focused features for the Monero network with complete RPC support.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Monero](https://img.shields.io/badge/Monero-XMR-orange)

## Features

### Wallet Operations
- **Get Balance** - Total and unlocked balance with XMR/piconero conversion
- **Get Address** - Primary wallet address with type detection
- **Create/Open/Close Wallet** - Full wallet lifecycle management
- **Restore from Seed** - Restore wallet from 25-word mnemonic
- **Refresh** - Sync wallet with blockchain

### Account Management
- **Get Accounts** - List all wallet accounts with balances
- **Create Account** - Create new accounts with labels
- **Create Subaddress** - Generate unlimited receiving addresses

### Transaction Operations
- **Transfer** - Send XMR with ring signature privacy (ring size 16)
- **Sweep All** - Send entire balance to address
- **Get Transfers** - Transaction history (incoming/outgoing)
- **Get Transfer by ID** - Lookup specific transaction

### Block & Daemon Operations
- **Get Block** - Retrieve block by height or hash
- **Get Block Count** - Current blockchain height
- **Get Daemon Info** - Node status and network info
- **Get Fee Estimate** - Current network fee

### Mining Operations
- **Get Mining Status** - Current mining state
- **Start/Stop Mining** - Control local mining

### Utility Functions
- **Convert Units** - XMR ↔ piconero conversion
- **Validate Address** - Check address validity
- **Make/Parse URI** - Payment request handling

### Trigger Events
- **New Block** - Trigger when a new block is mined
- **Transaction Received** - Trigger on incoming XMR
- **Transaction Sent** - Trigger on outgoing XMR
- **Balance Changed** - Trigger on balance updates
- **Transaction Confirmed** - Trigger after N confirmations

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter: `n8n-nodes-monero`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation
cd ~/.n8n/nodes

# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-monero.git
cd n8n-nodes-monero

# Install dependencies
pnpm install

# Build the project
pnpm build

# Restart n8n
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-monero.git
cd n8n-nodes-monero

# Install dependencies
pnpm install

# Build the project
pnpm build

# Run the install script
./scripts/install-local.sh

# Restart n8n
n8n start
```

## Prerequisites

- **n8n** v1.0.0 or later
- **Node.js** v18.10 or later
- **pnpm** v9.1 or later
- **Monero Daemon (monerod)** - For blockchain operations
- **Monero Wallet RPC** - For wallet operations

### Setting Up Monero RPC

```bash
# Start Monero Daemon (mainnet)
./monerod --rpc-bind-port 18081 --rpc-bind-ip 127.0.0.1

# Start Wallet RPC (in separate terminal)
./monero-wallet-rpc --rpc-bind-port 18082 --rpc-bind-ip 127.0.0.1 \
  --wallet-dir /path/to/wallets --disable-rpc-login

# For stagenet (recommended for testing)
./monerod --stagenet --rpc-bind-port 38081 --rpc-bind-ip 127.0.0.1
./monero-wallet-rpc --stagenet --rpc-bind-port 38082 --rpc-bind-ip 127.0.0.1 \
  --wallet-dir /path/to/wallets --disable-rpc-login
```

## Credentials Setup

1. In n8n, go to **Credentials** → **New**
2. Search for **"Monero Network API"**
3. Configure your connection:

| Field | Description | Example |
|-------|-------------|---------|
| Network | Mainnet/Stagenet/Testnet | `mainnet` |
| Connection Type | Daemon/Wallet/Both | `both` |
| Daemon RPC URL | monerod endpoint | `http://127.0.0.1:18081` |
| Wallet RPC URL | wallet-rpc endpoint | `http://127.0.0.1:18082` |
| Daemon Username | Auth (if enabled) | optional |
| Daemon Password | Auth (if enabled) | optional |

## Resources & Operations

| Resource | Operations |
|----------|------------|
| **Wallet** | Get Balance, Get Address, Get Height, Create Wallet, Open Wallet, Close Wallet, Restore From Seed, Refresh |
| **Account** | Get Accounts, Create Account, Create Subaddress |
| **Transaction** | Transfer, Sweep All, Get Transfers, Get Transfer By ID |
| **Block** | Get Block, Get Block Count, Get Last Block Header |
| **Daemon** | Get Info, Get Version, Get Height, Get Fee Estimate |
| **Mining** | Get Mining Status, Start Mining, Stop Mining |
| **Utility** | Convert Units, Validate Address, Make URI, Parse URI |

## Trigger Node

The **Monero Trigger** node supports polling-based triggers for:

| Event | Description |
|-------|-------------|
| New Block | Triggered when a new block is mined |
| Transaction Received | Triggered when XMR is received |
| Transaction Sent | Triggered when XMR is sent |
| Balance Changed | Triggered when balance changes |
| Transaction Confirmed | Triggered after N confirmations |

## Usage Examples

### Send XMR Transaction

```javascript
// Node Configuration
Resource: Transaction
Operation: Transfer
Destination Address: 4...your_recipient_address
Amount (XMR): 1.5
Priority: Normal
Account Index: 0
```

### Monitor Incoming Transactions

```javascript
// Trigger Node Configuration
Event: Transaction Received
Account Index: 0
Minimum Amount: 0.1
```

### Get Wallet Balance

```javascript
// Node Configuration
Resource: Wallet
Operation: Get Balance

// Output:
{
  "balance": "10.500000000000",
  "unlockedBalance": "10.000000000000",
  "formatted": "10.500000000000 XMR"
}
```

## Monero Concepts

| Term | Description |
|------|-------------|
| **XMR** | Native Monero token |
| **Piconero** | Smallest unit (10⁻¹² XMR) |
| **Ring Signature** | Mixes transaction with decoys for privacy |
| **Stealth Address** | One-time addresses for receiving |
| **View Key** | See incoming transactions |
| **Spend Key** | Authorize spending |
| **Subaddress** | Unlimited unique receiving addresses |
| **Payment ID** | Optional transaction identifier |
| **Ring Size** | Number of decoys (currently 16) |

## Networks

| Network | Daemon Port | Wallet Port | Use Case |
|---------|-------------|-------------|----------|
| Mainnet | 18081 | 18082 | Production |
| Stagenet | 38081 | 38082 | Testing |
| Testnet | 28081 | 28082 | Development |

## Error Handling

The node includes comprehensive error handling:

- Invalid address format validation
- RPC connection error handling
- Transaction failure handling
- Continue-on-fail support for batch operations

## Security Best Practices

- **Never share your seed phrase** - The 25-word mnemonic grants full wallet access
- **Protect private keys** - View and spend keys should be kept secure
- **Use local RPC** - Run daemon and wallet RPC on localhost when possible
- **Enable RPC authentication** - Use username/password for remote connections
- **Ring signatures** - All transactions use ring size 16 for privacy
- **Test on Stagenet** - Always test workflows on stagenet before production

## Development

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Watch mode for development
pnpm dev
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

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Documentation**: [Monero Developer Guides](https://www.getmonero.org/resources/developer-guides/)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-monero/issues)
- **Licensing**: licensing@velobpa.com

## Acknowledgments

- [Monero Project](https://www.getmonero.org/) for the privacy-focused cryptocurrency
- [n8n](https://n8n.io/) for the workflow automation platform
- The Monero community for their dedication to financial privacy

---

<p align="center">
  Made with ❤️ for the Monero community
</p>
