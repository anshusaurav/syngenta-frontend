'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, AlertTriangle, Users } from 'lucide-react';
import LanguagePicker from './LanguagePicker';
import { useLocale } from '@/lib/i18n/LocaleProvider';

const links = [
  { href: '/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { href: '/anomalies', labelKey: 'nav.alerts', icon: AlertTriangle },
  { href: '/reps', labelKey: 'nav.reps', icon: Users },
];

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useLocale();
  return (
    <nav className="bg-green-800 text-white shadow-md">
      <div className="max-w-2xl mx-auto px-4 flex items-center justify-between h-14 gap-2">
        <Link href="/dashboard" className="font-bold text-lg tracking-tight flex items-center gap-1.5">
          <span>🌱</span>
          <span>{t('brand')}</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map(({ href, labelKey, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-sm font-medium transition-colors ${
                pathname.startsWith(href)
                  ? 'bg-green-600 text-white'
                  : 'text-green-100 hover:bg-green-700'
              }`}
            >
              <Icon size={15} />
              <span>{t(labelKey)}</span>
            </Link>
          ))}
          <LanguagePicker />
        </div>
      </div>
    </nav>
  );
}
