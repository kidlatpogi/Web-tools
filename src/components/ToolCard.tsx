import React, { useState } from 'react';
import type { ToolItem } from '../types/tool';
import { ArrowUpRight, Copy, Check, Gift } from 'lucide-react';

interface ToolCardProps {
  tool: ToolItem;
  onSelect?: (tool: ToolItem) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(tool.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPricingBadgeClass = (pricing: string) => {
    switch (pricing) {
      case 'Free':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
      case 'Open Source':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'Free with Student ID':
        return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
      case 'Freemium':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(tool)}
      className="group relative border-2 border-slate-200/80 bg-white/95 backdrop-blur-md p-5 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col justify-between hover:border-accent hover:shadow-[0_16px_36px_-12px_rgba(196,73,0,0.16)] hover:-translate-y-1 transition-all duration-300 cursor-target text-left"
    >
      {/* Top Header: Category & Pricing Badge */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-bold truncate">
            {tool.categoryName}
          </span>
          <span
            className={`shrink-0 font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border font-semibold ${getPricingBadgeClass(
              tool.pricing
            )}`}
          >
            {tool.pricing}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-clash-semibold text-xl sm:text-2xl font-bold text-slate-900 leading-tight group-hover:text-accent transition-colors flex items-center gap-1.5">
          {tool.name}
        </h3>

        {/* Description */}
        <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed mt-2.5 line-clamp-3">
          {tool.description}
        </p>

        {/* Student Perk Banner if present */}
        {tool.studentPerk && (
          <div className="mt-3.5 p-2.5 rounded-xl bg-accent/5 border border-accent/15 flex items-start gap-2">
            <Gift className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <p className="font-sans text-[11px] sm:text-xs text-slate-800 font-medium leading-snug">
              <strong className="text-accent font-semibold">Student Perk:</strong> {tool.studentPerk}
            </p>
          </div>
        )}

        {/* Key Features Bullets (if available) */}
        {tool.keyFeatures && tool.keyFeatures.length > 0 && (
          <ul className="mt-3.5 space-y-1.5 border-t border-slate-100 pt-3">
            {tool.keyFeatures.slice(0, 2).map((feat, idx) => (
              <li key={idx} className="flex items-center gap-2 text-slate-600 font-sans text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" />
                <span className="truncate">{feat}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer: Tags & Action Buttons */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {tool.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100/90 text-slate-600 border border-slate-200/60 font-medium"
            >
              #{tag}
            </span>
          ))}
          {tool.tags.length > 3 && (
            <span className="font-mono text-[10px] text-slate-400 self-center">
              +{tool.tags.length - 3}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 mt-1">
          <button
            type="button"
            onClick={handleCopy}
            className="cursor-target inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-accent hover:text-accent font-mono text-[11px] font-bold text-slate-700 transition-colors shadow-xs"
            title="Copy Website URL"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy URL</span>
              </>
            )}
          </button>

          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="cursor-target inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-black hover:bg-accent text-white font-mono text-[11px] font-bold uppercase tracking-wider transition-all duration-200 shadow-xs hover:shadow-md"
          >
            Visit Site
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
