export function ArchetypeCard({ archetype, isCollected, onCollect }) {
  return (
    <article className={isCollected ? 'archetype-card collected' : 'archetype-card'}>
      <div className="card-topline">
        <span className="card-icon">{archetype.icon}</span>
        <span>{archetype.theme}</span>
      </div>
      <h3>{archetype.name}</h3>
      <p className="fossil">{archetype.fossil}</p>

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

      <section className="debate-box" aria-label={`Débat de groupe : ${archetype.name}`}>
        <p className="debate-kicker">Débat de groupe</p>
        <blockquote>{archetype.debate.prompt}</blockquote>
        <div className="position-grid">
          {archetype.debate.positions.map((position) => (
            <p key={position}>{position}</p>
          ))}
        </div>
        <p className="group-action">✦ {archetype.debate.groupAction}</p>
      </section>

      <details className="guide-notes">
        <summary>Repère psychoéducatif</summary>
        <p>{archetype.question}</p>
        <p>{archetype.resource}</p>
      </details>

      {isCollected ? (
        <p className="wisdom">✦ {archetype.wisdom}</p>
      ) : (
        <button className="primary-button" onClick={() => onCollect(archetype.id)}>
          Restaurer ce fragment
        </button>
      )}
    </article>
  )
}
