'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

type Tool = {
  id: string;
  name: string;
  desc: string;
  refLink: string;
  logo?: string;
  tags?: string[];
  priceTier?: 'Free' | 'Low' | 'Medium' | 'High';
};

const TOOLS_DB: Tool[] = [
  { id: 'sendfox', name: 'SendFox', desc: 'Email marketing (LTD)', refLink: 'https://appsumo.8odi.net/sendfoxsnowball', logo: '/sendfox.png', tags: ['email','marketing','newsletter','ltd'], priceTier: 'Low' },
  { id: 'tidycal', name: 'TidyCal', desc: 'Scheduling & booking (LTD)', refLink: 'https://appsumo.8odi.net/tidycal-snowball', logo: '/tidycal.png', tags: ['scheduling','booking','calendar','ltd'], priceTier: 'Low' },
  { id: 'nexter', name: 'Nexter Builder', desc: 'WordPress website builder (LTD)', refLink: 'https://appsumo.8odi.net/K0N9Lx', logo: '/nexter.png', tags: ['website','builder','wordpress','ltd'], priceTier: 'Low' },
  { id: 'late', name: 'Late – Social Scheduler', desc: 'Social media scheduling (LTD)', refLink: 'https://appsumo.8odi.net/7aNxry', logo: '/late.png', tags: ['social','scheduler','content','ltd'], priceTier: 'Low' },
  { id: 'breezedoc', name: 'BreezeDoc', desc: 'E-signatures & document signing (LTD)', refLink: 'https://appsumo.8odi.net/mOmb3X', logo: '/breeze.jpg', tags: ['contracts','esign','documents','ltd'], priceTier: 'Low' },
  { id: 'goosevpn', name: 'GOOSE VPN', desc: 'VPN & privacy (LTD)', refLink: 'https://appsumo.8odi.net/kOqb3N', logo: '/goose.jpg', tags: ['vpn','security','privacy','ltd'], priceTier: 'Low' },
  { id: 'reoon', name: 'Reoon Email Verifier', desc: 'Bulk email verification (LTD)', refLink: 'https://appsumo.8odi.net/e1WBMj', logo: '/reoon.jpg', tags: ['email','verifier','deliverability','ltd'], priceTier: 'Low' },
  { id: 'switchy', name: 'Switchy', desc: 'Link shortener & retargeting (LTD)', refLink: 'https://appsumo.8odi.net/QjQer3', logo: '/switchy.png', tags: ['links','shortener','utm','ltd'], priceTier: 'Low' },
  { id: 'systemeio', name: 'Systeme.io', desc: 'Funnel builder (Free trial)', refLink: 'https://systeme.io/?sa=sa0019716323b1979b8f63f683f78ab179ec9238c2', logo: '/systeme.jpg', tags: ['funnels','email','automation','trial'], priceTier: 'Free' },
  { id: 'aisensy', name: 'AiSensy', desc: 'WhatsApp marketing (Free trial)', refLink: 'https://m.aisensy.com/?ref=snowballmedia', logo: '/aisensy.jpg', tags: ['whatsapp','marketing','broadcast','trial'], priceTier: 'Free' },
  { id: 'fiverr', name: 'Fiverr', desc: 'Hire freelancers (Affiliate)', refLink: 'https://go.fiverr.com/visit/?bta=1146304&brand=fiverrmarketplace', logo: '/fiverr.jpg', tags: ['freelancers','marketplace','outsourcing'], priceTier: 'Low' },
  { id: 'bitrix24', name: 'Bitrix24', desc: 'Free CRM & collaboration suite', refLink: 'https://www.bitrix24.in/', logo: '/bitrix.jpg', tags: ['crm','sales','tasks','free'], priceTier: 'Free' },
  { id: 'gohighlevel', name: 'GoHighLevel', desc: 'All-in-one CRM & funnels (Free trial)', refLink: 'https://www.gohighlevel.com/?fp_ref=umang80', logo: '/highlevel.jpg', tags: ['crm','funnels','automation','trial'], priceTier: 'High' },
  { id: 'flexifunnels', name: 'FlexiFunnels', desc: 'Funnel/checkout builder (Affiliate)', refLink: 'https://sb.flexifunnels.com/4rmdxonv1?ai=1648&pi=19028&ti=clientsure', logo: '/flexifunnels.png', tags: ['funnels','checkout','pages'], priceTier: 'Medium' },
  { id: 'pabblyconnect', name: 'Pabbly Connect', desc: 'No-code automations (Affiliate)', refLink: 'https://payments.pabbly.com/api/affurl/RVYZ07kQyUZ0Z1HUKZ1m/IXZ0CSKA1zBgbtPSo?target=9Z2AHyhSldo6KI1Fn', logo: '/pabbly.png', tags: ['automation','zapier-alt','workflows'], priceTier: 'Medium' },
];

export default function ToolsPage() {
  const router = useRouter();

  const [need, setNeed] = useState('');
  const [budget, setBudget] = useState('');
  const [audience, setAudience] = useState('');
  const [priority, setPriority] = useState<'cost'|'speed'|'quality'>('cost');

  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [suggested, setSuggested] = useState<Tool[]>([]);
  const [suggestErr, setSuggestErr] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<'Any'|'Free'|'Low'|'Medium'|'High'>('Any');
  const [sortBy, setSortBy] = useState<'relevance'|'name'|'priceAsc'|'priceDesc'>('relevance');

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byQuery = (t: Tool) => {
      if (!q) return true;
      return [t.name, t.desc, ...(t.tags||[])].join(' ').toLowerCase().includes(q);
    };
    const byPrice = (t: Tool) => priceFilter === 'Any' ? true : t.priceTier === priceFilter;
    let list = TOOLS_DB.filter(t => byQuery(t) && byPrice(t));
    if (sortBy === 'name') list = list.sort((a,b)=>a.name.localeCompare(b.name));
    if (sortBy === 'priceAsc') list = list.sort((a,b)=>tierToNum(a.priceTier)-tierToNum(b.priceTier));
    if (sortBy === 'priceDesc') list = list.sort((a,b)=>tierToNum(b.priceTier)-tierToNum(a.priceTier));
    return list;
  }, [query, priceFilter, sortBy]);

  function tierToNum(t?: Tool['priceTier']) {
    if (t === 'Free') return 0;
    if (t === 'Low') return 1;
    if (t === 'Medium') return 2;
    if (t === 'High') return 3;
    return 1;
  }

  async function handleSuggest(e?: React.FormEvent) {
    e?.preventDefault();
    setLoadingSuggest(true);
    setSuggested([]);
    setSuggestErr(null);

    const payload = { need, budget, audience, priority };

    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        let picks: Tool[] = [];
        if (Array.isArray(json.suggestions)) {
          picks = json.suggestions.map((idOrObj: any) => {
            if (typeof idOrObj === 'string') return TOOLS_DB.find(t=>t.id===idOrObj) ?? null;
            if (idOrObj?.id) return TOOLS_DB.find(t=>t.id===idOrObj.id) ?? { ...idOrObj } as Tool;
            return null;
          }).filter(Boolean) as Tool[];
        } else if (Array.isArray(json.tools)) {
          picks = json.tools;
        }
        if (picks.length) {
          setSuggested(picks);
          setLoadingSuggest(false);
          return;
        }
      }
    } catch {
      // ignore and fall back
    }

    try {
      const lowerNeed = (need || '').toLowerCase();
      const lowerAudience = (audience || '').toLowerCase();
      const budgetNum = parseBudget(budget);

      const scored = TOOLS_DB.map(t => {
        let score = 0;
        const hay = [t.name, t.desc, ...(t.tags||[])].join(' ').toLowerCase();
        if (lowerNeed && hay.includes(lowerNeed)) score += 40;
        if (lowerAudience && hay.includes(lowerAudience)) score += 20;
        (t.tags || []).forEach(tag => {
          if ((lowerNeed + ' ' + lowerAudience).includes(tag)) score += 8;
        });
        if (!isNaN(budgetNum)) {
          if (budgetNum < 50 && (t.priceTier === 'Free' || t.priceTier === 'Low')) score += 8;
          if (budgetNum >= 50 && budgetNum < 500 && t.priceTier === 'Low') score += 5;
          if (budgetNum >= 500 && t.priceTier === 'High') score += 6;
        }
        if (priority === 'cost' && (t.priceTier === 'Free' || t.priceTier === 'Low')) score += 4;
        if (priority === 'speed' && (t.tags||[]).includes('scheduling')) score += 3;
        if (priority === 'quality' && t.priceTier === 'High') score += 4;
        return { tool: t, score };
      });

      const picks = scored.sort((a,b)=>b.score-a.score).slice(0,6).map(s=>s.tool);
      setSuggested(picks);
    } catch (err) {
      setSuggestErr('Could not produce suggestions.');
    } finally {
      setLoadingSuggest(false);
    }
  }

  function parseBudget(b: string) {
    if (!b) return NaN;
    const n = Number(String(b).replace(/[^0-9.]+/g,''));
    return isNaN(n) ? NaN : n;
  }

  async function copyLink(t: Tool) {
    try {
      await navigator.clipboard.writeText(t.refLink);
      setCopiedId(t.id);
      setTimeout(() => setCopiedId(id => (id === t.id ? null : id)), 1800);
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* TOP: AI Suggestion */}
        <section className="bg-gradient-to-r from-white to-blue-50 rounded-2xl p-6 border border-blue-100 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                className="px-4 py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors font-medium text-black"
                onClick={() => router.back()}
                aria-label="Go back"
                title="Back"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-black">🤖 Smart Tool Finder</h1>
                <p className="text-black mt-1">Tell us your need, budget and audience — we'll recommend the top tools for you.</p>
              </div>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSuggest}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-black">What do you need?</span>
                <input 
                  value={need} 
                  onChange={e=>setNeed(e.target.value)} 
                  placeholder="e.g., send contracts, run email campaigns, schedule calls" 
                  className="px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-black"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-black">Budget (monthly)</span>
                <input 
                  value={budget} 
                  onChange={e=>setBudget(e.target.value)} 
                  placeholder="e.g., 0, 50, 500" 
                  className="px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-black"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-black">Target audience</span>
                <input 
                  value={audience} 
                  onChange={e=>setAudience(e.target.value)} 
                  placeholder="e.g., SMBs, homeowners, developers" 
                  className="px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-black"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-black">Priority</span>
                <select 
                  value={priority} 
                  onChange={e=>setPriority(e.target.value as any)}
                  className="px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-black"
                >
                  <option value="cost">Cost</option>
                  <option value="speed">Speed</option>
                  <option value="quality">Quality</option>
                </select>
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="submit" 
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:-translate-y-0.5 shadow-lg font-semibold"
              >
                {loadingSuggest ? 'Suggesting…' : 'Suggest Tools'}
              </button>
              <button 
                type="button" 
                className="px-6 py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors font-medium text-black" 
                onClick={() => { setNeed(''); setBudget(''); setAudience(''); setPriority('cost'); setSuggested([]); setSuggestErr(null); }}
              >
                Reset
              </button>
            </div>

            {suggestErr && <div className="text-red-600 font-medium mt-3">{suggestErr}</div>}
          </form>
        </section>

        {/* MIDDLE: Suggested picks */}
        <section className="mb-8">
          {loadingSuggest && <div className="text-black text-center py-8">Thinking…</div>}

          {!loadingSuggest && suggested.length === 0 && (
            <div className="text-center py-8">
              <p className="text-black">No suggestions yet. Fill the form above and click <strong>Suggest Tools</strong>.</p>
            </div>
          )}

          {!loadingSuggest && suggested.length > 0 && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-black">Top suggestions for you</h2>
                <p className="text-black mt-1">These are the best fits based on your inputs.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggested.map(t => (
                  <article className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-5 border border-blue-200 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1" key={t.id}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        {t.logo ? <img src={t.logo} alt={t.name} className="w-full h-full object-cover rounded-xl" /> : <span className="text-xl font-bold text-blue-600">{t.name.charAt(0)}</span>}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-black mb-1">{t.name}</div>
                        <div className="text-black text-sm">{t.desc}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <a 
                        href={t.refLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:-translate-y-0.5 text-sm font-semibold" 
                        onClick={() => copyLink(t)}
                      >
                        {copiedId === t.id ? 'Copied' : 'Get Referral Link'}
                      </a>
                      <div className="px-3 py-1 bg-white border border-blue-200 rounded-lg text-black text-sm font-medium">{t.priceTier ?? '—'}</div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        {/* BOTTOM: Controls + catalog */}
        <section>
          <div className="flex flex-wrap gap-4 mb-6">
            <input 
              className="flex-1 min-w-64 px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-black" 
              placeholder="Search tools (name, description, tag)..." 
              value={query} 
              onChange={e=>setQuery(e.target.value)} 
            />

            <select 
              className="px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-black" 
              value={priceFilter} 
              onChange={e=>setPriceFilter(e.target.value as any)}
            >
              <option value="Any">All prices</option>
              <option value="Free">Free</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <select 
              className="px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-black" 
              value={sortBy} 
              onChange={e=>setSortBy(e.target.value as any)}
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="name">Sort: Name</option>
              <option value="priceAsc">Sort: Price ↑</option>
              <option value="priceDesc">Sort: Price ↓</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.length === 0 ? (
              <div className="col-span-full text-center py-8 text-black">No tools match your filters.</div>
            ) : (
              filteredTools.map(t => (
                <article className="bg-white rounded-xl p-5 border border-gray-200 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1" key={t.id}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {t.logo ? <img src={t.logo} alt={t.name} className="w-full h-full object-cover rounded-lg" /> : <span className="text-lg font-bold text-black">{t.name.charAt(0)}</span>}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-black mb-1">{t.name}</div>
                      <div className="text-black text-sm">{t.desc}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <a 
                      href={t.refLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium" 
                      onClick={() => copyLink(t)}
                    >
                      {copiedId === t.id ? 'Copied' : 'Get Link'}
                    </a>
                    <div className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-black text-xs font-medium">{t.priceTier ?? '—'}</div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}