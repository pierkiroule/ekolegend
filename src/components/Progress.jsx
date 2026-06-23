export function Progress({ current, total }) {
  const value = Math.round((current / total) * 100)

  return (
    <section className="progress-card" aria-label="Progression de la traversée">
      <div className="progress-copy">
        <span>Fragments restaurés</span>
        <strong>{current} / {total}</strong>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${value}%` }} />
      </div>
    </section>
  )
}
