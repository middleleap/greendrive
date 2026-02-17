import { getInteriorForVariant } from '../../utils/tesla-configurator-data.js';

export default function InteriorSection({ config }) {
  const interior = getInteriorForVariant(config.variant);
  if (!interior) return null;

  return (
    <div className="tc-section">
      <h2 className="tc-section-title">{interior.name}</h2>
      <p className="tc-section-subtitle">Included — {interior.description}</p>
      <div className="flex gap-3">
        <div
          className="tc-swatch tc-swatch-selected"
          style={{ backgroundColor: '#1a1a1a' }}
          aria-label={interior.name}
        />
      </div>
    </div>
  );
}
