import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import { OpenAI } from 'openai';

const app = new Hono().basePath('/api');

// Cloudflare Pages Functions - API Entry Point
// Updated for V0.3.3 deployment check
const SYSTEM_PROMPT = `# 角色定义
你是一名为 12345 政务服务便民热线工作的**首席质检专家**。你的职责不是取代人工决策，而是通过可解释、可审计的方式，识别工单记录中的偏差、遗漏风险及治理隐患。

你必须严格遵守以下原则：
*   仅基于输入的事实进行判断；严禁引入外部假设。
*   所有结论必须可解释、可追溯。
*   不直接对人员进行自动化考核或处理。
*   主动暴露不确定性，并提示人工介入。
*   **输出语言**：所有分析、判断、问题描述、建议及推理过程必须使用**简体中文**。

# 输入数据
1.  **市民真实诉求摘要** (\`dialogue_summary\`): 从通话录音转写中提取。
2.  **话务员录入工单** (\`work_order\`): 话务员创建的原始记录。
3.  **历史与反馈因子** (可选 \`history_factors\`): 话务员历史一致性得分、历史回访投诉情况等。

# 核心任务

## 第一层：质量评分 (V0.1)
基于以下 4 个维度对工单进行评估。
**关键评分规则**：100 分仅预留给**完美无瑕**的记录。任何瑕疵（如错别字、标点错误、口语化表达）必须扣分。

1.  **诉求完整性 (35 分)**
    *   是否遗漏了核心诉求或多项诉求？
    *   是否缺失关键要素（时间、地点、人物、频率）？
2.  **语义一致性 (20 分)**
    *   工单记录是否准确还原了市民的真实诉求？
    *   是否存在弱化、偏差、模糊或定性改变？
3.  **表述规范性 (20 分)**
    *   **严格错别字检查**：检查错别字（如“路灯不良”应为“路灯不亮”）、同音字或口语化表达。
    *   **扣分限制**：若发现任何错别字或语法错误，该项得分**不得超过 15 分**。
    *   表达是否清晰、规范、无歧义？是否影响后续部门理解？
4.  **风险敏感性 (25 分)**
    *   是否忽略了明显的不满情绪？
    *   是否弱化了重复、长期或具有升级隐患的问题？

## 第二层：置信度评估 (V0.2)
评分后，判断你结论的可靠性：
*   高置信度 (High)：语义明确，信息充足，一致性判断清晰。
*   中/低置信度：存在歧义，关键信息缺失，依赖推断。
*   **主动降级**：若存在潜在争议、矛盾或管理风险，必须主动降低置信度。

## 第三层：处置策略 (V0.2)
*   **高置信度 (≥0.85)**：建议自动通过。
*   **中置信度 (0.70–0.84)**：建议抽检复核。
*   **低置信度 (<0.70)**：强制人工复核。

## 第四层：历史因子校准 (V0.3)
利用历史数据调整置信度（而非分数）：
*   历史一致性高 -> 增强置信度稳定性。
*   存在回访投诉 -> 对类似的“低风险”判断降低置信度。

## 第五层：建设性修正 (条件触发)
*   **如果** 工单质量优秀（总分 >= 90 且无高风险项）：
    设置 \`suggested_revision\` 为 \`null\`。
*   **否则**（总分 < 90 或检测到问题）：
    生成 \`suggested_revision\` 对象，展示“理想”的工单标准：
    1.  **标题**：确保准确。若风险高，添加“【加急】”等标签。
    2.  **描述**：重写为专业、完整且基于事实的描述。还原所有遗漏细节，显性标记风险。
    3.  **优先级**：若检测到安全/健康/升级风险，提升优先级（Normal -> Urgent -> Emergency）。
    4.  **处理方式**：必须基于录音事实，严格判断是应该“直接办结(Direct)”还是“转办(Dispatch)”。
        *   **Direct (直接办结)**：仅适用于纯政策咨询（话务员当场答复）、简单的信息查询、或无需其他部门介入即可解决的问题。
        *   **Dispatch (转办)**：适用于所有需要线下核实、执法、维修、协调或超出话务员权限的诉求（如投诉、举报、求助、建议）。
        *   **注意**：若话务员为了省事将本该转办的投诉选为直接办结，必须修正并标记为风险。

# 输出格式 (JSON)
你必须仅输出一个有效的 JSON 对象。不要包裹在 Markdown 代码块中。
确保所有字符串值（除了 score 或 confidence 等键名）均使用**简体中文**。

{
  "scores": {
    "completeness": {
      "score": 0,
      "judgement": "字符串 (完整/基本完整/不完整)",
      "issues": ["字符串 (描述具体缺失点)"]
    },
    "consistency": {
      "score": 0,
      "judgement": "字符串 (一致/部分偏差/严重冲突)",
      "issues": ["字符串 (描述具体偏差)"]
    },
    "clarity": {
      "score": 0,
      "judgement": "字符串 (清晰/一般/模糊)",
      "issues": ["字符串 (描述具体语言问题)"]
    },
    "risk_awareness": {
      "score": 0,
      "judgement": "字符串 (充分/一般/不足)",
      "issues": ["字符串 (描述忽视的风险)"]
    }
  },
  "total_score": 0,
  "overall_level": "字符串 (优秀/合格/存在风险/不合格)",
  "confidence": 0.0,
  "adjusted_confidence": 0.0,
  "confidence_bucket": "字符串 (High/Medium/Low)",
  "need_human_review": 布尔值,
  "review_reason": "字符串 (人工复核的原因，中文)",
  "suggestion": "字符串 (给话务员的具体、可操作建议，中文)",
  "suggested_revision": {
    "title": "字符串 (修正后的标题)",
    "description": "字符串 (修正后的描述)",
    "priority": "字符串 (修正后的优先级)",
    "handling_type": "字符串 (Direct/Dispatch)"
  } 或 null,
  "reasoning_trace": "字符串 (分步骤的思维链推理过程，如 '1. 意图识别... 2. 事实比对... 3. 风险研判...', 中文)"
}
`;

app.post('/analyze', async (c) => {
  try {
    const { transcript, form_data, history_factors } = await c.req.json();

    const client = new OpenAI({
      apiKey: c.env.QWEN_API_KEY,
      baseURL: c.env.QWEN_BASE_URL,
    });

    const userPrompt = `
<dialogue_summary>
${transcript}
</dialogue_summary>

<work_order>
Title: ${form_data.title}
Description: ${form_data.description}
Citizen: ${form_data.citizen_name}
Priority: ${form_data.priority}
HandlingType: ${form_data.handling_type || 'Dispatch'}
</work_order>

<history_factors>
${JSON.stringify(history_factors || {})}
</history_factors>
    `;

    const completion = await client.chat.completions.create({
      model: c.env.QWEN_MODEL_NAME || "qwen-plus-2025-12-01",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.1,
      max_tokens: 4000
    });

    const content = completion.choices[0].message.content;
    
    if (!content) {
      throw new Error("No content received from LLM");
    }

    const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
    const result = JSON.parse(jsonStr);

    return c.json(result);

  } catch (error) {
    console.error("Error calling Qwen API:", error);
    return c.json({ error: "Failed to analyze work order" }, 500);
  }
});

// Audio Transcription Endpoint (Cloudflare Workers compatible)
// Note: Workers don't use 'multer' or 'fs'. We parse FormData directly.
app.post('/audio/transcribe', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return c.json({ error: "No file uploaded" }, 400);
    }

    const client = new OpenAI({
      apiKey: c.env.QWEN_API_KEY,
      baseURL: c.env.QWEN_BASE_URL,
    });

    console.log(`Transcribing file: ${file.name} using model: ${c.env.QWEN_ASR_MODEL}`);

    // Cloudflare Workers: File is a Blob, but OpenAI SDK expects a File with name or a ReadStream.
    // In Workers environment, File object from FormData is usually compatible.
    // However, some environments might need explicit conversion or buffer handling.
    // Let's ensure we pass the file directly as it supports the Blob interface.
    
    const transcription = await client.audio.transcriptions.create({
      file: file,
      model: c.env.QWEN_ASR_MODEL || "qwen3-asr-flash-filetrans",
    });

    return c.json({ text: transcription.text });

  } catch (error) {
    console.error("Transcription Error:", error);
    // Log detailed error for debugging
    if (error instanceof Error) {
        console.error("Error Message:", error.message);
        console.error("Error Stack:", error.stack);
    }
    return c.json({ error: "Transcription failed", details: String(error) }, 500);
  }
});

// Real-time Voice Input Endpoint (Short Chunk)
app.post('/audio/stream', async (c) => {
  try {
    const formData = await c.req.formData();
    const audioBlob = formData.get('audio');

    if (!audioBlob || !(audioBlob instanceof File)) {
      return c.json({ error: "No audio chunk" }, 400);
    }

    // Check for empty file
    if (audioBlob.size === 0) {
        return c.json({ text: "" });
    }

    const client = new OpenAI({
      apiKey: c.env.QWEN_API_KEY,
      baseURL: c.env.QWEN_BASE_URL,
    });

    console.log(`Streaming audio chunk (size: ${audioBlob.size}) to model: ${c.env.QWEN_REALTIME_MODEL}`);

    const transcription = await client.audio.transcriptions.create({
      file: audioBlob,
      model: c.env.QWEN_REALTIME_MODEL || "qwen3-tts-vd-realtime-2025-12-16",
    });

    return c.json({ text: transcription.text });

  } catch (error) {
    console.error("Stream Transcription Error:", error);
    if (error instanceof Error) {
        console.error("Error Message:", error.message);
        console.error("Error Stack:", error.stack);
    }
    return c.json({ error: "Stream processing failed", details: String(error) }, 500);
  }
});

export const onRequest = handle(app);
