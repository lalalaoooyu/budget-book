import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import type { MonthlyRecord } from '../data/initialData';
import { useLang } from '../i18n/useLang';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface Props {
  records: MonthlyRecord[];
  onUpdate: (records: MonthlyRecord[]) => void;
}

function parseYearMonth(s: string): number {
  const match = s.match(/(\d{4})\D+(\d{1,2})/);
  if (!match) return 0;
  return Number(match[1]) * 100 + Number(match[2]);
}

function getCurrentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}年${now.getMonth() + 1}月`;
}

export default function AssetChart({ records, onUpdate }: Props) {
  const { t } = useLang();
  const [newMonth, setNewMonth] = useState('');
  const currentYearMonth = getCurrentYearMonth();
  const dataRecords = records.filter((r) => r.assets !== null);

  const chartData = {
    labels: dataRecords.map((r) => r.yearMonth),
    datasets: [
      {
        label: t.history.assets,
        data: dataRecords.map((r) => r.assets),
        borderColor: '#D97757',
        backgroundColor: 'rgba(217, 119, 87, 0.08)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#D97757',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: t.history.chartTitle,
        font: { size: 16, weight: 'bold' as const },
        color: '#1A1612',
        padding: { bottom: 20 },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: number | string) => `¥${Number(value).toLocaleString()}`,
          color: '#8B7E74',
        },
        grid: { color: 'rgba(240, 233, 223, 0.8)' },
      },
      x: {
        ticks: { color: '#8B7E74' },
        grid: { display: false },
      },
    },
  };

  function getNextMonth(): string {
    if (records.length === 0) return currentYearMonth;
    const last = records[records.length - 1].yearMonth;
    const match = last.match(/(\d{4})\D+(\d{1,2})/);
    if (!match) return currentYearMonth;
    let year = Number(match[1]);
    let month = Number(match[2]) + 1;
    if (month > 12) { month = 1; year++; }
    return `${year}年${month}月`;
  }

  function addMonth() {
    const monthToAdd = newMonth.trim() || getNextMonth();
    if (records.some((r) => r.yearMonth === monthToAdd)) return;
    const newRecords = [...records, {
      yearMonth: monthToAdd,
      assets: null,
      target: '',
      dcPension: null,
      welfarePension: null,
      nationalPension: null,
      feedback: '',
    }].sort((a, b) => parseYearMonth(a.yearMonth) - parseYearMonth(b.yearMonth));
    onUpdate(newRecords);
    setNewMonth('');
  }

  function deleteRecord(index: number) {
    if (!confirm(t.history.confirmDelete)) return;
    onUpdate(records.filter((_, i) => i !== index));
  }

  function updateRecord(index: number, field: keyof MonthlyRecord, value: string) {
    const updated = [...records];
    if (field === 'assets' || field === 'dcPension' || field === 'welfarePension' || field === 'nationalPension') {
      (updated[index] as any)[field] = value === '' ? null : Number(value);
    } else {
      (updated[index] as any)[field] = value;
    }
    onUpdate(updated);
  }

  return (
    <div>
      <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-8 mb-4 md:mb-6">
        <Line data={chartData} options={options} />
      </div>

      <div className="bg-white rounded-xl md:rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-xs md:text-sm min-w-[480px]">
          <thead className="bg-anthro-sand/50">
            <tr>
              <th className="text-left px-4 py-3.5 font-medium text-anthro-muted text-xs tracking-wide uppercase">{t.history.yearMonth}</th>
              <th className="text-right px-4 py-3.5 font-medium text-anthro-muted text-xs tracking-wide uppercase">{t.history.assets}</th>
              <th className="text-left px-4 py-3.5 font-medium text-anthro-muted text-xs tracking-wide uppercase">{t.history.feedback}</th>
              <th className="px-4 py-3.5 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, i) => (
              <tr key={record.yearMonth} className="border-t border-anthro-sand/50 hover:bg-anthro-cream/50 transition-colors">
                <td className="px-4 py-3 font-medium text-anthro-dark">
                  {record.yearMonth}
                  {record.yearMonth === currentYearMonth && (
                    <span className="ml-2 text-[10px] text-anthro-orange font-normal">{t.history.autoSync}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {record.yearMonth === currentYearMonth ? (
                    <span className="text-sm text-anthro-dark font-medium">¥{(record.assets ?? 0).toLocaleString()}</span>
                  ) : (
                    <input
                      type="number"
                      value={record.assets ?? ''}
                      onChange={(e) => updateRecord(i, 'assets', e.target.value)}
                      className="border border-anthro-sand rounded-lg px-2 py-1.5 text-sm w-28 text-right focus:outline-anthro-orange"
                      placeholder="-"
                    />
                  )}
                </td>
                <td className="px-4 py-3">
                  <input
                    value={record.feedback}
                    onChange={(e) => updateRecord(i, 'feedback', e.target.value)}
                    className="border border-anthro-sand rounded-lg px-2 py-1.5 text-sm w-full focus:outline-anthro-orange"
                    placeholder="-"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => deleteRecord(i)} className="text-anthro-muted text-xs hover:text-red-500 transition-colors">
                    {t.entries.delete}
                  </button>
                </td>
              </tr>
            ))}
            <tr className="border-t border-anthro-sand/50 bg-anthro-cream/30">
              <td className="px-4 py-3">
                <input
                  value={newMonth}
                  onChange={(e) => setNewMonth(e.target.value)}
                  className="border border-anthro-sand rounded-lg px-2 py-1.5 text-sm w-28 focus:outline-anthro-orange"
                  placeholder={getNextMonth()}
                />
              </td>
              <td colSpan={2}></td>
              <td className="px-4 py-3 text-center">
                <button onClick={addMonth} className="text-anthro-orange text-xs font-medium hover:underline">
                  {t.entries.add}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
