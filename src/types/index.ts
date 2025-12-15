export interface UpgradeRecord {
  periodo: string;
  cliente: string;
  vendedor: string;
  processo: string;
  plano: string;
  diff: number;
  rawDiff: string;
}

export interface VendorData {
  [key: string]: number;
}

export interface PlanData {
  [key: string]: number;
}

export interface Top3Vendor {
  name: string;
  value: number;
  percentage: number;
}

export interface DashboardStats {
  totalRecords: number;
  totalValue: number;
  bestSeller: {
    name: string;
    value: number;
  };
  top3Vendors: Top3Vendor[];
  vendorData: VendorData;
  planData: PlanData;
}
