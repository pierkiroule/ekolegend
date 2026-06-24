export function ArchetypeCard({ archetype, choice, isCollected, onChoose }) {
  return (
    <article className={isCollected ? 'archetype-card collected mission-card' : 'archetype-card mission-card'}>
      <div className="card-topline">
        <span className="card-icon">{archetype.icon}</span>
        <span>{archetype.theme}</span>
      </div>
      <h3>{archetype.name}</h3>
      <p className="fossil">{archetype.fossil}</p>

      <section className="debate-box" aria-label={`Mission-débat : ${archetype.name}`}>
        <p className="debate-kicker">Mission-débat</p>
        <h4>{archetype.debate.prompt}</h4>
        <p className="debate-rule">Le groupe discute, puis choisit une piste. Il n’y a pas de bonne réponse : le choix révèle une facette utile de la traversée d’Éko.</p>
        <div className="choice-grid">
          {archetype.debate.choices.map((option) => (
            <button
              className={choice?.id === option.id ? 'choice-button selected' : 'choice-button'}
              disabled={isCollected}
              key={option.id}
              onClick={() => onChoose(archetype.id, option)}
            >
              <span>{option.label}</span>
              <strong>{option.text}</strong>
              <small>{option.reveals}</small>
            </button>
          ))}
        </div>
      </section>

      {isCollected && choice ? (
        <section className="reveal-box" aria-label="Révélation du choix">
          <p className="debate-kicker">Ce choix révèle</p>
          <p>{choice.reveals}</p>
          <p className="wisdom">✦ {archetype.wisdom}</p>
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
