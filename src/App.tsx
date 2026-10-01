import { useEffect } from 'react'
import { AssetList } from './components/AssetList'
import { QuotePreview } from './components/QuotePreview'
import {
  HashRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom'

const sections = [
  {
    path: '/acoes',
    title: 'Ações',
    label: 'Participações em empresas',
    description: 'Consulte cotações e fundamentos das empresas listadas na B3.',
  },
  {
    path: '/fiis',
    title: 'FIIs',
    label: 'Fundos imobiliários',
    description: 'Explore fundos imobiliários e seus indicadores disponíveis.',
  },
  {
    path: '/rankings',
    title: 'Rankings',
    label: 'Comparação por indicador',
    description:
      'Compare ativos por critérios objetivos. Rankings não são recomendações de compra.',
  },
  {
    path: '/screener',
    title: 'Screener',
    label: 'Seu recorte do mercado',
    description:
      'Encontre ativos combinando critérios de preço, fundamentos e liquidez.',
  },
]
function DataAvailability() {
  return (
    <div className="availability">
      <span className="status-dot" />
      Cobertura inicial limitada{' '}
      <span className="metadata">
        Fonte e atualização identificadas na consulta de cada ativo
      </span>
    </div>
  )
}
function Home() {
  return (
    <>
      <div className="eyebrow">MERCADO BRASILEIRO / AÇÕES E FIIs</div>
      <h1>
        O mercado, sob
        <br />
        <span>seus critérios.</span>
      </h1>
      <p className="intro">
        Um lugar para consultar ativos, comparar indicadores e organizar sua
        análise da B3.
      </p>
      <div className="hero-actions">
        <Link className="button" to="/acoes">
          Explorar ações ↗
        </Link>
        <Link className="text-link" to="/fiis">
          Explorar FIIs →
        </Link>
      </div>
      <section className="mt-12" aria-labelledby="explore-heading">
        <div className="section-heading">
          <h2 id="explore-heading">Explore o RadarB3</h2>
          <span className="metadata">Navegação inicial</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <Link className="section-card" key={section.path} to={section.path}>
              <div className="card-top">
                <span className="eyebrow">{section.label}</span>
                <span aria-hidden="true">↗</span>
              </div>
              <h3>{section.title}</h3>
              <p>{section.description}</p>
            </Link>
          ))}
        </div>
      </section>
      <div className="preview-link">
        <div>
          <strong>Conheça a página de um ativo</strong>
          <p>
            Consulta inicial de cotação, com origem e atualização identificadas.
          </p>
        </div>
        <Link className="text-link" to="/ativo/PETR4">
          Abrir PETR4 →
        </Link>
      </div>
    </>
  )
}
function SectionPage({ section }: { section: (typeof sections)[number] }) {
  return (
    <>
      <div className="eyebrow">{section.label}</div>
      <h1>{section.title}</h1>
      <p className="intro">{section.description}</p>
      <section className="empty-panel">
        <span className="empty-symbol" aria-hidden="true">
          —
        </span>
        <h2>Dados indisponíveis por enquanto</h2>
        <p>
          Esta área está em preparação. As informações de mercado serão exibidas
          após a integração da fonte de dados.
        </p>
        <Link className="text-link" to="/">
          Voltar ao início →
        </Link>
      </section>
    </>
  )
}
function AssetPage() {
  const { ticker = '' } = useParams()
  const normalized = ticker.toUpperCase()
  if (!/^[A-Z0-9]{4,12}$/.test(normalized)) return <NotFound invalid />
  return (
    <>
      <Link className="text-link" to="/acoes">
        ← Ações
      </Link>
      <div className="asset-heading">
        <div>
          <div className="eyebrow">PÁGINA DO ATIVO</div>
          <h1>{normalized}</h1>
        </div>
        <span className="badge">Acesso inicial sem token</span>
      </div>
      <QuotePreview ticker={normalized} />
    </>
  )
}
function NotFound({ invalid = false }: { invalid?: boolean }) {
  return (
    <>
      <div className="eyebrow">{invalid ? 'ATIVO INVÁLIDO' : '404'}</div>
      <h1>{invalid ? 'Confira o ticker' : 'Página não encontrada'}</h1>
      <p className="intro">
        {invalid
          ? 'Use um ticker com 4 a 12 letras e números.'
          : 'Este endereço não corresponde a uma página do RadarB3.'}
      </p>
      <Link className="button" to="/">
        Voltar ao início
      </Link>
    </>
  )
}
function Shell() {
  const location = useLocation()
  useEffect(() => {
    const section = sections.find((item) => item.path === location.pathname)
    document.title = `${section?.title ?? (location.pathname === '/' ? 'Início' : location.pathname.startsWith('/ativo/') ? 'Ativo' : 'Página não encontrada')} | RadarB3`
    document.getElementById('main-content')?.focus()
    window.scrollTo(0, 0)
  }, [location.pathname])
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault()
          document.getElementById('main-content')?.focus()
        }}
      >
        Pular para o conteúdo
      </a>
      <header className="header">
        <div className="header-inner">
          <Link className="brand" to="/" aria-label="RadarB3 — início">
            <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
              <circle
                cx="16"
                cy="16"
                r="13"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M16 3v13l9-9M3 16h7M16 22v7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="16" cy="16" r="3" fill="currentColor" />
            </svg>
            <span>
              Radar<span className="brand-suffix">B3</span>
            </span>
          </Link>
          <nav aria-label="Navegação principal">
            <NavLink to="/" end>
              Início
            </NavLink>
            {sections.map((section) => (
              <NavLink key={section.path} to={section.path}>
                {section.title}
              </NavLink>
            ))}
          </nav>
          <span className="badge header-badge">Versão inicial</span>
        </div>
      </header>
      <div className="content-wrap">
        <DataAvailability />
        <main id="main-content" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            {sections.map((section) => (
              <Route
                key={section.path}
                path={section.path}
                element={
                  section.path === '/acoes' ? (
                    <AssetList type="STOCK" />
                  ) : section.path === '/fiis' ? (
                    <AssetList type="FII" />
                  ) : (
                    <SectionPage section={section} />
                  )
                }
              />
            ))}
            <Route path="/ativo/:ticker" element={<AssetPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer>
          <Link className="footer-brand" to="/">
            RadarB3
          </Link>
          <p>
            Informações para comparação. Não constitui recomendação de
            investimento.
          </p>
          <span className="metadata">B3 · Brasil</span>
        </footer>
      </div>
    </div>
  )
}
export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  )
}
