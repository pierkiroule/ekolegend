import { useMemo, useState } from 'react'
import { archetypes } from './data/archetypes'
import { ArchetypeCard } from './components/ArchetypeCard'
import { Header } from './components/Header'
import { Progress } from './components/Progress'
import './styles.css'

const STORAGE_KEY = 'ekolegend.mvp.collection'

function readCollection() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export default function App() {
  const [view, setView] = useState('home')
  const [collectedIds, setCollectedIds] = useState(readCollection)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)

  const collected = useMemo(
    () => archetypes.filter((archetype) => collectedIds.includes(archetype.id)),
    [collectedIds],
  )

  function persist(nextIds) {
    setCollectedIds(nextIds)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds))
  }

  function collect(id) {
    if (!collectedIds.includes(id)) {
      persist([...collectedIds, id])
    }
  }

  function reset() {
    persist([])
    setView('home')
  }

  function exportJson() {
    downloadFile(
      'archive-eko.json',
      JSON.stringify({ exportedAt: new Date().toISOString(), collection: collected }, null, 2),
      'application/json',
    )
  }

  function exportTxt() {
    const body = collected
      .map((item) => `${item.name}\n${item.wisdom}\nRessource : ${item.resource}`)
      .join('\n\n---\n\n')
    downloadFile('synthese-eko.txt', body || 'Aucun fragment restauré.', 'text/plain')
  }

  return (
    <div className={animationsEnabled ? 'app-shell animated' : 'app-shell'}>
      <Header
        animationsEnabled={animationsEnabled}
        collectedCount={collected.length}
        onNavigate={setView}
        onToggleAnimations={() => setAnimationsEnabled((value) => !value)}
      />

      <main>
        {view === 'home' ? (
          <>
            <section className="hero-panel">
              <p className="eyebrow">MVP thérapeutique narratif</p>
              <h1>Explorer l’influence numérique sans perdre le fil de soi.</h1>
              <p>
                Une expérience courte, mobile-first et rassurante pour traverser sept figures
                d’Eko, collecter leurs sagesses et repartir avec une synthèse exportable.
              </p>
              <div className="hero-actions">
                <button className="primary-button" onClick={() => setView('quest')}>
                  Commencer la fouille
                </button>
                <button className="secondary-button" onClick={() => setView('collection')}>
                  Voir l’archive
                </button>
              </div>
            </section>
            <Progress current={collected.length} total={archetypes.length} />
          </>
        ) : null}

        {view === 'quest' ? (
          <section className="grid-section">
            <div className="section-heading">
              <p className="eyebrow">Cyber-fossiles</p>
              <h2>Choisissez un fragment à restaurer</h2>
            </div>
            <div className="card-grid">
              {archetypes.map((archetype) => (
                <ArchetypeCard
                  archetype={archetype}
                  isCollected={collectedIds.includes(archetype.id)}
                  key={archetype.id}
                  onCollect={collect}
                />
              ))}
            </div>
          </section>
        ) : null}

        {view === 'collection' ? (
          <section className="collection-panel">
            <div className="section-heading">
              <p className="eyebrow">Musée transnumériste</p>
              <h2>L’Archive d’Eko</h2>
            </div>
            <Progress current={collected.length} total={archetypes.length} />
            <div className="collection-actions">
              <button className="secondary-button" onClick={exportJson} disabled={collected.length === 0}>
                Export JSON
              </button>
              <button className="secondary-button" onClick={exportTxt} disabled={collected.length === 0}>
                Export TXT
              </button>
              <button className="danger-button" onClick={reset} disabled={collected.length === 0}>
                Réinitialiser
              </button>
            </div>
            <div className="archive-list">
              {archetypes.map((archetype) => (
                <article key={archetype.id}>
                  <span>{archetype.icon}</span>
                  <div>
                    <h3>{archetype.name}</h3>
                    <p>{collectedIds.includes(archetype.id) ? archetype.wisdom : 'Fragment à restaurer.'}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <footer>
        Atelier de médiation douce • Cadre protecteur et contenant • Respirez, revenez à vous.
      </footer>
    </div>
  )
}
