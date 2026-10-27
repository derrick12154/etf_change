import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export function DrawdownChart({ data }: { data: { date: string; dd: number }[] }) {
  const ticks: string[] = []
  let last = ''
  for (const p of data) {
    const y = p.date.slice(0, 4)
    if (y !== last) {
      last = y
      if (Number(y) % 2 === 0) ticks.push(p.date)
    }
  }
  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="ddFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a12a22" stopOpacity={0.05} />
              <stop offset="100%" stopColor="#a12a22" stopOpacity={0.22} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e6e2d8" vertical={false} />
          <XAxis
            dataKey="date"
            ticks={ticks}
            tickFormatter={(v: string) => v.slice(2, 4)}
            tick={{ fontSize: 11, fill: '#8a8578' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#8a8578' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${Math.round(v * 100)}%`}
            width={44}
          />
          <ReferenceLine y={0} stroke="#c9c3b6" />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #e6e2d8',
              fontSize: 12,
              boxShadow: '0 8px 24px rgba(0,0,0,.06)',
            }}
            labelFormatter={(v) => String(v).slice(0, 7).replace('-', '/')}
            formatter={(v: number) => [`${(v * 100).toFixed(1)}%`, '回撤']}
          />
          <Area type="monotone" dataKey="dd" stroke="#a12a22" strokeWidth={1.5} fill="url(#ddFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
