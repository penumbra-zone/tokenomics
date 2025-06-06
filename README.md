# Penumbra Tokenomics

The [Penumbra](https://penumbra.zone/) tokenomics dashboard for visualizing and analyzing network metrics.

This is a Next.js-based dashboard that provides comprehensive visualization and analysis of Penumbra's tokenomics data. Built with modern web technologies, it offers an intuitive interface for exploring key metrics and trends.

To participate in the test network, use a browser extension like [Prax](https://chrome.google.com/webstore/detail/penumbra-wallet/lkpmkhpnhknhmibgnmmhdhgdilepfghe) from the Chrome Web Store.

You can talk to us on [Discord](https://discord.gg/hKvkrqa3zC).

## Features

- Real-time tokenomics data visualization
- Interactive charts and graphs using ECharts
- Responsive design with modern UI components
- Data persistence with PostgreSQL
- AWS S3 integration for file storage

## Published Packages

All have a `@penumbra-zone/` namespace prefix on npm.

**🌘
[bech32m](https://www.npmjs.com/package/@penumbra-zone/bech32m) 🌑
[client](https://www.npmjs.com/package/@penumbra-zone/client) 🌑
[constants](https://www.npmjs.com/package/@penumbra-zone/constants) 🌑
[crypto](https://www.npmjs.com/package/@penumbra-zone/crypto) 🌑
[getters](https://www.npmjs.com/package/@penumbra-zone/getters) 🌑
[keys](https://www.npmjs.com/package/@penumbra-zone/keys) 🌑
[perspective](https://www.npmjs.com/package/@penumbra-zone/perspective) 🌑
[protobuf](https://www.npmjs.com/package/@penumbra-zone/protobuf) 🌑
[services](https://www.npmjs.com/package/@penumbra-zone/services) 🌑
[services-context](https://www.npmjs.com/package/@penumbra-zone/services-context) 🌑
[storage](https://www.npmjs.com/package/@penumbra-zone/storage) 🌑
[transport-chrome](https://www.npmjs.com/package/@penumbra-zone/transport-chrome) 🌑
[transport-dom](https://www.npmjs.com/package/@penumbra-zone/transport-dom) 🌑
[types](https://www.npmjs.com/package/@penumbra-zone/types) 🌑
[wasm](https://www.npmjs.com/package/@penumbra-zone/wasm)
🌒**

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- Radix UI
- ECharts
- Redux Toolkit
- PostgreSQL
- AWS SDK

## Getting Started

### Prerequisites

Make sure you have the following tools installed:

- [Node.js](https://nodejs.org/en/download/package-manager) – Recommended via [nvm](https://github.com/nvm-sh/nvm)
- [pnpm](https://pnpm.io/installation) – Package manager, recommended via [corepack](https://pnpm.io/installation#using-corepack)
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tokenomics-dashboard
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your specific configuration values.

### Development

Run the development server:

```bash
# Run in development mode
pnpm dev

# Run with mock data
pnpm mock:dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm mock:dev` - Start development server with mock data
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Security

If you believe you've found a security-related issue with Penumbra, please disclose responsibly by contacting the Penumbra Labs team at security@penumbralabs.xyz.
