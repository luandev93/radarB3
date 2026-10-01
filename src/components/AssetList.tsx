import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { marketData } from '../services'
import { DataError } from '../services/domain'
import { assetCoverage, selectRows, sortLabels } from '../services/listing'
import type { AssetRow, QuickFilter, SortKey } from '../services/listing'
import { AssetTable } from './AssetTable'
const filters: { key: QuickFilter; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'quoted', label: 'Com cotação' },
  { key: 'positive', label: 'Variação positiva' },
  { key: 'negative', label: 'Variação negativa' },
]
function StockList() {
  const tickers = assetCoverage.STOCK
  const [rows, setRows] = useState<AssetRow[]>(() =>
    tickers.map((ticker) => ({
      ticker,
      status: 'loading',
      data: null,
      error: null,
    })),
  )
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const sortParam = params.get('sort') ?? 'ticker'
  const sort: SortKey = Object.hasOwn(sortLabels, sortParam)
    ? (sortParam as SortKey)
    : 'ticker'
  const filter: QuickFilter =
    filters.find((f) => f.key === params.get('filter'))?.key ?? 'all'
  const direction = params.get('dir') === 'desc' ? 'desc' : 'asc'
  const searchRef = useRef<HTMLInputElement>(null)
  const mounted = useRef(false)
  const attempts = useRef(new Map<string, number>())
  const load = useCallback((ticker: string) => {
    const attempt = (attempts.current.get(ticker) ?? 0) + 1
    attempts.current.set(ticker, attempt)
    void marketData
      .getAsset(ticker)
      .then((data) => {
        if (mounted.current && attempts.current.get(ticker) === attempt)
          setRows((current) =>
            current.map((r) =>
              r.ticker === ticker
                ? {
                    ticker,
                    data,
                    error: null,
                    status: data ? 'ready' : 'empty',
                  }
                : r,
            ),
          )
      })
      .catch((error) => {
        if (mounted.current && attempts.current.get(ticker) === attempt)
          setRows((current) =>
            current.map((r) =>
              r.ticker === ticker
                ? {
                    ticker,
                    data: null,
                    status: 'error',
                    error:
                      error instanceof DataError
                        ? error
                        : new DataError('network'),
                  }
                : r,
            ),
          )
      })
  }, [])
  useEffect(() => {
    mounted.current = true
    // Provider owns cache, deduplication and the sequential request queue.
    for (const ticker of tickers) load(ticker)
    return () => {
      mounted.current = false
    }
  }, [tickers, load])
  const update = (values: Record<string, string>) => {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(values)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    setParams(next, { replace: true })
  }
  const visible = selectRows(rows, query, filter, sort, direction)
  const pending = rows.filter((r) => r.status === 'loading').length
  const failures = rows.filter((r) => r.status === 'error').length
  return (
    <>
      <p className="intro">
        Compare as ações disponíveis nesta etapa e abra um ativo para consultar
        sua origem.
      </p>
      <p className="coverage-note">
        Cobertura: PETR4, VALE3, ITUB4 e MGLU3. Fundamentos indisponíveis nesta
        fonte. Atraso não informado; cotações não são apresentadas como tempo
        real.
      </p>
      <section className="list-controls" aria-label="Busca e filtros">
        <label htmlFor="asset-search">Buscar por ticker ou nome</label>
        <div className="search-field">
          <input
            ref={searchRef}
            id="asset-search"
            type="search"
            value={query}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Ex.: PETR4"
          />
          {query && (
            <button
              className="quiet-button"
              aria-label="Limpar busca"
              onClick={() => {
                update({ q: '' })
                searchRef.current?.focus()
              }}
            >
              Limpar
            </button>
          )}
        </div>
        <div className="quick-filters" aria-label="Filtros rápidos">
          {filters.map((f) => (
            <button
              className="quiet-button"
              key={f.key}
              aria-pressed={filter === f.key}
              onClick={() => update({ filter: f.key === 'all' ? '' : f.key })}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="metadata" role="status">
          {visible.length} de {rows.length} ações na cobertura
          {pending > 0 ? ` · ${pending} consultas pendentes` : ''}
          {failures > 0 ? ` · ${failures} consultas falharam` : ''}
        </p>
      </section>
      {visible.length > 0 ? (
        <AssetTable
          rows={visible}
          sort={sort}
          direction={direction}
          onSort={(key) =>
            update({
              sort: key,
              dir: sort === key && direction === 'asc' ? 'desc' : 'asc',
            })
          }
          onRetry={(ticker) => {
            setRows((current) =>
              current.map((r) =>
                r.ticker === ticker
                  ? { ...r, status: 'loading', error: null }
                  : r,
              ),
            )
            load(ticker)
          }}
        />
      ) : (
        <section className="empty-panel">
          <h2>
            {pending > 0
              ? 'Consultas em andamento'
              : 'Nenhuma ação corresponde à busca'}
          </h2>
          <p>
            {pending > 0
              ? 'Os resultados podem mudar quando a fonte responder.'
              : 'Ajuste a busca ou os filtros dentro da cobertura disponível.'}
          </p>
          <button
            className="quiet-button"
            onClick={() => {
              update({ q: '', filter: '' })
              searchRef.current?.focus()
            }}
          >
            Limpar busca e filtros
          </button>
        </section>
      )}
    </>
  )
}
export function AssetList({ type }: { type: 'STOCK' | 'FII' }) {
  return (
    <>
      <div className="eyebrow">
        {type === 'STOCK' ? 'Participações em empresas' : 'Fundos imobiliários'}
      </div>
      <h1>{type === 'STOCK' ? 'Ações' : 'FIIs'}</h1>
      {type === 'STOCK' ? (
        <StockList />
      ) : (
        <section className="empty-panel">
          <h2>FIIs sem cobertura nesta etapa</h2>
          <p>
            A fonte disponível sem token não oferece FIIs. Nenhum fundo ou
            indicador foi preenchido com dados fictícios.
          </p>
          <Link className="text-link" to="/acoes">
            Consultar ações disponíveis →
          </Link>
        </section>
      )}
    </>
  )
}
