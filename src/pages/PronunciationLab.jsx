import { useMemo, useRef, useState } from 'react';
import { Mic, Play, Wand2 } from 'lucide-react';
import { filterByLevel, phraseBank, variants } from '../data/content';
import { Badge, ProgressBar, SectionHeader, SpeakButton } from '../components/UI';
import { createRecognition, feedbackFromScore, getPhoneticFeedback, recognitionSupported, scorePronunciation, speak } from '../utils/speech';

export function PronunciationLab({ recordActivity, addPronunciationScore, t, variant, level }) {
  const phrases = useMemo(() => filterByLevel(phraseBank[variant], level), [variant, level]);
  const [index, setIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState(null);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);
  const phrase = phrases.length ? phrases[index % phrases.length] : null;
  const feedback = score === null ? null : feedbackFromScore(score, t);
  const phoneticFeedback = score === null || !phrase ? null : getPhoneticFeedback(phrase.text, transcript, variant, score);

  const evaluate = (spoken) => {
    const result = scorePronunciation(phrase.text, spoken);
    setScore(result);
    addPronunciationScore({ phrase: phrase.text, variant, score: result, transcript: spoken });
    recordActivity({ type: 'pronunciation', title: variants[variant].voiceHint, xp: result >= 85 ? 24 : 12, score: result, minutes: 5 });
  };

  const startRecognition = () => {
    setError('');
    setScore(null);
    setTranscript('');

    if (!recognitionSupported()) {
      setError(t('pronunciation.unsupported'));
      return;
    }

    const recognition = createRecognition({
      lang: variant,
      onResult: (spoken) => {
        setTranscript(spoken);
        evaluate(spoken);
      },
      onEnd: () => setListening(false),
      onError: () => {
        setError(t('pronunciation.unsupported'));
        setListening(false);
      },
    });
    recognitionRef.current = recognition;
    setListening(true);
    try {
      recognition.start();
    } catch {
      setListening(false);
      setError(t('pronunciation.unsupported'));
    }
  };

  const nextPhrase = () => {
    recognitionRef.current?.abort?.();
    setListening(false);
    setScore(null);
    setTranscript('');
    setIndex((value) => value + 1);
  };

  if (!phrase) {
    return (
      <section className="panel">
        <SectionHeader eyebrow={`${t('pronunciation.eyebrow')} · ${level}`} title={t('common.noContentTitle')} />
        <p className="muted">{t('common.noContentBody')}</p>
      </section>
    );
  }

  return (
    <div className="page-grid two-column">
      <section className="panel">
        <SectionHeader eyebrow={`${t('pronunciation.eyebrow')} · ${level}`} title={t('pronunciation.title')} />
        <div className="prompt-card">
          <Badge tone="mint">{phrase.context}</Badge>
          <h2>{phrase.text}</h2>
          <p>{phrase.tip}</p>
          <div className="action-row">
            <SpeakButton text={phrase.text} lang={variant} label={t('common.listen')} />
            <button className="secondary-button" type="button" onClick={() => speak(phrase.text, variant, 0.72)}>
              <Play size={18} />
              {t('common.slow')}
            </button>
          </div>
        </div>

        <button className={`record-button ${listening ? 'listening' : ''}`} type="button" onClick={startRecognition}>
          <Mic size={30} />
          <span>{listening ? t('pronunciation.listening') : t('pronunciation.repeat')}</span>
        </button>

        {error && (
          <div className="practice-box">
            <p>{error}</p>
            <textarea value={transcript} onChange={(event) => setTranscript(event.target.value)} placeholder={t('pronunciation.manual')} />
            <button className="primary-button" type="button" onClick={() => evaluate(transcript)}><Wand2 size={18} />{t('immersion.evaluate')}</button>
          </div>
        )}

        {feedback && (
          <div className={`score-card ${feedback.tone}`}>
            <span>{feedback.label}</span>
            <strong>{score}%</strong>
            <ProgressBar label={t('pronunciation.match')} value={score} max={100} />
            <p>{t('pronunciation.recognised')}: <em>{transcript}</em></p>
            <div className="phonetic-grid" aria-live="polite">
              <article>
                <span>{t('pronunciation.phoneticFocus')}</span>
                <strong>{phoneticFeedback.title}</strong>
                <small>{phoneticFeedback.sound}</small>
              </article>
              <article>
                <span>{t('pronunciation.minimalPair')}</span>
                <strong>{phoneticFeedback.minimalPair}</strong>
                <small>{phoneticFeedback.tip}</small>
              </article>
              <article>
                <span>{t('pronunciation.rhythm')}</span>
                <strong>{phoneticFeedback.rhythm}</strong>
                {phoneticFeedback.missedWords.length > 0 && <small>{t('pronunciation.missedWords')}: {phoneticFeedback.missedWords.join(', ')}</small>}
              </article>
            </div>
          </div>
        )}
      </section>

      <section className="panel">
        <SectionHeader eyebrow={variants[variant].voiceHint} title={t('shadowing.queue')} />
        <div className="item-list compact-list">
          {Array.from({ length: 8 }, (_, offset) => phrases[(index + offset + 1) % phrases.length]).map((item) => (
            <button key={item.id} type="button" onClick={nextPhrase}>
              <span>{item.context}</span>
              <strong>{item.text}</strong>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
