'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getReps, Rep } from '@/lib/api';
import { MapPin, ChevronRight } from 'lucide-react';
import { useLocale } from '@/lib/i18n/LocaleProvider';
import { useSelectedRep } from '@/lib/useSelectedRep';

export default function RepsPage() {
  const { t } = useLocale();
  const router = useRouter();
  const { repId: currentRepId, setRep } = useSelectedRep();
  const [reps, setReps] = useState<Rep[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const handlePick = (rep: Rep) => {
    setRep(rep.rep_id, rep.territory_id);
    router.push('/dashboard');
  };

  useEffect(() => {
    getReps().then(d => setReps(d.reps)).finally(() => setLoading(false));
  }, []);

  const filtered = reps.filter(r =>
    r.rep_id.toLowerCase().includes(search.toLowerCase()) ||
    r.territory_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.state?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-shell space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-800">{t('reps.title')}</h1>
        <p className="text-sm text-gray-500">{t('reps.countLine', { count: reps.length })}</p>
      </div>

      <input
        placeholder={t('reps.searchPlaceholder')}
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-400"
      />

      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.slice(0, 50).map(rep => {
            const isCurrent = rep.rep_id === currentRepId;
            return (
              <button
                key={rep.rep_id}
                onClick={() => handlePick(rep)}
                className={`w-full text-left flex items-center justify-between bg-white border rounded-lg p-3 hover:border-green-400 hover:shadow-sm transition-all ${
                  isCurrent ? 'border-green-500 ring-1 ring-green-200' : 'border-gray-200'
                }`}
              >
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{rep.rep_id}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{rep.territory_name}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                    <MapPin size={10} /> {rep.district}, {rep.state}
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
            );
          })}
          {filtered.length > 50 && (
            <p className="text-xs text-center text-gray-400">{t('reps.showingHint', { total: filtered.length })}</p>
          )}
        </div>
      )}
    </div>
  );
}
