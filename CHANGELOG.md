# Changelog

All notable changes to this project will be documented in this file.

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
