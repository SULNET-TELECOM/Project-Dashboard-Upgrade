import type { UpgradeRecord, DashboardStats, VendorData, PlanData } from '../types';

export function parseCSV(text: string): UpgradeRecord[] {
  if (!text) return [];

  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
  const lines = text.split(/\r?\n/).map(l => l.trim());
  if (lines.length <= 1) return [];

  const data: UpgradeRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    const cols = line.split(/;(?![^"]*")/).map(c => c.replace(/^"|"$/g, '').trim());
    if (cols.every(c => c === '')) continue;
    while (cols.length < 6) cols.push('');

    let raw = cols[5] || '';
    raw = String(raw).trim();
    if (raw === '' || /^(-|na|n\/a|nan|null|undefined)$/i.test(raw)) raw = '0';
    raw = raw.replace(/R\$/g, '').replace(/\s/g, '');
    if (raw.indexOf('.') !== -1 && raw.indexOf(',') !== -1) {
      raw = raw.replace(/\./g, '').replace(/,/g, '.');
    } else if (raw.indexOf(',') !== -1) {
      raw = raw.replace(/,/g, '.');
    }

    if ((cols[1] === "" && cols[2] === "" && cols[4] === "") && raw === "0") continue;

    const diff = parseFloat(raw);
    data.push({
      periodo: cols[0] || '',
      cliente: cols[1] || '',
      vendedor: cols[2] || '',
      processo: cols[3] || '',
      plano: cols[4] || '',
      diff: isNaN(diff) ? 0 : diff,
      rawDiff: cols[5] || ''
    });
  }

  return data.sort((a, b) => (b.diff || 0) - (a.diff || 0));
}

export function calculateStats(data: UpgradeRecord[]): DashboardStats {
  const totalRecords = data.length;
  const totalValue = data.reduce((sum, record) => sum + (record.diff || 0), 0);

  const vendorData: VendorData = {};
  const planData: PlanData = {};

  data.forEach(record => {
    vendorData[record.vendedor] = (vendorData[record.vendedor] || 0) + (record.diff || 0);
    planData[record.plano] = (planData[record.plano] || 0) + 1;
  });

  const sortedVendors = Object.entries(vendorData).sort((a, b) => b[1] - a[1]);
  const bestSeller = sortedVendors[0]
    ? { name: sortedVendors[0][0], value: sortedVendors[0][1] }
    : { name: '—', value: 0 };

  const maxValue = sortedVendors[0]?.[1] || 1;
  const top3Vendors = sortedVendors.slice(0, 3).map(([name, value]) => ({
    name,
    value,
    percentage: (value / maxValue) * 100
  }));

  return {
    totalRecords,
    totalValue,
    bestSeller,
    top3Vendors,
    vendorData,
    planData
  };
}
