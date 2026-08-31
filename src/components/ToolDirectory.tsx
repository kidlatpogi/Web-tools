import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  ArrowUpDown,
  ShieldCheck,
  Scale,
  Wrench,
  ChevronLeft,
  ChevronRight
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
  'student-perks': <Gift className="w-3.5 h-3.5" />,
  'online-tools': <Wrench className="w-3.5 h-3.5" />
};

const ITEMS_PER_PAGE = 12;

export const ToolDirectory: React.FC<ToolDirectoryProps> = ({ initialTools, categories }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPricing, setSelectedPricing] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'az' | 'za'>('default');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [modalCopied, setModalCopied] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Shortcuts (/ to search, Esc to close/clear)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        if (showPolicyModal) {
          setShowPolicyModal(false);
        } else if (selectedTool) {
          setSelectedTool(null);
        } else if (searchQuery) {
          setSearchQuery('');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTool, showPolicyModal, searchQuery]);

  // Reset pagination to first page when search, category, pricing, or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedPricing, sortBy]);

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

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(processedTools.length / ITEMS_PER_PAGE));
  const paginatedTools = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedTools.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [processedTools, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    const directoryEl = document.getElementById('directory');
    if (directoryEl) {
      directoryEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dynamic pagination window helper
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  }, [currentPage, totalPages]);

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
      {/* Semantic Directory Heading for Screen Readers and SEO hierarchy */}
      <h2 className="sr-only">Curated Developer Tools &amp; CS Student Utilities</h2>

      {/* Directory Top Header Controls */}
      <div className="flex flex-col gap-5 sm:gap-6 mb-8 sm:mb-10">
        
        {/* Search Bar */}
        <div className="relative w-full max-w-3xl mx-auto px-1">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 sm:w-5 h-4 sm:h-5 text-slate-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              id="search-tools"
              name="search"
              aria-label="Search tools, topics, tags, and categories"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools, topics, tags (e.g. NetAcad, React, AI, Free Certs)..."
              className="w-full pl-11 sm:pl-12 pr-20 py-3.5 sm:py-4 rounded-2xl bg-white/90 backdrop-blur-md border-2 border-slate-200/90 text-slate-900 placeholder:text-slate-400 font-sans text-xs sm:text-base focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 shadow-sm transition-all cursor-target"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-target"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <div className="absolute right-3.5 hidden sm:flex items-center gap-1 pointer-events-none">
                <kbd className="px-2 py-0.5 text-[11px] font-mono font-bold text-slate-400 bg-slate-100 border border-slate-200 rounded-md shadow-2xs">
                  /
                </kbd>
              </div>
            )}
          </div>
        </div>

        {/* Category Filter Wrapping Pills: 2 columns on mobile (4 rows + bottom row for online-tools), flex-wrap on desktop */}
        <div className="w-full max-w-5xl mx-auto grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-2.5 px-2 sm:px-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`col-span-1 cursor-target inline-flex items-center justify-between sm:justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2 rounded-full font-mono text-[10.5px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 border-2 ${
              selectedCategory === 'all'
                ? 'bg-accent text-white border-accent shadow-md shadow-accent/20'
                : 'bg-white/90 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white'
            }`}
          >
            <div className="inline-flex items-center gap-1.5 truncate">
              <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">All Tools</span>
            </div>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] shrink-0 font-bold ${
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
            const isOnlineTools = cat.id === 'online-tools';
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`${
                  isOnlineTools ? 'col-span-2' : 'col-span-1'
                } cursor-target inline-flex items-center ${
                  isOnlineTools ? 'justify-center' : 'justify-between sm:justify-center'
                } gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2 rounded-full font-mono text-[10.5px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 border-2 ${
                  isSelected
                    ? 'bg-accent text-white border-accent shadow-md shadow-accent/20'
                    : 'bg-white/90 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="inline-flex items-center gap-1.5 truncate">
                  <span className="shrink-0">{CATEGORY_ICON_MAP[cat.id] || <Tag className="w-3.5 h-3.5" />}</span>
                  <span className="truncate">{cat.shortName}</span>
                </div>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] shrink-0 font-bold ${
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
              Showing{' '}
              <span className="text-accent">
                {processedTools.length === 0
                  ? 0
                  : `${(currentPage - 1) * ITEMS_PER_PAGE + 1} - ${Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      processedTools.length
                    )}`}
              </span>{' '}
              of {processedTools.length}
            </div>
          </div>

        </div>

      </div>

      {/* Tools Bento Grid with Pagination */}
      {paginatedTools.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {paginatedTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} onSelect={(t) => setSelectedTool(t)} />
            ))}
          </div>

          {/* Responsive Pagination Controls Bar */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 sm:mt-10 pt-6 border-t border-slate-200/80">
              <div className="font-mono text-xs text-slate-500 font-medium text-center sm:text-left">
                Page <span className="text-slate-900 font-bold">{currentPage}</span> of{' '}
                <span className="text-slate-900 font-bold">{totalPages}</span>
                <span className="hidden sm:inline text-slate-400"> &bull; {processedTools.length} total tools</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                {/* Prev Button */}
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`cursor-target inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-mono text-xs font-bold uppercase transition-all duration-200 border ${
                    currentPage === 1
                      ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200'
                      : 'bg-white hover:bg-slate-900 hover:text-white text-slate-700 border-slate-200 shadow-xs'
                  }`}
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                {/* Page Number Pills */}
                <div className="flex items-center gap-1">
                  {pageNumbers.map((page, idx) => {
                    if (page === '...') {
                      return (
                        <span key={`ellipsis-${idx}`} className="px-1.5 py-1 text-slate-400 font-mono text-xs font-bold">
                          ...
                        </span>
                      );
                    }
                    const pageNum = page as number;
                    const isActive = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        className={`cursor-target w-8 h-8 sm:w-9 sm:h-9 rounded-xl font-mono text-xs font-bold flex items-center justify-center transition-all duration-200 border ${
                          isActive
                            ? 'bg-accent text-white border-accent shadow-md shadow-accent/20'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                        aria-label={`Go to page ${pageNum}`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={`cursor-target inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-mono text-xs font-bold uppercase transition-all duration-200 border ${
                    currentPage === totalPages
                      ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200'
                      : 'bg-white hover:bg-slate-900 hover:text-white text-slate-700 border-slate-200 shadow-xs'
                  }`}
                  aria-label="Next Page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
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
              <div className="p-3.5 rounded-xs bg-accent/10 border border-accent/20 flex items-start gap-3">
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

      {/* Complete Responsive Footer with Copyright and Legal Disclaimer Below It */}
      <footer className="w-full border-t border-slate-200/80 bg-white/80 backdrop-blur-md py-8 px-4 sm:px-6 md:px-12 mt-16 sm:mt-20">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-4 text-center sm:text-left">
          {/* Top Row: Copyright, Author, Portfolio Link & Back to Top */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs font-mono text-slate-600">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span>&copy; {new Date().getFullYear()} <strong className="text-slate-900">Web-Tools</strong>.</span>
              <span>Made by</span>
              <a
                href="https://github.com/kidlatpogi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent font-bold hover:underline cursor-target"
              >
                kidlatpogi
              </a>
              <span className="text-slate-300 hidden sm:inline">&bull;</span>
              <a
                href="https://portfolio.kidlat.workers.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-target inline-flex items-center gap-1 text-slate-700 hover:text-accent font-bold transition-colors"
              >
                Visit my Portfolio
                <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a href="#directory" className="hover:text-accent font-medium transition-colors cursor-target">
                Back to Top &uarr;
              </a>
            </div>
          </div>

          {/* Bottom Row: Independent Curation & Legal Disclaimer below copyright */}
          <div className="pt-4 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-3 text-left">
            <p className="font-sans text-[11px] sm:text-xs text-slate-500 leading-relaxed max-w-3xl">
              <strong className="text-slate-700 font-semibold">Independent Curation:</strong> All trademarks, product names, and brand assets displayed belong to their respective copyright holders. We do not host or own third-party services.
            </p>
            <button
              type="button"
              onClick={() => setShowPolicyModal(true)}
              className="cursor-target shrink-0 font-mono text-[11px] font-bold uppercase tracking-wider text-accent hover:text-slate-900 hover:underline inline-flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Legal Disclaimer &amp; Privacy Policy &rarr;
            </button>
          </div>
        </div>
      </footer>

      {/* Legal Disclaimer & Privacy Policy Modal */}
      {showPolicyModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="policy-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={() => setShowPolicyModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white border-2 border-slate-200 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col gap-5 text-left"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowPolicyModal(false)}
              className="cursor-target absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"
              title="Close legal policy"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-3 pr-8 border-b border-slate-100 pb-4">
              <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                  Legal Compliance &bull; Attribution &bull; Terms
                </span>
                <h2 id="policy-modal-title" className="font-clash-semibold text-2xl sm:text-3xl font-bold text-slate-900">
                  Legal Disclaimer &amp; Privacy Policy
                </h2>
              </div>
            </div>

            {/* Policy Content */}
            <div className="space-y-4 font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div>
                <h3 className="font-clash-semibold text-base font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  1. Trademark &amp; Intellectual Property Attribution
                </h3>
                <p>
                  <strong>Web-Tools</strong> is an independent, open-source educational directory and aggregation platform. All product names, trademarks, registered trademarks, logos, brand names, and service marks referenced on this website are the property of their respective owners. Their identification and listing on Web-Tools are strictly for educational, informational, and indexing purposes and do not imply any affiliation, sponsorship, or endorsement by the trademark holders.
                </p>
              </div>

              <div>
                <h3 className="font-clash-semibold text-base font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  2. Third-Party Content &amp; External Links Disclaimer
                </h3>
                <p>
                  We do not own, operate, manage, or host any of the third-party software, applications, platforms, cloud compute providers, or educational certification portals indexed in this directory. All outbound links navigate directly to official external domains. Pricing tiers, student discounts, promotional credits, and feature availabilities are determined independently by respective operators and are subject to change without notice.
                </p>
              </div>

              <div>
                <h3 className="font-clash-semibold text-base font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  3. Privacy &amp; Data Collection Statement
                </h3>
                <p>
                  Web-Tools is built with a <strong>privacy-first</strong> ethos:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-700">
                  <li><strong>Zero Tracking:</strong> We do not track personal identifying information (PII) or sell user data to advertising brokers.</li>
                  <li><strong>Client-Side Processing:</strong> All searches, category filter queries, clipboard operations, and sorting logic execute 100% locally in your browser.</li>
                  <li><strong>No Cookies:</strong> We do not deploy third-party advertising or cross-site tracking cookies.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-clash-semibold text-base font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  4. DMCA &amp; Takedown Requests
                </h3>
                <p>
                  If you are a copyright or trademark owner and wish to update, modify, or remove your listing or intellectual property from our public index, please submit an issue or pull request directly on our official{' '}
                  <a
                    href="https://github.com/kidlatpogi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent font-semibold hover:underline"
                  >
                    GitHub repository
                  </a>
                  . Inquiries are processed promptly.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="font-mono text-[11px] text-slate-400">
                Last updated: August 2026
              </span>
              <button
                type="button"
                onClick={() => setShowPolicyModal(false)}
                className="cursor-target px-5 py-2 rounded-xl bg-slate-900 hover:bg-accent text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
