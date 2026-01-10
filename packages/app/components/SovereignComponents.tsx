
import React from 'react';
import { getSurface, TYPOGRAPHY, INTERACTIVE, STATUS } from '../theme/design-system';
import { useLowDataMode } from '../hooks/useLowDataMode';
import { ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// --- 1. SOVEREIGN BUTTON ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const SovereignButton: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', className = '', isLoading, icon, style, onClick, ...props 
}) => {
  const baseClass = INTERACTIVE.button.base;
  const variantClass = INTERACTIVE.button[variant];
  
  const finalStyle = variant === 'primary' && !className.includes('bg-') 
    ? { backgroundColor: 'var(--primary-color)', ...style } 
    : style;

  const handlePress = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (onClick) onClick(e);
  };

  return (
    <button 
      className={`${baseClass} ${variantClass} ${className} ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
      style={finalStyle}
      disabled={isLoading || props.disabled}
      onClick={handlePress}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!isLoading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// --- 2. SOVEREIGN INPUT (ACCESSIBILITY ENHANCED) ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export const SovereignInput: React.FC<InputProps> = ({ label, icon, error, className = '', ...props }) => {
  return (
    <div className="space-y-1.5 group">
      {label && (
        <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wide group-focus-within:text-indigo-600 transition-colors">
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 group-focus-within:text-indigo-600 transition-colors z-10">
            {icon}
          </div>
        )}
        <input
          className={`block w-full rounded-lg border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 shadow-sm transition-colors ${icon ? 'pl-10' : 'pl-3'} font-medium ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-600 font-bold">{error}</p>}
    </div>
  );
};

// --- 3. SOVEREIGN BADGE ---
interface BadgeProps {
  status: 'success' | 'warning' | 'error' | 'neutral';
  children: React.ReactNode;
}

export const SovereignBadge: React.FC<BadgeProps> = ({ status, children }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${STATUS[status]}`}>
      {children}
    </span>
  );
};

// --- 4. STAT CARD (KPI WIDGET) ---
interface StatCardProps {
  title: string;
  value: string | number;
  trend?: { value: number; isPositive: boolean };
  icon: React.ReactNode;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon, subtitle }) => {
  const { isLowData } = useLowDataMode();
  
  return (
    <div className={`${getSurface(isLowData)} rounded-xl p-6 relative overflow-hidden group border border-gray-100`}>
      {!isLowData && (
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
      )}
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-2 bg-gray-50 rounded-lg text-gray-600 border border-gray-100 shadow-sm">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
            trend.isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {trend.isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
        <p className="text-2xl font-black text-gray-900 tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
};

// --- 5. SOVEREIGN TABLE (HIGH DENSITY) ---
export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: (item: T) => React.ReactNode;
}

export function SovereignTable<T extends { id: string | number }>({ data, columns, actions }: TableProps<T>) {
  const { isLowData } = useLowDataMode();

  return (
    <div className={`${getSurface(isLowData)} rounded-xl overflow-hidden border border-gray-200 shadow-sm`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/80 backdrop-blur-sm">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
              {actions && <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>}
            </tr>
          </thead>
          <tbody className="bg-white/60 divide-y divide-gray-100">
            {data.map((item, rowIdx) => (
              <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors group">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                    {typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor] as React.ReactNode)}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                      {actions(item)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- 6. SKELETON LOADER ---
export const SovereignSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// --- 7. PAGE HEADER ---
export const PageHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
    <div>
      <h1 className={TYPOGRAPHY.h1}>{title}</h1>
      {subtitle && <p className={TYPOGRAPHY.body}>{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);
