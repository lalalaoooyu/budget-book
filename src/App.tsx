import { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { initialEntries, initialSubscriptions, initialMonthlyRecords } from './data/initialData';
import { LangContext } from './i18n/useLang';
import { useLang } from './i18n/useLang';
import type { Lang } from './i18n/translations';
import Dashboard from './components/Dashboard';
import EntryList from './components/EntryList';
import SubscriptionList from './components/SubscriptionList';
import AssetChart from './components/AssetChart';

type Tab = 'dashboard' | 'entries' | 'subscriptions' | 'history';

const tabKeys: Tab[] = ['dashboard', 'entries', 'subscriptions', 'history'];

function AppInner({ langToggle }: { langToggle: React.ReactNode }) {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [entries, setEntries] = useLocalStorage('kakeibo-entries', initialEntries);
  const [subscriptions, setSubscriptions] = useLocalStorage('kakeibo-subscriptions', initialSubscriptions);
  const [monthlyRecords, setMonthlyRecords] = useLocalStorage('kakeibo-monthly', initialMonthlyRecords);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showGuide, setShowGuide] = useState(false);

  // Auto-sync current month's net assets (資産 - 負債) from entries
  useEffect(() => {
    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}年${now.getMonth() + 1}月`;
    const totalAssets = entries
      .filter((e) => e.category === '資産')
      .reduce((sum, e) => sum + e.amount, 0);
    const totalLiabilities = entries
      .filter((e) => e.category === '負債')
      .reduce((sum, e) => sum + e.amount, 0);
    const netAssets = totalAssets - totalLiabilities;

    setMonthlyRecords((prev) => {
      const existing = prev.find((r) => r.yearMonth === currentYearMonth);
      if (existing) {
        if (existing.assets === netAssets) return prev;
        return prev.map((r) =>
          r.yearMonth === currentYearMonth ? { ...r, assets: netAssets } : r
        );
      }
      const parseYM = (s: string) => {
        const m = s.match(/(\d{4})\D+(\d{1,2})/);
        return m ? Number(m[1]) * 100 + Number(m[2]) : 0;
      };
      return [...prev, {
        yearMonth: currentYearMonth,
        assets: netAssets,
        target: '',
        dcPension: null,
        welfarePension: null,
        nationalPension: null,
        feedback: '',
      }].sort((a, b) => parseYM(a.yearMonth) - parseYM(b.yearMonth));
    });
  }, [entries, setMonthlyRecords]);

  const tabLabels: Record<Tab, string> = {
    dashboard: t.tabs.dashboard,
    entries: t.tabs.entries,
    subscriptions: t.tabs.subscriptions,
    history: t.tabs.history,
  };

  async function exportData() {
    const data = { entries, subscriptions, monthlyRecords };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const filename = `kakeibo-backup-${new Date().toISOString().slice(0, 10)}.json`;

    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as unknown as { showSaveFilePicker: (opts: unknown) => Promise<FileSystemFileHandle> }).showSaveFilePicker({
          suggestedName: filename,
          types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (err) {
        if ((err as DOMException).name === 'AbortError') return;
      }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.entries) setEntries(data.entries);
        if (data.subscriptions) setSubscriptions(data.subscriptions);
        if (data.monthlyRecords) setMonthlyRecords(data.monthlyRecords);
        alert(t.restoreSuccess);
      } catch {
        alert(t.restoreFail);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <>
      <header className="bg-anthro-dark">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-3 md:py-5">
          <div className="flex items-center justify-between">
            <h1 className="text-sm md:text-lg font-semibold text-white tracking-wide">{t.appTitle}</h1>
            <div className="flex items-center gap-1">
              <button
                onClick={exportData}
                className="px-2 md:px-3 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs text-anthro-sand/60 hover:text-white hover:bg-white/10 transition-all"
              >
                {t.export}
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2 md:px-3 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs text-anthro-sand/60 hover:text-white hover:bg-white/10 transition-all"
              >
                {t.import}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
              {langToggle}
              <button
                onClick={() => setShowGuide(true)}
                className="w-6 h-6 md:w-7 md:h-7 rounded-full border border-anthro-sand/30 text-anthro-sand/60 hover:text-white hover:border-white hover:bg-white/10 transition-all text-[10px] md:text-xs font-bold flex items-center justify-center"
              >
                ?
              </button>
            </div>
          </div>
          <nav className="flex gap-1 mt-2 md:mt-3 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
            {tabKeys.map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm whitespace-nowrap transition-all ${
                  activeTab === key
                    ? 'bg-anthro-orange text-white'
                    : 'text-anthro-sand/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {tabLabels[key]}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-5 md:py-8">
        {activeTab === 'dashboard' && <Dashboard entries={entries} />}
        {activeTab === 'entries' && <EntryList entries={entries} onUpdate={setEntries} />}
        {activeTab === 'subscriptions' && (
          <SubscriptionList subscriptions={subscriptions} onUpdate={setSubscriptions} />
        )}
        {activeTab === 'history' && (
          <AssetChart records={monthlyRecords} onUpdate={setMonthlyRecords} />
        )}
      </main>

      {showGuide && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowGuide(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-anthro-dark">{t.guide.title}</h2>
              <button onClick={() => setShowGuide(false)} className="text-anthro-muted hover:text-anthro-dark text-sm">
                {t.guide.close}
              </button>
            </div>
            <div className="space-y-4">
              {t.guide.sections.map((section) => (
                <div key={section.heading}>
                  <h3 className="text-sm font-semibold text-anthro-brown mb-1">{section.heading}</h3>
                  <p className="text-sm text-anthro-muted leading-relaxed">{section.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  const [lang, setLang] = useLocalStorage<Lang>('kakeibo-lang', 'ja');

  return (
    <LangContext.Provider value={lang}>
      <div className="min-h-screen bg-anthro-cream">
        <AppInner langToggle={
          <button
            onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')}
            className="px-3 py-2 rounded-full text-xs text-anthro-sand/60 hover:text-white hover:bg-white/10 transition-all"
          >
            {lang === 'ja' ? 'EN' : 'JA'}
          </button>
        } />
        <footer className="text-center py-6 text-xs text-anthro-muted space-y-2">
          <div className="flex justify-center gap-4">
            <a href="https://lalalaoooyu.github.io/alice-intro/" target="_blank" className="hover:text-anthro-orange transition-colors">Portfolio</a>
            <a href="https://github.com/lalalaoooyu" target="_blank" className="hover:text-anthro-orange transition-colors">GitHub</a>
            <a href="https://www.linkedin.com/in/jiatian-yu-7223b9232/" target="_blank" className="hover:text-anthro-orange transition-colors">LinkedIn</a>
          </div>
          <p>© {new Date().getFullYear()} Alice Yu (JIATIAN YU). All rights reserved.</p>
        </footer>
      </div>
    </LangContext.Provider>
  );
}

export default App;
