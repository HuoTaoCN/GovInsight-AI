# GovInsight-AI 后端 (Server)

基于 Node.js 和 Express 构建的轻量级 AI 分析服务。负责接收前端请求，组装 Prompt，调用大模型（Qwen）进行推理，并返回结构化的质检报告。

## 技术栈

*   **Runtime**: Node.js
*   **Web Framework**: Express
*   **AI SDK**: OpenAI Node.js SDK (Compatible with Qwen/DashScope)
*   **Model**: qwen-plus-2025-12-01

## API 接口

### `POST /api/analyze`

接收工单信息和录音转写，返回 AI 质检结果。

**Request Body:**
```json
{
  "transcript": "...", // 通话录音转写文本
  "form_data": {
    "title": "...",
    "description": "...",
    "priority": "Normal"
  },
  "history_factors": { // 可选：历史行为因子
    "agent_consistency_score": 0.9,
    "has_callback_complaint": false
  }
}
```

**Response Body:**
返回一个包含评分、置信度、推理过程和修正建议的 JSON 对象（详见代码中的 `EvaluationResult` 类型）。

## 环境变量配置

请在项目根目录创建 `.env` 文件（可复制 `.env.example`）：

```env
QWEN_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

## AI 质检逻辑 (System Prompt)

后端通过精心设计的 Prompt (Chain of Thought) 引导 AI 完成以下 5 层分析：

1.  **Layer 1 (V0.1) - 质量评分**：从完整性、一致性、规范性、风险敏感性四个维度打分。
2.  **Layer 2 (V0.2) - 置信度评估**：AI 自我评估判断的可靠性。
3.  **Layer 3 (V0.2) - 分级策略**：根据置信度决定“自动通过”、“抽检”还是“人工复核”。
4.  **Layer 4 (V0.3) - 历史校准**：引入话务员历史表现进行动态调整。
5.  **Layer 5 (Conditional) - 建设性修正**：仅在发现问题时生成“标准工单”范本。
