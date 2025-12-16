import { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import type { UpgradeRecord } from '../types';

interface DataTableProps {
  data: UpgradeRecord[];
}

type SortField = keyof UpgradeRecord;
type SortDirection = 'asc' | 'desc';

export default function DataTable({ data }: DataTableProps) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('diff');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(record =>
      Object.values(record).some(value =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );

    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return sortDirection === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

    return filtered;
  }, [data, search, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-slate-800">Registros Detalhados</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <colgroup>
            <col style={{ width: '13%' }} />
            <col style={{ width: '19%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '24%' }} />
            <col style={{ width: '8%' }} />
          </colgroup>
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {[
                { field: 'periodo' as SortField, label: 'Período' },
                { field: 'cliente' as SortField, label: 'Cliente' },
                { field: 'vendedor' as SortField, label: 'Vendedor' },
                { field: 'processo' as SortField, label: 'Processo' },
                { field: 'plano' as SortField, label: 'Plano Novo' },
                { field: 'diff' as SortField, label: 'Diferença' },
              ].map(({ field, label }) => (
                <th
                  key={field}
                  onClick={() => handleSort(field)}
                  className="px-2 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors overflow-hidden"
                >
                  <div className="flex items-center gap-2 truncate">
                    {label}
                    <SortIcon field={field} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.map((record, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors">
                <td className="px-3 py-4 text-xs text-slate-700 font-semibold truncate" title={record.periodo}>{record.periodo}</td>
                <td className="px-2 py-4 text-xs text-slate-700 font-semibold truncate" title={record.cliente}>{record.cliente}</td>
                <td className="px-2 py-4 text-xs text-slate-700 truncate" title={record.vendedor}>{record.vendedor}</td>
                <td className="px-2 py-4 text-xs text-slate-700 truncate" title={record.processo}>{record.processo}</td>
                <td className="px-2 py-4 text-xs text-slate-700 font-semibold truncate" title={record.plano}>{record.plano}</td>
                <td className="px-2 py-4 text-xs font-semibold text-emerald-600 truncate">
                  {record.diff.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedData.length === 0 && (
        <div className="p-12 text-center text-slate-400">
          <p>Nenhum registro encontrado</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="p-6 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredAndSortedData.length)} de {filteredAndSortedData.length} registros
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
