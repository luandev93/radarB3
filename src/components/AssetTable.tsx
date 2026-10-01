import { Link } from 'react-router-dom'
import type { AssetRow, SortKey } from '../services/listing'
import { sortLabels } from '../services/listing'
import { formatNumber, formatTimestamp } from '../services/normalize'
import { dataErrorMessages } from './dataErrors'
const columns = Object.keys(sortLabels) as SortKey[]
function Missing() {
  return <span className="metadata">Indisponível</span>
}
export function AssetTable({
  rows,
  sort,
  direction,
  onSort,
  onRetry,
}: {
  rows: AssetRow[]
  sort: SortKey
  direction: 'asc' | 'desc'
  onSort: (key: SortKey) => void
  onRetry: (ticker: string) => void
}) {
  return (
    <>
      <p className="metadata" id="table-help">
        Deslize a tabela para ver todas as colunas. Selecione o ticker para
        abrir o ativo. Valores ausentes ficam ao final da ordenação.
      </p>
      <div
        className="table-scroll"
        role="region"
        aria-label="Tabela de ativos"
        aria-describedby="table-help"
        tabIndex={0}
      >
        <table className="asset-table">
          <caption className="sr-only">
            Ativos na cobertura disponível; ordenação por {sortLabels[sort]},{' '}
            {direction === 'asc' ? 'crescente' : 'decrescente'}.
          </caption>
          <thead>
            <tr>
              {columns.map((key) => (
                <th
                  scope="col"
                  key={key}
                  aria-sort={
                    sort === key
                      ? direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  <button
                    className="sort-button"
                    onClick={() => onSort(key)}
                    aria-label={`Ordenar por ${sortLabels[key]}`}
                  >
                    {sortLabels[key]}{' '}
                    <span aria-hidden="true">
                      {sort === key ? (direction === 'asc' ? '↑' : '↓') : '↕'}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const d = row.data
              return (
                <tr key={row.ticker}>
                  <th scope="row">
                    <Link className="text-link" to={`/ativo/${row.ticker}`}>
                      {row.ticker} ↗
                    </Link>
                  </th>
                  {row.status !== 'ready' ? (
                    <td colSpan={9}>
                      {row.status === 'loading' ? (
                        <>
                          <span>Consultando {row.ticker}</span>
                          <div className="table-skeleton" aria-hidden="true" />
                        </>
                      ) : row.status === 'empty' ? (
                        'A fonte não retornou dados para este ativo.'
                      ) : (
                        <div className="row-error">
                          <p>
                            {dataErrorMessages[row.error?.code ?? 'network']}
                          </p>
                          {row.error?.retryAfterSeconds != null && (
                            <p>
                              Aguarde ao menos {row.error.retryAfterSeconds}{' '}
                              segundos.
                            </p>
                          )}
                          {!['auth', 'unsupported'].includes(
                            row.error?.code ?? '',
                          ) && (
                            <button
                              className="quiet-button"
                              onClick={() => onRetry(row.ticker)}
                            >
                              Tentar novamente {row.ticker}
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  ) : (
                    <>
                      <td>{d?.asset.name ?? <Missing />}</td>
                      <td className="numeric">
                        {d?.asset.currency === 'BRL' ? (
                          formatNumber(d.quote.price, 'BRL')
                        ) : (
                          <Missing />
                        )}
                      </td>
                      <td className="numeric">
                        {formatNumber(
                          d?.quote.changePercent ?? null,
                          'percent',
                        )}
                      </td>
                      <td className="numeric">
                        {formatNumber(
                          d?.fundamentals.dividendYield ?? null,
                          'percent',
                        )}
                      </td>
                      <td className="numeric">
                        {formatNumber(d?.fundamentals.pe ?? null)}
                      </td>
                      <td className="numeric">
                        {formatNumber(d?.fundamentals.pb ?? null)}
                      </td>
                      <td className="numeric">
                        {formatNumber(d?.fundamentals.roe ?? null, 'percent')}
                      </td>
                      <td className="numeric">
                        {formatNumber(d?.quote.volume ?? null)}
                      </td>
                      <td className="provenance">
                        <span>
                          Cotação: {formatTimestamp(d?.quote.updatedAt ?? null)}
                        </span>
                        <span>Fonte: {d?.quote.source ?? 'Indisponível'}</span>
                        <span>
                          Consulta: {formatTimestamp(d?.retrievedAt ?? null)}
                        </span>
                      </td>
                    </>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
