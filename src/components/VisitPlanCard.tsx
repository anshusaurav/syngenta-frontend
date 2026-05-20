'use client';

import Link from 'next/link';
import { VisitPlanItem } from '@/lib/api';
import { MapPin, Clock, Package, TrendingUp, AlertTriangle, Leaf, Smartphone } from 'lucide-react';
import { useLocale } from '@/lib/i18n/LocaleProvider';

const priorityStyle: Record<string, string> = {
  urgent: 'border-red-400 bg-red-50',
  high: 'border-amber-400 bg-amber-50',
  normal: 'border-gray-200 bg-white',
};

const priorityBadge: Record<string, string> = {
  urgent: 'bg-red-600 text-white',
  high: 'bg-amber-500 text-white',
  normal: 'bg-gray-200 text-gray-600',
};

function proximityClass(index: number): string {
  if (index === 0) return 'bg-green-100 text-green-700';
  if (index <= 2) return 'bg-teal-50 text-teal-700';
  if (index <= 5) return 'bg-gray-100 text-gray-500';
  return 'bg-gray-100 text-gray-400';
}

function proximityKey(index: number): string {
  if (index === 0) return 'visitCard.proximityHome';
  if (index <= 2) return 'visitCard.proximityNearby';
  if (index <= 5) return 'visitCard.proximityInRange';
  return 'visitCard.proximityFar';
}

export default function VisitPlanCard({
  rank, item, repId,
}: {
  rank: number; item: VisitPlanItem; repId: string;
}) {
  const { t } = useLocale();
  const { score_breakdown: sb } = item;
  const daysLabel = sb.days_since_visit === -1
    ? t('visitCard.neverVisited')
    : t('visitCard.daysAgo', { days: sb.days_since_visit });
  const showProximity = item.proximity_index >= 0;
  const proxClassName = showProximity ? proximityClass(item.proximity_index) : '';
  const proxLabel = showProximity ? t(proximityKey(item.proximity_index)) : '';
  const bioUrgency = sb.biological_urgency ?? 0;
  const digitalIntent = sb.digital_intent ?? 0;

  return (
    <Link href={`/retailer/${item.retailer_id}?repId=${repId}`}>
      <div className={`border-l-4 rounded-lg p-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow ${priorityStyle[item.priority]}`}>

        {/* Header row: rank + retailer ID + badges + score */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <span className="text-2xl font-bold text-gray-300 leading-none mt-0.5">#{rank}</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-800">{item.retailer_id}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${priorityBadge[item.priority]}`}>
                  {t(`visitCard.priority${item.priority.charAt(0).toUpperCase()}${item.priority.slice(1)}`)}
                </span>
                {showProximity && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${proxClassName}`}>
                    {proxLabel}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                <MapPin size={11} /> {item.tehsil}, {item.district}
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-lg font-bold text-green-700">{item.score}</div>
            <div className="text-xs text-gray-400">{t('visitCard.score')}</div>
          </div>
        </div>

        {/* Biological urgency + digital intent signals */}
        {(bioUrgency > 0 || digitalIntent > 0) && (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {bioUrgency > 0 && (
              <span className="flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                <Leaf size={10} />{' '}
                {t(bioUrgency === 1 ? 'visitCard.growersAtStage' : 'visitCard.growersAtStagePlural', { count: bioUrgency })}
              </span>
            )}
            {digitalIntent > 0 && (
              <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                <Smartphone size={10} />{' '}
                {t(digitalIntent === 1 ? 'visitCard.whatsappClick' : 'visitCard.whatsappClickPlural', { count: digitalIntent })}
              </span>
            )}
          </div>
        )}

        {/* Stats — labelled metric blocks. 2-col on mobile, 4-col on wide. */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
          <div className="bg-gray-50 rounded-md px-2 py-1.5">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
              <Clock size={10} /> {t('visitCard.metricLastVisit')}
            </div>
            <div className="text-xs font-medium text-gray-800 mt-0.5">{daysLabel}</div>
          </div>
          <div className="bg-gray-50 rounded-md px-2 py-1.5">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
              <Package size={10} className={sb.stock_out_count > 0 ? 'text-red-500' : ''} /> {t('visitCard.metricStock')}
            </div>
            <div className={`text-xs font-medium mt-0.5 ${sb.stock_out_count > 0 ? 'text-red-600' : 'text-gray-800'}`}>
              {sb.stock_out_count > 0
                ? t('visitCard.outOfStock', { count: sb.stock_out_count })
                : t('visitCard.inStock')}
            </div>
          </div>
          <div className="bg-gray-50 rounded-md px-2 py-1.5">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
              <TrendingUp size={10} /> {t('visitCard.metricSales30d')}
            </div>
            <div className="text-xs font-medium text-gray-800 mt-0.5">
              {t('visitCard.unitsShort', { n: sb.sales_velocity_30d })}
            </div>
          </div>
          <div className="bg-gray-50 rounded-md px-2 py-1.5">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
              <AlertTriangle size={10} className={sb.anomaly_count > 0 ? 'text-red-500' : ''} /> {t('visitCard.metricAlerts')}
            </div>
            <div className={`text-xs font-medium mt-0.5 ${sb.anomaly_count > 0 ? 'text-red-600' : 'text-gray-800'}`}>
              {sb.anomaly_count > 0
                ? t(sb.anomaly_count === 1 ? 'visitCard.alertsCount' : 'visitCard.alertsCountPlural', { count: sb.anomaly_count })
                : t('visitCard.noAlerts')}
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}
