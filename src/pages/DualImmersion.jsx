import { useMemo, useState } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { filterByLevel, interactiveScenarios, variants } from '../data/content';
import { Badge, SectionHeader, SpeakButton } from '../components/UI';

const scoreLine = (line, scene, variant) => {
  const text = line.toLowerCase();
  const polite = ['please', 'could', 'would', 'thanks', 'thank you', 'can'].some((word) => text.includes(word));
  const target = text.includes(scene.target.toLowerCase());
  const naturalLength = text.split(/\s+/).filter(Boolean).length >= 5;
  const variantFit =
    variant === 'en-GB'
      ? !['elevator', 'sidewalk', 'trash', 'vacation'].some((word) => text.includes(word))
      : !['lift', 'pavement', 'rubbish', 'holiday'].some((word) => text.includes(word));
  return Math.min(100, 36 + (polite ? 20 : 0) + (target ? 22 : 0) + (naturalLength ? 12 : 0) + (variantFit ? 10 : 0));
};

export function DualImmersion({ recordActivity, t, variant, level }) {
  const profile = variants[variant];
  const scenes = useMemo(
    () => filterByLevel(interactiveScenarios.filter((item) => item.variant === variant), level),
    [variant, level],
  );
  const [selectedId, setSelectedId] = useState(scenes[0]?.id || '');
  const [choice, setChoice] = useState(null);
  const [line, setLine] = useState('');
  const [feedback, setFeedback] = useState(null);
  const scene = scenes.find((item) => item.id === selectedId) || scenes[0];

  if (!scene) {
    return (
      <section className="panel">
        <SectionHeader eyebrow={`${t('immersion.eyebrow')} · ${profile.name}`} title={t('common.noContentTitle')} />
        <p className="muted">{t('common.noContentBody')}</p>
      </section>
    );
  }

  const choose = (option) => {
    setChoice(option);
    recordActivity({ type: 'immersion', title: scene.title, xp: Math.round(option.score / 5), score: option.score, minutes: 7 });
  };

  const evaluate = () => {
    const score = scoreLine(line, scene, variant);
    setFeedback({
      score,
      label: score >= 85 ? t('immersion.excellent') : score >= 65 ? t('immersion.good') : t('immersion.needsWork'),
    });
    recordActivity({ type: 'correction', title: scene.title, xp: score >= 85 ? 22 : 12, score, minutes: 4 });
  };

  return (
    <div className="page-grid browser-layout">
      <section className="panel browser-panel">
        <SectionHeader eyebrow={`${t('immersion.eyebrow')} · ${profile.name}`} title={t('immersion.choose')} />
        <div className="item-list">
          {scenes.map((item) => (
            <button className={scene.id === item.id ? 'active' : ''} key={item.id} type="button" onClick={() => { setSelectedId(item.id); setChoice(null); setFeedback(null); setLine(''); }}>
              <span>{item.context}</span>
              <strong>{item.title}</strong>
              <small>{item.level} · {item.characters.join(' + ')}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="panel scene-stage">
        <SectionHeader eyebrow={t('immersion.mission')} title={scene.title} />
        <div className="mission-card">
          <Badge tone="blue">{scene.level}</Badge>
          <Badge tone="mint">{profile.short}</Badge>
          <h3>{scene.setup}</h3>
          <p>{scene.mission}</p>
          <div className="pill-row">
            {scene.characters.map((character) => <span key={character}>{character}</span>)}
          </div>
        </div>

        <div className="dialogue">
          {scene.dialogue.map((turn, index) => (
            <div className={turn.speaker === 'You' ? 'turn you' : 'turn'} key={`${turn.speaker}-${index}`}>
              <span>{turn.speaker}</span>
              <p>{turn.text}</p>
              <SpeakButton text={turn.text} lang={variant} label={t('common.listen')} />
            </div>
          ))}
        </div>

        <div className="choice-grid compact">
          {scene.choices.map((option) => (
            <button className={choice?.label === option.label ? 'active' : ''} key={option.label} type="button" onClick={() => choose(option)}>
              <MessageCircle size={18} />
              <strong>{option.label}</strong>
              {choice?.label === option.label && <span>{option.score}% {t('immersion.culturalFit')}</span>}
            </button>
          ))}
        </div>

        <div className="practice-box">
          <SectionHeader eyebrow={t('immersion.culturalFit')} title={t('immersion.response')} />
          <textarea value={line} onChange={(event) => setLine(event.target.value)} placeholder={t('immersion.placeholder')} />
          <button className="primary-button" type="button" onClick={evaluate} disabled={!line.trim()}>
            <Sparkles size={18} />
            {t('immersion.evaluate')}
          </button>
          {feedback && <div className="feedback-inline"><strong>{feedback.label}</strong><span>{feedback.score}%</span></div>}
        </div>
      </section>
    </div>
  );
}
