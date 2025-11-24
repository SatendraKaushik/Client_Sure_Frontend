import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { need, budget, audience, priority } = await request.json();

    // Mock AI suggestion logic
    const toolIds = ['sendfox', 'tidycal', 'nexter', 'late', 'breezedoc', 'goosevpn', 'reoon', 'switchy', 'systemeio', 'aisensy', 'fiverr', 'bitrix24', 'gohighlevel', 'flexifunnels', 'pabblyconnect'];
    
    // Simple scoring based on inputs
    let suggestions = [];
    
    if (need?.toLowerCase().includes('email')) {
      suggestions.push('sendfox', 'reoon');
    }
    if (need?.toLowerCase().includes('schedule')) {
      suggestions.push('tidycal');
    }
    if (need?.toLowerCase().includes('website')) {
      suggestions.push('nexter');
    }
    if (need?.toLowerCase().includes('social')) {
      suggestions.push('late');
    }
    if (need?.toLowerCase().includes('contract')) {
      suggestions.push('breezedoc');
    }
    if (need?.toLowerCase().includes('crm')) {
      suggestions.push('bitrix24', 'gohighlevel');
    }
    if (need?.toLowerCase().includes('funnel')) {
      suggestions.push('systemeio', 'flexifunnels');
    }
    if (need?.toLowerCase().includes('automation')) {
      suggestions.push('pabblyconnect');
    }
    
    // If no specific matches, return some popular tools
    if (suggestions.length === 0) {
      suggestions = ['sendfox', 'tidycal', 'bitrix24', 'systemeio'];
    }
    
    // Limit to 6 suggestions
    suggestions = suggestions.slice(0, 6);

    return NextResponse.json({ suggestions });
  } catch (error) {
    return NextResponse.json({ error: 'Suggestion failed' }, { status: 500 });
  }
}