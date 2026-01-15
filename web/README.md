# GovInsight-AI 前端 (Web)

基于 React + Vite 构建的现代化工单质检界面。提供工单编辑、录音转写比对、AI 质检报告展示及修正建议对比功能。

## 技术栈

*   **框架**: React 19, Vite 7
*   **语言**: TypeScript
*   **样式**: Tailwind CSS 4
*   **图标**: Lucide React
*   **工具**: clsx, tailwind-merge

## 核心组件

*   `CaseEditor`: 支持手动录入工单信息（标题、描述、优先级等）。
*   `TranscriptView`: 展示通话录音转写内容。
*   `ScoreCard`: 可视化展示 AI 评分（支持进度条与颜色分级）。
*   `RevisionView`: 核心组件，展示原工单与 AI 建议修正工单的对比（Diff 视图），支持三种状态：
    *   待生成
    *   无需修正（绿色提示）
    *   修正对比（显示具体差异）

## 运行指南

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## Mock 数据

项目内置了 `src/data/mock_cases.ts`，包含三个典型案例供演示使用：
1.  **Case 1 (标准高分)**：展示系统对高质量工单的“自动采信”逻辑。
2.  **Case 2 (关键信息缺失)**：展示系统如何识别缺失要素并生成补充建议。
3.  **Case 3 (风险降级)**：展示系统如何识别话务员私自降级风险（如将“特急”降为“普通”）并触发强制修正。
