import { Trophy } from 'lucide-react';
import type { Top3Vendor } from '../types';

interface Top3CardProps {
  vendors: Top3Vendor[];
}

const medals = ['🥇', '🥈', '🥉'];
const colors = [
  'from-yellow-400 to-amber-500',
  'from-slate-300 to-slate-400',
  'from-orange-400 to-amber-600'
];

export default function Top3Card({ vendors }: Top3CardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden h-full">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
        <div className="flex items-center gap-3">
          <Trophy size={28} />
          <h3 className="text-xl font-bold">Top 3 Vendedores</h3>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {vendors.map((vendor, index) => (
          <div key={index} className="group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{medals[index]}</span>
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-lg">{vendor.name}</p>
                <p className="text-sm text-slate-500 font-medium">
                  R$ {vendor.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div
                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colors[index]} rounded-full transition-all duration-700 ease-out shadow-sm`}
                style={{ width: `${vendor.percentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}

        {vendors.length === 0 && (
          <p className="text-slate-400 text-center py-8">Nenhum dado disponível</p>
        )}
      </div>
    </div>
  );
}
