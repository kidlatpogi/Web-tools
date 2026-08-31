export type PricingType =
  | 'Free'
  | 'Freemium'
  | 'Paid'
  | 'Open Source'
  | 'Free with Student ID';

export type CategoryId =
  | 'ide'
  | 'ai-agents'
  | 'ai-chatbots'
  | 'design-inspiration'
  | 'certifications'
  | 'typography-assets'
  | 'student-perks';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  shortName: string;
  description: string;
  iconName: string;
  gradient: string;
}

export interface ToolItem {
  id: string;
  name: string;
  url: string;
  description: string;
  category: CategoryId;
  categoryName: string;
  pricing: PricingType;
  tags: string[];
  featured?: boolean;
  icon?: string;
  previewImage?: string;
  keyFeatures?: string[];
  studentPerk?: string;
  createdAt?: string;
}
