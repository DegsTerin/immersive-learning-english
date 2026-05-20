import { ArrowRight, Award, BookOpen, Brain, CalendarDays, CheckCircle2, Circle, Flame, Goal, Layers3, Mic2, Route, Trophy, Zap } from 'lucide-react';
import { achievements, cefrLevels, contentStats, examEquivalences, filterByLevel, idiomBank, interactiveScenarios, phraseBank, variants, wordBanks } from '../data/content';
import { AchievementBadge, CalendarHeatmap, ProgressBar, SectionHeader, StatCard } from '../components/UI';
import { todayKey } from '../utils/storage';
import { getDailyPathSteps, getNextDailyPathStep } from '../utils/dailyPath';

export function Dashboard({ progress, unlockedAchievements, navigate, t, variant, level, setLevel }) {
  const today = progress.history[todayKey()] || { xp: 0, activities: 0 };
  const profile = variants[variant];
  const words = filterByLevel(wordBanks[variant], level);
  const phrases = filterByLevel(phraseBank[variant], level);
  const idioms = filterByLevel(idiomBank[variant], level);
  const scenes = filterByLevel(interactiveScenarios.filter((item) => item.variant === variant), level);
  const nextLevelXp = progress.level * 250;
  const currentLevelStart = (progress.level - 1) * 250;
  const dailyProgress = Math.min(100, Math.round((today.xp / Math.max(1, progress.dailyGoal)) * 100));
  const levelProgress = Math.min(100, Math.round(((progress.xp - currentLevelStart) / Math.max(1, nextLevelXp - currentLevelStart)) * 100));
  const dailySteps = getDailyPathSteps(progress, todayKey());
  const nextDailyStep = getNextDailyPathStep(dailySteps);
  const completedDailySteps = dailySteps.filter((step) => step.completed).length;

  return (
    <div className="page-stack">
      <section className="hero">
        <div>
          <span className="eyebrow">{t('dashboard.method')}</span>
          <h2>{t('dashboard.heroTitle')}</h2>
          <p>{profile.hero}</p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => navigate('immersion')}>
              <Brain size={18} />
              {t('dashboard.startImmersion')}
            </button>
            <button className="secondary-button" type="button" onClick={() => navigate('pronunciation')}>
              <Mic2 size={18} />
              {t('dashboard.trainVoice')}
            </button>
          </div>
        </div>
        <div className="hero-visual progress-preview" aria-label={profile.name}>
          <div className="progress-preview-top">
            <div>
              <span>{profile.name}</span>
              <strong>{t('dashboard.progress')}</strong>
            </div>
            <em>{profile.short}</em>
          </div>

          <div className="progress-showcase">
            <div className="progress-orbit" style={{ '--progress': `${dailyProgress}%` }}>
              <span>{dailyProgress}%</span>
              <small>{t('dashboard.dailyGoal')}</small>
            </div>
            <div className="progress-metrics">
              <div>
                <span>{t('dashboard.totalXp')}</span>
                <strong>{progress.xp}</strong>
              </div>
              <div>
                <span>{t('dashboard.streak')}</span>
                <strong>{progress.streak} {t('common.days')}</strong>
              </div>
              <div>
                <span>{t('common.level')}</span>
                <strong>{progress.level}</strong>
              </div>
            </div>
          </div>

          <div className="level-progress-card">
            <div>
              <span>{level} · {cefrLevels.find((item) => item.id === level)?.band}</span>
              <strong>{levelProgress}%</strong>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${levelProgress}%` }} />
            </div>
          </div>

          <div className="mini-level-rail" aria-label={t('dashboard.cefrMap')}>
            {cefrLevels.map((item) => (
              <button className={item.id === level ? 'active' : ''} key={item.id} type="button" onClick={() => setLevel(item.id)}>
                {item.id}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="stat-grid">
        <StatCard icon={Zap} label={t('dashboard.totalXp')} value={progress.xp} detail={`${t('common.level')} ${progress.level}`} tone="mint" />
        <StatCard icon={Flame} label={t('dashboard.streak')} value={`${progress.streak} ${t('common.days')}`} detail={t('dashboard.progress')} tone="amber" />
        <StatCard icon={Goal} label={t('dashboard.dailyGoal')} value={`${today.xp}/${progress.dailyGoal}`} detail={`${today.activities || 0} ${t('common.activities')}`} tone="violet" />
        <StatCard icon={Layers3} label={t('common.currentMode')} value={profile.short} detail={profile.culture} tone="blue" />
      </section>

      <section className="panel daily-path-card">
        <SectionHeader
          eyebrow={t('daily.eyebrow')}
          title={t('daily.title')}
          action={(
            <button className="secondary-button" type="button" onClick={() => navigate(nextDailyStep.page)}>
              <ArrowRight size={18} />
              {t('daily.continue')}
            </button>
          )}
        />
        <div className="daily-path-grid">
          {dailySteps.map((step, index) => {
            const StepIcon = step.completed ? CheckCircle2 : step.current ? Route : Circle;
            return (
              <button
                className={`${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}`}
                key={step.id}
                type="button"
                onClick={() => navigate(step.page)}
              >
                <span>{index + 1}</span>
                <StepIcon size={20} />
                <strong>{t(step.labelKey)}</strong>
                <small>{t(step.detailKey)}</small>
              </button>
            );
          })}
        </div>
        <p className="muted">{t('daily.summary').replace('{completed}', completedDailySteps).replace('{total}', dailySteps.length)}</p>
      </section>

      <section className="panel two-column">
        <div>
          <SectionHeader eyebrow={t('dashboard.content')} title={`${level} · ${cefrLevels.find((item) => item.id === level)?.band}`} />
          <ProgressBar label={t('dashboard.progress')} value={today.xp} max={progress.dailyGoal} />
          <ProgressBar label={`${t('common.level')} ${progress.level}`} value={progress.xp - currentLevelStart} max={nextLevelXp - currentLevelStart} />
          <div className="pill-row">
            <span>{words.length} {t('dashboard.words')}</span>
            <span>{phrases.length} {t('dashboard.phrases')}</span>
            <span>{idioms.length} {t('dashboard.idioms')}</span>
            <span>{scenes.length} {t('dashboard.scenarios')}</span>
          </div>
          <p className="muted">{cefrLevels.find((item) => item.id === level)?.summary}</p>
        </div>
        <div>
          <SectionHeader eyebrow={t('dashboard.calendar')} title={t('dashboard.history')} />
          <CalendarHeatmap history={progress.history} />
          <div className="activity-list">
            {progress.activities.slice(0, 4).map((item) => (
              <div className="activity-item" key={item.id}>
                <CalendarDays size={18} />
                <div>
                  <strong>{item.title || item.type}</strong>
                  <span>{item.date} · {item.xp} XP</span>
                </div>
              </div>
            ))}
            {progress.activities.length === 0 && <p className="muted">{t('dashboard.emptyHistory')}</p>}
          </div>
        </div>
      </section>

      <section className="panel level-map">
        <SectionHeader eyebrow={t('dashboard.cefrMap')} title={t('dashboard.cefrTitle')} />
        <div className="level-rail">
          {cefrLevels.map((item) => (
            <button className={item.id === level ? 'active' : ''} key={item.id} type="button" onClick={() => setLevel(item.id)}>
              <strong>{item.id}</strong>
              <span>{item.band}</span>
            </button>
          ))}
        </div>
        <div className="exam-table">
          <span className="head">EC</span>
          {cefrLevels.map((item) => <span className={item.id === level ? 'active' : ''} key={item.id}>{item.id}</span>)}
          {examEquivalences.map((row) => [
            <strong key={`${row.exam}-name`}>{row.exam}</strong>,
            ...cefrLevels.map((item) => <span className={item.id === level ? 'active' : ''} key={`${row.exam}-${item.id}`}>{row[item.id] || '-'}</span>),
          ])}
        </div>
        <p className="muted">{t('dashboard.approximate')}</p>
      </section>

      <section className="panel two-column">
        <div>
          <SectionHeader eyebrow={t('dashboard.achievements')} title={`${unlockedAchievements.length}/${achievements.length}`} />
          <div className="achievement-grid">
            {achievements.map((achievement) => (
              <AchievementBadge key={achievement.id} achievement={achievement} unlocked={progress.achievements.includes(achievement.id)} />
            ))}
          </div>
        </div>
        <div>
          <SectionHeader eyebrow={t('dashboard.ranking')} title={profile.name} />
          <div className="ranking-list">
            {[{ name: progress.user.name || 'Learner', xp: progress.xp }, ...progress.ranking]
              .sort((a, b) => b.xp - a.xp)
              .map((person, index) => (
                <div className="ranking-row" key={person.name}>
                  <span>{index + 1}</span>
                  <strong>{person.name}</strong>
                  <em>{person.xp} XP</em>
                  {index === 0 && <Trophy size={17} />}
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <SectionHeader eyebrow={t('dashboard.shortcuts')} title={profile.voiceHint} />
        <div className="shortcut-grid">
          <button type="button" onClick={() => navigate('vocabulary')}><BookOpen size={18} />{t('nav.vocabulary')}</button>
          <button type="button" onClick={() => navigate('shadowing')}><Flame size={18} />{t('nav.shadowing')}</button>
          <button type="button" onClick={() => navigate('games')}><Award size={18} />{t('nav.games')}</button>
        </div>
      </section>
      <span className="sr-only">{contentStats.britishWords} {contentStats.americanWords}</span>
    </div>
  );
}
