import { useRef, useState } from 'react';
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

  const tabLabels: Record<Tab, string> = {
    dashboard: t.tabs.dashboard,
    entries: t.tabs.entries,
    subscriptions: t.tabs.subscriptions,
    history: t.tabs.history,
  };

  function exportData() {
    const data = { entries, subscriptions, monthlyRecords };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kakeibo-backup-${new Date().toISOString().slice(0, 10)}.json`;
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
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-white tracking-wide">{t.appTitle}</h1>
          <div className="flex items-center gap-4">
            <nav className="flex gap-1">
              {tabKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    activeTab === key
                      ? 'bg-anthro-orange text-white'
                      : 'text-anthro-sand/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tabLabels[key]}
                </button>
              ))}
            </nav>
            <div className="flex gap-1 border-l border-white/20 pl-4 ml-1">
              <button
                onClick={exportData}
                className="px-3 py-2 rounded-full text-xs text-anthro-sand/60 hover:text-white hover:bg-white/10 transition-all"
              >
                {t.export}
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 rounded-full text-xs text-anthro-sand/60 hover:text-white hover:bg-white/10 transition-all"
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
                className="w-7 h-7 rounded-full border border-anthro-sand/30 text-anthro-sand/60 hover:text-white hover:border-white hover:bg-white/10 transition-all text-xs font-bold flex items-center justify-center"
              >
                ?
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
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
        <footer className="text-center py-6 text-xs text-anthro-muted">
          © {new Date().getFullYear()} Alice Yu (Jiatian Yu). All rights reserved.
        </footer>
      </div>
    </LangContext.Provider>
  );
}

export default App;
