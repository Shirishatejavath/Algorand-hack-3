import { useState, type FormEvent } from 'react'
import axios from 'axios'

type AnalyzeResponse = {
  score: number
  risk: string
  reasons: string[]
  breakdown?: Record<string, number>
  timestamp: string
  tx_count: number
  is_real_data: boolean
  on_chain?: Record<string, unknown> | null
}

const apiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''

export default function App() {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)

  async function analyze(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setResult(null)
    if (!apiBase) {
      setError('VITE_API_URL is not set. Add it to frontend/.env')
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.post<AnalyzeResponse>(
        `${apiBase}/analyze-wallet`,
        { wallet_address: address.trim() },
        { headers: { 'Content-Type': 'application/json' } },
      )
      setResult(data)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg =
          (err.response?.data as { detail?: string })?.detail ??
          err.message ??
          'Request failed'
        setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
      } else {
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-10 max-w-3xl mx-auto">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-widest text-cyan-400/90 mb-2">
          BlockSentinel.ai
        </p>
        <h1 className="text-3xl font-semibold text-white mb-2">
          Wallet risk analysis
        </h1>
        <p className="text-sm text-slate-400">
          Backend:{' '}
          <code className="text-cyan-300/90 text-xs">
            {apiBase || '(set VITE_API_URL)'}
          </code>
        </p>
      </header>

      <form onSubmit={analyze} className="space-y-4 mb-8">
        <label className="block text-sm font-medium text-slate-300">
          Algorand address
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="58-character TestNet address"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            autoComplete="off"
          />
        </label>
        <button
          type="submit"
          disabled={loading || !address.trim()}
          className="rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? 'Analyzing…' : 'Analyze wallet'}
        </button>
      </form>

      {error && (
        <div className="rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200 mb-6">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex flex-wrap items-baseline gap-3 mb-4">
              <span className="text-4xl font-bold text-white">{result.score}</span>
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                  result.risk === 'HIGH'
                    ? 'bg-red-500/20 text-red-300'
                    : result.risk === 'MEDIUM'
                      ? 'bg-amber-500/20 text-amber-200'
                      : 'bg-emerald-500/20 text-emerald-200'
                }`}
              >
                {result.risk}
              </span>
              <span className="text-xs text-slate-500">
                {result.timestamp} · {result.tx_count} txs ·{' '}
                {result.is_real_data ? 'indexer data' : 'fallback / mock'}
              </span>
            </div>
            <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
              {result.reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>

          {result.on_chain && (
            <section className="rounded-xl border border-cyan-900/40 bg-cyan-950/20 p-5">
              <h2 className="text-sm font-semibold text-cyan-200 mb-2">
                On-chain registry
              </h2>
              <pre className="text-xs text-cyan-100/90 overflow-x-auto whitespace-pre-wrap break-all">
                {JSON.stringify(result.on_chain, null, 2)}
              </pre>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
