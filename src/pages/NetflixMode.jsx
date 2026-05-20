import { useMemo, useState } from 'react';
import { Clapperboard, Play, Sparkles } from 'lucide-react';
import { netflixScenes, variants } from '../data/content';
import { Badge, SectionHeader } from '../components/UI';
import { speak } from '../utils/speech';

export function NetflixMode({ recordActivity, t, variant, level }) {
  const scenes = useMemo(
    () => netflixScenes.filter((scene) => scene.variant === variant || scene.variant === 'mixed' || scene.level === level),
    [variant, level],
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const scene = scenes[index % scenes.length];

  const choose = (option) => {
    setSelected(option);
    recordActivity({ type: 'netflix', title: scene.title, xp: option.score >= 90 ? 28 : 14, score: option.score, minutes: 6 });
  };

  return (
    <div className="page-grid two-column">
      <section className="panel cinema-card">
        <div className="cinema-top">
          <Badge tone="violet">{scene.genre}</Badge>
          <Clapperboard size={34} />
        </div>
        <h2>{scene.title}</h2>
        <p>{scene.setup}</p>
        <div className="script-line">
          <span>{t('netflix.scenePartner')}</span>
          <strong>{scene.line}</strong>
          <button className="icon-text-button" type="button" onClick={() => speak(scene.line, scene.variant === 'mixed' ? variant : scene.variant)}>
            <Play size={17} />
            {t('common.listen')}
          </button>
        </div>
      </section>

      <section className="panel">
        <SectionHeader eyebrow={`${t('netflix.eyebrow')} · ${variants[variant].short}`} title={t('netflix.title')} />
        <div className="scene-options">
          {scene.options.map((option) => (
            <button className={selected?.text === option.text ? 'active' : ''} key={option.text} type="button" onClick={() => choose(option)}>
              <strong>{option.text}</strong>
              {selected?.text === option.text && <span>{option.score}% {t('netflix.naturalness')} · {option.feedback}</span>}
            </button>
          ))}
        </div>
        {selected && <div className="feedback-inline"><Sparkles size={20} /><strong>{selected.score}%</strong><span>{selected.feedback}</span></div>}
        <button className="secondary-button" type="button" onClick={() => { setIndex((value) => value + 1); setSelected(null); }}>{t('netflix.nextScene')}</button>
      </section>
    </div>
  );
}
