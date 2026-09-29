# Uniswap V4 Hook Analyzer

分析 Uniswap V4 Hook 合约的抽税机制与潜在风险。

## 功能特性

- 🔍 支持多链分析：Ethereum、Base、Arbitrum、BSC、X Layer
- 💰 自动识别费用提取机制
- 🔐 检测权限控制模式
- ⚠️ 标记可疑代码模式
- 📊 风险评分系统

## 使用方法

1. 选择目标链
2. 输入 Hook 合约地址
3. 点击"开始分析"

## 技术栈

- React + Vite
- Ethers.js
- 多链 RPC 支持

## 本地开发

```bash
npm install
npm run dev
```

## 部署

```bash
npm run build
```

构建产物在 `dist` 目录，可直接部署到 GitHub Pages。

## 注意事项

- 合约必须在区块链浏览器上验证源码
- 分析结果仅供参考，不构成投资建议
- 建议结合人工审计进行综合判断

## License

MIT
