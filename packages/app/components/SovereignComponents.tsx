
import React from 'react';
import { getSurface, TYPOGRAPHY, INTERACTIVE, STATUS } from '../theme/design-system';
import { useLowDataMode } from '../hooks/useLowDataMode';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, Loader2 } from 'lucide-react';

// --- 1. SOVEREIGN BUTTON ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const SovereignButton: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', className = '', isLoading, icon, style, ...props 
}) => {
  const baseClass = INTERACTIVE.button.base;
  const variantClass = INTERACTIVE.button[variant];
  
  // Dynamic Primary Color support via inline style if provided, else falls back to class
  const finalStyle = variant === 'primary' && !className.includes('bg-') 
    ? { backgroundColor: 'var(--primary-color)', ...style } 
    : style;

  return (
    <button 
      className={`${baseClass} ${variantClass} ${className} ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
      style={finalStyle}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!isLoading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// --- 2. STAT CARD (KPI WIDGET) ---
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
    <div className={`${getSurface(isLowData)} rounded-xl p-6 relative overflow-hidden group`}>
      {/* Decorative Gradient Blob */}
      {!isLowData && (
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
      )}
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-2 bg-gray-50 rounded-lg text-gray-600 border border-gray-100">
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
        <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

// --- 3. SOVEREIGN TABLE (HIGH DENSITY) ---
interface Column<T> {
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
    <div className={`${getSurface(isLowData)} rounded-xl overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/50">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
              {actions && <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>}
            </tr>
          </thead>
          <tbody className="bg-white/50 divide-y divide-gray-100">
            {data.map((item, rowIdx) => (
              <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
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

// --- 4. SKELETON LOADER ---
export const SovereignSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// --- 5. PAGE HEADER ---
export const PageHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
    <div>
      <h1 className={TYPOGRAPHY.h1}>{title}</h1>
      {subtitle && <p className={TYPOGRAPHY.body}>{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);
