import { useState } from 'react';

export default function CollapsibleSection({ title, subtitle, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-bank-gray-bg/50 transition-colors"
        aria-expanded={open}
      >
        <div>
          <h3 className="section-title">{title}</h3>
          {subtitle && <p className="text-xs text-bank-gray-mid mt-0.5">{subtitle}</p>}
        </div>
        <svg
          className={`w-4 h-4 text-bank-gray-mid flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`collapsible-body ${open ? 'collapsible-open' : 'collapsible-closed'}`}
      >
        <div className="px-5 pb-5 pt-0">{children}</div>
      </div>
    </div>
  );
}
