import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  title?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, title }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span className="relative inline-flex items-center">
      <span
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help inline-flex items-center"
      >
        {children || <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-slate-200 transition-colors ml-1" />}
      </span>

      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 p-2.5 bg-slate-900 border border-slate-700/80 rounded-lg shadow-xl text-left pointer-events-none">
          {title && <div className="text-xs font-semibold text-slate-200 mb-1">{title}</div>}
          <div className="text-[11px] leading-relaxed text-slate-300 font-normal">{content}</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-700" />
        </div>
      )}
    </span>
  );
};
