// slides-part3.js - Dev Compare, Debug Compare, SubAgent, Future, Thanks slides
const PRIMARY = '1a73e8';
const PRIMARY_LIGHT = 'e8f0fe';
const SECONDARY = 'ff9800';
const SECONDARY_LIGHT = 'fff3e0';
const SUCCESS = '4caf50';
const SUCCESS_LIGHT = 'e8f5e9';
const DANGER = 'f44336';
const DANGER_LIGHT = 'ffebee';
const DARK = '1a1a2e';
const GRAY = '666666';
const LIGHT_BG = 'f8f9fa';
const PURPLE = '7b1fa2';
const PURPLE_LIGHT = 'f3e5f5';
const CYAN = '00bcd4';
const CYAN_LIGHT = 'e0f7fa';

function createDevCompareSlide(pptx) {
    const slide = pptx.addSlide();
    slide.background = { color: LIGHT_BG };
    
    // Header
    slide.addText('Dev Agent 实战对比', {
        x: 0.5, y: 0.3, w: 6, h: 0.5,
        fontSize: 22, bold: true, color: DARK
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 0.75, w: 0.8, h: 0.07,
        fill: { color: PRIMARY }
    });
    
    // Left: Default Agent (Bad)
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.5, y: 1.0, w: 4.5, h: 2.8,
        fill: { color: 'FFFFFF' },
        shadow: { type: 'outer', blur: 2, offset: 1, angle: 45, color: '000000', opacity: 0.08 },
        rectRadius: 0.08
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 1.0, w: 4.5, h: 0.06,
        fill: { color: DANGER }
    });
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.65, y: 1.15, w: 1.4, h: 0.3,
        fill: { color: DANGER_LIGHT }, rectRadius: 0.03
    });
    slide.addText('❌ Default Agent', {
        x: 0.65, y: 1.15, w: 1.4, h: 0.3,
        fontSize: 9, bold: true, color: DANGER, align: 'center', valign: 'middle'
    });
    slide.addText('无知识库支持', {
        x: 2.1, y: 1.15, w: 1.5, h: 0.3,
        fontSize: 11, bold: true, color: DARK, valign: 'middle'
    });
    
    const badSteps = [
        '搜索代码找到 GetAbilitySystemComponent',
        '直接使用 → 编译报错（这是 Actor 成员函数）',
        '再搜 GetSelf / GetSelfActor → 还是错',
        '多次试错，效率低'
    ];
    badSteps.forEach((s, i) => {
        slide.addShape(pptx.shapes.OVAL, {
            x: 0.7, y: 1.6 + i * 0.45, w: 0.25, h: 0.25,
            fill: { color: 'e0e0e0' }
        });
        slide.addText(String(i + 1), {
            x: 0.7, y: 1.6 + i * 0.45, w: 0.25, h: 0.25,
            fontSize: 8, bold: true, color: GRAY, align: 'center', valign: 'middle'
        });
        slide.addText(s, {
            x: 1.0, y: 1.6 + i * 0.45, w: 3.8, h: 0.4,
            fontSize: 9, color: s.includes('编译报错') || s.includes('还是错') ? DANGER : '555555', valign: 'middle'
        });
    });
    
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.65, y: 3.45, w: 4.2, h: 0.3,
        fill: { color: DANGER_LIGHT }
    });
    slide.addText('⚠️ 无开发模板，遗漏蓝图配置步骤', {
        x: 0.65, y: 3.45, w: 4.2, h: 0.3,
        fontSize: 8, color: DANGER, valign: 'middle'
    });
    
    // Right: Dev Agent (Good)
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 5.2, y: 1.0, w: 4.5, h: 2.8,
        fill: { color: 'FFFFFF' },
        shadow: { type: 'outer', blur: 2, offset: 1, angle: 45, color: '000000', opacity: 0.08 },
        rectRadius: 0.08
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 5.2, y: 1.0, w: 4.5, h: 0.06,
        fill: { color: SUCCESS }
    });
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 5.35, y: 1.15, w: 1.2, h: 0.3,
        fill: { color: SUCCESS_LIGHT }, rectRadius: 0.03
    });
    slide.addText('✅ Dev Agent', {
        x: 5.35, y: 1.15, w: 1.2, h: 0.3,
        fontSize: 9, bold: true, color: SUCCESS, align: 'center', valign: 'middle'
    });
    slide.addText('知识库 + Skill', {
        x: 6.6, y: 1.15, w: 1.5, h: 0.3,
        fontSize: 11, bold: true, color: DARK, valign: 'middle'
    });
    
    const goodSteps = [
        '检索知识库获取正确 API',
        '返回：用 GetASCFromActor',
        '一次正确，无编译错误',
        'Skill 指导完整流程'
    ];
    goodSteps.forEach((s, i) => {
        slide.addShape(pptx.shapes.OVAL, {
            x: 5.4, y: 1.6 + i * 0.45, w: 0.25, h: 0.25,
            fill: { color: 'c8e6c9' }
        });
        slide.addText(String(i + 1), {
            x: 5.4, y: 1.6 + i * 0.45, w: 0.25, h: 0.25,
            fontSize: 8, bold: true, color: SUCCESS, align: 'center', valign: 'middle'
        });
        slide.addText(s, {
            x: 5.7, y: 1.6 + i * 0.45, w: 3.8, h: 0.4,
            fontSize: 9, color: s.includes('一次正确') ? SUCCESS : '555555', valign: 'middle'
        });
    });
    
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 5.35, y: 3.45, w: 4.2, h: 0.3,
        fill: { color: SUCCESS_LIGHT }
    });
    slide.addText('✅ 框架自动生成，提示蓝图配置', {
        x: 5.35, y: 3.45, w: 4.2, h: 0.3,
        fontSize: 8, color: SUCCESS, valign: 'middle'
    });
    
    // Summary Table
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.5, y: 3.95, w: 9.2, h: 1.0,
        fill: { color: 'FFFFFF' },
        shadow: { type: 'outer', blur: 2, offset: 1, angle: 45, color: '000000', opacity: 0.08 },
        rectRadius: 0.08
    });
    slide.addText('📋 关键差异总结', {
        x: 0.65, y: 4.0, w: 2, h: 0.3,
        fontSize: 10, bold: true, color: DARK
    });
    
    // Table
    const cols = [{ w: 1.5, x: 0.7 }, { w: 3.2, x: 2.2 }, { w: 3.5, x: 5.5 }];
    slide.addShape(pptx.shapes.RECTANGLE, { x: 0.65, y: 4.35, w: 8.9, h: 0.25, fill: { color: 'f5f5f5' } });
    slide.addText('维度', { x: cols[0].x, y: 4.35, w: cols[0].w, h: 0.25, fontSize: 8, bold: true, color: DARK });
    slide.addText('Default Agent', { x: cols[1].x, y: 4.35, w: cols[1].w, h: 0.25, fontSize: 8, bold: true, color: DARK });
    slide.addText('Dev Agent', { x: cols[2].x, y: 4.35, w: cols[2].w, h: 0.25, fontSize: 8, bold: true, color: DARK });
    
    const tableRows = [
        ['API 检索', '猜测 → 多次试错', '知识库 → 一次正确'],
        ['开发模板', '无 → 从零开始', 'Skill → 框架自动生成']
    ];
    tableRows.forEach((r, i) => {
        const y = 4.6 + i * 0.2;
        slide.addText(r[0], { x: cols[0].x, y: y, w: cols[0].w, h: 0.2, fontSize: 8, color: DARK });
        slide.addText(r[1], { x: cols[1].x, y: y, w: cols[1].w, h: 0.2, fontSize: 8, color: DANGER });
        slide.addText(r[2], { x: cols[2].x, y: y, w: cols[2].w, h: 0.2, fontSize: 8, color: SUCCESS, bold: true });
    });
}

function createDebugCompareSlide(pptx) {
    const slide = pptx.addSlide();
    slide.background = { color: LIGHT_BG };
    
    // Header
    slide.addText('Debug Agent 三方对比', {
        x: 0.5, y: 0.3, w: 6, h: 0.5,
        fontSize: 22, bold: true, color: DARK
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 0.75, w: 0.8, h: 0.07,
        fill: { color: SECONDARY }
    });
    
    // Three cards
    const cards = [
        { title: 'TAPD AI', badge: '🔴', color: DANGER, items: ['❌ 无法获取日志', '❌ 只读 Bug 描述', '❌ 只能给通用建议'] },
        { title: 'Default Agent', badge: '🟡', color: SECONDARY, items: ['⚠️ 需手动提供日志', '⚠️ 大文件读不了', '⚠️ 无固定分析流程'] },
        { title: 'Debug Agent', badge: '🟢', color: SUCCESS, items: ['✅ 自动拉取日志', '✅ 智能切分 <10MB', '✅ Debug总纲规范'] }
    ];
    
    cards.forEach((card, i) => {
        const x = 0.5 + i * 3.2;
        slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: x, y: 1.0, w: 3, h: 1.6,
            fill: { color: 'FFFFFF' },
            shadow: { type: 'outer', blur: 2, offset: 1, angle: 45, color: '000000', opacity: 0.08 },
            rectRadius: 0.08
        });
        slide.addShape(pptx.shapes.RECTANGLE, {
            x: x, y: 1.0, w: 3, h: 0.06,
            fill: { color: card.color }
        });
        slide.addText(card.badge + ' ' + card.title, {
            x: x + 0.15, y: 1.15, w: 2.7, h: 0.35,
            fontSize: 11, bold: true, color: DARK
        });
        card.items.forEach((item, j) => {
            slide.addText(item, {
                x: x + 0.15, y: 1.55 + j * 0.35, w: 2.7, h: 0.3,
                fontSize: 9, color: item.startsWith('❌') ? DANGER : (item.startsWith('⚠️') ? SECONDARY : SUCCESS)
            });
        });
    });
    
    // Workflow
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.5, y: 2.75, w: 9.2, h: 1.3,
        fill: { color: 'FFFFFF' },
        shadow: { type: 'outer', blur: 2, offset: 1, angle: 45, color: '000000', opacity: 0.08 },
        rectRadius: 0.08
    });
    slide.addText('🔄 Debug Agent 完整工作流', {
        x: 0.65, y: 2.85, w: 4, h: 0.3,
        fontSize: 11, bold: true, color: DARK
    });
    
    const steps = [
        { name: 'ds_log_dump', desc: '输入 BattleID\n自动从智研拉取', color: PRIMARY_LIGHT, textColor: PRIMARY },
        { name: 'log_split', desc: '按时间/角色切分\n每份 <10MB', color: SUCCESS_LIGHT, textColor: SUCCESS },
        { name: 'Debug总纲', desc: '固定分析流程\n精准定位问题', color: SECONDARY_LIGHT, textColor: SECONDARY },
        { name: '输出报告', desc: '分析文档\n关键日志行号', color: PURPLE_LIGHT, textColor: PURPLE }
    ];
    
    steps.forEach((step, i) => {
        const x = 0.8 + i * 2.3;
        slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: x, y: 3.2, w: 1.8, h: 0.75,
            fill: { color: step.color }, rectRadius: 0.05
        });
        slide.addText(step.name, {
            x: x, y: 3.25, w: 1.8, h: 0.3,
            fontSize: 9, bold: true, color: step.textColor, align: 'center'
        });
        slide.addText(step.desc, {
            x: x, y: 3.55, w: 1.8, h: 0.35,
            fontSize: 7, color: GRAY, align: 'center'
        });
        if (i < 3) {
            slide.addText('→', {
                x: x + 1.85, y: 3.4, w: 0.4, h: 0.4,
                fontSize: 14, color: 'cccccc', align: 'center'
            });
        }
    });
    
    // Summary
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 4.2, w: 4.5, h: 0.8,
        fill: { color: DANGER_LIGHT }
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 4.2, w: 0.06, h: 0.8,
        fill: { color: DANGER }
    });
    slide.addText('❌ Default Agent 的问题', {
        x: 0.65, y: 4.25, w: 4, h: 0.25,
        fontSize: 9, bold: true, color: DANGER
    });
    slide.addText('• 不知道分析谁的日志\n• 分析无关时间段\n• 不给关键日志引用', {
        x: 0.65, y: 4.5, w: 4, h: 0.45,
        fontSize: 8, color: GRAY
    });
    
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 5.2, y: 4.2, w: 4.5, h: 0.8,
        fill: { color: SUCCESS_LIGHT }
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 5.2, y: 4.2, w: 0.06, h: 0.8,
        fill: { color: SUCCESS }
    });
    slide.addText('✅ Debug Agent 的解决', {
        x: 5.35, y: 4.25, w: 4, h: 0.25,
        fontSize: 9, bold: true, color: SUCCESS
    });
    slide.addText('• 按 BattleID 自动过滤\n• 按时间戳智能切分\n• 输出文档 + 行号', {
        x: 5.35, y: 4.5, w: 4, h: 0.45,
        fontSize: 8, color: GRAY
    });
}

function createSubAgentSlide(pptx) {
    const slide = pptx.addSlide();
    slide.background = { color: LIGHT_BG };
    
    // Header
    slide.addText('SubAgent 架构：工作流封装', {
        x: 0.5, y: 0.25, w: 6, h: 0.45,
        fontSize: 20, bold: true, color: DARK
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 0.65, w: 0.8, h: 0.06,
        fill: { color: PURPLE }
    });
    slide.addText('从手动编排 → 自动编排：将 Skills 封装为专用智能体', {
        x: 0.5, y: 0.75, w: 6, h: 0.25,
        fontSize: 9, color: GRAY
    });
    
    // Why SubAgent
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.5, y: 1.05, w: 4.3, h: 1.0,
        fill: { color: 'FFFFFF' },
        shadow: { type: 'outer', blur: 2, offset: 1, angle: 45, color: '000000', opacity: 0.08 },
        rectRadius: 0.08
    });
    slide.addText('🤔 为什么要封装 SubAgent？', {
        x: 0.65, y: 1.1, w: 4, h: 0.25,
        fontSize: 10, bold: true, color: PURPLE
    });
    
    // Before/After boxes
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.65, y: 1.4, w: 1.95, h: 0.55,
        fill: { color: DANGER_LIGHT }
    });
    slide.addText('❌ Before\n手动选择 Skill，容易遗漏', {
        x: 0.65, y: 1.4, w: 1.95, h: 0.55,
        fontSize: 8, color: DANGER, valign: 'middle'
    });
    
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 2.7, y: 1.4, w: 1.95, h: 0.55,
        fill: { color: SUCCESS_LIGHT }
    });
    slide.addText('✅ After\nSubAgent 自动编排完整流程', {
        x: 2.7, y: 1.4, w: 1.95, h: 0.55,
        fontSize: 8, color: SUCCESS, valign: 'middle'
    });
    
    // Two agent cards
    // Dev Agent
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.5, y: 2.15, w: 2.1, h: 1.85,
        fill: { color: 'FFFFFF' },
        shadow: { type: 'outer', blur: 2, offset: 1, angle: 45, color: '000000', opacity: 0.08 },
        rectRadius: 0.08
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 2.15, w: 2.1, h: 0.05,
        fill: { color: PRIMARY }
    });
    slide.addText('🔧 战斗开发 Agent', {
        x: 0.6, y: 2.25, w: 1.9, h: 0.25,
        fontSize: 9, bold: true, color: PRIMARY
    });
    slide.addText('触发', { x: 0.6, y: 2.5, w: 0.5, h: 0.2, fontSize: 7, color: '999999' });
    slide.addText('Task/Condition/Status 开发', { x: 0.6, y: 2.7, w: 1.9, h: 0.2, fontSize: 8, color: '555555' });
    slide.addText('工作流', { x: 0.6, y: 2.95, w: 0.5, h: 0.2, fontSize: 7, color: '999999' });
    slide.addText('识别→检索→生成代码', { x: 0.6, y: 3.15, w: 1.9, h: 0.2, fontSize: 8, color: '555555' });
    slide.addText('Skills', { x: 0.6, y: 3.4, w: 0.5, h: 0.2, fontSize: 7, color: '999999' });
    slide.addText('GAS-AbleTask Condition Status', { x: 0.6, y: 3.6, w: 1.9, h: 0.25, fontSize: 7, color: PRIMARY });
    
    // Debug Agent
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 2.7, y: 2.15, w: 2.1, h: 1.85,
        fill: { color: 'FFFFFF' },
        shadow: { type: 'outer', blur: 2, offset: 1, angle: 45, color: '000000', opacity: 0.08 },
        rectRadius: 0.08
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 2.7, y: 2.15, w: 2.1, h: 0.05,
        fill: { color: SECONDARY }
    });
    slide.addText('🐛 战斗 Debug Agent', {
        x: 2.8, y: 2.25, w: 1.9, h: 0.25,
        fontSize: 9, bold: true, color: SECONDARY
    });
    slide.addText('触发', { x: 2.8, y: 2.5, w: 0.5, h: 0.2, fontSize: 7, color: '999999' });
    slide.addText('Bug 排查、崩溃、性能分析', { x: 2.8, y: 2.7, w: 1.9, h: 0.2, fontSize: 8, color: '555555' });
    slide.addText('工作流', { x: 2.8, y: 2.95, w: 0.5, h: 0.2, fontSize: 7, color: '999999' });
    slide.addText('拉取→切分→按总纲分析', { x: 2.8, y: 3.15, w: 1.9, h: 0.2, fontSize: 8, color: '555555' });
    slide.addText('Skills', { x: 2.8, y: 3.4, w: 0.5, h: 0.2, fontSize: 7, color: '999999' });
    slide.addText('DS Log Dump  Log Split', { x: 2.8, y: 3.6, w: 1.9, h: 0.25, fontSize: 7, color: SECONDARY });
    
    // Architecture diagram
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 5.0, y: 1.05, w: 4.7, h: 2.95,
        fill: { color: 'FFFFFF' },
        shadow: { type: 'outer', blur: 2, offset: 1, angle: 45, color: '000000', opacity: 0.08 },
        rectRadius: 0.08
    });
    slide.addText('🏗️ 系统架构', {
        x: 5.0, y: 1.1, w: 4.7, h: 0.3,
        fontSize: 10, bold: true, color: DARK, align: 'center'
    });
    
    // User
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 5.9, y: 1.45, w: 2.9, h: 0.35,
        fill: { color: 'f5f5f5' }, rectRadius: 0.03
    });
    slide.addText('👤 用户需求', {
        x: 5.9, y: 1.45, w: 2.9, h: 0.35,
        fontSize: 9, color: GRAY, align: 'center', valign: 'middle'
    });
    
    slide.addText('▼', { x: 5.9, y: 1.8, w: 2.9, h: 0.2, fontSize: 10, color: 'cccccc', align: 'center' });
    
    // Main Agent
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 5.9, y: 2.0, w: 2.9, h: 0.4,
        fill: { color: PURPLE_LIGHT }, line: { color: 'ce93d8', width: 1 }, rectRadius: 0.03
    });
    slide.addText('🧠 Main Agent (路由)', {
        x: 5.9, y: 2.0, w: 2.9, h: 0.4,
        fontSize: 9, bold: true, color: PURPLE, align: 'center', valign: 'middle'
    });
    
    slide.addText('▼', { x: 5.9, y: 2.4, w: 2.9, h: 0.2, fontSize: 10, color: 'cccccc', align: 'center' });
    
    // Two agents
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 5.5, y: 2.6, w: 1.5, h: 0.4,
        fill: { color: PRIMARY_LIGHT }, line: { color: '90caf9', width: 1 }, rectRadius: 0.03
    });
    slide.addText('🔧 战斗开发', {
        x: 5.5, y: 2.6, w: 1.5, h: 0.4,
        fontSize: 8, color: PRIMARY, align: 'center', valign: 'middle'
    });
    
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 7.7, y: 2.6, w: 1.5, h: 0.4,
        fill: { color: SECONDARY_LIGHT }, line: { color: 'ffcc80', width: 1 }, rectRadius: 0.03
    });
    slide.addText('🐛 战斗Debug', {
        x: 7.7, y: 2.6, w: 1.5, h: 0.4,
        fontSize: 8, color: SECONDARY, align: 'center', valign: 'middle'
    });
    
    slide.addText('▼', { x: 5.9, y: 3.0, w: 2.9, h: 0.2, fontSize: 10, color: 'cccccc', align: 'center' });
    
    // Knowledge Base
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 5.9, y: 3.2, w: 2.9, h: 0.4,
        fill: { color: SUCCESS_LIGHT }, line: { color: 'a5d6a7', width: 1 }, rectRadius: 0.03
    });
    slide.addText('📚 Knowledge Base', {
        x: 5.9, y: 3.2, w: 2.9, h: 0.4,
        fontSize: 9, bold: true, color: SUCCESS, align: 'center', valign: 'middle'
    });
    
    // Value bar
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 4.15, w: 9.2, h: 0.45,
        fill: { color: PURPLE_LIGHT }
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 4.15, w: 0.06, h: 0.45,
        fill: { color: PURPLE }
    });
    slide.addText('💡 核心价值：用户零门槛，SubAgent 负责编排 Skills + 访问知识库', {
        x: 0.65, y: 4.15, w: 9, h: 0.45,
        fontSize: 10, bold: true, color: PURPLE, valign: 'middle'
    });
}

function createFutureSlide(pptx) {
    const slide = pptx.addSlide();
    slide.background = { color: LIGHT_BG };
    
    // Header
    slide.addText('未来展望：自动化维护与推广', {
        x: 0.5, y: 0.3, w: 6, h: 0.5,
        fontSize: 22, bold: true, color: DARK
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 0.75, w: 0.8, h: 0.07,
        fill: { color: CYAN }
    });
    
    // Maintainer section
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.5, y: 1.0, w: 4.5, h: 2.0,
        fill: { color: 'FFFFFF' },
        shadow: { type: 'outer', blur: 2, offset: 1, angle: 45, color: '000000', opacity: 0.08 },
        rectRadius: 0.08
    });
    slide.addText('🔧 Maintainer 自动维护', {
        x: 0.65, y: 1.1, w: 4, h: 0.3,
        fontSize: 11, bold: true, color: PRIMARY
    });
    
    // Workflow steps
    const maintainerSteps = [
        { icon: '⚙️', name: '配置路径', desc: 'watch_paths', color: PRIMARY_LIGHT },
        { icon: '🔍', name: '自动抽取', desc: '扫描 cpp/lua', color: SUCCESS_LIGHT },
        { icon: '📚', name: '生成文档', desc: '按模块分类', color: SECONDARY_LIGHT }
    ];
    maintainerSteps.forEach((s, i) => {
        const x = 0.7 + i * 1.4;
        slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: x, y: 1.5, w: 1.2, h: 0.8,
            fill: { color: s.color }, rectRadius: 0.05
        });
        slide.addText(s.icon, { x: x, y: 1.52, w: 1.2, h: 0.3, fontSize: 16, align: 'center' });
        slide.addText(s.name, { x: x, y: 1.8, w: 1.2, h: 0.25, fontSize: 8, bold: true, color: DARK, align: 'center' });
        slide.addText(s.desc, { x: x, y: 2.0, w: 1.2, h: 0.2, fontSize: 7, color: GRAY, align: 'center' });
    });
    
    slide.addText('• 配置关注的代码目录\n• AST 解析 API 结构\n• 自动生成/更新 impl.json', {
        x: 0.7, y: 2.4, w: 4, h: 0.5,
        fontSize: 8, color: GRAY
    });
    
    // Quick setup
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.5, y: 3.15, w: 4.5, h: 1.0,
        fill: { color: 'FFFFFF' },
        shadow: { type: 'outer', blur: 2, offset: 1, angle: 45, color: '000000', opacity: 0.08 },
        rectRadius: 0.08
    });
    slide.addText('🚀 一键配置推广', {
        x: 0.65, y: 3.2, w: 4, h: 0.3,
        fontSize: 11, bold: true, color: SUCCESS
    });
    slide.addText('其他团队（3C、AI）想接入？', {
        x: 0.65, y: 3.45, w: 4, h: 0.2,
        fontSize: 9, color: GRAY
    });
    
    const setupSteps = ['配置路径', '运行 Maintainer', '知识库生成', '套用模板'];
    setupSteps.forEach((s, i) => {
        slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: 0.7 + i * 1.05, y: 3.7, w: 0.95, h: 0.35,
            fill: { color: [PRIMARY_LIGHT, SUCCESS_LIGHT, SECONDARY_LIGHT, PURPLE_LIGHT][i] },
            rectRadius: 0.03
        });
        slide.addText(s, {
            x: 0.7 + i * 1.05, y: 3.7, w: 0.95, h: 0.35,
            fontSize: 7, color: [PRIMARY, SUCCESS, SECONDARY, PURPLE][i], align: 'center', valign: 'middle'
        });
        if (i < 3) slide.addText('→', { x: 0.7 + i * 1.05 + 0.95, y: 3.7, w: 0.1, h: 0.35, fontSize: 8, color: 'cccccc' });
    });
    
    // Iteration loop
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 5.2, y: 1.0, w: 4.5, h: 1.3,
        fill: { color: 'FFFFFF' },
        shadow: { type: 'outer', blur: 2, offset: 1, angle: 45, color: '000000', opacity: 0.08 },
        rectRadius: 0.08
    });
    slide.addText('🔄 持续迭代闭环', {
        x: 5.35, y: 1.1, w: 4, h: 0.3,
        fontSize: 11, bold: true, color: SECONDARY
    });
    
    const loopSteps = [
        { name: '使用 Agent', color: PRIMARY_LIGHT, textColor: PRIMARY },
        { name: '发现问题', color: SECONDARY_LIGHT, textColor: SECONDARY },
        { name: '更新知识库', color: SUCCESS_LIGHT, textColor: SUCCESS }
    ];
    loopSteps.forEach((s, i) => {
        slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: 5.5 + i * 1.4, y: 1.5, w: 1.2, h: 0.4,
            fill: { color: s.color }, rectRadius: 0.03
        });
        slide.addText(s.name, {
            x: 5.5 + i * 1.4, y: 1.5, w: 1.2, h: 0.4,
            fontSize: 8, color: s.textColor, align: 'center', valign: 'middle'
        });
        if (i < 2) slide.addText('→', { x: 5.5 + i * 1.4 + 1.2, y: 1.5, w: 0.2, h: 0.4, fontSize: 10, color: 'cccccc' });
    });
    slide.addText('↩', { x: 9.1, y: 1.5, w: 0.4, h: 0.4, fontSize: 12, color: '999999' });
    slide.addText('核心理念：越用越准，持续进化', {
        x: 5.35, y: 2.0, w: 4, h: 0.2,
        fontSize: 9, color: GRAY, italic: true, align: 'center'
    });
    
    // Summary table
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 5.2, y: 2.45, w: 4.5, h: 1.7,
        fill: { color: 'FFFFFF' },
        shadow: { type: 'outer', blur: 2, offset: 1, angle: 45, color: '000000', opacity: 0.08 },
        rectRadius: 0.08
    });
    slide.addText('📊 推广价值总结', {
        x: 5.35, y: 2.55, w: 4, h: 0.3,
        fontSize: 11, bold: true, color: DARK
    });
    
    // Table
    slide.addShape(pptx.shapes.RECTANGLE, { x: 5.35, y: 2.9, w: 4.2, h: 0.25, fill: { color: 'f5f5f5' } });
    slide.addText('维度', { x: 5.35, y: 2.9, w: 1.2, h: 0.25, fontSize: 8, bold: true, color: DARK });
    slide.addText('现状（战斗）', { x: 6.55, y: 2.9, w: 1.4, h: 0.25, fontSize: 8, bold: true, color: DARK });
    slide.addText('推广后', { x: 7.95, y: 2.9, w: 1.6, h: 0.25, fontSize: 8, bold: true, color: DARK });
    
    const tableData = [
        ['覆盖范围', '战斗系统', '3C、AI、UI 等'],
        ['接入成本', '从零搭建', '配置+一键生成'],
        ['维护方式', '半自动', '全自动'],
        ['SubAgent', '战斗 Dev/Debug', '每模块可复用']
    ];
    tableData.forEach((r, i) => {
        const y = 3.18 + i * 0.23;
        slide.addText(r[0], { x: 5.35, y: y, w: 1.2, h: 0.23, fontSize: 8, color: DARK });
        slide.addText(r[1], { x: 6.55, y: y, w: 1.4, h: 0.23, fontSize: 8, color: GRAY });
        slide.addText(r[2], { x: 7.95, y: y, w: 1.6, h: 0.23, fontSize: 8, color: SUCCESS, bold: true });
    });
}

function createThanksSlide(pptx) {
    const slide = pptx.addSlide();
    slide.background = { color: PRIMARY };
    
    slide.addText('Thanks!', {
        x: 0.5, y: 1.8, w: 9, h: 1,
        fontSize: 52, bold: true, color: 'FFFFFF',
        align: 'center'
    });
    
    slide.addText('Questions?', {
        x: 0.5, y: 2.9, w: 9, h: 0.5,
        fontSize: 20, color: 'FFFFFF', alpha: 90,
        align: 'center'
    });
    
    slide.addText('姚圳 | 元梦之星开发一组 | 游戏客户端开发', {
        x: 0.5, y: 3.8, w: 9, h: 0.4,
        fontSize: 14, color: 'FFFFFF', alpha: 70,
        align: 'center'
    });
}

module.exports = { createDevCompareSlide, createDebugCompareSlide, createSubAgentSlide, createFutureSlide, createThanksSlide };
