# Uniswap V4 Hook Analyzer

🔍 自动分析 Uniswap V4 Hook 合约的抽税机制与风险评估工具

## 🌐 在线使用

访问: https://earnbabysol.github.io/uniswap-v4-hook-analyzer/

## ✨ 功能特性

### 支持的区块链
- Ethereum
- Base
- Arbitrum
- Optimism
- Polygon
- BSC (Binance Smart Chain)
- Avalanche
- X Layer
- Robinhood Network

### 分析能力
1. **费用机制检测**
   - Swap 费用提取
   - LP 费用分配
   - 协议费用
   - 动态费用机制

2. **权限分析**
   - Owner 权限
   - 管理员角色
   - 紧急暂停功能
   - 合约升级能力

3. **风险评估**
   - 中心化风险
   - 可升级合约风险
   - 蜜罐特征检测
   - 税率分析
   - 综合风险评分

4. **代码扫描**
   - 自动识别关键函数
   - 检测可疑模式
   - 高亮风险代码

## 🚀 使用方法

1. 选择目标区块链
2. 输入已验证的 Uniswap V4 Hook 合约地址
3. 点击"开始分析"
4. 查看详细的分析报告

## ⚠️ 重要提示

- 合约必须在区块链浏览器上**已验证**（有源代码）才能分析
- 工具仅分析已公开的智能合约代码
- 分析结果仅供参考，不构成投资建议
- 使用前请自行做好尽职调查

## 🛠️ 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📝 技术栈

- React 18
- Vite
- ethers.js v6
- Ankr RPC (公共节点)

## 📄 License

MIT

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
