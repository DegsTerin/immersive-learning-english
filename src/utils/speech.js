import { findRecordedAudio } from '../data/audioPacks.js';

export const speechSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

export const recognitionSupported = () =>
  typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

export const speak = (text, lang = 'en-US', rate = 0.95) => {
  if (!speechSupported()) {
    return false;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = lang === 'en-GB' ? 0.96 : 1.02;

  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find((voice) => voice.lang?.toLowerCase().startsWith(lang.toLowerCase()));
  if (preferred) {
    utterance.voice = preferred;
  }

  window.speechSynthesis.speak(utterance);
  return true;
};

export const playRecordedAudio = (audio, rate = 1) => {
  if (!audio || typeof window === 'undefined') return false;

  const player = new Audio(audio.url);
  player.playbackRate = rate;
  player.preload = 'auto';

  const result = player.play();
  if (result?.catch) {
    result.catch(() => speak(audio.term, audio.variant, rate));
  }

  return true;
};

export const playRecordedOrSpeak = ({ text, lang = 'en-US', rate = 0.95, audioId, fallbackTerms = [] }) => {
  const audio = findRecordedAudio({ variant: lang, text, audioId, fallbackTerms });
  if (audio) {
    return playRecordedAudio(audio, rate);
  }

  return speak(text, lang, rate);
};

export const createRecognition = ({ lang = 'en-US', onResult, onEnd, onError }) => {
  if (!recognitionSupported()) {
    return null;
  }

  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new Recognition();
  recognition.lang = lang;
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript ?? '';
    onResult?.(transcript);
  };
  recognition.onend = () => onEnd?.();
  recognition.onerror = (event) => onError?.(event.error);

  return recognition;
};

export const normalizeSpeech = (value) =>
  value
    .toLowerCase()
    .replace(/[^\w\s']/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const scorePronunciation = (expected, spoken) => {
  const expectedWords = normalizeSpeech(expected).split(' ').filter(Boolean);
  const spokenWords = normalizeSpeech(spoken).split(' ').filter(Boolean);

  if (!expectedWords.length || !spokenWords.length) return 0;

  const matched = expectedWords.filter((word) => spokenWords.includes(word)).length;
  const orderBonus = expectedWords.reduce((score, word, index) => score + (spokenWords[index] === word ? 1 : 0), 0);
  const coverage = matched / expectedWords.length;
  const order = orderBonus / expectedWords.length;
  const lengthPenalty = Math.min(1, spokenWords.length / expectedWords.length);

  return Math.round((coverage * 0.65 + order * 0.25 + lengthPenalty * 0.1) * 100);
};

export const feedbackFromScore = (score, t) => {
  if (score >= 86) return { label: t ? t('feedback.excellent') : 'Excellent', tone: 'excellent' };
  if (score >= 65) return { label: t ? t('feedback.good') : 'Good', tone: 'good' };
  return { label: t ? t('feedback.needsWork') : 'Needs work', tone: 'needs-work' };
};

const phoneticProfiles = {
  'en-GB': [
    {
      id: 'th',
      pattern: /\b(the|this|that|there|thanks|think|three|with|together)\b/,
      title: 'TH clarity',
      sound: '/θ/ and /ð/',
      minimalPair: 'thin / tin · then / den',
      tip: 'Place the tongue lightly between the teeth; keep the sound soft rather than replacing it with T, D or F.',
    },
    {
      id: 't',
      pattern: /\b(water|better|city|ticket|started|tomato|timetable)\b/,
      title: 'Crisp T control',
      sound: '/t/',
      minimalPair: 'ten / den · two / do',
      tip: 'In careful modern British speech, keep T clearer in stressed words and avoid turning every T into a D sound.',
    },
    {
      id: 'r',
      pattern: /\b(car|park|four|floor|work|near|before|sort)\b/,
      title: 'Non-rhotic R',
      sound: 'linking R',
      minimalPair: 'law / lore · saw it / saw rit',
      tip: 'Do not over-pronounce final R before silence; link it gently only when the next word starts with a vowel.',
    },
    {
      id: 'schwa',
      pattern: /\b(could|would|about|together|before|today|support)\b/,
      title: 'Weak forms',
      sound: '/ə/',
      minimalPair: 'can / cən · to / tə',
      tip: 'Reduce small grammar words so the important content words carry the sentence stress.',
    },
  ],
  'en-US': [
    {
      id: 'r',
      pattern: /\b(car|parking|four|floor|work|near|before|store|sure)\b/,
      title: 'American R',
      sound: '/r/',
      minimalPair: 'car / ca · right / light',
      tip: 'Keep R present at the end of words and before consonants; it should sound firm but not forced.',
    },
    {
      id: 'flap-t',
      pattern: /\b(water|better|city|started|meeting|getting|later)\b/,
      title: 'Flap T rhythm',
      sound: '/ɾ/',
      minimalPair: 'latter / ladder · writer / rider',
      tip: 'Between vowels, T often becomes a quick flap. Keep it light so the sentence sounds connected.',
    },
    {
      id: 'th',
      pattern: /\b(the|this|that|there|thanks|think|three|with|together)\b/,
      title: 'TH clarity',
      sound: '/θ/ and /ð/',
      minimalPair: 'thin / tin · then / den',
      tip: 'Use a small tongue movement between the teeth; avoid changing TH into T, D, S or Z.',
    },
    {
      id: 'reductions',
      pattern: /\b(can|could|would|going|want|to|for|you)\b/,
      title: 'Connected reductions',
      sound: 'gonna, wanna, weak to',
      minimalPair: 'can / can’t · for / four',
      tip: 'Let function words shrink naturally, but keep the main nouns and verbs clear.',
    },
  ],
};

export const getPhoneticFeedback = (expected, spoken, lang = 'en-US', score = 0) => {
  const normalisedExpected = normalizeSpeech(expected);
  const expectedWords = normalisedExpected.split(' ').filter(Boolean);
  const spokenWords = normalizeSpeech(spoken).split(' ').filter(Boolean);
  const profile = phoneticProfiles[lang] || phoneticProfiles['en-US'];
  const focus = profile.find((item) => item.pattern.test(normalisedExpected)) || profile[0];
  const missingWords = expectedWords.filter((word) => !spokenWords.includes(word)).slice(0, 4);
  const ratio = spokenWords.length / Math.max(1, expectedWords.length);
  const rhythm =
    ratio < 0.72
      ? 'You dropped several words. Slow down, then rebuild the full sentence with the same stress pattern.'
      : ratio > 1.35
        ? 'You added extra words. Aim for shorter chunks and copy the original rhythm first.'
        : score >= 86
          ? 'Your rhythm is close. Now focus on smoother linking between words.'
          : 'Keep the stressed words clear and reduce smaller words instead of saying every word equally.';

  return {
    title: focus.title,
    sound: focus.sound,
    tip: focus.tip,
    minimalPair: focus.minimalPair,
    rhythm,
    missedWords: missingWords,
  };
};
