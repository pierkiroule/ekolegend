export function Header({ collectedCount, animationsEnabled, onToggleAnimations, onNavigate }) {
  return (
    <header className="app-header">
      <button className="brand" onClick={() => onNavigate('home')} aria-label="Retour à l'accueil">
        <span className={animationsEnabled ? 'brand-icon pulse' : 'brand-icon'}>🧵</span>
        <span>
          <strong>La Légende d’Eko</strong>
          <small>Laboratoire de cyber-archéologie</small>
        </span>
      </button>

      <nav className="header-actions" aria-label="Navigation principale">
        <button className="ghost-button" onClick={onToggleAnimations}>
          ✨ Anim : {animationsEnabled ? 'ON' : 'OFF'}
        </button>
        <button className="collection-button" onClick={() => onNavigate('collection')}>
          📂
          {collectedCount > 0 && <span aria-label={`${collectedCount} fragments collectés`}>{collectedCount}</span>}
        </button>
      </nav>
    </header>
  )
}
