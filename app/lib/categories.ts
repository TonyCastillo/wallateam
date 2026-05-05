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

// ---------- Categorías de ingresos (solo wallets personales) ----------

export type IncomeCategoryId = 'salary' | 'freelance' | 'gift_in' | 'other_income';

export interface IncomeCategoryDef {
  id: IncomeCategoryId;
  label: string;
  icon: IconName;
  color: string;
}

export const INCOME_CATEGORIES: IncomeCategoryDef[] = [
  { id: 'salary',       label: 'Salario',     icon: 'Briefcase',  color: '#2ECC71' },
  { id: 'freelance',    label: 'Freelance',   icon: 'Laptop',     color: '#3B82F6' },
  { id: 'gift_in',      label: 'Regalo',      icon: 'Gift',       color: '#F39C12' },
  { id: 'other_income', label: 'Otro',        icon: 'PlusCircle', color: '#16A085' },
];

export function categoryById(id: string | null | undefined): CategoryDef {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}

export function incomeCategoryById(id: string | null | undefined): IncomeCategoryDef {
  return (
    INCOME_CATEGORIES.find((c) => c.id === id) ??
    INCOME_CATEGORIES[INCOME_CATEGORIES.length - 1]
  );
}

/**
 * Resuelve cualquier id de categoría sin importar si es de gasto o ingreso.
 * Útil para componentes que renderizan ambos tipos en una lista mezclada (ExpenseRow).
 */
export function anyCategoryById(
  id: string | null | undefined,
  kind: 'expense' | 'income',
): CategoryDef | IncomeCategoryDef {
  return kind === 'income' ? incomeCategoryById(id) : categoryById(id);
}
