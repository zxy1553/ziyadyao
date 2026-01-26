const pptxgen = require('pptxgenjs');
const { createSkillSlide, createKnowledgeSlide } = require('./slides-part2');
const { createDevCompareSlide, createDebugCompareSlide, createSubAgentSlide, createFutureSlide, createThanksSlide } = require('./slides-part3');

// Colors
const PRIMARY = '1a73e8';
const PRIMARY_LIGHT = 'e8f0fe';
const SECONDARY = 'ff9800';
const SUCCESS = '4caf50';
const DANGER = 'f44336';
const DARK = '1a1a2e';
const GRAY = '666666';
const LIGHT_BG = 'f8f9fa';

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';
pptx.author = 'Yao Zhen';
pptx.title = 'Combat Agent System';

// ==================== SLIDE 1: Cover ====================
function createCoverSlide() {
    const slide = pptx.addSlide();
    slide.background = { color: PRIMARY };
    
    slide.addText('战斗智能体系统', {
        x: 0.5, y: 2, w: 9, h: 1,
        fontSize: 44, bold: true, color: 'FFFFFF',
        align: 'center'
    });
    
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 4.2, y: 3.1, w: 1.6, h: 0.08,
        fill: { color: 'FFFFFF' }
    });
    
    slide.addText('从 Skill 到多智能体架构', {
        x: 0.5, y: 3.4, w: 9, h: 0.6,
        fontSize: 20, color: 'FFFFFF', alpha: 90,
        align: 'center'
    });
    
    slide.addText('姚圳 | 元梦之星开发一组 | 2026年1月', {
        x: 0.5, y: 4.5, w: 9, h: 0.4,
        fontSize: 14, color: 'FFFFFF', alpha: 70,
        align: 'center'
    });
}

// ==================== SLIDE 2: Work Stats ====================
function createWorkSlide() {
    const slide = pptx.addSlide();
    slide.background = { color: LIGHT_BG };
    
    // Header
    slide.addText('业务开发工作积累', {
        x: 0.5, y: 0.3, w: 5, h: 0.6,
        fontSize: 28, bold: true, color: DARK
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 0.85, w: 0.8, h: 0.08,
        fill: { color: PRIMARY }
    });
    
    // Stats
    slide.addText('实习期间总工作量 (2025.09-2026.01)', {
        x: 7.5, y: 0.3, w: 2.3, h: 0.3,
        fontSize: 9, color: GRAY, align: 'right'
    });
    slide.addText([
        { text: '63', options: { fontSize: 40, bold: true, color: PRIMARY } },
        { text: '项', options: { fontSize: 16, color: PRIMARY } }
    ], { x: 7.5, y: 0.5, w: 2.3, h: 0.7, align: 'right' });
    
    // Cards
    const cards = [
        { title: '战斗系统', icon: '⚡', percent: '35%', count: '22项', 
          items: ['Condition/Filter (阵营、距离、Tag)', 'Find Target Task 扩展', '检测框尺寸与相机UI适配', '受击音效、特效接口扩展'] },
        { title: '3C表现', icon: '👁', percent: '43%', count: '27项', 
          items: ['武器装备角色动画切换系统', '武器显隐、动画时序优化', '角色物理初始化流程整理', '多端适配 Bug 修复'] },
        { title: 'AI智能体', icon: '🤖', percent: '8%', count: '5项', 
          items: ['战斗程序多智能体系统开发', 'Cpp Risk Analyzer 等 Skills', 'ChestPVE 战斗知识库搭建'] },
        { title: '工具开发', icon: '⚙', percent: '14%', count: '9项', 
          items: ['Able 编辑器 ECA 化', '地图生成器开发 (连通率拓展、Debug模块、UI美化)'] }
    ];
    
    const cardWidth = 2.2;
    const cardX = 0.5;
    const cardY = 1.2;
    const gap = 0.15;
    
    cards.forEach((card, i) => {
        const x = cardX + i * (cardWidth + gap);
        
        // Card background
        slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: x, y: cardY, w: cardWidth, h: 3.2,
            fill: { color: 'FFFFFF' },
            shadow: { type: 'outer', blur: 3, offset: 1, angle: 45, color: '000000', opacity: 0.1 },
            rectRadius: 0.1
        });
        
        // Icon box
        slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: x + 0.15, y: cardY + 0.15, w: 0.4, h: 0.4,
            fill: { color: PRIMARY_LIGHT },
            rectRadius: 0.05
        });
        slide.addText(card.icon, {
            x: x + 0.15, y: cardY + 0.15, w: 0.4, h: 0.4,
            fontSize: 14, align: 'center', valign: 'middle'
        });
        
        // Title
        slide.addText(card.title, {
            x: x + 0.6, y: cardY + 0.18, w: 1.5, h: 0.35,
            fontSize: 13, bold: true, color: DARK
        });
        
        // Percent
        slide.addText([
            { text: card.percent, options: { fontSize: 22, bold: true, color: PRIMARY } },
            { text: '  ' + card.count, options: { fontSize: 9, color: '999999' } }
        ], { x: x + 0.15, y: cardY + 0.65, w: 1.9, h: 0.4 });
        
        // Progress bar
        slide.addShape(pptx.shapes.RECTANGLE, {
            x: x + 0.15, y: cardY + 1.1, w: 1.9, h: 0.06,
            fill: { color: 'e0e0e0' }
        });
        slide.addShape(pptx.shapes.RECTANGLE, {
            x: x + 0.15, y: cardY + 1.1, w: 1.9 * parseFloat(card.percent) / 100, h: 0.06,
            fill: { color: PRIMARY }
        });
        
        // Items
        card.items.forEach((item, j) => {
            slide.addShape(pptx.shapes.RECTANGLE, {
                x: x + 0.15, y: cardY + 1.35 + j * 0.45, w: 0.04, h: 0.35,
                fill: { color: PRIMARY }
            });
            slide.addText(item, {
                x: x + 0.25, y: cardY + 1.35 + j * 0.45, w: 1.8, h: 0.35,
                fontSize: 8, color: '444444', valign: 'top'
            });
        });
    });
    
    // Footer progress bar
    slide.addText('工作类型分布', {
        x: 0.5, y: 4.55, w: 1.2, h: 0.3,
        fontSize: 9, color: GRAY
    });
    slide.addText('+ 功能开发 47项 (75%)', {
        x: 1.7, y: 4.55, w: 1.8, h: 0.3,
        fontSize: 9, color: PRIMARY
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 3.6, y: 4.6, w: 4.5, h: 0.15,
        fill: { color: 'e0e0e0' }
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 3.6, y: 4.6, w: 3.375, h: 0.15,
        fill: { color: PRIMARY }
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
        x: 6.975, y: 4.6, w: 1.125, h: 0.15,
        fill: { color: SECONDARY }
    });
    slide.addText('⏱ Bug修复 16项 (25%)', {
        x: 8.2, y: 4.55, w: 1.6, h: 0.3,
        fontSize: 9, color: SECONDARY
    });
}

// Create all slides
createCoverSlide();
createWorkSlide();
createSkillSlide(pptx);
createKnowledgeSlide(pptx);
createDevCompareSlide(pptx);
createDebugCompareSlide(pptx);
createSubAgentSlide(pptx);
createFutureSlide(pptx);
createThanksSlide(pptx);

// Save
pptx.writeFile({ fileName: 'e:/GitHub/ziyadyao/Interview/workspace/modern-ppt.pptx' })
    .then(() => console.log('PPT saved: modern-ppt.pptx (9 slides)'))
    .catch(err => console.error(err));
