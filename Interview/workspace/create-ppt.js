const pptxgen = require('pptxgenjs');
const path = require('path');

// Get html2pptx path from skill
const html2pptxPath = path.resolve(__dirname, '../../.codebuddy/skills/pptx/scripts/html2pptx.js');
const html2pptx = require(html2pptxPath);

async function createPresentation() {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'Yao Zhen';
    pptx.title = 'Combat Agent System';
    pptx.subject = 'From Skill to Multi-Agent Architecture';

    const slides = [
        'slide1-cover.html',
        'slide2-work.html',
        'slide3-skill.html',
        'slide4-knowledge.html',
        'slide5-dev-compare.html',
        'slide6-debug-compare.html',
        'slide7-subagent.html',
        'slide8-future.html',
        'slide9-thanks.html'
    ];

    console.log('Creating presentation...');
    
    for (let i = 0; i < slides.length; i++) {
        const slidePath = path.join(__dirname, slides[i]);
        console.log(`Processing slide ${i + 1}: ${slides[i]}`);
        
        try {
            await html2pptx(slidePath, pptx);
            console.log(`  ✓ Slide ${i + 1} created`);
        } catch (error) {
            console.error(`  ✗ Error creating slide ${i + 1}:`, error.message);
        }
    }

    const outputPath = path.join(__dirname, 'presentation.pptx');
    await pptx.writeFile({ fileName: outputPath });
    console.log(`\nPresentation saved to: ${outputPath}`);
}

createPresentation().catch(console.error);
