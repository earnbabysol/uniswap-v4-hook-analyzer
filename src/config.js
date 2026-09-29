export const CHAINS = {
  ethereum: {
    id: 1,
    name: 'Ethereum',
    rpc: 'https://rpc.ankr.com/eth',
    explorer: 'https://etherscan.io'
  },
  base: {
    id: 8453,
    name: 'Base',
    rpc: 'https://rpc.ankr.com/base',
    explorer: 'https://basescan.org'
  },
  arbitrum: {
    id: 42161,
    name: 'Arbitrum',
    rpc: 'https://rpc.ankr.com/arbitrum',
    explorer: 'https://arbiscan.io'
  },
  bsc: {
    id: 56,
    name: 'BSC',
    rpc: 'https://rpc.ankr.com/bsc',
    explorer: 'https://bscscan.com'
  },
  optimism: {
    id: 10,
    name: 'Optimism',
    rpc: 'https://rpc.ankr.com/optimism',
    explorer: 'https://optimistic.etherscan.io'
  },
  polygon: {
    id: 137,
    name: 'Polygon',
    rpc: 'https://rpc.ankr.com/polygon',
    explorer: 'https://polygonscan.com'
  },
  avalanche: {
    id: 43114,
    name: 'Avalanche',
    rpc: 'https://rpc.ankr.com/avalanche',
    explorer: 'https://snowtrace.io'
  },
  xlayer: {
    id: 196,
    name: 'X Layer',
    rpc: 'https://rpc.ankr.com/xlayer',
    explorer: 'https://www.okx.com/web3/explorer/xlayer'
  },
  robinhood: {
    id: 1116,
    name: 'Robinhood',
    rpc: 'https://rpc.robinhood.network',
    explorer: 'https://explorer.robinhood.network'
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
