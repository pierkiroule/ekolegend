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
              <p className="eyebrow soft-signal-label">Archive restaurée partiellement</p>
              <h1 className="soft-signal-title" data-text="EKO">EKO</h1>
              <p className="hero-subtitle">La légende de l’influenceur influencé</p>

              <div className="narrative-copy">
                <p>Personne ne sait exactement ce qui est arrivé à Éko.</p>
                <p>Pour certains, il était un influenceur parmi d’autres.</p>
                <p>Pour d’autres, il est devenu une légende parce qu’il a traversé une grande crise numérique : le BiG BUG.</p>
                <p>Ce jour-là, son direct s’est interrompu.</p>
                <p>Son avatar ne répondait plus comme avant.</p>
                <p>Son IA semblait parler à sa place.</p>
                <p>Et Éko ne savait plus très bien qui pilotait quoi.</p>
                <p>Lui.</p>
                <p>Son image.</p>
                <p>Son profil.</p>
                <p>Ou ses écrans.</p>
                <p>Des années plus tard, des fragments de son histoire ont été retrouvés.</p>
                <p>Ils ne racontent pas tous la même version.</p>
                <p>C’est normal.</p>
                <p>Une légende n’est jamais faite d’une seule vérité.</p>
                <p>Ta mission est d’explorer ces fragments.</p>
                <p>À chaque étape, tu découvriras une figure d’Éko et une sagesse ancienne qui aurait pu l’aider à traverser le BiG BUG.</p>
                <p>À la fin, tu pourras construire ta propre version de la légende.</p>
                <p>Pas pour trouver la seule vraie réponse.</p>
                <p>Mais pour comprendre ce qui aide un humain à rester vivant, relié et créatif au milieu des écrans, des avatars et des IA.</p>
              </div>

              <aside className="found-message" aria-label="Message retrouvé dans l’archive">
                <p className="found-message-label">Message retrouvé</p>
                <blockquote>
                  <p>Si quelqu’un retrouve ceci...</p>
                  <p>Je crois que je traverse quelque chose d’étrange.</p>
                  <p>Au début, je pensais contrôler mes écrans.</p>
                  <p>Puis j’ai eu l’impression que mes écrans me contrôlaient un peu trop.</p>
                  <p>Je ne savais plus vraiment qui imitait qui.</p>
                  <p>Moi.</p>
                  <p>Mon avatar.</p>
                  <p>Ou mon IA.</p>
                  <p>Alors j’ai cherché des repères.</p>
                  <p>Des anciennes sagesses.</p>
                  <p>Des petites lumières pour retrouver mon fil.</p>
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
              <p className="section-intro">Chaque fragment ouvre une question à discuter ensemble : il n’y a pas de bonne réponse unique, seulement des hypothèses à comparer.</p>
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
        Archive Éko • Tu peux faire une pause ou quitter l’archive à tout moment.
      </footer>
    </div>
  )
}
