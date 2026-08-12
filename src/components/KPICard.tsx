import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendPositive = true,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-card border border-border hover:border-[#D2D0C1]/60 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between group">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <div className="p-2 rounded-xl bg-background border border-border text-[#D2D0C1] group-hover:scale-105 transition-transform">
          {icon}
        </div>
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
          {value}
        </div>
        {(subtitle || trend) && (
          <div className="flex items-center gap-2 mt-1 text-xs">
            {trend && (
              <span
                className={`font-semibold ${
                  trendPositive ? 'text-emerald-500' : 'text-rose-500'
                }`}
              >
                {trend}
              </span>
            )}
            {subtitle && (
              <span className="text-muted-foreground truncate">{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
