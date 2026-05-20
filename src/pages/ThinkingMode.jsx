import { useMemo, useState } from 'react';
import { Brain, Eye, TimerReset } from 'lucide-react';
import { filterByLevel, thinkingPrompts, variants } from '../data/content';
import { Badge, SectionHeader } from '../components/UI';

export function ThinkingMode({ recordActivity, t, variant, level }) {
  const prompts = useMemo(() => filterByLevel(thinkingPrompts, level), [level]);
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState(null);
  const prompt = prompts[index % prompts.length];
  const options = prompt.options[variant] || prompt.options['en-GB'];

  const choose = (optionIndex) => {
    const correct = optionIndex === prompt.correct;
    setResult(correct ? t('thinking.correct') : t('thinking.wrong'));
    recordActivity({ type: 'thinking', title: prompt.prompt, xp: correct ? 18 : 7, score: correct ? 100 : 35, minutes: 3 });
  };

  return (
    <div className="page-grid two-column">
      <section className="panel thinking-stage">
        <SectionHeader eyebrow={`${t('thinking.eyebrow')} · ${level}`} title={t('thinking.title')} />
        <div className="visual-cue">
          <Eye size={24} />
          <span>{t('thinking.visual')}</span>
          <strong>{prompt.visual}</strong>
        </div>
        <div className="thinking-card">
          <Badge tone="mint">{variants[variant].name}</Badge>
          <h2>{prompt.prompt}</h2>
        </div>
      </section>

      <section className="panel">
        <SectionHeader eyebrow={t('thinking.prompt')} title="3... 2... 1..." />
        <div className="option-grid">
          {options.map((option, optionIndex) => (
            <button key={option} type="button" onClick={() => choose(optionIndex)}>
              <Brain size={18} />
              {option}
            </button>
          ))}
        </div>
        {result && <div className={result === t('thinking.correct') ? 'feedback-inline' : 'feedback-inline warning'}>{result}</div>}
        <button className="secondary-button wide" type="button" onClick={() => { setResult(null); setIndex((value) => value + 1); }}>
          <TimerReset size={18} />
          {t('common.next')}
        </button>
      </section>
    </div>
  );
}
