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
  { id: '1', category: '資産', name: 'みずほ銀行', amount: 3200000, note: '' },
  { id: '2', category: '資産', name: 'ゆうちょ銀行', amount: 1500000, note: '' },
  { id: '3', category: '資産', name: 'NISA口座', amount: 2800000, note: '投資口座' },
  { id: '4', category: '資産', name: '株式', amount: 1200000, note: '' },
  { id: '5', category: '資産', name: '現金', amount: 300000, note: '' },
  { id: '6', category: '負債', name: 'クレジットカード', amount: 150000, note: '今月分' },
  { id: '7', category: '負債', name: '車ローン', amount: 850000, note: '残り12回' },
  { id: '8', category: '収益', name: '給与', amount: 600000, note: '月給' },
  { id: '9', category: '費用', name: '家賃', amount: 130000, note: '' },
  { id: '10', category: '費用', name: '水道光熱', amount: 20000, note: '' },
  { id: '11', category: '費用', name: '食費', amount: 80000, note: '' },
  { id: '12', category: '費用', name: '交通', amount: 15000, note: '' },
  { id: '13', category: '費用', name: '通信費', amount: 12000, note: '' },
  { id: '14', category: '費用', name: '娯楽', amount: 50000, note: '' },
  { id: '15', category: '費用', name: '衣服・美容', amount: 35000, note: '' },
  { id: '16', category: '費用', name: '保険', amount: 25000, note: '' },
  { id: '17', category: '費用', name: '雑費', amount: 20000, note: '' },
  { id: '18', category: '費用', name: 'サブスク', amount: 13000, note: '' },
];

export const initialSubscriptions: Subscription[] = [
  { id: 's1', name: 'Netflix', amount: 1990 },
  { id: 's2', name: 'Spotify', amount: 1580 },
  { id: 's3', name: 'iCloud', amount: 1300 },
  { id: 's4', name: 'YouTube Premium', amount: 2280 },
  { id: 's5', name: 'Amazon Prime', amount: 600 },
  { id: 's6', name: 'ChatGPT Plus', amount: 3000 },
  { id: 's7', name: 'Adobe CC', amount: 2250 },
];

export const initialMonthlyRecords: MonthlyRecord[] = [
  { yearMonth: '2025年4月', assets: 6500000, target: '', dcPension: null, welfarePension: null, nationalPension: null, feedback: '' },
  { yearMonth: '2025年5月', assets: 6700000, target: '', dcPension: null, welfarePension: null, nationalPension: null, feedback: '' },
  { yearMonth: '2025年6月', assets: 6950000, target: '', dcPension: null, welfarePension: null, nationalPension: null, feedback: '' },
  { yearMonth: '2025年7月', assets: 7200000, target: '700万', dcPension: null, welfarePension: null, nationalPension: null, feedback: '' },
  { yearMonth: '2025年8月', assets: 7100000, target: '', dcPension: null, welfarePension: null, nationalPension: null, feedback: '旅行で出費多め' },
  { yearMonth: '2025年9月', assets: 7400000, target: '', dcPension: null, welfarePension: null, nationalPension: null, feedback: '' },
  { yearMonth: '2025年10月', assets: 7650000, target: '', dcPension: null, welfarePension: null, nationalPension: null, feedback: '' },
  { yearMonth: '2025年11月', assets: 7900000, target: '', dcPension: null, welfarePension: null, nationalPension: null, feedback: '' },
  { yearMonth: '2025年12月', assets: 8000000, target: '800万', dcPension: null, welfarePension: null, nationalPension: null, feedback: '' },
  { yearMonth: '2026年1月', assets: null, target: '', dcPension: null, welfarePension: null, nationalPension: null, feedback: '' },
  { yearMonth: '2026年2月', assets: null, target: '', dcPension: null, welfarePension: null, nationalPension: null, feedback: '' },
  { yearMonth: '2026年3月', assets: null, target: '1000万', dcPension: null, welfarePension: null, nationalPension: null, feedback: '' },
];
