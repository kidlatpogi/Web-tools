import type { CategoryInfo, ToolItem, CategoryId, PricingType } from '../types/tool';
import categoriesData from './categories.json';
import toolsData from './tools.json';

export const categories: CategoryInfo[] = categoriesData as CategoryInfo[];
export const tools: ToolItem[] = toolsData as ToolItem[];

export function getAllTools(): ToolItem[] {
  return tools;
}

export function getFeaturedTools(): ToolItem[] {
  return tools.filter((tool) => tool.featured);
}

export function getToolsByCategory(categoryId: CategoryId): ToolItem[] {
  return tools.filter((tool) => tool.category === categoryId);
}

export function getToolById(id: string): ToolItem | undefined {
  return tools.find((tool) => tool.id === id);
}

export function getCategories(): CategoryInfo[] {
  return categories;
}

export function getCategoryById(id: string): CategoryInfo | undefined {
  return categories.find((cat) => cat.id === id);
}

export function searchTools(query: string, category?: string, pricing?: string): ToolItem[] {
  const q = query.toLowerCase().trim();
  return tools.filter((tool) => {
    if (category && category !== 'all' && tool.category !== category) return false;
    if (pricing && pricing !== 'all' && tool.pricing !== pricing) return false;
    if (!q) return true;
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      tool.categoryName.toLowerCase().includes(q) ||
      (tool.studentPerk && tool.studentPerk.toLowerCase().includes(q))
    );
  });
}

export function getCategoryStats() {
  const stats: Record<string, number> = { all: tools.length };
  for (const cat of categories) {
    stats[cat.id] = tools.filter((t) => t.category === cat.id).length;
  }
  return stats;
}
