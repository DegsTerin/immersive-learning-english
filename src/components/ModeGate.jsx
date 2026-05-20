import { useState } from 'react';
import { Building2, CheckCircle2, ClipboardCheck, Coffee, Languages, Moon, Sun } from 'lucide-react';
import { placementQuestions, recommendLevelFromPlacement } from '../data/content';
import { LevelSelect } from './UI';

export function ModeGate({ t, theme, toggleTheme, languageAction, levels, level, setLevel, placementComplete, completePlacement, chooseVariant }) {
  const ThemeIcon = theme === 'dark' ? Sun : Moon;
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const currentQuestion = placementQuestions[questionIndex];

  const chooseAnswer = (option) => {
    const nextAnswers = [...answers, option.points];
    if (questionIndex === placementQuestions.length - 1) {
      completePlacement(recommendLevelFromPlacement(nextAnswers).id);
      return;
    }

    setAnswers(nextAnswers);
    setQuestionIndex((current) => current + 1);
  };

  const skipPlacement = () => {
    completePlacement(level || 'A1');
  };

  const gateTop = (
    <header className="gate-top">
      <div className="brand">
        <div className="brand-mark">ILE</div>
        <div>
          <strong>{t('appName')}</strong>
          <span>{t('onboarding.eyebrow')}</span>
        </div>
      </div>
      <div className="top-actions">
        <button className="ghost-button" type="button" onClick={languageAction.onClick}>
          <Languages size={18} />
          {languageAction.value}
        </button>
        <button className="ghost-button" type="button" onClick={toggleTheme}>
          <ThemeIcon size={18} />
          {theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
        </button>
      </div>
    </header>
  );

  if (!placementComplete) {
    const progress = Math.round((questionIndex / placementQuestions.length) * 100);

    return (
      <main className="gate">
        {gateTop}

        <section className="placement-shell" aria-labelledby="placement-title">
          <div className="placement-intro">
            <span className="eyebrow">{t('placement.eyebrow')}</span>
            <h1 id="placement-title">{t('placement.title')}</h1>
            <p>{t('placement.body')}</p>
            <div className="progress-track" aria-hidden="true">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <small>{questionIndex + 1}/{placementQuestions.length}</small>
          </div>

          <div className="placement-card">
            <div className="placement-question">
              <ClipboardCheck size={22} />
              <strong>{currentQuestion.prompt}</strong>
            </div>
            <div className="placement-options">
              {currentQuestion.options.map((option) => (
                <button key={option.label} type="button" onClick={() => chooseAnswer(option)}>
                  <span>{option.level}</span>
                  <strong>{option.label}</strong>
                </button>
              ))}
            </div>
            <button className="secondary-button" type="button" onClick={skipPlacement}>
              <CheckCircle2 size={18} />
              {t('placement.skip')}
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="gate">
      {gateTop}

      <section className="gate-hero">
        <span className="eyebrow">{t('onboarding.eyebrow')}</span>
        <h1>{t('onboarding.title')}</h1>
        <p>{t('onboarding.body')}</p>
      </section>

      <section className="level-panel">
        <div>
          <span className="eyebrow">{t('common.studyLevel')}</span>
          <h2>{t('onboarding.levelTitle')}</h2>
          <p>{t('onboarding.levelBody')}</p>
        </div>
        <LevelSelect levels={levels} value={level} onChange={setLevel} label={t('common.studyLevel')} />
      </section>

      <section className="choice-grid">
        <button className="choice-card british" type="button" onClick={() => chooseVariant('en-GB')}>
          <Building2 size={34} />
          <span>UK</span>
          <strong>{t('onboarding.britishTitle')}</strong>
          <p>{t('onboarding.britishBody')}</p>
          <em>{t('onboarding.enter')}</em>
        </button>
        <button className="choice-card american" type="button" onClick={() => chooseVariant('en-US')}>
          <Coffee size={34} />
          <span>US</span>
          <strong>{t('onboarding.americanTitle')}</strong>
          <p>{t('onboarding.americanBody')}</p>
          <em>{t('onboarding.enter')}</em>
        </button>
      </section>
    </main>
  );
}
