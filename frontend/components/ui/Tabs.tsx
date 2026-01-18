'use client';

import { useState, createContext, useContext, ReactNode } from 'react';
import { clsx } from 'clsx';

// Types
interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

// Context
const TabsContext = createContext<TabsContextType | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
}

// Tabs Root Component
export interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const activeTab = value ?? internalValue;

  const setActiveTab = (newValue: string) => {
    if (!value) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

// Tabs List Component
export interface TabsListProps {
  children: ReactNode;
  className?: string;
  variant?: 'underline' | 'pills' | 'enclosed';
}

export function TabsList({
  children,
  className,
  variant = 'underline',
}: TabsListProps) {
  const variants = {
    underline: 'flex border-b border-surface-200',
    pills: 'flex gap-2 p-1 bg-surface-100 rounded-lg',
    enclosed: 'flex border-b border-surface-200',
  };

  return (
    <div className={clsx(variants[variant], className)} role="tablist">
      {children}
    </div>
  );
}

// Tab Trigger Component
export interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
}

export function TabsTrigger({
  value,
  children,
  className,
  disabled = false,
  icon,
}: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={clsx(
        'relative px-4 py-3 font-medium text-sm',
        'transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2',
        'flex items-center gap-2',
        isActive
          ? 'text-primary-600'
          : 'text-surface-500 hover:text-surface-700',
        disabled && 'opacity-50 cursor-not-allowed',
        // Underline indicator
        'after:absolute after:bottom-0 after:left-0 after:right-0',
        'after:h-0.5 after:transition-all after:duration-200',
        isActive
          ? 'after:bg-primary-400'
          : 'after:bg-transparent hover:after:bg-surface-200',
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

// Tab Content Component
export interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      className={clsx('animate-fade-in', className)}
    >
      {children}
    </div>
  );
}

