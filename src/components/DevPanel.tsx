import { useState } from 'react';
import { DEMO_OPTIONS, type DemoScenarioId } from '../demo/scenarios';

type Props = {
  current: DemoScenarioId;
  onSelect: (id: DemoScenarioId) => void;
};

export function DevPanel({ current, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className={`dev-toggle${open ? ' open' : ''}`}>
      <div className="dev-menu">
        {DEMO_OPTIONS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`demo-btn${current === id ? ' active' : ''}`}
            onClick={() => {
              onSelect(id);
              setOpen(false);
            }}
          >
            {label}
          </button>
        ))}
        <div className="dev-sep" />
        <button
          type="button"
          className="dev-close"
          onClick={() => setVisible(false)}
          title="隐藏"
        >
          ✕
        </button>
      </div>
      <button type="button" className="dev-pill" onClick={() => setOpen((o) => !o)}>
        Dev
      </button>
    </div>
  );
}
