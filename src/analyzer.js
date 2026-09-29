import { ethers } from 'ethers';

const POOL_MANAGER_ABI = [
  'function getPool(bytes32 id) view returns (tuple(address currency0, address currency1, uint24 fee, int24 tickSpacing, address hooks))'
];

const GENERIC_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)'
];

export async function fetchHookContract(chain, poolAddress) {
  try {
    const provider = new ethers.JsonRpcProvider(chain.rpc);
    const code = await provider.getCode(poolAddress);

    if (code === '0x' || code === '0x0') {
      throw new Error('地址不是合约');
    }

    return { code, provider };
  } catch (error) {
    throw new Error(`获取合约失败: ${error.message}`);
  }
}

export async function decompileContract(chain, address) {
  const response = await fetch(
    `${chain.explorer}/api?module=contract&action=getsourcecode&address=${address}`
  );

  const data = await response.json();

  if (data.status === '1' && data.result[0].SourceCode) {
    return data.result[0].SourceCode;
  }

  return null;
}

export function analyzeHookCode(sourceCode, patterns) {
  const findings = {
    feeExtraction: [],
    accessControl: [],
    suspicious: [],
    riskScore: 0
  };

  if (!sourceCode) {
    return findings;
  }

  // Fee extraction patterns
  patterns.feeExtraction.forEach(pattern => {
    const matches = sourceCode.match(pattern);
    if (matches) {
      findings.feeExtraction.push(...matches.map(m => m.trim()));
      findings.riskScore += matches.length * 2;
    }
  });

  // Access control patterns
  patterns.accessControl.forEach(pattern => {
    const matches = sourceCode.match(pattern);
    if (matches) {
      findings.accessControl.push(...matches.map(m => m.trim()));
      findings.riskScore += matches.length;
    }
  });

  // Suspicious patterns
  patterns.suspicious.forEach(pattern => {
    const matches = sourceCode.match(pattern);
    if (matches) {
      findings.suspicious.push(...matches.map(m => m.trim()));
      findings.riskScore += matches.length * 5;
    }
  });

  // Extract fee percentages
  const feeRegex = /(\d+)\s*\*\s*amount\s*\/\s*(\d+)/g;
  let match;
  while ((match = feeRegex.exec(sourceCode)) !== null) {
    const percentage = (parseInt(match[1]) / parseInt(match[2]) * 100).toFixed(2);
    findings.feeExtraction.push(`抽税率: ${percentage}%`);
  }

  // Check for hardcoded addresses (potential fee recipients)
  const addressRegex = /0x[a-fA-F0-9]{40}/g;
  const addresses = sourceCode.match(addressRegex);
  if (addresses) {
    findings.feeRecipients = [...new Set(addresses)].slice(0, 5);
  }

  return findings;
}

export function calculateRiskLevel(score) {
  if (score === 0) return { level: 'unknown', label: '未知', color: 'var(--text-dim)' };
  if (score < 5) return { level: 'low', label: '低风险', color: 'var(--success)' };
  if (score < 15) return { level: 'medium', label: '中风险', color: 'var(--warning)' };
  return { level: 'high', label: '高风险', color: 'var(--danger)' };
}
