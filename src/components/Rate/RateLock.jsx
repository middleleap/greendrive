import { useState, useEffect } from 'react';
import Card from '../shared/Card.jsx';
import { BASE_RATE } from '../../utils/constants.js';

const LOCK_STORAGE_KEY = 'greendrive_rate_lock';
const LOCK_DURATION_DAYS = 30;

function getLock() {
  try {
    return JSON.parse(localStorage.getItem(LOCK_STORAGE_KEY));
  } catch {
    return null;
  }
}

function saveLock(lock) {
  localStorage.setItem(LOCK_STORAGE_KEY, JSON.stringify(lock));
}

export default function RateLock({ score }) {
  const [lock, setLock] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const stored = getLock();
    if (stored) {
      const expiry = new Date(stored.expiresAt).getTime();
      if (expiry > Date.now()) {
        setLock(stored);
      } else {
        localStorage.removeItem(LOCK_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (!lock) return;
    const updateTimer = () => {
      const expiry = new Date(lock.expiresAt).getTime();
      const diff = expiry - Date.now();
      if (diff <= 0) {
        setLock(null);
        setTimeLeft(null);
        localStorage.removeItem(LOCK_STORAGE_KEY);
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      setTimeLeft({ days, hours, minutes, total: diff });
    };
    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [lock]);

  if (!score || !score.rateReduction) return null;

  const greenRate = BASE_RATE - score.rateReduction;

  const handleLock = () => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + LOCK_DURATION_DAYS * 86400000).toISOString();
    const lockData = {
      lockedAt: now.toISOString(),
      expiresAt,
      score: score.totalScore,
      tier: score.tier,
      rate: greenRate,
      rateReduction: score.rateReduction,
    };
    saveLock(lockData);
    setLock(lockData);
  };

  if (lock && timeLeft) {
    return (
      <Card>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-pastel flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-deep"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="section-title mb-0.5">Rate Locked</h3>
            <p className="text-xs text-bank-gray-mid mb-3">
              Your {lock.rate.toFixed(2)}% Green Rate ({lock.tier}) is guaranteed
            </p>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center p-2.5 rounded-lg bg-green-pastel">
                <p className="text-xl font-semibold text-green-deep">{timeLeft.days}</p>
                <p className="text-[10px] text-green-deep/70 uppercase tracking-widest">Days</p>
              </div>
              <div className="text-center p-2.5 rounded-lg bg-green-pastel">
                <p className="text-xl font-semibold text-green-deep">{timeLeft.hours}</p>
                <p className="text-[10px] text-green-deep/70 uppercase tracking-widest">Hours</p>
              </div>
              <div className="text-center p-2.5 rounded-lg bg-green-pastel">
                <p className="text-xl font-semibold text-green-deep">{timeLeft.minutes}</p>
                <p className="text-[10px] text-green-deep/70 uppercase tracking-widest">Min</p>
              </div>
            </div>

            {/* Progress bar showing time remaining */}
            <div className="h-1.5 bg-bank-gray-bg rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-green-deep transition-all duration-1000"
                style={{
                  width: `${(timeLeft.total / (LOCK_DURATION_DAYS * 86400000)) * 100}%`,
                }}
              />
            </div>
            <p className="text-[10px] text-bank-gray mt-2">
              Locked on{' '}
              {new Date(lock.lockedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
              . Apply before expiry to guarantee this rate.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-bank-gray-bg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-bank-gray-mid"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="section-title mb-0.5">Lock Your Green Rate</h3>
          <p className="text-xs text-bank-gray-mid mb-3">
            Guarantee your {greenRate.toFixed(2)}% rate for {LOCK_DURATION_DAYS} days while you
            finalise your purchase. Your score may fluctuate, but your locked rate won't.
          </p>
          <button
            onClick={handleLock}
            className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-green-deep to-[#0f8a5f] text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Lock Rate for {LOCK_DURATION_DAYS} Days
          </button>
          <p className="text-[10px] text-bank-gray mt-2">
            Rate lock is indicative and subject to final credit approval. Standard T&amp;Cs apply.
          </p>
        </div>
      </div>
    </Card>
  );
}
