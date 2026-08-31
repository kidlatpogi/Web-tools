import React, { useState, useMemo } from 'react';
import type { ToolItem, CategoryInfo, CategoryId, PricingType } from '../types/tool';
import { ToolCard } from './ToolCard';
import {
  Search,
  X,
  Code,
  Bot,
  Sparkles,
  Palette,
  GraduationCap,
  Layers,
  Gift,
  LayoutGrid,
  Filter,
  ArrowUpRight,
  ExternalLink,
  Tag,
  Check,
  Copy,
  Info,
  ArrowUpDown
} from 'lucide-react';

interface ToolDirectoryProps {
  initialTools: ToolItem[];
  categories: CategoryInfo[];
}

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  ide: <Code className="w-3.5 h-3.5" />,
  'ai-agents': <Bot className="w-3.5 h-3.5" />,
  'ai-chatbots': <Sparkles className="w-3.5 h-3.5" />,
  'design-inspiration': <Palette className="w-3.5 h-3.5" />,
  certifications: <GraduationCap className="w-3.5 h-3.5" />,
  'typography-assets': <Layers className="w-3.5 h-3.5" />,
  'student-perks': <Gift className="w-3.5 h-3.5" />
};

export const ToolDirectory: React.FC<ToolDirectoryProps> = ({ initialTools, categories }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPricing, setSelectedPricing] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'az' | 'za'>('default');
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const [modalCopied, setModalCopied] = useState(false);

  // Category item count mapping
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: initialTools.length };
    categories.forEach((cat) => {
      counts[cat.id] = initialTools.filter((t) => t.category === cat.id).length;
    });
    return counts;
  }, [initialTools, categories]);

  // Filtered & Sorted tools
  const processedTools = useMemo(() => {
    const filtered = initialTools.filter((tool) => {
      // Category filter
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }
      // Pricing filter
      if (selectedPricing !== 'all' && tool.pricing !== selectedPricing) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = tool.name.toLowerCase().includes(q);
        const matchesDesc = tool.description.toLowerCase().includes(q);
        const matchesTags = tool.tags.some((tag) => tag.toLowerCase().includes(q));
        const matchesCat = tool.categoryName.toLowerCase().includes(q);
        const matchesPerk = tool.studentPerk?.toLowerCase().includes(q);
        return matchesName || matchesDesc || matchesTags || matchesCat || matchesPerk;
      }
      return true;
    });

    // Sorting
    if (sortBy === 'az') {
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === 'za') {
      return [...filtered].sort((a, b) => b.name.localeCompare(a.name));
    }
    return filtered;
  }, [initialTools, selectedCategory, selectedPricing, searchQuery, sortBy]);

  const pricingOptions = [
    'all',
    'Free',
    'Freemium',
    'Open Source',
    'Free with Student ID',
    'Paid'
  ];

  const handleCopyModalUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setModalCopied(true);
    setTimeout(() => setModalCopied(false), 2000);
  };

  return (
    <section id="directory" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-10">
      {/* Directory Top Header Controls */}
      <div className="flex flex-col gap-5 sm:gap-6 mb-8 sm:mb-10">
        
        {/* Search Bar */}
        <div className="relative w-full max-w-3xl mx-auto px-1">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 sm:w-5 h-4 sm:h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, category, tag (e.g. Cursor, AI, Icons, Harvard)..."
              className="w-full pl-11 sm:pl-12 pr-10 py-3.5 sm:py-4 rounded-2xl bg-white/90 backdrop-blur-md border-2 border-slate-200/90 text-slate-900 placeholder:text-slate-400 font-sans text-xs sm:text-base focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 shadow-sm transition-all cursor-target"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-target"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Wrapping Pills */}
        <div className="w-full max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 px-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`cursor-target inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 border-2 ${
              selectedCategory === 'all'
                ? 'bg-accent text-white border-accent shadow-md shadow-accent/20'
                : 'bg-white/90 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            All Tools
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedCategory === 'all'
                  ? 'bg-black/30 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {categoryCounts.all}
            </span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`cursor-target inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 border-2 ${
                  isSelected
                    ? 'bg-accent text-white border-accent shadow-md shadow-accent/20'
                    : 'bg-white/90 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white'
                }`}
              >
                {CATEGORY_ICON_MAP[cat.id] || <Tag className="w-3.5 h-3.5" />}
                {cat.shortName}
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? 'bg-black/30 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {categoryCounts[cat.id] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Pricing Filter & Sorting Controls Bar */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 pt-4 border-t border-slate-200/80">
          
          {/* Pricing Pills */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 w-full md:w-auto">
            <span className="font-mono text-xs text-slate-400 font-bold uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-accent" />
              Pricing:
            </span>
            {pricingOptions.map((price) => (
              <button
                key={price}
                type="button"
                onClick={() => setSelectedPricing(price)}
                className={`cursor-target px-2.5 sm:px-3 py-1 rounded-full font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase transition-all duration-200 border ${
                  selectedPricing === price
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {price === 'all' ? 'All Tiers' : price}
              </button>
            ))}
          </div>

          {/* Sort Controls & Count */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 sm:gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1 bg-white/90 border border-slate-200 px-2 py-1 rounded-full">
              <span className="font-mono text-[11px] text-slate-400 uppercase font-bold flex items-center gap-1 pl-1">
                <ArrowUpDown className="w-3 h-3 text-accent" />
                Sort:
              </span>
              <button
                type="button"
                onClick={() => setSortBy('default')}
                className={`cursor-target px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  sortBy === 'default' ? 'bg-accent text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Curated
              </button>
              <button
                type="button"
                onClick={() => setSortBy('az')}
                className={`cursor-target px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  sortBy === 'az' ? 'bg-accent text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                A-Z
              </button>
              <button
                type="button"
                onClick={() => setSortBy('za')}
                className={`cursor-target px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  sortBy === 'za' ? 'bg-accent text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Z-A
              </button>
            </div>

            <div className="font-mono text-xs text-slate-500 font-bold tracking-wider shrink-0">
              Showing <span className="text-accent">{processedTools.length}</span> of{' '}
              {initialTools.length}
            </div>
          </div>

        </div>

      </div>

      {/* Tools Bento Grid */}
      {processedTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {processedTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onSelect={(t) => setSelectedTool(t)} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="w-full py-16 px-6 text-center border-2 border-dashed border-slate-200 bg-white/50 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="font-clash-semibold text-xl font-bold text-slate-800">
            No tools matched your criteria
          </h4>
          <p className="font-sans text-sm text-slate-500 max-w-md mt-1 mb-4">
            Try adjusting your search query or switching category/pricing filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedPricing('all');
              setSortBy('default');
            }}
            className="cursor-target px-5 py-2 rounded-full bg-black hover:bg-accent text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Tool Detail Modal Drawer */}
      {selectedTool && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={() => setSelectedTool(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-2 border-slate-200 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 flex flex-col gap-4 sm:gap-5 text-left"
          >
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setSelectedTool(null)}
              className="cursor-target absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="pr-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-400 font-bold">
                  {selectedTool.categoryName}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 font-bold">
                  {selectedTool.pricing}
                </span>
              </div>
              <h2 className="font-clash-semibold text-2xl sm:text-3xl font-bold text-slate-900">
                {selectedTool.name}
              </h2>
            </div>

            {/* Modal Description */}
            <p className="font-sans text-sm sm:text-base text-slate-600 leading-relaxed">
              {selectedTool.description}
            </p>

            {/* Student Perk Highlight */}
            {selectedTool.studentPerk && (
              <div className="p-3.5 rounded-2xl bg-accent/10 border border-accent/20 flex items-start gap-3">
                <Gift className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-clash-semibold text-sm font-bold text-slate-900">
                    Student Perk / Educational Benefit
                  </h4>
                  <p className="font-sans text-xs text-slate-700 mt-0.5">
                    {selectedTool.studentPerk}
                  </p>
                </div>
              </div>
            )}

            {/* Key Features List */}
            {selectedTool.keyFeatures && selectedTool.keyFeatures.length > 0 && (
              <div>
                <h4 className="font-mono text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                  Key Capabilities & Highlights
                </h4>
                <ul className="space-y-2">
                  {selectedTool.keyFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700 font-sans text-xs sm:text-sm">
                      <span className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            <div>
              <h4 className="font-mono text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                Tags & Ecosystem
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedTool.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleCopyModalUrl(selectedTool.url)}
                className="cursor-target inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-accent hover:text-accent font-mono text-xs font-bold text-slate-700 transition-colors"
              >
                {modalCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600">Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Direct Link</span>
                  </>
                )}
              </button>

              <a
                href={selectedTool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-target inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md"
              >
                Launch Tool
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
