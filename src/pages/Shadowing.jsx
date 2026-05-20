import { useMemo, useState } from 'react';
import { Pause, Play, Repeat, Rabbit, Snail } from 'lucide-react';
import { filterByLevel, phraseBank, variants } from '../data/content';
import { Badge, SectionHeader, SpeakButton } from '../components/UI';
import { speak } from '../utils/speech';

export function Shadowing({ recordActivity, t, variant, level }) {
  const phrases = useMemo(() => filterByLevel(phraseBank[variant], level), [variant, level]);
  const [index, setIndex] = useState(0);
  const [rate, setRate] = useState(0.86);
  const [autoRepeat, setAutoRepeat] = useState(false);
  const [playing, setPlaying] = useState(false);
  const phrase = phrases[index % phrases.length];

  const play = () => {
    setPlaying(true);
    speak(phrase.text, variant, rate);
    recordActivity({ type: 'shadowing', title: phrase.focus, xp: 8, minutes: 3 });
    if (autoRepeat) window.setTimeout(() => speak(phrase.text, variant, Math.max(0.6, rate - 0.08)), 2200);
    window.setTimeout(() => setPlaying(false), autoRepeat ? 4600 : 1300);
  };

  return (
    <div className="page-grid two-column">
      <section className="panel">
        <SectionHeader eyebrow={`${t('shadowing.eyebrow')} · ${variants[variant].short}`} title={t('shadowing.title')} />
        <div className="prompt-card shadow">
          <Badge tone="mint">{phrase.context}</Badge>
          <h2>{phrase.text}</h2>
          <p>{phrase.tip}</p>
          <div className="action-row">
            <button className="record-button compact" type="button" onClick={play}>
              {playing ? <Pause size={26} /> : <Play size={26} />}
              <span>{playing ? 'Playing' : t('common.listen')}</span>
            </button>
            <button className={`toggle-button ${autoRepeat ? 'active' : ''}`} type="button" onClick={() => setAutoRepeat((value) => !value)}>
              <Repeat size={18} />
              {t('shadowing.autoRepeat')}
            </button>
          </div>
          <label className="range-control">
            <Snail size={18} />
            <input type="range" min="0.55" max="1.2" step="0.03" value={rate} onChange={(event) => setRate(Number(event.target.value))} />
            <Rabbit size={18} />
            <strong>{rate.toFixed(2)}x</strong>
          </label>
        </div>
      </section>

      <section className="panel">
        <SectionHeader eyebrow={t('shadowing.queue')} title={t('shadowing.speed')} />
        <div className="item-list compact-list">
          {Array.from({ length: 8 }, (_, offset) => phrases[(index + offset) % phrases.length]).map((item, offset) => (
            <button className={offset === 0 ? 'active' : ''} key={`${item.id}-${offset}`} type="button" onClick={() => setIndex(index + offset)}>
              <span>{item.context}</span>
              <strong>{item.text}</strong>
            </button>
          ))}
        </div>
        <div className="action-row">
          <button className="secondary-button" type="button" onClick={() => setIndex((value) => Math.max(0, value - 1))}>{t('common.previous')}</button>
          <button className="primary-button" type="button" onClick={() => setIndex((value) => value + 1)}>{t('common.next')}</button>
          <SpeakButton text={phrase.text} lang={variant} rate={0.65} label={t('common.slow')} />
        </div>
      </section>
    </div>
  );
}
