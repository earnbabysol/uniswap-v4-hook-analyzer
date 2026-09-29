import { useState } from 'react';
import { ethers } from 'ethers';
import { CHAINS, HOOK_PATTERNS } from './config';
import { fetchHookContract, decompileContract, analyzeHookCode, calculateRiskLevel } from './analyzer';
import './App.css';

function App() {
  const [selectedChain, setSelectedChain] = useState('ethereum');
  const [poolAddress, setPoolAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!poolAddress || !ethers.isAddress(poolAddress)) {
      setError('请输入有效的合约地址');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const chain = CHAINS[selectedChain];

      // Fetch contract and extract hook address
      const { hookAddress, isPool } = await fetchHookContract(chain, poolAddress);

      const targetAddress = hookAddress || poolAddress;

      // Try to get source code
      const sourceCode = await decompileContract(chain, targetAddress);

      if (!sourceCode) {
        setError('无法获取合约源码，请确保合约已在区块链浏览器上验证');
        setLoading(false);
        return;
      }

      // Analyze the code
      const findings = analyzeHookCode(sourceCode, HOOK_PATTERNS);
      const risk = calculateRiskLevel(findings.riskScore);

      setResult({
        poolAddress: poolAddress,
        hookAddress: targetAddress,
        isPool: isPool,
        chain: chain.name,
        findings,
        risk,
        sourceCode: sourceCode.substring(0, 500) + '...'
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Uniswap V4 Hook Analyzer</h1>
        <p className="subtitle">分析 Hook 合约的抽税机制与风险</p>
      </header>

      <main className="container">
        <div className="input-section">
          <div className="form-group">
            <label>选择链</label>
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value)}
              className="select"
            >
              {Object.entries(CHAINS).map(([key, chain]) => (
                <option key={key} value={key}>{chain.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>池子地址</label>
            <input
              type="text"
              value={poolAddress}
              onChange={(e) => setPoolAddress(e.target.value)}
              placeholder="0x..."
              className="input"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? '分析中...' : '开始分析'}
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        {result && (
          <div className="result-section">
            <div className="result-header">
              <h2>分析结果</h2>
              <div
                className="risk-badge"
                style={{ backgroundColor: result.risk.color }}
              >
                {result.risk.label}
              </div>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">链</span>
                <span className="info-value">{result.chain}</span>
              </div>
              <div className="info-item">
                <span className="info-label">池子地址</span>
                <span className="info-value mono">{result.poolAddress}</span>
              </div>
              {result.isPool && (
                <div className="info-item">
                  <span className="info-label">Hook 地址</span>
                  <span className="info-value mono">{result.hookAddress}</span>
                </div>
              )}
              <div className="info-item">
                <span className="info-label">风险评分</span>
                <span className="info-value">{result.findings.riskScore}</span>
              </div>
            </div>

            {result.findings.feeExtraction.length > 0 && (
              <div className="finding-block">
                <h3>💰 费用提取机制</h3>
                <ul className="finding-list">
                  {result.findings.feeExtraction.slice(0, 10).map((item, i) => (
                    <li key={i} className="mono">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.findings.accessControl.length > 0 && (
              <div className="finding-block">
                <h3>🔐 权限控制</h3>
                <ul className="finding-list">
                  {result.findings.accessControl.slice(0, 10).map((item, i) => (
                    <li key={i} className="mono">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.findings.suspicious.length > 0 && (
              <div className="finding-block finding-danger">
                <h3>⚠️ 可疑模式</h3>
                <ul className="finding-list">
                  {result.findings.suspicious.slice(0, 10).map((item, i) => (
                    <li key={i} className="mono">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.findings.feeRecipients && (
              <div className="finding-block">
                <h3>📍 潜在收款地址</h3>
                <ul className="finding-list">
                  {result.findings.feeRecipients.map((addr, i) => (
                    <li key={i} className="mono">{addr}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="footer">
        Built with React + Vite | Analyze Uniswap V4 Hooks
      </footer>
    </div>
  );
}

export default App;
