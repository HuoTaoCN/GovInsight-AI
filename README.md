# GovInsight-AI

**Intelligent Quality Inspection System for Government Service Hotline Work Orders**
**政务热线工单质量智能检测系统**

[English](#english-introduction) | [中文](#中文介绍)

---

<a name="english-introduction"></a>
## English Introduction

**GovInsight-AI** is an open-source intelligent quality inspection system powered by **Large Language Models (LLM)** (specifically Qwen-Plus). It addresses the critical challenge of verification between "Call Transcripts" and "Operator Work Orders" in government service hotlines (e.g., 12345).

Traditional manual inspection is time-consuming, inconsistent, and often misses subtle semantic shifts. GovInsight-AI automates this process by comparing the dialogue with the written record, identifying **missing key information**, **semantic deviations**, and **risk downgrading**, while providing interpretable scoring and constructive revision suggestions.

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
    User[User / Inspector] -->|Interacts| Web[Frontend (React + Vite)]
    Web -->|HTTP POST| Server[Backend (Express)]
    Server -->|Construct Prompt| LLM[Qwen-Plus (LLM)]
    LLM -->|JSON Response| Server
    Server -->|Parsed Result| Web
    Web -->|Visual Report| User
```

### Key Technologies

*   **Frontend**: React 19, TypeScript, Tailwind CSS 4, Lucide Icons, Vite 7.
*   **Backend**: Node.js, Express, OpenAI SDK (Adapter).
*   **AI Model**: Qwen-Plus (via Aliyun DashScope).
*   **Prompt Engineering**: 5-Layer reasoning logic (Scoring -> Confidence -> Strategy -> Calibration -> Revision).

---

<a name="中文介绍"></a>
## 中文介绍

**GovInsight-AI** 是一个基于大语言模型（LLM）的政务热线工单质量检测系统。它旨在解决政务热线（如 12345）中“通话录音”与“话务员录入工单”一致性校验的痛点。

传统的人工质检效率低、标准不一，且难以发现隐蔽的语义篡改。GovInsight-AI 通过自动比对录音转写与工单记录，精准识别关键信息缺失、语义偏差和风险降级等问题，并提供智能化的修正建议，大幅提升质检效率与准确性。

### 核心功能

*   **多维度智能质检**：
    *   **完整性 (Completeness)**：检测是否遗漏时间、地点、诉求细节等关键要素。
    *   **一致性 (Consistency)**：比对录音与工单，发现语义篡改或事实偏差（如将“投诉”改为“咨询”）。
    *   **规范性 (Clarity)**：评估表述是否清晰、专业，是否影响后续办理。
    *   **风险敏感性 (Risk Awareness)**：识别是否忽视了群众的激烈情绪或升级风险（如“多次未解决”）。
*   **AI 思维链推理 (CoT)**：展示 AI 的完整推理过程，让质检结果可解释、可追溯，拒绝“黑盒”评判。
*   **智能处置建议**：
    *   **自动采信**：高置信度工单（≥0.85）自动通过，减少人工工作量。
    *   **人工复核**：低置信度（<0.70）或存在风险的工单提示人工介入。
*   **自动修正工单**：当发现质量问题时，AI 自动生成标准的“建议修正版本”，并高亮显示差异，话务员可一键参考。

### 提示词工程 (Prompt Engineering)

本项目采用了先进的分层提示词设计（Layered Prompt Design）：
1.  **Layer 1 质量评分**：基于 4 个维度进行打分。
2.  **Layer 2 置信度评估**：AI 自我反思判断的可靠性。
3.  **Layer 3 分级策略**：将分数映射为业务动作（通过/抽检/必检）。
4.  **Layer 4 历史校准**：结合话务员历史表现调整阈值。
5.  **Layer 5 建设性修正**：仅在必要时生成修正建议。

详细设计请参考：[Prompt Library V0.3](docs/prompt_library_v0.3.md)

## Directory Structure / 目录结构

*   `web/`: 前端项目 (React 19, Tailwind CSS 4, Lucide Icons)
    *   `src/components/RevisionView.tsx`: 核心对比组件
    *   `src/data/mock_cases.ts`: 内置演示案例
*   `server/`: 后端服务 (Node.js, Express, OpenAI SDK)
    *   `index.js`: 核心业务逻辑与 Prompt 组装
*   `docs/`: 文档与 Prompt 资产
    *   `prompt_library_v0.3.md`: 提示词工程文档
    *   `design_consistency_check.md`: 系统设计文档

## Quick Start / 快速开始

### 1. Prerequisites / 环境准备
*   Node.js (v18+)
*   npm or yarn
*   Aliyun Qwen API Key (或者兼容 OpenAI 格式的其他大模型 Key)

### 2. Start Backend / 启动后端服务
```bash
cd server
# Copy the example environment file
cp .env.example .env

# Edit .env and fill in your QWEN_API_KEY
# 编辑 .env 文件，填入您的 QWEN_API_KEY (DashScope)
vim .env 

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

## Roadmap / 路线图

*   [x] **V0.1**: 基础评分功能 (Basic Scoring)。
*   [x] **V0.2**: 置信度评估与分级处置 (Confidence & Bucketing)。
*   [x] **V0.3**: UI 重构、条件式修正生成、Mock 演示模式。
*   [ ] **V0.4**: 支持批量上传与 CSV 导出。
*   [ ] **V0.5**: 集成 RAG (检索增强生成) 以支持本地知识库（如政策法规库）的合规性检测。
*   [ ] **V1.0**: 完整的仪表盘 (Dashboard) 与多租户支持。

## Version History / 版本历史

*   **V0.3.0 (Current)**: 
    *   UI Overhaul with unified Card style.
    *   Backend upgraded to `qwen-plus-2025-12-01`.
    *   Conditional generation logic for "Suggested Revision".
    *   Added Mock Data Demo & Manual Entry Mode.
*   **V0.2.0**: Introduced Confidence Estimation & Bucketing Strategy.
*   **V0.1.0**: Initial Quality Scoring.

## License / 许可证
GNU GPL v3.0 License
