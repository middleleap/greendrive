import { useState, useEffect } from 'react';
import { getImageUrl, IMAGE_VIEWS } from '../../utils/tesla-configurator-data.js';

const FALLBACK_IMAGE = '/assets/model3-fallback.svg';
const VIEWS = [IMAGE_VIEWS.FRONT, IMAGE_VIEWS.SIDE];
const VIEW_LABELS = { [IMAGE_VIEWS.FRONT]: 'Front View', [IMAGE_VIEWS.SIDE]: 'Side View' };

export default function CarImagePanel({ config }) {
  const [viewIndex, setViewIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const view = VIEWS[viewIndex];

  const imageUrl = getImageUrl({ ...config, _view: view });

  // Preload the other view
  useEffect(() => {
    if (!config.variant) return;
    const otherView = VIEWS[(viewIndex + 1) % VIEWS.length];
    const img = new Image();
    img.src = getImageUrl({ ...config, _view: otherView });
  }, [config, viewIndex]);

  // Reset loaded/error state on image change
  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [imageUrl]);

  const prev = () => setViewIndex((i) => (i - 1 + VIEWS.length) % VIEWS.length);
  const next = () => setViewIndex((i) => (i + 1) % VIEWS.length);

  if (!config.variant) {
    return (
      <div className="tc-image-panel">
        <img
          src={FALLBACK_IMAGE}
          alt="Model 3"
          style={{ maxWidth: '85%', height: 'auto', opacity: 0.85 }}
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div className="tc-image-panel">
      <button className="tc-view-btn tc-view-btn-left" onClick={prev} aria-label="Previous view">
        &#8249;
      </button>
      <img
        src={error ? FALLBACK_IMAGE : imageUrl}
        alt={`${VIEW_LABELS[view]} of Model 3`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{ opacity: loaded || error ? 1 : 0.3 }}
        draggable={false}
      />
      <button className="tc-view-btn tc-view-btn-right" onClick={next} aria-label="Next view">
        &#8250;
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {VIEWS.map((v, i) => (
          <button
            key={v}
            onClick={() => setViewIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === viewIndex ? 'bg-gray-800 scale-125' : 'bg-gray-400'}`}
            aria-label={VIEW_LABELS[v]}
          />
        ))}
      </div>
    </div>
  );
}
