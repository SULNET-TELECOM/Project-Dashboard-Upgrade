import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { BarChart3, PieChart } from 'lucide-react';
import type { VendorData, PlanData } from '../types';

Chart.register(...registerables);

interface ChartsSectionProps {
  vendorData: VendorData;
  planData: PlanData;
}

const colors = ['#0fa3b1', '#d9e5d6', '#eddea4', '#f7a072', '#ff9b42'];

export default function ChartsSection({ vendorData, planData }: ChartsSectionProps) {
  const vendorChartRef = useRef<HTMLCanvasElement>(null);
  const planChartRef = useRef<HTMLCanvasElement>(null);
  const vendorChartInstance = useRef<Chart | null>(null);
  const planChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (vendorChartInstance.current) {
      vendorChartInstance.current.destroy();
    }

    if (vendorChartRef.current) {
      const sortedVendors = Object.entries(vendorData).sort((a, b) => b[1] - a[1]);
      const labels = sortedVendors.map(v => v[0]);
      const values = sortedVendors.map(v => v[1]);

      vendorChartInstance.current = new Chart(vendorChartRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Valor Total (R$)',
            data: values,
            backgroundColor: labels.map((_, i) => colors[i % colors.length]),
            borderRadius: 8,
            borderSkipped: false,
          }]
        },
        options: {
          indexAxis: 'y' as const,
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              cornerRadius: 8,
              titleFont: { size: 12, weight: 'bold' },
              bodyFont: { size: 11 },
              maxWidth: 250,
              callbacks: {
                label: (context) => `R$ ${Number(context.parsed.x).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(0, 0, 0, 0.05)' },
              beginAtZero: true,
              ticks: {
                font: { size: 9 },
                callback: (value) => `R$ ${value}`
              }
            },
            y: {
              grid: { display: false },
              ticks: {
                font: { size: 9 }
              }
            }
          }
        }
      });
    }

    return () => {
      if (vendorChartInstance.current) {
        vendorChartInstance.current.destroy();
      }
    };
  }, [vendorData]);

  useEffect(() => {
    if (planChartInstance.current) {
      planChartInstance.current.destroy();
    }

    if (planChartRef.current) {
      const labels = Object.keys(planData);
      const values = Object.values(planData);

      planChartInstance.current = new Chart(planChartRef.current, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data: values,
            backgroundColor: labels.map((_, i) => colors[i % colors.length]),
            borderWidth: 3,
            borderColor: '#ffffff',
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom' as const,
              labels: {
                padding: 12,
                font: { size: 10 },
                usePointStyle: true,
                pointStyle: 'circle',
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              cornerRadius: 8,
              titleFont: { size: 12, weight: 'bold' },
              bodyFont: { size: 11 },
              maxWidth: 250,
              callbacks: {
                title: (context) => {
                  const label = context[0].label;
                  return label.length > 35 ? label.substring(0, 32) + '...' : label;
                }
              }
            }
          }
        }
      });
    }

    return () => {
      if (planChartInstance.current) {
        planChartInstance.current.destroy();
      }
    };
  }, [planData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#0fa3b1] to-cyan-500 p-5 text-white">
          <div className="flex items-center gap-3">
            <BarChart3 size={24} />
            <h3 className="font-bold text-lg">Ranking — Valor por Vendedor</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="relative h-96">
            <canvas ref={vendorChartRef}></canvas>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#0fa3b1] to-teal-500 p-5 text-white">
          <div className="flex items-center gap-3">
            <PieChart size={24} />
            <h3 className="font-bold text-lg">Novos Planos mais procurados</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="relative h-96">
            <canvas ref={planChartRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
