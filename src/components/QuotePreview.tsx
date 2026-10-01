import { useEffect, useState } from 'react'
import { dataErrorMessages } from './dataErrors'
import { marketData } from '../services'
import { DataError } from '../services/domain'
import type { AssetSnapshot } from '../services/domain'
import { formatNumber, formatTimestamp } from '../services/normalize'

type State =
  | { status: 'loading' }
  | { status: 'empty' }
  | { status: 'error'; error: DataError }
  | { status: 'ready'; data: AssetSnapshot }
function QuoteContent({ ticker }: { ticker: string }) {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let active = true
    marketData
      .getAsset(ticker)
      .then((data) => {
        if (active)
          setState(data ? { status: 'ready', data } : { status: 'empty' })
      })
      .catch((error) => {
        if (active)
          setState({
            status: 'error',
            error:
              error instanceof DataError ? error : new DataError('network'),
          })
      })
    return () => {
      active = false
    }
  }, [ticker, attempt])
  if (state.status === 'loading')
    return (
      <section className="empty-panel data-panel" role="status">
        <h2>Consultando cotação</h2>
        <p>Aguardando a fonte de dados.</p>
      </section>
    )
  if (state.status === 'empty')
    return (
      <section className="empty-panel data-panel">
        <h2>Nenhum dado retornado</h2>
        <p>A fonte não retornou informações para este ativo.</p>
      </section>
    )
  if (state.status === 'error')
    return (
      <section className="empty-panel data-panel" role="status">
        <h2>Cotação indisponível</h2>
        <p>{dataErrorMessages[state.error.code]}</p>
        {state.error.retryAfterSeconds !== null && (
          <p>Aguarde ao menos {state.error.retryAfterSeconds} segundos.</p>
        )}
        {!['unsupported', 'auth'].includes(state.error.code) && (
          <button
            className="button"
            onClick={() => {
              setState({ status: 'loading' })
              setAttempt((n) => n + 1)
            }}
          >
            Tentar novamente
          </button>
        )}
      </section>
    )
  const { asset, quote, retrievedAt } = state.data
  return (
    <>
      <p className="intro">{asset.name ?? 'Nome indisponível'}</p>
      <section className="metric-grid" aria-label="Cotação e indicadores">
        {[
          [
            'Cotação',
            asset.currency === 'BRL'
              ? formatNumber(quote.price, 'BRL')
              : 'Indisponível',
          ],
          ['Variação', formatNumber(quote.changePercent, 'percent')],
          ['Dividend Yield', 'Indisponível'],
          ['P/VP', 'Indisponível'],
        ].map(([label, value]) => (
          <div className="metric" key={label}>
            <h2>{label}</h2>
            <strong className="quote-value">
              {value === 'Indisponível' ? (
                <span aria-label="Indisponível">—</span>
              ) : (
                value
              )}
            </strong>
            <span>
              {value === 'Indisponível'
                ? value
                : label === 'Cotação'
                  ? 'BRL'
                  : label === 'Variação'
                    ? 'Percentual informado pela fonte'
                    : ''}
            </span>
          </div>
        ))}
      </section>
      <section className="empty-panel">
        <h2>Origem e atualização</h2>
        <p>Fonte: {quote.source}</p>
        <p>Horário da cotação: {formatTimestamp(quote.updatedAt)}</p>
        <p>Consultado em: {formatTimestamp(retrievedAt)}</p>
        <p>
          Atraso: não informado para este acesso. A cotação não é apresentada
          como tempo real.
        </p>
        <p>Fundamentos e proventos: indisponíveis nesta consulta.</p>
      </section>
    </>
  )
}
export function QuotePreview({ ticker }: { ticker: string }) {
  return <QuoteContent key={ticker} ticker={ticker} />
}
