export const CHAINS = {
  ethereum: {
    id: 1,
    name: 'Ethereum',
    rpc: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io',
    explorerApiUrl: 'https://api.etherscan.io/api'
  },
  base: {
    id: 8453,
    name: 'Base',
    rpc: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    explorerApiUrl: 'https://api.basescan.org/api'
  },
  arbitrum: {
    id: 42161,
    name: 'Arbitrum',
    rpc: 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io',
    explorerApiUrl: 'https://api.arbiscan.io/api'
  },
  bsc: {
    id: 56,
    name: 'BSC',
    rpc: 'https://bsc-dataseed1.binance.org',
    explorer: 'https://bscscan.com',
    explorerApiUrl: 'https://api.bscscan.com/api'
  },
  optimism: {
    id: 10,
    name: 'Optimism',
    rpc: 'https://mainnet.optimism.io',
    explorer: 'https://optimistic.etherscan.io',
    explorerApiUrl: 'https://api-optimistic.etherscan.io/api'
  },
  polygon: {
    id: 137,
    name: 'Polygon',
    rpc: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    explorerApiUrl: 'https://api.polygonscan.com/api'
  },
  avalanche: {
    id: 43114,
    name: 'Avalanche',
    rpc: 'https://api.avax.network/ext/bc/C/rpc',
    explorer: 'https://snowtrace.io',
    explorerApiUrl: 'https://api.snowtrace.io/api'
  },
  xlayer: {
    id: 196,
    name: 'X Layer',
    rpc: 'https://rpc.xlayer.tech',
    explorer: 'https://www.okx.com/web3/explorer/xlayer',
    explorerApiUrl: 'https://www.okx.com/api/v5/explorer/xlayer/api'
  },
  robinhood: {
    id: 1116,
    name: 'Robinhood',
    rpc: 'https://rpc.robinhood.network',
    explorer: 'https://explorer.robinhood.network',
    explorerApiUrl: 'https://explorer.robinhood.network/api'
  }
};

export const HOOK_PATTERNS = {
  feeExtraction: [
    /function\s+(\w*[Ff]ee\w*)\s*\(/g,
    /(\w*[Tt]ax\w*)/g,
    /\.transfer\s*\(/g,
    /\.call\{value:/g,
    /IERC20.*\.transfer/g
  ],
  accessControl: [
    /onlyOwner/g,
    /require\s*\(\s*msg\.sender\s*==\s*/g,
    /modifier\s+only\w+/g,
    /AccessControl/g
  ],
  suspicious: [
    /selfdestruct/g,
    /delegatecall/g,
    /assembly\s*\{/g,
    /\.call\s*\{/g
  ]
};
