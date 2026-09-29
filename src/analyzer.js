import { ethers } from 'ethers';

// Uniswap V4 PoolManager 合约地址（主网部署地址）
const POOL_MANAGER_ADDRESSES = {
  1: '0x0000000000000000000000000000000000000000', // Ethereum - 需要更新为实际地址
  8453: '0x0000000000000000000000000000000000000000', // Base
  42161: '0x0000000000000000000000000000000000000000', // Arbitrum
  // 其他链的 PoolManager 地址
};

const POOL_ABI = [
  'function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
  'function liquidity() view returns (uint128)',
  'function tickBitmap(int16) view returns (uint256)',
  'function positions(bytes32) view returns (uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)'
];

// 尝试从池子合约中提取 hook 地址
async function extractHookFromPool(provider, poolAddress) {
  try {
    // 方法1: 尝试读取存储槽（hook 地址通常在固定位置）
    // Uniswap V4 Pool 的 hook 地址通常存储在特定的存储槽
    const hookSlot = await provider.getStorage(poolAddress, 0);
    const hookAddress = '0x' + hookSlot.slice(26); // 取后20字节

    if (ethers.isAddress(hookAddress) && hookAddress !== '0x0000000000000000000000000000000000000000') {
      const code = await provider.getCode(hookAddress);
      if (code !== '0x' && code !== '0x0') {
        return hookAddress;
      }
    }

    // 方法2: 尝试通过事件日志获取
    const currentBlock = await provider.getBlockNumber();
    const logs = await provider.getLogs({
      address: poolAddress,
      fromBlock: Math.max(0, currentBlock - 10000),
      toBlock: currentBlock
    });

    // 从 Initialize 事件中提取 hook 地址
    for (const log of logs) {
      if (log.topics[0]) {
        try {
          // 解析日志，查找 hook 相关信息
          const data = log.data;
          if (data.length >= 66) {
            const potentialHook = '0x' + data.slice(26, 66);
            if (ethers.isAddress(potentialHook) && potentialHook !== '0x0000000000000000000000000000000000000000') {
              const code = await provider.getCode(potentialHook);
              if (code !== '0x' && code !== '0x0') {
                return potentialHook;
              }
            }
          }
        } catch (e) {
          continue;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('提取 Hook 地址失败:', error);
    return null;
  }
}

export async function fetchHookContract(chain, poolAddress) {
  try {
    const provider = new ethers.JsonRpcProvider(chain.rpc);
    const code = await provider.getCode(poolAddress);

    if (code === '0x' || code === '0x0') {
      throw new Error('地址不是合约');
    }

    // 尝试从池子中提取 Hook 地址
    const hookAddress = await extractHookFromPool(provider, poolAddress);

    if (!hookAddress) {
      // 如果没有找到 hook，假设用户输入的就是 hook 地址
      return { code, provider, hookAddress: poolAddress };
    }

    // 获取 Hook 合约的代码
    const hookCode = await provider.getCode(hookAddress);

    return {
      code: hookCode,
      provider,
      hookAddress,
      isPool: hookAddress !== poolAddress
    };
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
