import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_TOOLS = new Set(['emails', 'whatsapp', 'linkedin', 'contracts', 'text']);

export async function POST(request: NextRequest) {
  try {
    const { prompt, tool, expectJson } = await request.json();
    
    // Validate inputs
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt provided' },
        { status: 400 }
      );
    }
    
    const safeTool = ALLOWED_TOOLS.has(tool) ? tool : 'text';
    
    // Try Gemini AI first
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (apiKey) {
      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-pro',
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        });
        
        console.log('Sending prompt to Gemini:', prompt.substring(0, 100) + '...');
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('Gemini response received:', text.substring(0, 100) + '...');
        
        if (text && text.trim()) {
          return NextResponse.json({ text: text.trim() });
        }
      } catch (geminiError: any) {
        console.error('Gemini API error:', geminiError.message || geminiError);
        // Continue to fallback
      }
    } else {
      console.log('No Gemini API key found');
    }
    
    // Enhanced fallback responses based on actual prompt content
    return generateSmartFallback(prompt, tool, expectJson);
    
  } catch (error: any) {
    console.error('General error:', error.message || error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}

function generateSmartFallback(prompt: string, tool: string, expectJson: boolean) {
  // Extract key information from prompt
  const senderName = prompt.match(/Sender name: ([^.\n]+)/)?.[1]?.trim() || 'Professional';
  const niche = prompt.match(/Niche: ([^.\n]+)/)?.[1]?.trim() || 'Business';
  const target = prompt.match(/Target: ([^.\n]+)/)?.[1]?.trim() || 'Clients';
  const cta = prompt.match(/Include this CTA \(exact\): "([^"]+)"/)?.[1] || 'Contact us';
  const wordLimit = prompt.match(/Keep it under (\d+) words/)?.[1];
  
  if (expectJson && tool === 'emails') {
    const response = JSON.stringify({
      subject: `${niche} Services - ${senderName}`,
      preview: `Professional ${niche.toLowerCase()} solutions for ${target.toLowerCase()}`,
      body: `Hi there!\n\nI'm ${senderName}, specializing in ${niche.toLowerCase()} services for ${target.toLowerCase()}.\n\nWe provide quality solutions that deliver real results for your business.\n\n${cta}\n\nBest regards,\n${senderName}`
    });
    return NextResponse.json({ text: response });
  }
  
  // Generate contextual responses based on tool type
  let response = '';
  
  switch (tool) {
    case 'whatsapp':
      response = `Hi! ${senderName} here 👋\n${niche} expert for ${target.toLowerCase()}.\n${cta}`;
      break;
    case 'linkedin':
      response = `Hello! I'm ${senderName}, ${niche} specialist helping ${target.toLowerCase()}. ${cta}`;
      break;
    case 'contracts':
      response = `${niche.toUpperCase()} SERVICE CONTRACT\n\nProvider: ${senderName}\nClient: [Client Name]\nScope: Professional ${niche.toLowerCase()} services\n\nTerms: Standard industry terms apply\nNext Steps: ${cta}`;
      break;
    default:
      response = `Professional ${niche.toLowerCase()} content from ${senderName} for ${target.toLowerCase()}. ${cta}`;
  }
  
  return NextResponse.json({ text: response });
}