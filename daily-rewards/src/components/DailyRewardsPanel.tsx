import './DailyRewardsPanel.css';
import { useGameState } from '../gameState';
import { useDailyRewards } from '../hooks/useDailyRewards';

const DailyRewardsPanel = () => {
  const { state, applyReward } = useGameState();
  const { streak, lastClaimDate, canClaim, nextReward, grid, claim } = useDailyRewards(applyReward);

  return (
    <section className="daily-panel">
      <header className="daily-panel__header">
        <div>
          <p className="daily-panel__label">Récompense quotidienne</p>
          <h1>Récompense du jour</h1>
          <small>Timezone Asia/Dubai</small>
        </div>
        <button
          className="primary"
          onClick={() => claim()}
          disabled={!canClaim}
        >
          {canClaim ? 'Réclamer la récompense' : 'Récompense déjà prise'}
        </button>
      </header>

      <div className="daily-panel__summary">
        <div className="daily-panel__stat">
          <span>Streak</span>
          <strong>
            {streak} jour{streak > 1 ? 's consécutifs' : ' consécutif'}
          </strong>
        </div>
        <div className="daily-panel__stat">
          <span>Prochain reward</span>
          <strong>
            {nextReward.quantity} {nextReward.type.toUpperCase()}
          </strong>
          <small>{nextReward.label}</small>
        </div>
      </div>

      <div className="daily-panel__grid">
        {grid.map(entry => (
          <article key={entry.day} className={`daily-card ${entry.status}`}>
            <div className="daily-card__day">Jour {entry.day}</div>
            <div className="daily-card__detail">
              <strong>{entry.reward.quantity}</strong>
              <span>{entry.reward.label}</span>
            </div>
            <p className="daily-card__type">{entry.reward.type.toUpperCase()}</p>
            {entry.status === 'claimed' && <span className="daily-card__pill">Déjà</span>}
            {entry.status === 'next' && <span className="daily-card__pill daily-card__pill--next">À venir</span>}
          </article>
        ))}
      </div>

      <footer className="daily-panel__footer">
        <div>Dernière réclamation : {lastClaimDate ?? 'jamais'}</div>
        <div>Gold: {state.gold} · XP: {state.xp}</div>
        <div>Inventaire: {state.inventory.length} objet{state.inventory.length !== 1 ? 's' : ''}</div>
      </footer>
    </section>
  );
};

export default DailyRewardsPanel;
