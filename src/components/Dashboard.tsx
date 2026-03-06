import type { Entry } from '../data/initialData';
import { useLang } from '../i18n/useLang';

interface Props {
  entries: Entry[];
}

function sumByCategory(entries: Entry[], category: string): number {
  return entries
    .filter((e) => e.category === category)
    .reduce((sum, e) => sum + e.amount, 0);
}

export default function Dashboard({ entries }: Props) {
  const { t } = useLang();
  const assets = sumByCategory(entries, '資産');
  const liabilities = sumByCategory(entries, '負債');
  const income = sumByCategory(entries, '収益');
  const expenses = sumByCategory(entries, '費用');
  const netAssets = assets - liabilities;
  const monthlyBalance = income - expenses;

  const cards = [
    { label: t.dashboard.totalAssets, value: assets, accent: 'border-l-anthro-orange' },
    { label: t.dashboard.totalLiabilities, value: liabilities, accent: 'border-l-red-400' },
    { label: t.dashboard.netAssets, value: netAssets, accent: 'border-l-anthro-brown' },
    { label: t.dashboard.totalIncome, value: income, accent: 'border-l-emerald-500' },
    { label: t.dashboard.totalExpenses, value: expenses, accent: 'border-l-amber-500' },
    { label: t.dashboard.monthlyBalance, value: monthlyBalance, accent: monthlyBalance >= 0 ? 'border-l-emerald-500' : 'border-l-red-400' },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`bg-white rounded-2xl p-5 border-l-4 ${card.accent} shadow-sm hover:shadow-md transition-shadow`}
          >
            <p className="text-xs font-medium text-anthro-muted tracking-wide uppercase">{card.label}</p>
            <p className="text-2xl font-bold mt-2 text-anthro-dark">
              ¥{card.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-medium text-anthro-muted mb-4 tracking-wide uppercase">{t.dashboard.breakdown}</h2>
        <div className="space-y-3">
          {entries.filter(e => e.category === '費用' && e.amount > 0).map((entry) => {
            const ratio = expenses > 0 ? (entry.amount / expenses) * 100 : 0;
            return (
              <div key={entry.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-anthro-brown">{entry.name}</span>
                  <span className="text-anthro-muted">¥{entry.amount.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-anthro-sand rounded-full overflow-hidden">
                  <div
                    className="h-full bg-anthro-orange rounded-full transition-all"
                    style={{ width: `${ratio}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
