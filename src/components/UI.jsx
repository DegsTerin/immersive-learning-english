import { createElement, useEffect, useId, useRef, useState } from 'react';
import { CheckCircle2, ChevronDown, GraduationCap, RefreshCw, Volume2, X } from 'lucide-react';
import { playRecordedOrSpeak } from '../utils/speech';
import { todayKey } from '../utils/storage';

export function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="section-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function StatCard({ icon, label, value, detail, tone = 'mint' }) {
  return (
    <article className={`stat-card tone-${tone}`}>
      <div className="stat-icon">{createElement(icon, { size: 21 })}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

export function Badge({ children, tone = 'neutral' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function ProgressBar({ label, value, max }) {
  const percentage = Math.min(100, Math.round((value / Math.max(1, max)) * 100));
  return (
    <div className="progress-block">
      <div className="progress-label">
        <span>{label}</span>
        <strong>{percentage}%</strong>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

export function SpeakButton({ text, lang, rate = 0.95, label, audioId, fallbackTerms = [], title }) {
  return (
    <button className="icon-text-button" type="button" title={title} onClick={() => playRecordedOrSpeak({ text, lang, rate, audioId, fallbackTerms })}>
      <Volume2 size={17} />
      {label}
    </button>
  );
}

export function LevelSelect({ levels, value, onChange, label, compact = false, showLabel = true }) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef(null);
  const listboxId = useId();
  const selected = levels.find((level) => level.id === value) || levels[0];
  const selectedIndex = Math.max(0, levels.findIndex((level) => level.id === selected.id));
  const optionId = (levelId) => `${listboxId}-${levelId}`;

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!pickerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const chooseLevel = (levelId) => {
    onChange(levelId);
    setOpen(false);
  };

  const moveLevel = (nextIndex) => {
    const next = levels[(nextIndex + levels.length) % levels.length];
    if (next) {
      onChange(next.id);
      setOpen(true);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveLevel(selectedIndex + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveLevel(selectedIndex - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      moveLevel(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      moveLevel(levels.length - 1);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className={`level-picker ${compact ? 'compact' : ''} ${showLabel && !compact ? '' : 'no-label'}`} ref={pickerRef}>
      {showLabel && !compact && <span className="picker-label">{label}</span>}
      <button
        className="level-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-activedescendant={open ? optionId(selected.id) : undefined}
        aria-label={`${label}: ${selected.id} - ${selected.band}`}
        onKeyDown={handleKeyDown}
        onClick={() => setOpen((value) => !value)}
      >
        {compact && <GraduationCap size={16} aria-hidden="true" />}
        <strong>{selected.id}</strong>
        {!compact && <ChevronDown size={16} aria-hidden="true" />}
      </button>
      {open && (
        <div className="level-menu" id={listboxId} role="listbox" aria-label={label}>
          {levels.map((level) => (
            <button
              className={level.id === selected.id ? 'active' : ''}
              id={optionId(level.id)}
              key={level.id}
              type="button"
              role="option"
              aria-selected={level.id === selected.id}
              onKeyDown={handleKeyDown}
              onClick={() => chooseLevel(level.id)}
            >
              <strong>{level.id}</strong>
              <span>{level.band}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function VariantSelect({ value, onChange, label, t }) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef(null);
  const listboxId = useId();
  const options = [
    { id: 'en-GB', short: 'UK', name: t('common.british') },
    { id: 'en-US', short: 'US', name: t('common.american') },
  ];
  const selected = options.find((option) => option.id === value) || options[0];
  const selectedIndex = Math.max(0, options.findIndex((option) => option.id === selected.id));
  const optionId = (optionIdValue) => `${listboxId}-${optionIdValue}`;

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!pickerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const chooseVariant = (variantId) => {
    onChange(variantId);
    setOpen(false);
  };

  const moveVariant = (nextIndex) => {
    const next = options[(nextIndex + options.length) % options.length];
    if (next) {
      onChange(next.id);
      setOpen(true);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveVariant(selectedIndex + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveVariant(selectedIndex - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      moveVariant(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      moveVariant(options.length - 1);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="level-picker variant-picker" ref={pickerRef}>
      <span className="picker-label">{label}</span>
      <button
        className="level-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-activedescendant={open ? optionId(selected.id) : undefined}
        aria-label={`${label}: ${selected.name}`}
        onKeyDown={handleKeyDown}
        onClick={() => setOpen((value) => !value)}
      >
        <strong>{selected.name}</strong>
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      {open && (
        <div className="level-menu variant-menu" id={listboxId} role="listbox" aria-label={label}>
          {options.map((option) => (
            <button
              className={option.id === selected.id ? 'active' : ''}
              id={optionId(option.id)}
              key={option.id}
              type="button"
              role="option"
              aria-selected={option.id === selected.id}
              onKeyDown={handleKeyDown}
              onClick={() => chooseVariant(option.id)}
            >
              <strong>{option.short}</strong>
              <span>{option.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function NativeLevelSelect({ levels, value, onChange, label }) {
  return (
    <label className="select-label">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {levels.map((level) => (
          <option key={level.id} value={level.id}>
            {level.id} - {level.band}
          </option>
        ))}
      </select>
    </label>
  );
}

export function VariantSwitch({ value, onChange, t }) {
  return (
    <div className="segmented" role="group" aria-label={t('common.studyVariant')}>
      <button className={value === 'en-GB' ? 'active' : ''} type="button" onClick={() => onChange('en-GB')}>
        UK
      </button>
      <button className={value === 'en-US' ? 'active' : ''} type="button" onClick={() => onChange('en-US')}>
        US
      </button>
    </div>
  );
}

export function CalendarHeatmap({ history }) {
  const today = new Date();
  const days = Array.from({ length: 28 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (27 - index));
    const key = todayKey(date);
    return { key, xp: history[key]?.xp || 0 };
  });

  return (
    <div className="heatmap" aria-label="Study calendar">
      {days.map((day) => (
        <span key={day.key} title={`${day.key}: ${day.xp} XP`} data-level={day.xp > 120 ? 4 : day.xp > 70 ? 3 : day.xp > 20 ? 2 : day.xp > 0 ? 1 : 0} />
      ))}
    </div>
  );
}

export function AchievementBadge({ achievement, unlocked }) {
  return (
    <article className={`achievement ${unlocked ? 'unlocked' : ''}`}>
      <CheckCircle2 size={18} />
      <strong>{achievement.title}</strong>
      <span>{achievement.description}</span>
    </article>
  );
}

export function PwaUpdateToast({ t, onReload, onDismiss }) {
  return (
    <aside className="pwa-toast" role="status" aria-live="polite" aria-label={t('pwa.updateTitle')}>
      <div>
        <strong>{t('pwa.updateTitle')}</strong>
        <span>{t('pwa.updateBody')}</span>
      </div>
      <button className="primary-button" type="button" onClick={onReload}>
        <RefreshCw size={17} />
        {t('pwa.reload')}
      </button>
      <button className="icon-button" type="button" onClick={onDismiss} aria-label={t('pwa.later')}>
        <X size={17} />
      </button>
    </aside>
  );
}
