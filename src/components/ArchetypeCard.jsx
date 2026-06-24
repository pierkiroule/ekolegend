export function ArchetypeCard({ archetype, choice, isCollected, onChoose, onContinue }) {
  const correctChoice = archetype.debate.choices.find((option) => option.isCorrect)
  const hasAnswered = Boolean(choice)

  return (
    <article className={isCollected ? 'archetype-card collected mission-card' : 'archetype-card mission-card'}>
      <div className="card-topline">
        <span className="card-icon">{archetype.icon}</span>
        <span>{archetype.theme}</span>
      </div>
      <h3>{archetype.name}</h3>
      <p className="fossil">{archetype.fossil}</p>

      <section className="situation-box" aria-label={`Situation narrative : ${archetype.name}`}>
        <p className="debate-kicker">La légende raconte</p>
        <p>{archetype.situation}</p>
      </section>

      <section className="debate-box" aria-label={`Énigme transnumériste : ${archetype.name}`}>
        <p className="debate-kicker">Énigme du collectif</p>
        <h4>{archetype.debate.prompt}</h4>
        <p className="debate-rule">Le groupe débat, choisit une réponse, puis l’animateur ou un jeune révèle la suite du conte. Une seule réponse marque le point du collectif.</p>
        <div className="choice-grid">
          {archetype.debate.choices.map((option) => {
            const isSelected = choice?.id === option.id
            const isCorrect = option.isCorrect
            const stateClass = hasAnswered && isCorrect ? ' correct' : hasAnswered && isSelected ? ' missed' : ''

            return (
              <button
                className={`${isSelected ? 'choice-button selected' : 'choice-button'}${stateClass}`}
                disabled={hasAnswered}
                key={option.id}
                onClick={() => onChoose(archetype.id, option)}
              >
                <span>{option.label}</span>
                <strong>{option.text}</strong>
              </button>
            )
          })}
        </div>
      </section>

      {hasAnswered ? (
        <section className="reveal-box" aria-label="Révélation narrative et psychoéducative">
          <p className="debate-kicker">Réponse révélée</p>
          <p className={choice.isCorrect ? 'score-good' : 'score-missed'}>
            {choice.isCorrect ? 'Point gagné pour le collectif.' : 'Pas de point cette fois, mais la bonne réponse est révélée.'}
          </p>
          <p><strong>Bonne réponse :</strong> {correctChoice.label} — {correctChoice.text}</p>
          <p>{correctChoice.reveals}</p>
          <div className="story-reveal">
            <p>{archetype.storyReveal}</p>
            <p><strong>Besoin profond :</strong> {archetype.deepNeed}</p>
            <p className="wisdom">✦ Sagesse d’Éko : {archetype.transnumeristWisdom}</p>
          </div>
          <button className="primary-button" onClick={onContinue}>
            Révéler la mission suivante
          </button>
        </section>
      ) : null}

      <details className="guide-notes">
        <summary>Repère psychoéducatif</summary>
        <dl className="insight-list">
          <div>
            <dt>Puissance</dt>
            <dd>{archetype.power}</dd>
          </div>
          <div>
            <dt>Vulnérabilité</dt>
            <dd>{archetype.vulnerability}</dd>
          </div>
        </dl>
        <p>{archetype.question}</p>
        <p>{archetype.resource}</p>
      </details>
    </article>
  )
}
