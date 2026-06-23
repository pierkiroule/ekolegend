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
              <div className="archive-glow" aria-hidden="true" />
              <p className="eyebrow glitch-label">Archive partiellement corrompue</p>
              <h1 className="glitch-title" data-text="EKO">EKO</h1>
              <p className="hero-subtitle">La légende de l’influenceur influencé</p>

              <div className="narrative-copy">
                <p>Personne ne sait exactement ce qui est arrivé à Éko.</p>
                <p>Pour certains, il n'était qu'un influenceur parmi d'autres.</p>
                <p>Pour d'autres, il fut le premier humain à traverser consciemment l'Ékran.</p>
                <p>Le jour du BiG BUG, son direct fut suivi par des millions de personnes.</p>
                <p>Puis le flux s'interrompit.</p>
                <p>Plus aucun message. Plus aucune vidéo. Plus aucune trace. Ou presque.</p>
                <p>Des siècles plus tard, les cyber-archéologues transnuméristes ont retrouvé des fragments dispersés de son histoire.</p>
                <p>Mais les archives sont incomplètes. Contradictoires. Parfois corrompues.</p>
                <p>Certaines sources affirment qu'Éko a disparu.</p>
                <p>D'autres prétendent qu'il a découvert quelque chose que personne n'aurait dû voir.</p>
                <p>Ta mission est simple.</p>
                <p>Retrouver la vérité vraie. Ou du moins ce qu'il en reste.</p>
                <p>Pour cela, tu devras explorer les fragments retrouvés et découvrir les anciennes sagesses qui auraient aidé Éko à traverser la crise du BiG BUG.</p>
                <p>Chaque fragment restauré révélera une partie de la légende.</p>
                <p>Chaque cyber-fossile découvert dévoilera une sagesse oubliée.</p>
                <p>À la fin de ton enquête, tu pourras partager au monde ce que tu crois être arrivé à Éko.</p>
                <p>Et peut-être comprendre pourquoi cette histoire continue encore aujourd'hui à nous concerner tous.</p>
              </div>

              <aside className="found-message" aria-label="Message retrouvé dans l’archive">
                <p className="found-message-label">Message retrouvé</p>
                <blockquote>
                  <p>Si quelqu'un retrouve ceci...</p>
                  <p>Je crois que quelque chose m'est arrivé.</p>
                  <p>Au début je pensais contrôler mes écrans.</p>
                  <p>Puis mes écrans ont commencé à me contrôler.</p>
                  <p>Ensuite je ne savais plus vraiment qui imitait qui.</p>
                  <p>Moi.</p>
                  <p>Mon avatar.</p>
                  <p>Ou mon IA.</p>
                  <p>Si tu lis ceci...</p>
                  <p>aide-moi à reconstruire mon histoire.</p>
                </blockquote>
              </aside>

              <div className="hero-actions">
                <button className="primary-button" onClick={() => setView('quest')}>
                  Ouvrir la première archive
                </button>
                <button className="secondary-button" onClick={() => setView('collection')}>
                  Consulter les fragments restaurés
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
        Archive Éko • Signal reconstruit • Fragments sous observation
      </footer>
    </div>
  )
}
