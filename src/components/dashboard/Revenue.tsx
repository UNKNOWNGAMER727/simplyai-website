import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign } from 'lucide-react';
import { revenueEntries, monthlyRevenue } from '../../data/mockData';
import { EmptyState } from '../ui/EmptyState';

// -- Tier colors --------------------------------------------------------------

const TIER_COLORS: Record<string, string> = {
  basic: '#0071e3',
  pro: '#ff9f0a',
  premium: '#bf5af2',
};

const TIER_PRICES: Record<string, number> = {
  basic: 149,
  pro: 249,
  premium: 349,
};

// -- Helpers ------------------------------------------------------------------

function formatCurrency(n: number): string {
  return `$${n.toLocaleString()}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// -- Component ----------------------------------------------------------------

export function Revenue() {
  // Show empty state when no revenue data exists
  if (revenueEntries.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Revenue</h2>
          <button className="px-4 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
            Export CSV
          </button>
        </div>

        <EmptyState
          icon={DollarSign}
          title="Revenue tracking"
          description="Revenue will be tracked automatically as clients complete bookings. You'll see breakdowns by tier, monthly trends, and payment status."
        />
      </div>
    );
  }

  // -- Derived data (only computed when data exists) --------------------------

  const totalRevenue = revenueEntries.reduce((sum, e) => sum + e.amount, 0);
  const thisMonthEntries = revenueEntries.filter((e) => e.date.startsWith('2026-03'));
  const thisMonth = thisMonthEntries.reduce((sum, e) => sum + e.amount, 0);
  const avgPerClient = Math.round(totalRevenue / revenueEntries.length);
  const projectedMonthly = Math.round(
    (thisMonth / new Date().getDate()) * 30
  );

  const MONTHLY_GOAL = 5000;
  const goalProgress = Math.min((thisMonth / MONTHLY_GOAL) * 100, 100);

  const tierBreakdown = (['basic', 'pro', 'premium'] as const).map((tier) => ({
    tier,
    total: thisMonthEntries.filter((e) => e.tier === tier).reduce((s, e) => s + e.amount, 0),
    count: thisMonthEntries.filter((e) => e.tier === tier).length,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Revenue</h2>
        <button className="px-4 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
          Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), color: '#34c759' },
          { label: 'This Month', value: formatCurrency(thisMonth), color: '#0071e3' },
          { label: 'Avg Per Client', value: formatCurrency(avgPerClient), color: '#ff9f0a' },
          { label: 'Projected Monthly', value: formatCurrency(projectedMonthly), color: '#bf5af2' },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-4"
          >
            <span className="text-xs text-[#86868b]">{card.label}</span>
            <p className="text-2xl font-semibold mt-1" style={{ color: card.color }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Goal progress */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Monthly Goal</span>
          <span className="text-sm text-[#86868b]">
            {formatCurrency(thisMonth)} / {formatCurrency(MONTHLY_GOAL)}
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-[#111] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${goalProgress}%`,
              backgroundColor: goalProgress >= 100 ? '#34c759' : '#0071e3',
            }}
          />
        </div>
        <p className="text-xs text-[#86868b] mt-2">
          {goalProgress >= 100
            ? 'Goal reached!'
            : `${Math.round(goalProgress)}% of monthly target`}
        </p>
      </div>

      {/* Monthly revenue chart */}
      {monthlyRevenue.length > 0 && (
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-5">
          <h3 className="text-sm font-medium mb-4">Monthly Revenue by Tier</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[...monthlyRevenue]} barCategoryGap="20%">
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#86868b', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#86868b', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `$${v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    color: '#fff',
                    fontSize: 12,
                  }}
                  formatter={(value, name) => {
                    const n = String(name ?? '');
                    return [`$${value ?? 0}`, n.charAt(0).toUpperCase() + n.slice(1)];
                  }}
                />
                <Bar dataKey="basic" stackId="a" fill={TIER_COLORS.basic} radius={[0, 0, 0, 0]} />
                <Bar dataKey="pro" stackId="a" fill={TIER_COLORS.pro} radius={[0, 0, 0, 0]} />
                <Bar dataKey="premium" stackId="a" fill={TIER_COLORS.premium} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tier breakdown */}
      {tierBreakdown.some((t) => t.count > 0) && (
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-5">
          <h3 className="text-sm font-medium mb-4">This Month by Tier</h3>
          <div className="grid grid-cols-3 gap-4">
            {tierBreakdown.map(({ tier, total, count }) => (
              <div key={tier} className="text-center">
                <div
                  className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2"
                  style={{
                    backgroundColor: `${TIER_COLORS[tier]}20`,
                    color: TIER_COLORS[tier],
                  }}
                >
                  {tier.charAt(0).toUpperCase() + tier.slice(1)} — ${TIER_PRICES[tier]}
                </div>
                <p className="text-lg font-semibold">{formatCurrency(total)}</p>
                <p className="text-xs text-[#86868b]">{count} client{count !== 1 ? 's' : ''}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent transactions */}
      {revenueEntries.length > 0 && (
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-5">
          <h3 className="text-sm font-medium mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {revenueEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"
              >
                <span className="flex-1 text-sm font-medium truncate">{entry.clientName}</span>
                <span
                  className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider"
                  style={{
                    backgroundColor: `${TIER_COLORS[entry.tier]}20`,
                    color: TIER_COLORS[entry.tier],
                  }}
                >
                  {entry.tier}
                </span>
                <span className="shrink-0 text-sm font-semibold w-16 text-right">
                  {formatCurrency(entry.amount)}
                </span>
                <span className="shrink-0 text-xs text-[#86868b] w-16 text-right">
                  {formatDate(entry.date)}
                </span>
                <span
                  className="shrink-0 w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: entry.status === 'paid' ? '#34c759' : '#ff9f0a',
                  }}
                  title={entry.status}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
