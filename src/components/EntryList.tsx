import { useState } from 'react';
import type { Entry, Category } from '../data/initialData';
import { useLang } from '../i18n/useLang';

interface Props {
  entries: Entry[];
  onUpdate: (entries: Entry[]) => void;
}

const categories: Category[] = ['資産', '負債', '収益', '費用'];
const categoryColors: Record<Category, string> = {
  '資産': 'bg-anthro-orange/15 text-anthro-orange',
  '負債': 'bg-red-100 text-red-700',
  '収益': 'bg-emerald-100 text-emerald-700',
  '費用': 'bg-amber-100 text-amber-700',
};

export default function EntryList({ entries, onUpdate }: Props) {
  const { t } = useLang();
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editNote, setEditNote] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newCategory, setNewCategory] = useState<Category>('費用');
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newNote, setNewNote] = useState('');

  const filtered = filter === 'all' ? entries : entries.filter((e) => e.category === filter);

  const categoryLabels: Record<Category, string> = {
    '資産': t.categories.assets,
    '負債': t.categories.liabilities,
    '収益': t.categories.income,
    '費用': t.categories.expenses,
  };

  function startEdit(entry: Entry) {
    setEditingId(entry.id);
    setEditAmount(String(entry.amount));
    setEditNote(entry.note);
  }

  function saveEdit(id: string) {
    onUpdate(entries.map((e) =>
      e.id === id ? { ...e, amount: Number(editAmount) || 0, note: editNote } : e
    ));
    setEditingId(null);
  }

  function deleteEntry(id: string) {
    if (!confirm(t.entries.confirmDelete)) return;
    onUpdate(entries.filter((e) => e.id !== id));
  }

  function addEntry() {
    if (!newName.trim()) return;
    const newEntry: Entry = {
      id: Date.now().toString(),
      category: newCategory,
      name: newName.trim(),
      amount: Number(newAmount) || 0,
      note: newNote,
    };
    onUpdate([...entries, newEntry]);
    setNewName('');
    setNewAmount('');
    setNewNote('');
    setShowAdd(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 md:mb-5 gap-2">
        <div className="flex gap-1.5 md:gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm transition-all ${filter === 'all' ? 'bg-anthro-dark text-white' : 'bg-anthro-sand text-anthro-brown hover:bg-anthro-orange-light'}`}
          >
            {t.entries.all}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm transition-all ${filter === cat ? 'bg-anthro-dark text-white' : 'bg-anthro-sand text-anthro-brown hover:bg-anthro-orange-light'}`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-anthro-orange text-white px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm whitespace-nowrap hover:brightness-110 transition-all"
        >
          {t.entries.add}
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-5 mb-4 md:mb-5 flex flex-wrap gap-3 md:gap-4 items-end">
          <div>
            <label className="block text-xs text-anthro-muted mb-1.5">{t.entries.category}</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as Category)}
              className="border border-anthro-sand rounded-lg px-3 py-2 text-sm bg-white"
            >
              {categories.map((c) => <option key={c} value={c}>{categoryLabels[c]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-anthro-muted mb-1.5">{t.entries.item}</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border border-anthro-sand rounded-lg px-3 py-2 text-sm w-32 focus:outline-anthro-orange"
              placeholder={t.entries.itemPlaceholder}
            />
          </div>
          <div>
            <label className="block text-xs text-anthro-muted mb-1.5">{t.entries.amount}</label>
            <input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              className="border border-anthro-sand rounded-lg px-3 py-2 text-sm w-28 focus:outline-anthro-orange"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs text-anthro-muted mb-1.5">{t.entries.note}</label>
            <input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="border border-anthro-sand rounded-lg px-3 py-2 text-sm w-32 focus:outline-anthro-orange"
              placeholder={t.entries.notePlaceholder}
            />
          </div>
          <button
            onClick={addEntry}
            className="bg-anthro-orange text-white px-5 py-2 rounded-full text-sm hover:brightness-110 transition-all"
          >
            {t.entries.save}
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl md:rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-xs md:text-sm min-w-[540px]">
          <thead className="bg-anthro-sand/50">
            <tr>
              <th className="text-left px-3 md:px-5 py-2.5 md:py-3.5 font-medium text-anthro-muted text-xs tracking-wide uppercase">{t.entries.category}</th>
              <th className="text-left px-3 md:px-5 py-2.5 md:py-3.5 font-medium text-anthro-muted text-xs tracking-wide uppercase">{t.entries.item}</th>
              <th className="text-right px-3 md:px-5 py-2.5 md:py-3.5 font-medium text-anthro-muted text-xs tracking-wide uppercase">{t.entries.amount}</th>
              <th className="text-left px-3 md:px-5 py-2.5 md:py-3.5 font-medium text-anthro-muted text-xs tracking-wide uppercase">{t.entries.note}</th>
              <th className="px-3 md:px-5 py-2.5 md:py-3.5 font-medium text-anthro-muted text-xs tracking-wide uppercase w-24">{t.entries.action}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry) => (
              <tr key={entry.id} className="border-t border-anthro-sand/50 hover:bg-anthro-cream/50 transition-colors">
                <td className="px-3 md:px-5 py-2.5 md:py-3.5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[entry.category]}`}>
                    {categoryLabels[entry.category]}
                  </span>
                </td>
                <td className="px-3 md:px-5 py-2.5 md:py-3.5 text-anthro-dark">{entry.name}</td>
                <td className="px-3 md:px-5 py-2.5 md:py-3.5 text-right text-anthro-dark">
                  {editingId === entry.id ? (
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="border border-anthro-sand rounded-lg px-2 py-1 text-sm w-28 text-right focus:outline-anthro-orange"
                    />
                  ) : (
                    `¥${entry.amount.toLocaleString()}`
                  )}
                </td>
                <td className="px-3 md:px-5 py-2.5 md:py-3.5 text-anthro-muted">
                  {editingId === entry.id ? (
                    <input
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      className="border border-anthro-sand rounded-lg px-2 py-1 text-sm w-full focus:outline-anthro-orange"
                    />
                  ) : (
                    entry.note
                  )}
                </td>
                <td className="px-3 md:px-5 py-2.5 md:py-3.5 text-center">
                  {editingId === entry.id ? (
                    <button onClick={() => saveEdit(entry.id)} className="text-anthro-orange text-xs font-medium hover:underline">
                      {t.entries.save}
                    </button>
                  ) : (
                    <div className="flex gap-3 justify-center">
                      <button onClick={() => startEdit(entry)} className="text-anthro-brown text-xs hover:text-anthro-orange transition-colors">
                        {t.entries.edit}
                      </button>
                      <button onClick={() => deleteEntry(entry.id)} className="text-anthro-muted text-xs hover:text-red-500 transition-colors">
                        {t.entries.delete}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
