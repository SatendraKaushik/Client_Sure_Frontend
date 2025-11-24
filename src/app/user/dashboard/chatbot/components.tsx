import { useEffect, useMemo, useRef, useState, useCallback } from 'react';

function useEditorShortcuts(ref: React.RefObject<HTMLTextAreaElement | null>) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement?.tagName ?? ''))) {
        e.preventDefault(); ref.current?.focus();
      }
      if (e.key === 'Escape') (document.activeElement as HTMLElement | null)?.blur();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'enter') {
        window.dispatchEvent(new CustomEvent('ai-tools:generate'));
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ref]);
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-visible rounded-xl bg-gradient-to-br from-white to-blue-50 border border-blue-200 p-6 shadow-lg hover:shadow-xl transition-all focus-within:z-50">
      {children}
    </div>
  );
}

function Sidebar({ activeTool, openTool }: { activeTool: any; openTool: (t: any) => void }) {
  const Item = ({ id, label, emoji }: { id: any; label: string; emoji: string }) => {
    const active = activeTool === id;
    return (
      <button
        onClick={() => openTool(id)}
        className={[
          'w-full text-left px-4 py-3 rounded-xl border transition-all group',
          active
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-600 text-white shadow-lg transform scale-105'
            : 'bg-white border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-900 hover:shadow-md'
        ].join(' ')}
      >
        <span className="mr-3 text-lg">{emoji}</span>
        <span className="font-semibold">{label}</span>
        {active && <span className="ml-2 text-xs px-2 py-1 rounded-full bg-white/20 text-white">active</span>}
      </button>
    );
  };

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="px-4 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
        <div className="text-sm font-bold">AI Tools</div>
        <div className="text-xs opacity-90">Compose and automate outreach</div>
      </div>

      <nav className="flex flex-col gap-3">
        <Item id="emails" label="Emails" emoji="📧" />
        <Item id="whatsapp" label="WhatsApp" emoji="💬" />
        <Item id="linkedin" label="LinkedIn" emoji="🔗" />
        <Item id="contracts" label="Contracts" emoji="📄" />
      </nav>
    </div>
  );
}

function SenderBlock({
  role, setRole,
  senderName, setSenderName,
  senderEmail, setSenderEmail,
  language, setLanguage,
  level, setLevel
}: {
  role: string; setRole: (v:string)=>void;
  senderName: string; setSenderName: (v:string)=>void;
  senderEmail: string; setSenderEmail: (v:string)=>void;
  language: string; setLanguage: (v:string)=>void;
  level: 'Simple'|'Intermediate'|'Advanced'; setLevel: (v:'Simple'|'Intermediate'|'Advanced')=>void;
}) {
  return (
    <Card>
      <FieldRow>
        <div className="flex-1 min-w-[220px]">
          <label className="text-xs text-blue-900 font-semibold">Your profession / role</label>
          <input
            className="mt-2 w-full rounded-lg bg-white border border-blue-300 px-4 py-3 outline-none placeholder:text-blue-400 text-blue-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            value={role}
            onChange={(e)=>setRole(e.target.value)}
            placeholder="Founder · Growth · Manager"
          />
        </div>

        <div className="w-full sm:w-[260px]">
          <label className="text-xs text-blue-900 font-semibold">Sender name</label>
          <input
            className="mt-2 w-full rounded-lg bg-white border border-blue-300 px-4 py-3 outline-none placeholder:text-blue-400 text-blue-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            value={senderName}
            onChange={(e)=>setSenderName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div className="w-full sm:w-[220px] relative z-[9999]">
          <label className="text-xs text-blue-900 font-semibold">Language</label>
          <select
            className="mt-2 w-full rounded-lg bg-white border border-blue-300 text-blue-900 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            value={language}
            onChange={e => setLanguage(e.target.value)}
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Spanish</option>
            <option>French</option>
            <option>Portuguese</option>
            <option>German</option>
            <option>Bengali</option>
            <option>Urdu</option>
            <option>Arabic</option>
          </select>
        </div>

        <div className="w-full sm:w-[240px]">
          <label className="text-xs text-blue-900 font-semibold">Reading level</label>
          <select
            className="mt-2 w-full rounded-lg bg-white border border-blue-300 text-blue-900 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            value={level}
            onChange={(e)=>setLevel(e.target.value as any)}
          >
            <option value="Simple">Simple (conversational)</option>
            <option value="Intermediate">Intermediate (professional)</option>
            <option value="Advanced">Advanced (formal)</option>
          </select>
        </div>
      </FieldRow>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-blue-900 font-semibold">
          Optional: sender email
        </summary>
        <div className="mt-3 max-w-sm">
          <input
            className="w-full rounded-lg bg-white border border-blue-300 px-4 py-3 outline-none placeholder:text-blue-400 text-blue-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            value={senderEmail}
            onChange={(e)=>setSenderEmail(e.target.value)}
            placeholder="you@company.com"
          />
        </div>
      </details>
    </Card>
  );
}

export { useEditorShortcuts, FieldRow, Card, Sidebar, SenderBlock };