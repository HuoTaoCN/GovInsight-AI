# Changelog

All notable changes to this project will be documented in this file.

## [V0.3.2] - 2026-01-16

### 🛠️ Infrastructure & DevEx (基础设施与开发体验)
- **One-Click Setup**: 
  - 新增 `setup_and_run.sh` 自动化脚本，支持一键安装依赖并同时启动前后端服务。
  - **Auto Node.js Runtime**: 脚本集成了 Node.js (v24.13.0) 自动下载功能。当检测到系统未安装 Node.js 或版本不兼容时，会自动下载独立的运行时环境到 `runtime/` 目录，确保项目在任何环境下都能“开箱即用”。
- **Configurable Model Name**:
  - 后端服务支持通过 `.env` 配置 `QWEN_MODEL_NAME` 环境变量。
  - 允许开发者灵活切换 Qwen 模型的不同版本（如 `qwen-plus`, `qwen-turbo`），无需修改代码。
- **Documentation**:
  - 新增 `README_SETUP.md` 详细安装指南。
  - 更新 `README.md` 添加快速启动说明。

## [V0.3.1] - 2026-01-16

### ✨ New Features (新增特性)
- **Dashboard Layout Refactor**: 
  - 全新重构为全屏三栏式布局 (Dashboard Style)，高度自适应屏幕。
  - 实现左中右三栏独立滚动，互不干扰，提升信息密度与阅读体验。
- **Intelligent Score Cards**: 
  - 评分卡片新增 Tooltip 悬浮说明，详细展示 4 个维度的评分标准与细则。
  - 引入 `React Portal` 技术解决悬浮层被容器遮挡的问题。
- **New Brand Identity**: 
  - 设计并上线了全新的 Logo（盾牌 + 脉冲波形），体现“安全治理”与“AI 智能”的结合。
  - 同步更新了 Favicon 和应用内图标。
- **New Test Case**: 
  - 新增 `case-004` “严重歪曲事实 (高置信度/退回重写)”案例，完善对恶性工单的风控验证。

### 💄 UI/UX Improvements (体验优化)
- **Compact Score View**: 调整质检得分区域布局比例至 70%，无需滚动即可完整查看所有评分项。
- **Adaptive Editor**: “手动录入测试”模式下的编辑器支持高度自适应，移除多余滚动条。
- **Visual Polish**: 统一了卡片圆角、阴影及间距标准，视觉效果更专业。

### 🐛 Bug Fixes (问题修复)
- 修复了 Tooltip 在 `overflow: hidden` 容器中被截断无法完整显示的问题。
- 修正了页面标题与文档不一致的问题，统一为 "GovInsight-AI 热线工单质量智能检测系统"。

---

## [V0.3.0] - 2026-01-14

### Features
- Initial release of the UI with Mock data support.
- Implemented core scoring logic and confidence assessment.
- Added "Revision View" with diff highlighting.
