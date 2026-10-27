import { DrawdownChart } from '../components/DrawdownChart'
import { NavChart } from '../components/NavChart'
import { StatCard } from '../components/StatCard'
import { YearlyBars } from '../components/YearlyBars'
import { cnDate, pct } from '../lib/format'
import { drawdownSeries, evaluate, trailingMetrics } from '../lib/metrics'
import type { Meta, NavPoint, SignalRow } from '../lib/types'

const levelText = { good: '正常', warn: '关注', bad: '异常' } as const

export function HistoryPage({
  nav,
  meta,
  history,
}: {
  nav: NavPoint[]
  meta: Meta
  history: SignalRow[]
}) {
  const trailing = trailingMetrics(nav, 52)
  const verdict = trailing ? evaluate(trailing, meta.expected) : null
  const recent = [...history].slice(-14).reverse()

  return (
    <>
      <section className={`verdict ${verdict?.overall ?? 'good'}`}>
        <div className="verdict-head">
          <span className="eyebrow">近 52 周表现评估</span>
          <span className="dot-status" />
        </div>
        <h2>{verdict ? levelText[verdict.overall] : '数据不足'}</h2>
        <p>{verdict?.summary ?? '净值序列不足 53 周，无法评估。'}</p>
      </section>

      {verdict && (
        <section className="stats">
          {verdict.items.map((it) => (
            <StatCard
              key={it.key}
              label={it.label}
              value={it.actual}
              sub={`长期 ${it.expected} · ${it.detail}`}
              level={it.level}
            />
          ))}
        </section>
      )}

      <section className="card">
        <div className="card-head">
          <h2>净值曲线</h2>
          <span className="hint">2015 至今 · 周频</span>
        </div>
        <NavChart nav={nav} />
      </section>

      <section className="card">
        <div className="card-head">
          <h2>回撤</h2>
          <span className="hint">历史最大 {pct(meta.expected.mdd, 1)}</span>
        </div>
        <DrawdownChart data={drawdownSeries(nav)} />
      </section>

      <section className="card">
        <h2>分年度收益</h2>
        <YearlyBars data={meta.yearly} />
      </section>

      <section className="card">
        <h2>最近的信号</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>日期</th>
                <th>持有</th>
                <th className="r">股票</th>
                <th className="r">闸门</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => {
                const eq = Object.entries(r.weights)
                  .filter(([c]) => !['511010', '518880'].includes(c))
                  .reduce((a, [, w]) => a + w, 0)
                return (
                  <tr key={r.date}>
                    <td>{cnDate(r.date).replace('年', '/').replace('月', '/').replace('日', '')}</td>
                    <td>{r.leader_name}</td>
                    <td className="r">{pct(eq, 0)}</td>
                    <td className="r">{r.gate ? '开' : '关'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
