import { useMemo, useState } from 'react'
import { archetypes } from './data/archetypes'
import { ArchetypeCard } from './components/ArchetypeCard'
import { Header } from './components/Header'
import { Progress } from './components/Progress'
import './styles.css'

const STORAGE_KEY = 'ekolegend.mvp.collection'
const CHOICES_STORAGE_KEY = 'ekolegend.mvp.choices'

function readCollection() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

function readChoices() {
  try {
    return JSON.parse(localStorage.getItem(CHOICES_STORAGE_KEY)) ?? {}
  } catch {
    return {}
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
  const [choices, setChoices] = useState(readChoices)
  const [revealedMissionId, setRevealedMissionId] = useState(null)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)

  const collected = useMemo(
    () => archetypes.filter((archetype) => collectedIds.includes(archetype.id)),
    [collectedIds],
  )

  const score = Object.values(choices).filter((choice) => choice.isCorrect).length
  const revealedArchetype = archetypes.find((archetype) => archetype.id === revealedMissionId)
  const nextArchetype = archetypes.find((archetype) => !collectedIds.includes(archetype.id))
  const activeArchetype = revealedArchetype ?? nextArchetype

  function persist(nextIds) {
    setCollectedIds(nextIds)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds))
  }

  function persistChoices(nextChoices) {
    setChoices(nextChoices)
    localStorage.setItem(CHOICES_STORAGE_KEY, JSON.stringify(nextChoices))
  }

  function chooseMission(archetypeId, choice) {
    persistChoices({ ...choices, [archetypeId]: choice })
    setRevealedMissionId(archetypeId)
    if (!collectedIds.includes(archetypeId)) {
      persist([...collectedIds, archetypeId])
    }
  }

  function continueMission() {
    setRevealedMissionId(null)
  }

  function reset() {
    persist([])
    persistChoices({})
    setRevealedMissionId(null)
    setView('home')
  }

  function exportJson() {
    downloadFile(
      'archive-eko.json',
      JSON.stringify({ exportedAt: new Date().toISOString(), collection: collected, choices, score }, null, 2),
      'application/json',
    )
  }

  function exportTxt() {
    const body = collected
      .map((item) => {
        const choice = choices[item.id]
        const correctChoice = item.debate.choices.find((option) => option.isCorrect)
        const reveal = choice
          ? `\nChoix du groupe : ${choice.text}\n${choice.isCorrect ? 'Point gagné' : `Bonne réponse révélée : ${correctChoice.text}`}\nBesoin profond : ${item.deepNeed}\nSagesse : ${item.transnumeristWisdom}`
          : ''
        return `${item.name}\n${item.wisdom}${reveal}\nRessource : ${item.resource}`
      })
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

              <section className="video-fossil" aria-label="Fossile vidéo de la légende d’Éko">
                <div>
                  <p className="found-message-label">Fossile vidéo · 2026</p>
                  <h2>Le slam des colporteurs d’Éko</h2>
                  <p>
                    Cet artefact aurait été réalisé en 2026 par un mystérieux collectif de
                    colporteurs de la légende d’Éko. Ils racontent avoir composé ce slam en
                    résonance avec un témoignage qu’Éko leur aurait confié, au moment où il
                    cherchait comment traverser son propre BiG BUG.
                  </p>
                </div>
                <div className="video-frame">
                  <iframe
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    src="https://www.youtube-nocookie.com/embed/xJmbsrkC5_A"
                    title="Fossile vidéo de la légende d’Éko"
                  />
                </div>
              </section>

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
              <h2>Énigme après énigme, traversez le BiG BUG</h2>
              <p className="section-intro">Le groupe débat comme dans un quiz narratif : une seule réponse marque le point, puis la bonne réponse est révélée et la suite du conte psychoéducatif apparaît.</p>
              <div className="score-card" aria-label="Score du collectif">
                <span>Score du collectif</span>
                <strong>{score} / {archetypes.length}</strong>
              </div>
            </div>
            {activeArchetype ? (
              <ArchetypeCard
                archetype={activeArchetype}
                choice={choices[activeArchetype.id]}
                isCollected={collectedIds.includes(activeArchetype.id)}
                onChoose={chooseMission}
                onContinue={continueMission}
              />
            ) : (
              <div className="quest-complete">
                <p className="eyebrow">Traversée recomposée</p>
                <h3>Les sept énigmes sont traversées.</h3>
                <p>Score du collectif : {score} / {archetypes.length}. Consultez la synthèse pour relire les besoins profonds, les sagesses d’Éko et les choix du groupe.</p>
                <button className="primary-button" onClick={() => setView('collection')}>
                  Voir la synthèse du groupe
                </button>
              </div>
            )}
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
              {archetypes.map((archetype) => {
                const choice = choices[archetype.id]

                return (
                  <article key={archetype.id}>
                    <span>{archetype.icon}</span>
                    <div>
                      <h3>{archetype.name}</h3>
                      {collectedIds.includes(archetype.id) ? (
                        <>
                          <p>{archetype.wisdom}</p>
                          {choice && <p className="choice-summary">Choix du groupe : {choice.text}</p>}
                          {choice && <p className="choice-summary">{choice.isCorrect ? 'Point gagné' : 'Bonne réponse révélée'} : {archetype.debate.choices.find((option) => option.isCorrect)?.text}</p>}
                          <p className="choice-summary">Besoin profond : {archetype.deepNeed}</p>
                          <p className="choice-summary">Sagesse : {archetype.transnumeristWisdom}</p>
                        </>
                      ) : (
                        <p>Mission-débat à jouer.</p>
                      )}
                    </div>
                  </article>
                )
              })}
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
