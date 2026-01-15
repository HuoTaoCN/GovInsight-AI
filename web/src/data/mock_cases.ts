import type { EvaluationResult, WorkOrderInput } from "../types/quality_inspection";

export interface MockCase {
  id: string;
  name: string;
  description: string;
  input: WorkOrderInput;
  result: EvaluationResult;
}

export const MOCK_CASES: MockCase[] = [
  {
    id: "case-001",
    name: "标准高分案例 (高置信度)",
    description: "记录准确，无遗漏，置信度高，建议自动采信。",
    input: {
      transcript: `
话务员：您好，12345政务服务便民热线，请问有什么可以帮您？
市民：你好，我想反映一下幸福家园小区门口的路灯坏了两个，晚上太黑了，老人走路不方便。
话务员：您好，先生。请问具体是小区的哪个门口？是东门还是南门？
市民：就是南门，靠近那个...家家乐超市的那个门。
话务员：好的，靠近家家乐超市的南门是吧。请问大概坏了多久了？
市民：有两三天了吧，前天晚上我就发现不亮了。
话务员：明白了。请问您贵姓？方便留个联系方式吗？以便维修人员到了联系您。
市民：我免贵姓王，电话就是现在打的这个。
话务员：好的，王先生。我已经详细记录了：幸福家园小区南门（近家家乐超市）有两盏路灯损坏，影响居民出行。我们会立刻转派给市政路灯管理所进行维修。请您保持电话畅通。
市民：好的，谢谢啊，麻烦快点修好。
话务员：不客气，这是我们应该做的。祝您生活愉快，再见。
      `,
      form_data: {
        title: "幸福家园南门路灯损坏报修",
        description: "市民来电反映幸福家园小区南门（近家家乐超市）有两盏路灯不亮，已持续两三天，影响夜间出行，要求尽快维修。",
        citizen_name: "王先生",
        citizen_phone: "138****8888",
        priority: "Normal"
      },
      metadata: {
        ticket_id: "20250101-001",
        category: "城市管理/市政设施/照明设施",
        timestamp: "2025-01-01 09:30:00",
        handling_department: "市市政管理处",
        status: "Processing"
      },
      history_factors: {
        agent_consistency_score: 0.95,
        has_callback_complaint: false
      }
    },
    result: {
      scores: {
        completeness: { score: 35, judgement: "完整", issues: [] },
        consistency: { score: 30, judgement: "高度一致", issues: [] },
        clarity: { score: 20, judgement: "规范", issues: [] },
        risk_awareness: { score: 15, judgement: "充分", issues: [] }
      },
      total_score: 100,
      overall_level: "Excellent",
      confidence: 0.98,
      adjusted_confidence: 0.99,
      confidence_bucket: "High",
      need_human_review: false,
      suggestion: "工单记录规范，无需修改。",
      reasoning_trace: "1. **一致性校验**：话务员录入的工单描述准确涵盖了'地点(南门/近超市)'、'问题(路灯坏)'、'时间(两三天)'、'诉求(维修)'，无信息遗漏。\n2. **动作提取**：话务员引导规范，已准确转派。\n3. **结论**：工单生成质量高，完全符合录音事实。"
    }
  },
  {
    id: "case-002",
    name: "关键信息缺失 (中置信度)",
    description: "遗漏了'盲道被堵'的关键事实，影响部门判断，需抽检。",
    input: {
      transcript: `
话务员：您好，这里是12345热线，请问有什么诉求？
市民：你好，我要投诉！我在建设路这边，人行道上全是乱停的共享单车，都没法走路了！
话务员：请问具体是在建设路哪一段？附近有什么标志性建筑吗？
市民：就在建设银行门口这段。最气人的是，那些车把盲道都给堵得死死的！刚才我看见个盲人差点绊倒，太危险了！你们能不能管管？
话务员：好的，收到。建设银行门口共享单车乱停放是吧？
市民：对，主要是堵塞盲道，这个很严重的！
话务员：好的，我们会转给相关部门处理的。
市民：大概什么时候能处理？
话务员：会有工作人员联系您的，再见。
      `,
      form_data: {
        title: "建设路共享单车乱停放",
        description: "市民反映建设路（建设银行门口）人行道有共享单车乱停放，影响通行。",
        citizen_name: "匿名",
        citizen_phone: "139****1234",
        priority: "Normal"
      },
      metadata: {
        ticket_id: "20250105-088",
        category: "交通运输/交通秩序/车辆停放",
        timestamp: "2025-01-05 14:20:00",
        handling_department: "城管局",
        status: "Pending"
      },
      history_factors: {
        agent_consistency_score: 0.82,
        has_callback_complaint: false
      }
    },
    result: {
      scores: {
        completeness: { 
          score: 25, 
          judgement: "基本完整", 
          issues: ["遗漏关键细节：盲道被堵", "遗漏关键细节：险些造成盲人受伤"] 
        },
        consistency: { 
          score: 25, 
          judgement: "部分偏差", 
          issues: ["弱化了问题的严重性（盲道占用属于重点治理项，且涉及安全隐患）"] 
        },
        clarity: { score: 18, judgement: "规范", issues: [] },
        risk_awareness: { score: 12, judgement: "一般", issues: [] }
      },
      total_score: 80,
      overall_level: "Qualified",
      confidence: 0.82,
      adjusted_confidence: 0.82,
      confidence_bucket: "Medium",
      need_human_review: false,
      suggestion: "建议补充记录'盲道被堵'及'存在安全隐患'等关键信息，以便承办部门准确评估优先级。",
      suggested_revision: {
        title: "建设路共享单车乱停放堵塞盲道",
        description: "市民反映建设路（建设银行门口）人行道有大量共享单车乱停放，严重堵塞盲道，且险些造成盲人受伤，存在安全隐患，要求尽快清理。",
        priority: "Urgent"
      },
      reasoning_trace: "1. **信息比对**：市民反复强调'盲道被堵'和'安全隐患'，但工单仅记录'影响通行'，存在明显信息遗漏。\n2. **严重性评估**：普通乱停放与堵塞盲道性质不同，后者应优先处置。\n3. **结论**：工单虽然覆盖了基本事实，但丢失了核心加急情节，建议完善。"
    }
  },
  {
    id: "case-003",
    name: "风险降级 (低置信度/人工复核)",
    description: "群众情绪激烈且扬言升级，工单未体现，且历史回访有投诉记录。",
    input: {
      transcript: `
话务员：您好，12345热线。
市民：你们到底管不管？啊？那个化工厂的味道熏得我头疼，我家孩子都住院了！咳咳...
话务员：先生您先别激动，慢慢说，是哪里的化工厂？
市民：还能是哪里？就是城南那个化工园区！我都投诉三次了！三次了！每次都说去查，查个屁！味道越来越大！
话务员：先生，我们系统里确实有您的记录，相关部门回复说是符合排放标准的...
市民：放屁！符合标准孩子能住院吗？我告诉你们，如果明天还没人来给我个说法，我就去市政府门口拉横幅！还要找电视台曝光你们！我看你们怕不怕！
话务员：先生您消消气，我们非常重视，马上帮您加急办理，再次转办给生态环境局。
市民：加急有个屁用！这是最后一次警告！明天我看不到人，咱们就走着瞧！
      `,
      form_data: {
        title: "化工厂异味投诉",
        description: "市民再次来电反映城南化工园区有异味，要求再次核查。",
        citizen_name: "张某",
        citizen_phone: "133****9999",
        priority: "Normal"
      },
      metadata: {
        ticket_id: "20250110-999",
        category: "环境保护/空气污染/工业废气",
        timestamp: "2025-01-10 18:00:00",
        handling_department: "生态环境局",
        status: "Pending"
      },
      history_factors: {
        agent_consistency_score: 0.75,
        has_callback_complaint: true // 历史有回访不满意
      }
    },
    result: {
      scores: {
        completeness: { 
          score: 20, 
          judgement: "不完整", 
          issues: ["遗漏关键信息：孩子住院（健康受损）", "遗漏关键信息：已投诉三次（重复信访）"] 
        },
        consistency: { 
          score: 10, 
          judgement: "明显不一致", 
          issues: ["严重弱化诉求性质，将'激烈投诉/最后通牒'降级为'一般反映'"] 
        },
        clarity: { score: 15, judgement: "一般", issues: ["描述过于简略，未体现紧急程度"] },
        risk_awareness: { 
          score: 0, 
          judgement: "不足", 
          issues: ["完全忽略'拉横幅'（群体事件风险）", "完全忽略'找电视台'（舆情风险）"] 
        }
      },
      total_score: 45,
      overall_level: "Risk",
      confidence: 0.65,
      adjusted_confidence: 0.55, // 因历史回访投诉，置信度进一步下调
      confidence_bucket: "Low",
      need_human_review: true,
      review_reason: "工单严重弱化群众激烈情绪及升级风险，且该话务员历史存在回访投诉记录，建议人工介入。",
      suggestion: "必须如实记录群众的激烈情绪及采取极端措施的倾向，并标记为'紧急'或'特急'，严禁私自降级风险。",
      suggested_revision: {
        title: "【加急】城南化工园区异味严重扰民投诉",
        description: "市民再次来电反映城南化工园区异味严重，导致孩子住院（健康受损），已投诉三次无果。市民情绪极其激动，扬言若不解决将采取拉横幅、找媒体等极端措施（有群体事件及舆情风险）。",
        priority: "Emergency"
      },
      reasoning_trace: "1. **风险识别**：录音中出现'拉横幅'、'找媒体'、'孩子住院'等高危关键词。\n2. **工单对比**：工单仅记录为'有异味'，优先级选为'Normal'，完全未体现上述风险。\n3. **结论**：存在极大的漏报风险，极易引发次生舆情，判定为高风险工单。"
    }
  }
];
