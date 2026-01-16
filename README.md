<div align="center">

# GovInsight-AI

**热线工单质量智能检测系统**
**Intelligent Quality Inspection System for Government Service Hotline Work Orders**

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
![React](https://img.shields.io/badge/React-v19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-v18+-43853D?style=flat-square&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-v7-646CFF?style=flat-square&logo=vite&logoColor=white)
![LLM](https://img.shields.io/badge/LLM-Qwen--Plus-blueviolet?style=flat-square)

[简体中文](#简体中文) | [English](#english-introduction)

</div>

---

<a name="简体中文"></a>

**GovInsight-AI** 是一个基于 **大语言模型 (LLM)** 的政务热线工单质量检测系统。它旨在解决政务热线（如 12345）中“通话录音”与“话务员录入工单”一致性校验的痛点。

传统的人工质检效率低、标准不一，且难以发现隐蔽的语义篡改。GovInsight-AI 通过自动比对录音转写与工单记录，精准识别关键信息缺失、语义偏差和风险降级等问题，并提供智能化的修正建议，大幅提升质检效率与准确性。

## ✨ 核心特性

*   **🔍 多维度智能质检**：
    *   **完整性 (Completeness)**：检测是否遗漏时间、地点、诉求细节等关键要素。
    *   **一致性 (Consistency)**：比对录音与工单，发现语义篡改或事实偏差（如将“投诉”改为“咨询”）。
    *   **规范性 (Clarity)**：评估表述是否清晰、专业，是否影响后续办理。
    *   **风险敏感性 (Risk Awareness)**：识别是否忽视了群众的激烈情绪或升级风险（如“多次未解决”）。
*   **🧠 AI 思维链推理 (CoT)**：展示 AI 的完整推理过程，让质检结果可解释、可追溯，拒绝“黑盒”评判。
*   **🛡️ 智能处置建议**：
    *   **自动采信**：高置信度工单（≥0.85）自动通过，减少人工工作量。
    *   **人工复核**：低置信度（<0.70）或存在风险的工单提示人工介入。
*   **✍️ 自动修正工单**：当发现质量问题时，AI 自动生成标准的“建议修正版本”，并高亮显示差异，话务员可一键参考。

## 🏗️ 系统架构

```mermaid
graph TD
    User[用户 / 质检员] -->|交互| Web[前端 (React + Vite)]
    Web -->|HTTP POST| Server[后端 (Express)]
    Server -->|组装 Prompt| LLM[Qwen-Plus (大模型)]
    LLM -->|返回 JSON| Server
    Server -->|解析结果| Web
    Web -->|可视化报告| User
```

## 🛠️ 技术栈

*   **前端**: React 19, TypeScript, Tailwind CSS 4, Lucide Icons, Vite 7
*   **后端**: Node.js, Express, OpenAI SDK (Adapter)
*   **AI 模型**: Qwen-Plus (via Aliyun DashScope)
*   **提示词工程**: 5层分层推理逻辑 (评分 -> 置信度 -> 策略 -> 校准 -> 修正)

## 🚀 快速开始

### 1. 环境准备
*   Node.js (v18+)
*   npm 或 yarn
*   阿里云 Qwen API Key (或兼容 OpenAI 格式的其他 LLM Key)

### 2. 启动后端服务
```bash
cd server
# 复制环境变量示例文件
cp .env.example .env

# 编辑 .env 文件，填入您的 QWEN_API_KEY
vim .env 

npm install
node index.js
```
后端默认运行在 `http://localhost:3000`

### 3. 启动前端界面
```bash
cd web
npm install
npm run dev
```
前端默认运行在 `http://localhost:5173`

## 🗺️ 路线图

*   [x] **V0.1**: 基础评分功能 (Basic Scoring)
*   [x] **V0.2**: 置信度评估与分级处置 (Confidence & Bucketing)
*   [x] **V0.3**: UI 重构、条件式修正生成、Mock 演示模式
*   [ ] **V0.4**: 支持批量上传与 CSV 导出
*   [ ] **V0.5**: 集成 RAG (检索增强生成) 以支持本地知识库（如政策法规库）的合规性检测
*   [ ] **V1.0**: 完整的仪表盘 (Dashboard) 与多租户支持

## 📄 许可证

本项目采用 [GNU GPL v3.0](LICENSE) 许可证。

---

<a name="english-introduction"></a>
## English Introduction

**GovInsight-AI** is an open-source intelligent quality inspection system powered by **Large Language Models (LLM)** (specifically Qwen-Plus). It addresses the critical challenge of verification between "Call Transcripts" and "Operator Work Orders" in government service hotlines (e.g., 12345).

By automatically comparing the dialogue with the written record, GovInsight-AI identifies **missing key information**, **semantic deviations**, and **risk downgrading**, providing interpretable scoring and constructive revision suggestions.

### Core Features

*   **Multi-dimensional Inspection**: Completeness, Consistency, Clarity, and Risk Awareness.
*   **Chain of Thought (CoT)**: Displays full reasoning process for interpretable judgments.
*   **Intelligent Strategy**: Auto-Pass for high confidence, Human Review for risks.
*   **Auto-Revision**: Generates standardized revisions with highlighted diffs.

### Quick Start

1.  **Backend**: `cd server` -> `cp .env.example .env` -> `npm install` -> `node index.js`
2.  **Frontend**: `cd web` -> `npm install` -> `npm run dev`

### License
GNU GPL v3.0 License
