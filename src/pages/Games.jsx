import { useEffect, useMemo, useState } from 'react';
import { Check, Headphones, Timer, X } from 'lucide-react';
import { filterByLevel, phraseBank, wordBanks } from '../data/content';
import { SectionHeader, SpeakButton } from '../components/UI';
import { speak } from '../utils/speech';
import { optionsFor } from '../utils/games';
import { buildMemoryCards, isMemoryRoundComplete } from '../utils/memoryGame';

export function Games({ recordActivity, addGameScore, t, variant, level }) {
  const bank = useMemo(() => filterByLevel(wordBanks[variant], level), [variant, level]);
  const phrases = useMemo(() => filterByLevel(phraseBank[variant], level), [variant, level]);
  const [tab, setTab] = useState('listening');
  const [round, setRound] = useState(0);
  const [message, setMessage] = useState('');
  const [speedScore, setSpeedScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [running, setRunning] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState([]);
  const [matchedMemory, setMatchedMemory] = useState([]);
  const [memoryRound, setMemoryRound] = useState(0);
  const [memoryCompleted, setMemoryCompleted] = useState(false);
  const item = bank.length ? bank[(round * 7) % bank.length] : null;
  const phrase = phrases.length ? phrases[(round * 5) % phrases.length] : null;
  const hasContent = Boolean(item && phrase);

  useEffect(() => {
    if (!running) return undefined;
    if (timeLeft <= 0) {
      setRunning(false);
      addGameScore({ game: 'speed', score: speedScore });
      recordActivity({ type: 'game', title: t('games.speed'), xp: 14 + speedScore, score: speedScore, minutes: 3 });
      return undefined;
    }
    const timer = window.setTimeout(() => setTimeLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [addGameScore, recordActivity, running, speedScore, t, timeLeft]);

  const success = (title, xp = 14) => {
    setMessage(t('games.correct'));
    recordActivity({ type: 'game', title, xp, minutes: 3 });
    addGameScore({ game: title, score: xp });
    setRound((value) => value + 1);
  };

  const fail = () => {
    setMessage(t('games.wrong'));
    setRound((value) => value + 1);
  };

  const memoryCards = useMemo(() => buildMemoryCards(bank, memoryRound), [bank, memoryRound]);

  const resetMemoryRound = () => {
    setSelectedMemory([]);
    setMatchedMemory([]);
    setMemoryCompleted(false);
    setMemoryRound((value) => value + 1);
  };

  const chooseMemory = (card) => {
    if (matchedMemory.includes(card.pair) || selectedMemory.some((item) => item.id === card.id)) return;
    const next = [...selectedMemory, card].slice(-2);
    setSelectedMemory(next);
    if (next.length === 2) {
      if (next[0].pair === next[1].pair) {
        const nextMatched = [...new Set([...matchedMemory, card.pair])];
        setMatchedMemory(nextMatched);
        if (!memoryCompleted && isMemoryRoundComplete(nextMatched, memoryCards)) {
          setMemoryCompleted(true);
          setMessage(t('games.correct'));
          addGameScore({ game: t('games.memory'), score: 40 });
          recordActivity({ type: 'game', title: t('games.memory'), xp: 40, minutes: 4 });
        }
      }
      window.setTimeout(() => setSelectedMemory([]), 650);
    }
  };

  const tabs = [
    ['listening', t('games.listening')],
    ['speed', t('games.speed')],
    ['accent', t('games.accent')],
    ['complete', t('games.complete')],
    ['dialogue', t('games.dialogue')],
    ['memory', t('games.memory')],
  ];

  return (
    <div className="page-stack">
      <section className="panel">
        <SectionHeader eyebrow={`${t('games.eyebrow')} · ${level}`} title={t('games.title')} />
        <div className="tabs wrap">
          {tabs.map(([id, label]) => <button className={tab === id ? 'active' : ''} key={id} type="button" onClick={() => setTab(id)}>{label}</button>)}
        </div>
        {message && <div className="feedback-inline">{message}</div>}
      </section>

      {!hasContent && (
        <section className="panel">
          <SectionHeader eyebrow={level} title={t('common.noContentTitle')} />
          <p className="muted">{t('common.noContentBody')}</p>
        </section>
      )}

      {hasContent && tab === 'listening' && (
        <section className="panel game-card">
          <SectionHeader eyebrow={t('games.listening')} title={item.context} />
          <div className="listen-card"><Headphones size={34} /><SpeakButton text={item.term} lang={variant} audioId={item.term} label={t('games.playAudio')} /></div>
          <div className="option-grid">
            {optionsFor(bank, item.term, round + 4).map((option) => <button key={option} type="button" onClick={() => (option === item.term ? success(t('games.listening')) : fail())}>{option}</button>)}
          </div>
        </section>
      )}

      {hasContent && tab === 'speed' && (
        <section className="panel game-card">
          <SectionHeader eyebrow={t('games.speed')} title={item.term} />
          <div className="speed-board"><strong>{timeLeft}s</strong><span>{speedScore} XP</span></div>
          <div className="action-row">
            <button className="primary-button" type="button" onClick={() => { setRunning(true); setTimeLeft(20); setSpeedScore(0); }}><Timer size={18} />{t('games.startSpeed')}</button>
            <button className="secondary-button" type="button" disabled={!running} onClick={() => { setSpeedScore((value) => value + 1); setRound((value) => value + 1); }}><Check size={18} />{t('common.studied')}</button>
            <button className="secondary-button" type="button" disabled={!running} onClick={() => { setSpeedScore((value) => value - 1); setRound((value) => value + 1); }}><X size={18} />{t('common.skip')}</button>
          </div>
        </section>
      )}

      {hasContent && tab === 'accent' && (
        <section className="panel game-card">
          <SectionHeader eyebrow={t('games.accent')} title={phrase.context} />
          <div className="listen-card"><Headphones size={34} /><strong>{phrase.text}</strong><SpeakButton text={phrase.text} lang={variant} label={t('games.playAudio')} /></div>
          <div className="option-grid">
            <button type="button" onClick={() => success(t('games.accent'), 16)}>Sounds natural</button>
            <button type="button" onClick={() => success(t('games.accent'), 8)}>Needs more control</button>
          </div>
        </section>
      )}

      {hasContent && tab === 'complete' && (
        <section className="panel game-card">
          <SectionHeader eyebrow={t('games.complete')} title={phrase.context} />
          <div className="sentence-hole">{phrase.text.replace(item.term, '_____')}</div>
          <div className="option-grid">
            {optionsFor(bank, item.term, round + 8).map((option) => <button key={option} type="button" onClick={() => (option === item.term ? success(t('games.complete')) : fail())}>{option}</button>)}
          </div>
        </section>
      )}

      {hasContent && tab === 'dialogue' && (
        <section className="panel game-card">
          <SectionHeader eyebrow={t('games.dialogue')} title={phrase.text} />
          <div className="option-grid">
            <button type="button" onClick={() => success(t('games.dialogue'), 16)}>{variant === 'en-GB' ? 'Sure, I can sort that out.' : 'Sure, I can take care of that.'}</button>
            <button type="button" onClick={fail}>{variant === 'en-GB' ? 'I need the elevator right now.' : 'I need the lift right now.'}</button>
          </div>
          <button className="secondary-button" type="button" onClick={() => speak(phrase.text, variant)}>{t('common.listen')}</button>
        </section>
      )}

      {hasContent && tab === 'memory' && (
        <section className="panel game-card">
          <SectionHeader
            eyebrow={t('games.memory')}
            title={item.category}
            action={<button className="secondary-button" type="button" onClick={resetMemoryRound}>{t('games.newRound')}</button>}
          />
          <div className="memory-grid">
            {memoryCards.map((card) => {
              const visible = matchedMemory.includes(card.pair) || selectedMemory.some((item) => item.id === card.id);
              return <button className={visible ? 'visible' : ''} key={card.id} type="button" onClick={() => chooseMemory(card)}>{visible ? card.label : '?'}</button>;
            })}
          </div>
        </section>
      )}
    </div>
  );
}
