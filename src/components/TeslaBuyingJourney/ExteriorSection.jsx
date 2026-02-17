import { getAvailableColors } from '../../utils/tesla-configurator-data.js';

export default function ExteriorSection({ config, onConfigChange }) {
  const colors = getAvailableColors(config.variant);
  const selected = colors.find(c => c.id === config.exteriorColor);

  return (
    <div className="tc-section">
      <h2 className="tc-section-title">{selected?.name || 'Exterior'}</h2>
      <p className="tc-section-subtitle">
        {selected ? (selected.price === 0 ? 'Included' : `AED ${selected.price.toLocaleString()}`) : 'Select a color'}
      </p>
      <div className="flex gap-3 flex-wrap">
        {colors.map(color => (
          <button
            key={color.id}
            onClick={() => onConfigChange({ exteriorColor: color.id })}
            className={`tc-swatch ${config.exteriorColor === color.id ? 'tc-swatch-selected' : ''}`}
            style={{ backgroundColor: color.hex }}
            aria-label={color.name}
            title={`${color.name}${color.price > 0 ? ` — AED ${color.price.toLocaleString()}` : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
