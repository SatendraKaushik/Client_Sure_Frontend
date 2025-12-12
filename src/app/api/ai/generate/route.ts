import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const ALLOWED_TOOLS = new Set(['emails', 'whatsapp', 'linkedin', 'contracts', 'text']);

// Rate limiting: In-memory store (use Redis in production for distributed systems)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 20; // 20 requests per minute

// Response cache: In-memory LRU cache
const responseCache = new Map<string, { response: string; expiresAt: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const MAX_CACHE_SIZE = 100;

// Generate cache key from prompt
function getCacheKey(prompt: string, tool: string): string {
  return crypto.createHash('sha256').update(`${tool}:${prompt}`).digest('hex');
}

// Clean expired cache entries
function cleanExpiredCache() {
  const now = Date.now();
  for (const [key, value] of responseCache.entries()) {
    if (value.expiresAt < now) {
      responseCache.delete(key);
    }
  }
}

// LRU cache eviction
function evictOldestCache() {
  if (responseCache.size >= MAX_CACHE_SIZE) {
    const firstKey = responseCache.keys().next().value;
    if (firstKey) responseCache.delete(firstKey);
  }
}

// Rate limiting check
function checkRateLimit(identifier: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record || record.resetAt < now) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  record.count++;
  return { allowed: true };
}

// Clean expired rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean every minute

export async function POST(request: NextRequest) {
  try {
    const { prompt, tool, expectJson } = await request.json();
    
    // Get client identifier (IP or session)
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const identifier = clientIp.split(',')[0].trim();
    
    // Rate limiting check
    const rateLimitResult = checkRateLimit(identifier);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please wait a moment.',
          retryAfter: rateLimitResult.retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
            'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + (rateLimitResult.retryAfter || 60) * 1000).toISOString()
          }
        }
      );
    }
    
    // Validate inputs
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt provided' },
        { status: 400 }
      );
    }
    
    const safeTool = ALLOWED_TOOLS.has(tool) ? tool : 'text';
    
    // Check cache first
    const cacheKey = getCacheKey(prompt, safeTool);
    const cached = responseCache.get(cacheKey);
    
    if (cached && cached.expiresAt > Date.now()) {
      console.log('Cache hit for prompt:', prompt.substring(0, 50) + '...');
      return NextResponse.json({ 
        text: cached.response,
        cached: true 
      });
    }
    
    // Try Gemini AI first
    const apiKey = process.env.GEMINI_API_KEY;
    
    console.log('🔑 API Key Status:', {
      exists: !!apiKey,
      length: apiKey?.length || 0,
      preview: apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}` : 'NOT_FOUND'
    });
    
    if (apiKey) {
      try {
        console.log('🤖 Initializing Gemini AI...');
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Try different model names in order of preference
        const modelNames = [
          'gemini-pro',
          'gemini-1.0-pro',
          'text-bison-001'
        ];
        
        let selectedModel = 'gemini-pro'; // fallback
        
        // Try each model until one works
        for (const modelName of modelNames) {
          try {
            console.log('🎯 Trying model:', modelName);
            const testModel = genAI.getGenerativeModel({ model: modelName });
            selectedModel = modelName;
            console.log('✅ Model available:', selectedModel);
            break;
          } catch (modelError) {
            console.log('❌ Model not available:', modelName);
            continue;
          }
        }
        
        const model = genAI.getGenerativeModel({ 
          model: selectedModel,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        });
        
        console.log('📤 Sending prompt to Gemini (length:', prompt.length, 'chars)');
        console.log('📝 Prompt preview:', prompt.substring(0, 150) + '...');
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('✅ Gemini response received (length:', text.length, 'chars)');
        console.log('📝 Response preview:', text.substring(0, 200) + '...');
        
        if (text && text.trim()) {
          // Cache the response
          cleanExpiredCache();
          evictOldestCache();
          responseCache.set(cacheKey, {
            response: text.trim(),
            expiresAt: Date.now() + CACHE_TTL
          });
          
          return NextResponse.json({ 
            text: text.trim(),
            cached: false 
          });
        }
      } catch (geminiError: any) {
        console.error('❌ Gemini API error:', geminiError.message || geminiError);
        console.error('🔍 Error details:', {
          name: geminiError.name,
          code: geminiError.code,
          status: geminiError.status
        });
        // Continue to fallback
      }
    } else {
      console.error('⚠️ No Gemini API key found in environment variables');
    }
    
    // Enhanced fallback responses based on actual prompt content
    const fallbackResponse = generateSmartFallback(prompt, tool, expectJson);
    
    // Cache fallback response too
    const fallbackText = await fallbackResponse.json();
    if (fallbackText.text) {
      cleanExpiredCache();
      evictOldestCache();
      responseCache.set(cacheKey, {
        response: fallbackText.text,
        expiresAt: Date.now() + CACHE_TTL
      });
    }
    
    return NextResponse.json({ ...fallbackText, cached: false });
    
  } catch (error: any) {
    console.error('General error:', error.message || error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}

function generateSmartFallback(prompt: string, tool: string, expectJson: boolean) {
  console.log('🔄 Fallback triggered - Extracting details from prompt');
  
  // Extract key information from prompt with multiple patterns
  const senderName = prompt.match(/Sender name: ([^.\n]+)/)?.[1]?.trim() || 
                     prompt.match(/I'm ([^,\n]+),/)?.[1]?.trim() || 'Professional';
  
  const senderRole = prompt.match(/Sender role: ([^.\n]+)/)?.[1]?.trim() || 
                     prompt.match(/Your profession\/role[:\s]+([^\n]+)/)?.[1]?.trim() || 'Founder';
  
  const niche = prompt.match(/Niche[:\s]+([^.\n]+)/)?.[1]?.trim() || 
                prompt.match(/Keywords[^:]*:[^,]*, ([^,\n]+)/)?.[1]?.trim() || 'Business';
  
  const target = prompt.match(/Target audience[:\s]+([^.\n]+)/)?.[1]?.trim() || 
                 prompt.match(/Target[:\s]+([^.\n]+)/)?.[1]?.trim() || 'Clients';
  
  const prospectName = prompt.match(/Prospect name[:\s]+([^.\n]+)/)?.[1]?.trim() || '';
  const prospectCompany = prompt.match(/Prospect company[:\s]+([^.\n]+)/)?.[1]?.trim() || '';
  
  const cta = prompt.match(/Include this (?:clear )?CTA \(exact\)[:\s]*["']([^"']+)["']/)?.[1] || 
              prompt.match(/CTA \(exact text\)[:\s]*["']([^"']+)["']/)?.[1] || 
              'Contact us';
  
  const wordLimit = parseInt(prompt.match(/Keep it under (\d+) words/)?.[1] || '100');
  
  console.log('📝 Extracted details:', { senderName, senderRole, niche, target, prospectName, prospectCompany, cta, wordLimit });
  
  if (expectJson && tool === 'emails') {
    // Generate personalized email
    const greeting = prospectName ? `Hi ${prospectName},` : 'Hi there,';
    const companyMention = prospectCompany ? ` at ${prospectCompany}` : '';
    
    // Create benefit based on niche
    const benefits: Record<string, string> = {
      'roofing': 'protect your home with durable, weather-resistant roofing',
      'marketing': 'boost your brand visibility and drive more leads',
      'consulting': 'optimize your business operations and increase efficiency',
      'software': 'streamline your workflows with cutting-edge technology',
      'design': 'create stunning visuals that captivate your audience'
    };
    
    const nicheLower = niche.toLowerCase();
    const benefit = benefits[nicheLower] || `deliver quality ${nicheLower} solutions`;
    
    const body = `${greeting}\n\nI'm ${senderName}, ${senderRole}${companyMention}. I help ${target.toLowerCase()} ${benefit}.\n\nWe've helped many clients achieve great results. Let's discuss how we can help you too.\n\n${cta}\n\nBest regards,\n${senderName}`;
    
    const response = JSON.stringify({
      subject: `${niche} Solution for ${prospectName || 'You'}`,
      preview: `${greeting.replace(',', '')} Let's discuss your ${niche.toLowerCase()} needs`,
      body: body
    });
    
    console.log('✅ Fallback response generated');
    return NextResponse.json({ text: response, fallback: true });
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