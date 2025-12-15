import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  gradient: string;
}

export default function StatsCard({ title, value, subtitle, icon, gradient }: StatsCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800 mb-1 break-words">{value}</h3>
            {subtitle && (
              <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
            )}
          </div>
          <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md ml-4`}>
            {icon}
          </div>
        </div>
      </div>

      <div className={`h-1 bg-gradient-to-r ${gradient}`}></div>
    </div>
  );
}
