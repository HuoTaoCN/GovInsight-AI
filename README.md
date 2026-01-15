# GovInsight-AI

**Intelligent Quality Inspection System for Government Service Hotline Work Orders**
**政务热线工单质量智能检测系统**

[English](#english-introduction) | [中文](#中文介绍)

---

<a name="english-introduction"></a>
## English Introduction

**GovInsight-AI** is an open-source intelligent quality inspection system powered by **Large Language Models (LLM)** (specifically Qwen-Plus). It is designed to solve the challenge of consistency verification between "Call Transcripts" and "Operator Work Orders" in government service hotlines (e.g., 12345).

By automatically comparing the dialogue with the written record, GovInsight-AI identifies issues such as **missing key information**, **semantic deviations**, and **risk downgrading**, providing interpretable scoring and constructive revision suggestions.

### Core Features

*   **Multi-dimensional Inspection**:
    *   **Completeness**: Checks for missing details (time, location, core appeals).
    *   **Consistency**: Detects semantic tampering or factual errors.
    *   **Clarity**: Evaluates professional expression and ambiguity.
    *   **Risk Awareness**: Identifies ignored public sentiment or escalation risks.
*   **Chain of Thought (CoT)**: Displays the AI's full reasoning process, making judgments interpretable and traceable.
*   **Intelligent Strategy**:
    *   **Auto-Pass**: High-confidence orders (≥0.85) are automatically approved.
    *   **Human Review**: Low-confidence (<0.70) or risky orders are flagged for mandatory human review.
*   **Auto-Revision**: Automatically generates a standardized "Suggested Revision" work order when quality issues are detected, highlighting the differences.

### System Architecture

```mermaid
graph TD
    A[Frontend (React + Vite)] -->|HTTP POST| B[Backend (Express)]
    B -->|API Call| C[Qwen-Plus (LLM)]
    C -->|JSON Result| B
    B -->|Evaluation Data| A
```

---

<a name="中文介绍"></a>
## 中文介绍

**GovInsight-AI** 是一个基于大语言模型（LLM）的政务热线工单质量检测系统。它通过对比“通话录音转写”与“话务员录入工单”，自动识别关键信息缺失、语义偏差和风险降级等问题，并提供智能化的修正建议。

### 核心功能

*   **多维度智能质检**：
    *   **完整性 (Completeness)**：检测是否遗漏时间、地点、诉求细节等关键要素。
    *   **一致性 (Consistency)**：比对录音与工单，发现语义篡改或事实偏差。
    *   **规范性 (Clarity)**：评估表述是否清晰、专业，是否影响后续办理。
    *   **风险敏感性 (Risk Awareness)**：识别是否忽视了群众的激烈情绪或升级风险。
*   **AI 思维链推理 (CoT)**：展示 AI 的完整推理过程，让质检结果可解释、可追溯。
*   **智能处置建议**：
    *   **自动采信**：高置信度工单自动通过。
    *   **人工复核**：低置信度或存在风险的工单提示人工介入。
*   **自动修正工单**：当发现质量问题时，AI 自动生成标准的“建议修正版本”，并高亮显示差异。

## Directory Structure / 目录结构

*   `web/`: Frontend Project (React 19, Tailwind CSS 4, Lucide Icons)
*   `server/`: Backend Service (Node.js, Express, OpenAI SDK)
*   `docs/`: Documentation & Prompt Engineering Library

## Quick Start / 快速开始

### 1. Prerequisites / 环境准备
*   Node.js (v18+)
*   npm or yarn
*   Aliyun Qwen API Key (or OpenAI-compatible Key)

### 2. Start Backend / 启动后端服务
```bash
cd server
cp .env.example .env
# Edit .env and fill in your QWEN_API_KEY
# 编辑 .env 文件，填入您的 QWEN_API_KEY
npm install
node index.js
```
Server runs at `http://localhost:3000`

### 3. Start Frontend / 启动前端界面
```bash
cd web
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

## Version History / 版本历史

*   **V0.3.0 (Current)**: 
    *   UI Overhaul with unified Card style.
    *   Backend upgraded to `qwen-plus-2025-12-01`.
    *   Conditional generation logic for "Suggested Revision".
    *   Added Mock Data Demo & Manual Entry Mode.
*   **V0.2.0**: Introduced Confidence Estimation & Bucketing Strategy.
*   **V0.1.0**: Initial Quality Scoring.

## License / 许可证
MIT License
