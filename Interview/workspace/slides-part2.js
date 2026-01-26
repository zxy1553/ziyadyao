// slides-part2.js - Skill Matrix & Knowledge Base slides
const PRIMARY = '1a73e8';
const PRIMARY_LIGHT = 'e8f0fe';
const SECONDARY = 'ff9800';
const SECONDARY_LIGHT = 'fff3e0';
const SUCCESS = '4caf50';
const SUCCESS_LIGHT = 'e8f5e9';
const DANGER = 'f44336';
const DARK = '1a1a2e';
const GRAY = '666666';
const LIGHT_BG = 'f8f9fa';
const PURPLE = '7b1fa2';
const PURPLE_LIGHT = 'f3e5f5';

function createSkillSlide(pptx) {
    const slide = pptx.addSlide();
    slide.background = { color: LIGHT_BG };
    
    // Header
    slide.addText('Skill 矩阵：能力叠加架构', {
        x: 0.5, y: 0.3, w: 6, h: 0.5,
        fontSize: 22, bold: true, color: DARK
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 0.75, w: 0.8, h: 0.07,
        fill: { color: PRIMARY }
    });
    
    // Left: Dev Skills Card
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.5, y: 1.0, w: 3.2, h: 1.6,
        fill: { color: 'FFFFFF' },
        shadow: { type: 'outer', blur: 2, offset: 1, angle: 45, color: '000000', opacity: 0.08 },
        rectRadius: 0.08
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 1.0, w: 3.2, h: 0.06,
        fill: { color: PRIMARY }
    });
    slide.addText('🔧 Dev Skills', {
        x: 0.65, y: 1.15, w: 2, h: 0.35,
        fontSize: 12, bold: true, color: PRIMARY
    });
    const devSkills = [
        { name: 'GAS-AbleTask', desc: 'Basic/SpawnActor/HitTask 模板' },
        { name: 'Condition', desc: '内置专家知识，实时指导开发' },
        { name: 'Status Writer', desc: '替代晦涩文档，提供 SOP' }
    ];
    devSkills.forEach((s, i) => {
        slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: 0.65, y: 1.55 + i * 0.32, w: 1.1, h: 0.25,
            fill: { color: 'f5f5f5' }, rectRadius: 0.03
        });
        slide.addText(s.name, {
            x: 0.65, y: 1.55 + i * 0.32, w: 1.1, h: 0.25,
            fontSize: 8, bold: true, color: PRIMARY, align: 'center', valign: 'middle'
        });
        slide.addText(s.desc, {
            x: 1.8, y: 1.55 + i * 0.32, w: 1.8, h: 0.25,
            fontSize: 8, color: GRAY, valign: 'middle'
        });
    });
    
    // Left: Debug Skills Card
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.5, y: 2.7, w: 3.2, h: 1.1,
        fill: { color: 'FFFFFF' },
        shadow: { type: 'outer', blur: 2, offset: 1, angle: 45, color: '000000', opacity: 0.08 },
        rectRadius: 0.08
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 2.7, w: 3.2, h: 0.06,
        fill: { color: SECONDARY }
    });
    slide.addText('🐛 Debug Skills', {
        x: 0.65, y: 2.85, w: 2, h: 0.35,
        fontSize: 12, bold: true, color: SECONDARY
    });
    const debugSkills = [
        { name: 'DS Log Dump', desc: 'BattleID → 自动拉取日志' },
        { name: 'Log Split', desc: '按时间戳智能切分，每份<10MB' }
    ];
    debugSkills.forEach((s, i) => {
        slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: 0.65, y: 3.25 + i * 0.32, w: 1.1, h: 0.25,
            fill: { color: SECONDARY_LIGHT }, rectRadius: 0.03
        });
        slide.addText(s.name, {
            x: 0.65, y: 3.25 + i * 0.32, w: 1.1, h: 0.25,
            fontSize: 8, bold: true, color: SECONDARY, align: 'center', valign: 'middle'
        });
        slide.addText(s.desc, {
            x: 1.8, y: 3.25 + i * 0.32, w: 1.8, h: 0.25,
            fontSize: 8, color: GRAY, valign: 'middle'
        });
    });
    
    // Warning Box
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 3.95, w: 3.2, h: 0.85,
        fill: { color: 'fff5f5' }
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 3.95, w: 0.06, h: 0.85,
        fill: { color: DANGER }
    });
    slide.addText('⚠️ 提效了，但人工介入仍多', {
        x: 0.65, y: 4.0, w: 3, h: 0.3,
        fontSize: 9, bold: true, color: DANGER
    });
    slide.addText('• Dev: API 混淆 (GetOwningPawn vs GetSelfActor)\n• Debug: 误判正常机制为异常', {
        x: 0.65, y: 4.3, w: 3, h: 0.45,
        fontSize: 8, color: GRAY
    });
    
    // Right: Architecture Diagram
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 3.9, y: 1.0, w: 2.8, h: 2.8,
        fill: { color: 'FFFFFF' },
        shadow: { type: 'outer', blur: 2, offset: 1, angle: 45, color: '000000', opacity: 0.08 },
        rectRadius: 0.08
    });
    slide.addText('架构层次', {
        x: 3.9, y: 1.1, w: 2.8, h: 0.35,
        fontSize: 11, bold: true, color: DARK, align: 'center'
    });
    
    // Dev Skills box
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 4.1, y: 1.55, w: 1.1, h: 0.7,
        fill: { color: PRIMARY_LIGHT }, line: { color: '90caf9', width: 1 }, rectRadius: 0.05
    });
    slide.addText('🔧 Dev Skills\n代码生成、模板', {
        x: 4.1, y: 1.55, w: 1.1, h: 0.7,
        fontSize: 8, color: PRIMARY, align: 'center', valign: 'middle'
    });
    
    // Debug Skills box
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 5.4, y: 1.55, w: 1.1, h: 0.7,
        fill: { color: SECONDARY_LIGHT }, line: { color: 'ffcc80', width: 1 }, rectRadius: 0.05
    });
    slide.addText('🐛 Debug Skills\n日志拉取、切分', {
        x: 5.4, y: 1.55, w: 1.1, h: 0.7,
        fontSize: 8, color: SECONDARY, align: 'center', valign: 'middle'
    });
    
    // Arrow
    slide.addText('▼ 叠加', {
        x: 3.9, y: 2.35, w: 2.8, h: 0.3,
        fontSize: 10, color: GRAY, align: 'center'
    });
    
    // Base Agent box
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 4.1, y: 2.7, w: 2.4, h: 0.7,
        fill: { color: PURPLE_LIGHT }, line: { color: 'ce93d8', width: 1 }, rectRadius: 0.05
    });
    slide.addText('🧠 Base Agent\n通用大模型能力', {
        x: 4.1, y: 2.7, w: 2.4, h: 0.7,
        fontSize: 9, color: PURPLE, align: 'center', valign: 'middle'
    });
    
    // Insight Box
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 3.9, y: 3.95, w: 2.8, h: 0.85,
        fill: { color: SUCCESS_LIGHT }
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 3.9, y: 3.95, w: 0.06, h: 0.85,
        fill: { color: SUCCESS }
    });
    slide.addText('💡 核心洞察', {
        x: 4.05, y: 4.0, w: 2.5, h: 0.25,
        fontSize: 9, bold: true, color: SUCCESS
    });
    slide.addText('Skill 解决了"怎么做"，但 Agent 仍缺少"知道什么" → 需要引入知识库', {
        x: 4.05, y: 4.25, w: 2.5, h: 0.5,
        fontSize: 8, color: '444444', italic: true
    });
    
    // Far right: Summary table
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 6.9, y: 1.0, w: 2.9, h: 3.8,
        fill: { color: 'FFFFFF' },
        shadow: { type: 'outer', blur: 2, offset: 1, angle: 45, color: '000000', opacity: 0.08 },
        rectRadius: 0.08
    });
    slide.addText('痛点 → 解决', {
        x: 6.9, y: 1.1, w: 2.9, h: 0.35,
        fontSize: 11, bold: true, color: DARK, align: 'center'
    });
    
    const painPoints = [
        { pain: '脚本生成空壳代码', solve: 'GAS-AbleTask 多套模板' },
        { pain: '蓝图修改受限', solve: 'Lua + 配置 SOP 指导' },
        { pain: '手动拉取日志繁琐', solve: 'DS Log Dump 全自动' },
        { pain: '日志太大超限制', solve: 'Log Split 智能切分' }
    ];
    painPoints.forEach((p, i) => {
        slide.addText('❌ ' + p.pain, {
            x: 7.0, y: 1.55 + i * 0.75, w: 2.7, h: 0.3,
            fontSize: 8, color: DANGER
        });
        slide.addText('✅ ' + p.solve, {
            x: 7.0, y: 1.85 + i * 0.75, w: 2.7, h: 0.3,
            fontSize: 8, color: SUCCESS
        });
    });
}

function createKnowledgeSlide(pptx) {
    const slide = pptx.addSlide();
    slide.background = { color: LIGHT_BG };
    
    // Header
    slide.addText('知识库设计：从"能做"到"做对"', {
        x: 0.5, y: 0.3, w: 6, h: 0.5,
        fontSize: 22, bold: true, color: DARK
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 0.75, w: 0.8, h: 0.07,
        fill: { color: SUCCESS }
    });
    slide.addText('Skill 教会了 Agent "怎么做"，知识库告诉它"知道什么"', {
        x: 0.5, y: 0.9, w: 6, h: 0.3,
        fontSize: 10, color: GRAY, italic: true
    });
    
    // Left: Compare table
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.5, y: 1.3, w: 4.5, h: 1.5,
        fill: { color: 'FFFFFF' },
        shadow: { type: 'outer', blur: 2, offset: 1, angle: 45, color: '000000', opacity: 0.08 },
        rectRadius: 0.08
    });
    slide.addText('📊 检索方案对比', {
        x: 0.65, y: 1.4, w: 2, h: 0.3,
        fontSize: 11, bold: true, color: SUCCESS
    });
    
    // Table header
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.65, y: 1.75, w: 4.2, h: 0.3,
        fill: { color: 'f5f5f5' }
    });
    slide.addText('方案', { x: 0.65, y: 1.75, w: 1.4, h: 0.3, fontSize: 9, bold: true, color: DARK });
    slide.addText('精度', { x: 2.05, y: 1.75, w: 0.8, h: 0.3, fontSize: 9, bold: true, color: DARK });
    slide.addText('局限', { x: 2.85, y: 1.75, w: 2, h: 0.3, fontSize: 9, bold: true, color: DARK });
    
    // Table rows
    const rows = [
        { name: '源码搜索', level: '低', levelColor: DANGER, limit: '量大，看不出意图' },
        { name: 'Codebase Search', level: '中', levelColor: SECONDARY, limit: '搜不到"怎么用"' },
        { name: 'Knowledge', level: '高', levelColor: SUCCESS, limit: '精准、可迭代', highlight: true }
    ];
    rows.forEach((r, i) => {
        const y = 2.1 + i * 0.3;
        if (r.highlight) {
            slide.addShape(pptx.shapes.RECTANGLE, {
                x: 0.65, y: y, w: 4.2, h: 0.3,
                fill: { color: SUCCESS_LIGHT }
            });
        }
        slide.addText(r.name, { x: 0.65, y: y, w: 1.4, h: 0.3, fontSize: 8, color: r.highlight ? SUCCESS : DARK, bold: r.highlight });
        slide.addText(r.level, { x: 2.05, y: y, w: 0.8, h: 0.3, fontSize: 8, color: r.levelColor, bold: true });
        slide.addText(r.limit, { x: 2.85, y: y, w: 2, h: 0.3, fontSize: 8, color: r.highlight ? SUCCESS : GRAY });
    });
    
    // Knowledge value
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.5, y: 3.0, w: 4.5, h: 1.2,
        fill: { color: 'FFFFFF' },
        shadow: { type: 'outer', blur: 2, offset: 1, angle: 45, color: '000000', opacity: 0.08 },
        rectRadius: 0.08
    });
    slide.addText('✅ 知识库能补充什么？', {
        x: 0.65, y: 3.1, w: 3, h: 0.3,
        fontSize: 11, bold: true, color: SUCCESS
    });
    const values = [
        'API 检索 → 怎么用、何时用',
        '最佳实践 → 参考实现',
        '经验沉淀 → Debug 案例复用'
    ];
    values.forEach((v, i) => {
        slide.addText('• ' + v, {
            x: 0.75, y: 3.45 + i * 0.25, w: 4, h: 0.25,
            fontSize: 9, color: '444444'
        });
    });
    
    // Design thinking
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 4.35, w: 4.5, h: 0.65,
        fill: { color: SUCCESS_LIGHT }
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 4.35, w: 0.06, h: 0.65,
        fill: { color: SUCCESS }
    });
    slide.addText('💡 设计思考：不放代码（Agent 本来就能搜），放 Agent 的盲区', {
        x: 0.65, y: 4.35, w: 4.2, h: 0.65,
        fontSize: 9, color: SUCCESS, valign: 'middle'
    });
    
    // Right: Architecture
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 5.2, y: 1.3, w: 4.5, h: 3.7,
        fill: { color: 'FFFFFF' },
        shadow: { type: 'outer', blur: 2, offset: 1, angle: 45, color: '000000', opacity: 0.08 },
        rectRadius: 0.08
    });
    slide.addText('📁 分层架构设计', {
        x: 5.35, y: 1.4, w: 3, h: 0.35,
        fontSize: 11, bold: true, color: DARK
    });
    
    // Root
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 5.5, y: 1.85, w: 1.6, h: 0.35,
        fill: { color: SUCCESS }, rectRadius: 0.03
    });
    slide.addText('_index.md 入口', {
        x: 5.5, y: 1.85, w: 1.6, h: 0.35,
        fontSize: 9, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle'
    });
    
    // Branches
    const branches = [
        { name: 'domain_context', desc: '战斗系统背景', y: 2.35 },
        { name: 'domain_agreements', desc: '开发通用约定', y: 2.7 },
        { name: 'Concepts/', desc: '架构设计文档', y: 3.05 }
    ];
    branches.forEach(b => {
        slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: 5.8, y: b.y, w: 1.5, h: 0.3,
            fill: { color: PRIMARY_LIGHT }, rectRadius: 0.03
        });
        slide.addText(b.name, {
            x: 5.8, y: b.y, w: 1.5, h: 0.3,
            fontSize: 8, bold: true, color: PRIMARY, align: 'center', valign: 'middle'
        });
        slide.addText(b.desc, {
            x: 7.4, y: b.y, w: 2, h: 0.3,
            fontSize: 8, color: GRAY, valign: 'middle'
        });
    });
    
    // Sub modules
    const modules = ['Core/', 'Effect/', 'Targeting/', 'Cue/', 'Equipment/'];
    modules.forEach((m, i) => {
        slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: 6.1 + (i % 3) * 1.1, y: 3.5 + Math.floor(i / 3) * 0.35, w: 1, h: 0.28,
            fill: { color: SECONDARY_LIGHT }, rectRadius: 0.03
        });
        slide.addText(m, {
            x: 6.1 + (i % 3) * 1.1, y: 3.5 + Math.floor(i / 3) * 0.35, w: 1, h: 0.28,
            fontSize: 7, color: SECONDARY, align: 'center', valign: 'middle'
        });
    });
    
    // Debug folder
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 5.8, y: 4.25, w: 1.5, h: 0.3,
        fill: { color: 'ffebee' }, rectRadius: 0.03
    });
    slide.addText('Debug/', {
        x: 5.8, y: 4.25, w: 1.5, h: 0.3,
        fontSize: 8, bold: true, color: DANGER, align: 'center', valign: 'middle'
    });
    slide.addText('案例+方法论', {
        x: 7.4, y: 4.25, w: 2, h: 0.3,
        fontSize: 8, color: GRAY, valign: 'middle'
    });
    
    // Module structure
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 5.5, y: 4.65, w: 4, h: 0.35,
        fill: { color: 'f5f5f5' }
    });
    slide.addText('📦 模块结构: API/ (JSON) + Logs/ (JSON) + impl.json', {
        x: 5.5, y: 4.65, w: 4, h: 0.35,
        fontSize: 8, color: GRAY, valign: 'middle'
    });
}

module.exports = { createSkillSlide, createKnowledgeSlide };
