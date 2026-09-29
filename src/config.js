export const CHAINS = {
  ethereum: {
    id: 1,
    name: 'Ethereum',
    rpc: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io'
  },
  base: {
    id: 8453,
    name: 'Base',
    rpc: 'https://mainnet.base.org',
    explorer: 'https://basescan.org'
  },
  arbitrum: {
    id: 42161,
    name: 'Arbitrum',
    rpc: 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io'
  },
  bsc: {
    id: 56,
    name: 'BSC',
    rpc: 'https://bsc-dataseed.binance.org',
    explorer: 'https://bscscan.com'
  },
  xlayer: {
    id: 196,
    name: 'X Layer',
    rpc: 'https://rpc.xlayer.tech',
    explorer: 'https://www.oklink.com/xlayer'
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
