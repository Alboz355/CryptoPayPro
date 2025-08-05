# CryptoPayPro - Professional Crypto Wallet App

This is a professional crypto wallet application built with Next.js, React, and Shadcn UI, featuring secure wallet generation using Trust Wallet Core-compatible standards.

## 🔐 Security Features

-   **Trust Wallet Core Standards**: Implements BIP39/BIP44 standards for secure wallet generation and recovery
-   **Cryptographically Secure**: Uses industry-standard cryptographic libraries for mnemonic generation
-   **HD Wallet Support**: Hierarchical Deterministic (HD) wallet with standard derivation paths
-   **Multi-Crypto Support**: Bitcoin, Ethereum, and Algorand address generation
-   **BIP39 Validation**: Proper mnemonic phrase validation using BIP39 standards

## ✨ Features

-   **Secure Wallet Generation**: Generate new Bitcoin (SegWit), Ethereum, and Algorand wallets using Trust Wallet Core standards
-   **Wallet Import/Export**: Import wallets using 12/24-word mnemonic phrases with BIP39 validation
-   **PIN Security**: Secure your wallet with a PIN for sensitive operations
-   **Real-time Prices**: View real-time prices for BTC, ETH, ALGO
-   **Buy Crypto**: Integrate with Mt Pelerin for direct crypto purchases
-   **Responsive UI**: Optimized for iOS, Android, and desktop
-   **Dark Mode**: Full dark mode support
-   **Error Handling**: Comprehensive error boundaries and informative messages
-   **TPE Mode**: Professional Point of Sale functionality for merchants

## 🛠 Trust Wallet Core Integration

The application uses Trust Wallet Core-compatible implementations that follow the same security standards:

### Supported Cryptocurrencies
- **Bitcoin**: Uses derivation path `m/44'/0'/0'/0/0` for P2PKH addresses
- **Ethereum**: Uses derivation path `m/44'/60'/0'/0/0` for standard addresses
- **Algorand**: Uses derivation path `m/44'/283'/0'/0/0` for Base32 addresses

### Security Standards
- **BIP39**: Mnemonic phrase generation and validation
- **BIP44**: Hierarchical Deterministic (HD) wallet structure
- **Secure Random**: Cryptographically secure random number generation
- **Standard Validation**: Industry-standard address validation

## Getting Started

1.  **Clone the repository**:
    \`\`\`bash
    git clone [repository-url]
    cd crypto-wallet-app
    \`\`\`
2.  **Install dependencies**:
    \`\`\`bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    \`\`\`
3.  **Run the development server**:
    \`\`\`bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    \`\`\`
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

-   `app/`: Next.js App Router pages and layout.
-   `components/`: Reusable React components, including UI components from Shadcn UI.
-   `hooks/`: Custom React hooks.
-   `lib/`: Utility functions and blockchain-related logic.
-   `public/`: Static assets.
-   `styles/`: Global CSS.

## 📋 Dependencies

### Core Crypto Libraries
-   `bip39` - BIP39 mnemonic phrase generation and validation
-   `@ethersproject/hdnode` - Hierarchical Deterministic wallet support
-   `@ethersproject/address` - Ethereum address utilities
-   `@ethersproject/transactions` - Ethereum transaction utilities

### UI and Framework
-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   Shadcn UI

### Additional Crypto Libraries
-   `@noble/hashes` for cryptographic hashing
-   `@scure/base` for Base32 encoding
-   `ed25519-hd-key` for Algorand key derivation
-   `bech32` for Bitcoin SegWit addresses
-   `ethers` for Ethereum wallet generation

### APIs and Services
-   CoinGecko API for real-time prices
-   Mt Pelerin API for crypto purchases
