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

      <blockquote>{archetype.question}</blockquote>

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
