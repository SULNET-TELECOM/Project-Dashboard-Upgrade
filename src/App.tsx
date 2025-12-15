import { useState, useEffect } from 'react';
import { Upload, Trash2, FileText, TrendingUp, Users, Award } from 'lucide-react';
import StatsCard from './components/StatsCard';
import Top3Card from './components/Top3Card';
import ChartsSection from './components/ChartsSection';
import DataTable from './components/DataTable';
import { parseCSV, calculateStats } from './utils/csvParser';
import type { UpgradeRecord, DashboardStats } from './types';

function App() {
  const [data, setData] = useState<UpgradeRecord[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lastCSV, setLastCSV] = useState<string | null>(null);
  const [status, setStatus] = useState('Aguardando arquivo...');

  useEffect(() => {
    const savedCSV = localStorage.getItem('dashboard_csv_data');
    if (savedCSV) {
      try {
        setLastCSV(savedCSV);
        const parsed = parseCSV(savedCSV);
        setData(parsed);
        setStats(calculateStats(parsed));
        setStatus(`Dashboard carregado a partir de dados salvos — ${parsed.length} registros`);
      } catch (error) {
        console.error('Erro ao processar CSV salvo:', error);
        setStatus('Erro ao carregar dados salvos');
        localStorage.removeItem('dashboard_csv_data');
      }
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setStatus('Nenhum arquivo selecionado');
      return;
    }

    setStatus('Lendo arquivo...');
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        setLastCSV(text);
        localStorage.setItem('dashboard_csv_data', text);
        const parsed = parseCSV(text);
        setData(parsed);
        setStats(calculateStats(parsed));
        setStatus(`Arquivo carregado — ${parsed.length} registros`);
      } catch (error) {
        console.error('Erro ao processar CSV:', error);
        setStatus('Erro ao processar CSV');
      }
    };

    reader.onerror = () => setStatus('Erro ao ler o arquivo');
    reader.readAsText(file, 'UTF-8');
    event.target.value = '';
  };

  const handleClear = () => {
    localStorage.removeItem('dashboard_csv_data');
    setData([]);
    setStats(null);
    setLastCSV(null);
    setStatus('Dashboard limpo. Aguardando novo arquivo...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50 px-6 sm:px-6 md:px-8 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
            <TrendingUp className="text-orange-500" size={36} />
            Dashboard UPGRADEs - Sulnet
          </h1>
          <p className="text-slate-600">Análise completa de upgrades e performance</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex-1 min-w-[200px]">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 file:cursor-pointer file:transition-all"
              />
            </label>
            <button
              onClick={handleClear}
              className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:bg-slate-300 disabled:cursor-not-allowed"
              disabled={!stats}
            >
              <Trash2 size={18} />
              Limpar
            </button>
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <FileText size={18} />
              {status}
            </div>
          </div>
        </div>

        {stats && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="grid grid-cols-1 gap-4">
                <StatsCard
                  title="Total de Registros"
                  value={stats.totalRecords.toString()}
                  icon={<FileText size={24} />}
                  gradient="from-blue-500 to-cyan-500"
                />
                <StatsCard
                  title="Valor Total de Upgrades"
                  value={`R$ ${stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  icon={<TrendingUp size={24} />}
                  gradient="from-emerald-500 to-teal-500"
                />
                <StatsCard
                  title="Melhor Vendedor"
                  value={stats.bestSeller.name}
                  subtitle={`R$ ${stats.bestSeller.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  icon={<Award size={24} />}
                  gradient="from-orange-500 to-amber-500"
                />
              </div>
              <Top3Card vendors={stats.top3Vendors} />
            </div>

            <ChartsSection
              vendorData={stats.vendorData}
              planData={stats.planData}
            />

            <DataTable data={data} />
          </>
        )}

        {!stats && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
            <Upload className="mx-auto text-slate-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Nenhum arquivo carregado</h3>
            <p className="text-slate-500">Faça upload de um arquivo CSV para visualizar o dashboard</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
