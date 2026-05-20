import { useMemo, useState } from 'react';
import { Brain, Heart, RotateCcw, Star, Target } from 'lucide-react';
import { filterByLevel, wordBanks } from '../data/content';
import { Badge, SectionHeader, SpeakButton } from '../components/UI';
import { addDaysKey, todayKey } from '../utils/storage';

export function Flashcards({ progress, recordActivity, updateFlashcard, toggleFavourite, toggleDifficult, t, variant, level }) {
  const bank = useMemo(() => filterByLevel(wordBanks[variant], level), [variant, level]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mode, setMode] = useState('adaptive');
  const today = todayKey();
  const deck = useMemo(() => {
    const due = bank.filter((item) => {
      const state = progress.flashcards[item.id];
      if (mode === 'favourites') return progress.favourites.includes(item.id);
      if (mode === 'difficult') return progress.difficultWords.includes(item.id);
      return !state || state.nextReview <= today || progress.difficultWords.includes(item.id);
    });
    return due.length ? due : bank;
  }, [bank, mode, progress.difficultWords, progress.favourites, progress.flashcards, today]);

  const card = deck[index % deck.length];
  const state = progress.flashcards[card.id] || { reviews: 0, interval: 1, ease: 2.5 };

  const review = (quality) => {
    const interval = quality === 'hard' ? 1 : quality === 'good' ? Math.max(2, state.interval * 2) : Math.max(4, Math.round(state.interval * 2.8));
    updateFlashcard(card.id, {
      reviews: state.reviews + 1,
      interval,
      ease: quality === 'easy' ? state.ease + 0.15 : quality === 'hard' ? Math.max(1.3, state.ease - 0.25) : state.ease,
      nextReview: addDaysKey(interval),
      lastQuality: quality,
    });
    if (quality === 'hard' && !progress.difficultWords.includes(card.id)) toggleDifficult(card.id);
    recordActivity({ type: 'flashcard', title: card.term, xp: quality === 'easy' ? 14 : quality === 'good' ? 10 : 7, minutes: 2 });
    setFlipped(false);
    setIndex((value) => value + 1);
  };

  return (
    <div className="page-grid two-column">
      <section className="panel">
        <SectionHeader eyebrow={`${t('flashcards.eyebrow')} · ${level}`} title={t('flashcards.title')} />
        <div className="tabs">
          {[
            ['adaptive', t('flashcards.adaptive')],
            ['favourites', t('flashcards.favourites')],
            ['difficult', t('flashcards.difficult')],
          ].map(([id, label]) => <button className={mode === id ? 'active' : ''} key={id} type="button" onClick={() => setMode(id)}>{label}</button>)}
        </div>

        <button className={`flashcard ${flipped ? 'flipped' : ''}`} type="button" onClick={() => setFlipped((value) => !value)}>
          {!flipped ? (
            <>
              <Badge tone="blue">{card.level}</Badge>
              <h2>{card.term}</h2>
              <p>{card.category} · {card.context}</p>
              <span>{t('flashcards.flip')}</span>
            </>
          ) : (
            <>
              <Badge tone="mint">{t('vocabulary.example')}</Badge>
              <h2>{card.example}</h2>
              <p>{card.explanation}</p>
              <SpeakButton text={card.example} lang={variant} audioId={card.term} fallbackTerms={[card.term]} label={t('common.listen')} />
            </>
          )}
        </button>

        <div className="review-row">
          <button type="button" onClick={() => review('hard')}><Target size={18} />{t('flashcards.hard')}</button>
          <button type="button" onClick={() => review('good')}><Brain size={18} />{t('flashcards.good')}</button>
          <button type="button" onClick={() => review('easy')}><Star size={18} />{t('flashcards.easy')}</button>
        </div>
      </section>

      <section className="panel">
        <SectionHeader eyebrow={t('dashboard.progress')} title={`${deck.length} ${t('flashcards.due')}`} />
        <div className="insight-grid">
          <div><strong>{state.reviews}</strong><span>reviews</span></div>
          <div><strong>{state.interval}d</strong><span>interval</span></div>
          <div><strong>{progress.difficultWords.length}</strong><span>{t('flashcards.difficult')}</span></div>
          <div><strong>{progress.favourites.length}</strong><span>{t('flashcards.favourites')}</span></div>
        </div>
        <div className="action-row">
          <button className="secondary-button" type="button" onClick={() => toggleFavourite(card.id)}><Heart size={18} />{progress.favourites.includes(card.id) ? t('common.favourite') : t('common.addFavourite')}</button>
          <button className="secondary-button" type="button" onClick={() => setIndex((value) => value + 1)}><RotateCcw size={18} />{t('common.skip')}</button>
        </div>
      </section>
    </div>
  );
}
