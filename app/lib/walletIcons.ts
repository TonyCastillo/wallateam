import { IconName } from '@/components/Icon';
import { WalletIcon } from './types';

export interface WalletIconDef {
  id: WalletIcon;
  lucide: IconName;
  color: string;
  label: string;
}

export const WALLET_ICONS: WalletIconDef[] = [
  { id: 'piggy',     lucide: 'PiggyBank',  color: '#16A085', label: 'Ahorro' },
  { id: 'home',      lucide: 'Home',       color: '#1F3A5F', label: 'Hogar' },
  { id: 'plane',     lucide: 'Plane',      color: '#3B82F6', label: 'Viaje' },
  { id: 'briefcase', lucide: 'Briefcase',  color: '#7F8C8D', label: 'Trabajo' },
  { id: 'gift',      lucide: 'Gift',       color: '#E74C3C', label: 'Regalos' },
  { id: 'sparkle',   lucide: 'Sparkles',   color: '#F39C12', label: 'Eventos' },
  { id: 'shopping',  lucide: 'ShoppingBag',color: '#9B59B6', label: 'Compras' },
  { id: 'food',      lucide: 'UtensilsCrossed', color: '#2ECC71', label: 'Comida' },
];

export const DEFAULT_WALLET_ICON: WalletIcon = 'wallet';
