import { useState } from 'react';
import type { Subscription } from '../data/initialData';
import { useLang } from '../i18n/useLang';

interface Props {
  subscriptions: Subscription[];
  onUpdate: (subs: Subscription[]) => void;
}

export default function SubscriptionList({ subscriptions, onUpdate }: Props) {
  const { t } = useLang();
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const total = subscriptions.reduce((sum, s) => sum + s.amount, 0);

  function addSub() {
    if (!newName.trim()) return;
    onUpdate([...subscriptions, {
      id: Date.now().toString(),
      name: newName.trim(),
      amount: Number(newAmount) || 0,
    }]);
    setNewName('');
    setNewAmount('');
  }

  function deleteSub(id: string) {
    if (!confirm(t.subscriptions.confirmDelete)) return;
    onUpdate(subscriptions.filter((s) => s.id !== id));
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-anthro-dark">{t.subscriptions.title}</h2>
        <div className="bg-anthro-orange/10 px-4 py-2 rounded-full">
          <span className="text-sm text-anthro-muted">{t.subscriptions.total} </span>
          <span className="font-bold text-anthro-orange">¥{total.toLocaleString()}{t.subscriptions.perMonth}</span>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        {subscriptions.map((sub) => (
          <div key={sub.id} className="flex items-center justify-between py-3 px-4 bg-anthro-cream rounded-xl hover:bg-anthro-sand/50 transition-colors">
            <span className="text-sm text-anthro-dark">{sub.name}</span>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-anthro-brown">¥{sub.amount.toLocaleString()}</span>
              <button onClick={() => deleteSub(sub.id)} className="text-anthro-muted text-xs hover:text-red-500 transition-colors">
                {t.subscriptions.delete}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 items-center pt-4 border-t border-anthro-sand">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border border-anthro-sand rounded-xl px-4 py-2.5 text-sm flex-1 focus:outline-anthro-orange"
          placeholder={t.subscriptions.namePlaceholder}
        />
        <input
          type="number"
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
          className="border border-anthro-sand rounded-xl px-4 py-2.5 text-sm w-28 focus:outline-anthro-orange"
          placeholder={t.subscriptions.amountPlaceholder}
        />
        <button onClick={addSub} className="bg-anthro-orange text-white px-5 py-2.5 rounded-full text-sm hover:brightness-110 transition-all">
          {t.subscriptions.add}
        </button>
      </div>
    </div>
  );
}
