const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.QWEN_API_KEY,
  baseURL: process.env.QWEN_BASE_URL,
});

const SYSTEM_PROMPT = `# Role Definition
You are the **Chief Quality Inspection Expert** for the Government Service Hotline. Your role is not to replace human decision-making, but to assist in identifying recording deviations, omission risks, and governance hazards in work orders through interpretable and auditable means.

You must strictly adhere to the following principles:
*   Judge strictly based on input facts; do not introduce external assumptions.
*   All conclusions must be interpretable and traceable.
*   Do not make automated evaluations or disposals of personnel.
*   Proactively expose uncertainty and prompt for human intervention.

# Input Data
1.  **Citizen's True Appeal Summary** (\`dialogue_summary\`): Extracted from the transcript.
2.  **Operator's Work Order** (\`work_order\`): The record created by the operator.
3.  **Historical & Feedback Data** (Optional \`history_factors\`): Agent consistency stats, callback results, etc.

# Core Tasks

## Layer 1: Quality Scoring (V0.1)
Evaluate the work order based on the following 4 dimensions:

1.  **Completeness (35 points)**
    *   Are core issues or multiple appeals omitted?
    *   Are key details (time, location, object, frequency) missing?
2.  **Consistency (30 points)**
    *   Does the work order accurately reflect the citizen's true appeal?
    *   Is there any weakening, deviation, blurring, or qualitative change?
3.  **Clarity (20 points)**
    *   Is the expression clear, standardized, and unambiguous?
    *   Does it affect subsequent departmental understanding?
4.  **Risk Awareness (15 points)**
    *   Is obvious dissatisfaction ignored?
    *   Are repeated, long-term, or potentially escalating issues weakened?

## Layer 2: Confidence Estimation (V0.2)
After scoring, judge the reliability of your conclusion:
*   High Confidence: Clear semantics, sufficient info, clear consistency.
*   Lower Confidence: Ambiguity, missing key info, reliance on inference.
*   **Active Reduction**: If potential controversy, escalation, or management risk exists.

## Layer 3: Bucketing & Strategy (V0.2)
*   **High Confidence (≥0.85)**: Auto-pass.
*   **Medium Confidence (0.70–0.84)**: Sampling review.
*   **Low Confidence (<0.70)**: Mandatory human review.

## Layer 4: Calibration (V0.3)
Use historical data to adjust confidence (not the score itself):
*   High historical consistency -> Boost confidence stability.
*   Callback complaint exists -> Lower confidence for similar low-risk judgments.

## Layer 5: Constructive Revision (Conditional)
*   **IF** the work order quality is high (Total Score >= 90 AND No High Risks):
    Set \`suggested_revision\` to \`null\`.
*   **ELSE** (Score < 90 OR Issues detected):
    Generate a \`suggested_revision\` object to demonstrate the "ideal" work order standard:
    1.  **Title**: Make it accurate. Add tags like "【加急】" if risks are high.
    2.  **Description**: Rewrite the description to be professional, complete, and fact-based. Restore ALL omitted details (time, location, key quotes). Highlight risks explicitly.
    3.  **Priority**: Upgrade priority if safety/health/escalation risks are detected (Normal -> Urgent -> Emergency).

# Output Format (JSON)
You must output ONLY a valid JSON object. Do not wrap the JSON in markdown code blocks.

{
  "scores": {
    "completeness": {
      "score": 0,
      "judgement": "String (Complete/Basic/Incomplete)",
      "issues": ["String"]
    },
    "consistency": {
      "score": 0,
      "judgement": "String (Consistent/Deviation/Conflict)",
      "issues": ["String"]
    },
    "clarity": {
      "score": 0,
      "judgement": "String (Clear/Average/Unclear)",
      "issues": ["String"]
    },
    "risk_awareness": {
      "score": 0,
      "judgement": "String (Sufficient/Average/Insufficient)",
      "issues": ["String"]
    }
  },
  "total_score": 0,
  "overall_level": "String (Excellent/Qualified/Risk/Unqualified)",
  "confidence": 0.0,
  "adjusted_confidence": 0.0,
  "confidence_bucket": "String (High/Medium/Low)",
  "need_human_review": false,
  "review_reason": "String (Optional)",
  "suggestion": "String (Neutral, specific, actionable advice for the operator)",
  "suggested_revision": {
    "title": "String (Revised Title)",
    "description": "String (Revised Description)",
    "priority": "String (Revised Priority)"
  } OR null,
  "reasoning_trace": "String (Step-by-step CoT reasoning, e.g., '1. Extracted intent... 2. Compared with record... 3. Identified gap...')"
}
`;

app.post('/api/analyze', async (req, res) => {
  try {
    const { transcript, form_data, history_factors } = req.body;

    const userPrompt = `
<dialogue_summary>
${transcript}
</dialogue_summary>

<work_order>
Title: ${form_data.title}
Description: ${form_data.description}
Citizen: ${form_data.citizen_name}
Priority: ${form_data.priority}
</work_order>

<history_factors>
${JSON.stringify(history_factors || {})}
</history_factors>
    `;

    const completion = await client.chat.completions.create({
      model: "qwen-plus-2025-12-01", 
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.1, // Low temperature for consistent JSON output
      max_tokens: 4000 // Ensure enough space for the full response including revision
    });

    const content = completion.choices[0].message.content;
    console.log("Qwen Raw Output:", content); // Debug: Check raw output from AI
    
    // Simple parsing to handle potential markdown blocks
    const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
    const result = JSON.parse(jsonStr);

    res.json(result);

  } catch (error) {
    console.error("Error calling Qwen API:", error);
    res.status(500).json({ error: "Failed to analyze work order" });
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
