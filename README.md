# TGTokenHub

A decentralized platform where Telegram usernames become Ethereum tokens, with live charts, social engagement stats, and community-driven liquidity.

## Features

- **Telegram Username = Token**: Each Telegram username can mint one ERC-20 token
- **Fair Launch Mechanics**: No pre-mine, bonding curve minting, anti-snipe protection
- **Live Social Chart**: Real-time tracking of mentions, engagement, and social score
- **Telegram Bot Integration**: Trade tokens directly in Telegram
- **Community-Driven Liquidity**: Auto-LP and burn mechanics

## Tech Stack

- **Frontend**: Next.js, TailwindCSS, Web3-React
- **Smart Contracts**: Solidity, Hardhat
- **Backend**: Node.js, Telegraf
- **Blockchain**: Ethereum (Mainnet, Goerli, Sepolia)

## Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- MetaMask or another Web3 wallet
- Telegram account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/tgtokenhub.git
cd tgtokenhub
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
TELEGRAM_BOT_TOKEN=your_bot_token
RPC_URL=your_ethereum_rpc_url
TG_TOKEN_FACTORY_ADDRESS=deployed_factory_address
PRIVATE_KEY=your_private_key
```

4. Compile smart contracts:

```bash
npm run compile
```

5. Deploy smart contracts:

```bash
npm run deploy -- --network sepolia
```

6. Start the development server:

```bash
npm run dev
```

7. Start the Telegram bot:

```bash
npm run bot
```

## Smart Contracts

The project includes two main smart contracts:

1. `TGTokenFactory`: Deploys and manages user tokens
2. `TGToken`: Individual token contract for each Telegram username

## Telegram Bot Commands

- `/start` - Get started with TGTokenHub
- `/create` - Create a new token for your username
- `/price @username` - Check token price
- `/buy @username amount` - Buy tokens
- `/sell @username amount` - Sell tokens

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenZeppelin for smart contract templates
- Uniswap for DEX integration inspiration
- The Ethereum community for tools and libraries
