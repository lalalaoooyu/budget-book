export type Category = '資産' | '負債' | '収益' | '費用';

export interface Entry {
  id: string;
  category: Category;
  name: string;
  amount: number;
  note: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
}

export interface MonthlyRecord {
  yearMonth: string;
  assets: number | null;
  target: string;
  dcPension: number | null;
  welfarePension: number | null;
  nationalPension: number | null;
  feedback: string;
}

export const initialEntries: Entry[] = [
  { id: '1', category: '資産', name: 'みずほ銀行', amount: 250000, note: '' },
  { id: '2', category: '資産', name: 'ゆうちょ銀行', amount: 80000, note: '' },
  { id: '3', category: '資産', name: 'NISA口座', amount: 500000, note: '投資口座' },
  { id: '4', category: '資産', name: '現金', amount: 15000, note: '' },
  { id: '5', category: '負債', name: 'クレジットカード', amount: 45000, note: '今月分' },
  { id: '6', category: '負債', name: 'ローン', amount: 60000, note: '残り' },
  { id: '7', category: '収益', name: '給与', amount: 350000, note: '月給' },
  { id: '8', category: '収益', name: '副業', amount: 30000, note: '' },
  { id: '9', category: '費用', name: '家賃', amount: 85000, note: '' },
  { id: '10', category: '費用', name: '水道光熱', amount: 12000, note: '' },
  { id: '11', category: '費用', name: '食費', amount: 60000, note: '' },
  { id: '12', category: '費用', name: '交通', amount: 8000, note: '' },
  { id: '13', category: '費用', name: '通信費', amount: 5000, note: '' },
  { id: '14', category: '費用', name: '娯楽', amount: 15000, note: '' },
  { id: '15', category: '費用', name: '雑費', amount: 10000, note: '' },
  { id: '16', category: '費用', name: 'サブスク', amount: 5500, note: '' },
];

export const initialSubscriptions: Subscription[] = [
  { id: 's1', name: 'Netflix', amount: 1490 },
  { id: 's2', name: 'Spotify', amount: 980 },
  { id: 's3', name: 'iCloud', amount: 400 },
  { id: 's4', name: 'YouTube Premium', amount: 1280 },
  { id: 's5', name: 'Amazon Prime', amount: 600 },
  { id: 's6', name: 'ChatGPT Plus', amount: 750 },
];

export const initialMonthlyRecords: MonthlyRecord[] = [
  { yearMonth: '2025年5月', assets: 520000, target: '', dcPension: null, welfarePension: null, nationalPension: null, feedback: '' },
  { yearMonth: '2025年6月', assets: 580000, target: '', dcPension: null, welfarePension: null, nationalPension: null, feedback: '' },
  { yearMonth: '2025年7月', assets: 640000, target: '50万', dcPension: 85000, welfarePension: 35000, nationalPension: null, feedback: '' },
  { yearMonth: '2025年8月', assets: 610000, target: '', dcPension: null, welfarePension: null, nationalPension: null, feedback: '' },
  { yearMonth: '2025年9月', assets: 690000, target: '', dcPension: 100000, welfarePension: null, nationalPension: null, feedback: '節約を心がける' },
  { yearMonth: '2025年10月', assets: 720000, target: '', dcPension: null, welfarePension: null, nationalPension: null, feedback: '' },
  { yearMonth: '2025年11月', assets: 750000, target: '', dcPension: null, welfarePension: null, nationalPension: null, feedback: '' },
  { yearMonth: '2025年12月', assets: null, target: '100万', dcPension: null, welfarePension: null, nationalPension: null, feedback: '' },
  { yearMonth: '2026年1月', assets: null, target: '', dcPension: null, welfarePension: null, nationalPension: null, feedback: '' },
  { yearMonth: '2026年2月', assets: null, target: '', dcPension: null, welfarePension: null, nationalPension: null, feedback: '' },
  { yearMonth: '2026年3月', assets: null, target: '', dcPension: null, welfarePension: null, nationalPension: null, feedback: '' },
];
