import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { NavPoint } from '../lib/types'

const fmtDate = (iso: string) => iso.slice(0, 7).replace('-', '/')
const fmtX = (iso: string) => iso.slice(2, 4)

function ticksOf(nav: NavPoint[], step = 2): string[] {
  const out: string[] = []
  let last = ''
  for (const p of nav) {
    const y = p.date.slice(0, 4)
    if (y !== last) {
      last = y
      if (Number(y) % step === 0) out.push(p.date)
    }
  }
  return out
}

export function NavChart({ nav }: { nav: NavPoint[] }) {
  const ticks = ticksOf(nav)
  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={nav} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="navFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b23a2f" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#b23a2f" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e6e2d8" vertical={false} />
          <XAxis
            dataKey="date"
            ticks={ticks}
            tickFormatter={fmtX}
            tick={{ fontSize: 11, fill: '#8a8578' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fontSize: 11, fill: '#8a8578' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v.toFixed(1)}x`}
            width={44}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #e6e2d8',
              fontSize: 12,
              boxShadow: '0 8px 24px rgba(0,0,0,.06)',
            }}
            labelFormatter={(v) => fmtDate(String(v))}
            formatter={(v: number) => [`${v.toFixed(3)}x`, '净值']}
          />
          <Area type="monotone" dataKey="nav" stroke="#b23a2f" strokeWidth={2} fill="url(#navFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
