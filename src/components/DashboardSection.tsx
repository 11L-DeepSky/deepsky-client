
import React from 'react';
import { cn } from "@/lib/utils";

interface DashboardSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const DashboardSection = ({ title, children, className }: DashboardSectionProps) => {
  return (
    <div className={cn(
      "bg-dashboard-card rounded-lg border border-dashboard-border p-4",
      "transition-all duration-200 animate-fade-in",
      "backdrop-blur-sm backdrop-filter",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-gray-200 tracking-wide">{title}</h2>
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
      </div>
      <div className="h-[calc(100%-2rem)]">
        {children}
      </div>
    </div>
  );
};

export default DashboardSection;
