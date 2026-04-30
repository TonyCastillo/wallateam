import { IconName } from '@/components/Icon';

export type CategoryId =
  | 'food'
  | 'transport'
  | 'home'
  | 'shopping'
  | 'entertainment'
  | 'health'
  | 'work'
  | 'other';

export interface CategoryDef {
  id: CategoryId;
  label: string;
  icon: IconName;
  color: string;
}

export const CATEGORIES: CategoryDef[] = [
  { id: 'food',          label: 'Comida',          icon: 'UtensilsCrossed', color: '#2ECC71' },
  { id: 'transport',     label: 'Transporte',      icon: 'Car',             color: '#3B82F6' },
  { id: 'home',          label: 'Hogar',           icon: 'Home',            color: '#1F3A5F' },
  { id: 'shopping',      label: 'Compras',         icon: 'ShoppingBag',     color: '#9B59B6' },
  { id: 'entertainment', label: 'Entretenimiento', icon: 'Sparkles',        color: '#F39C12' },
  { id: 'health',        label: 'Salud',           icon: 'Heart',           color: '#E74C3C' },
  { id: 'work',          label: 'Trabajo',         icon: 'Briefcase',       color: '#7F8C8D' },
  { id: 'other',         label: 'Otro',            icon: 'Tag',             color: '#16A085' },
];

export function categoryById(id: string | null | undefined): CategoryDef {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}
