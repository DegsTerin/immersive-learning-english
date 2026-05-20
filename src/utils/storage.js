const STORAGE_KEY = 'immersive-learning-english-progress';
export const PROFILE_STORE_KEY = 'immersive-learning-english-profile-store';

const dateKeyFromLocalTime = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const todayKey = (date = new Date()) => dateKeyFromLocalTime(date);

export const yesterdayKey = (date = new Date()) => {
  const previous = new Date(date);
  previous.setDate(previous.getDate() - 1);
  return dateKeyFromLocalTime(previous);
};

export const tomorrowKey = (date = new Date()) => {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  return dateKeyFromLocalTime(next);
};

export const addDaysKey = (days, date = new Date()) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return dateKeyFromLocalTime(next);
};

export const cloneDefaultProgress = () => JSON.parse(JSON.stringify(defaultProgress));

export const mergeProgress = (stored) => {
  const base = cloneDefaultProgress();
  const source = stored || {};
  return {
    ...base,
    ...source,
    user: { ...base.user, ...(source.user || {}) },
    history: source.history || base.history,
    activities: source.activities || base.activities,
    favourites: source.favourites || base.favourites,
    difficultWords: source.difficultWords || base.difficultWords,
    flashcards: source.flashcards || base.flashcards,
    pronunciationScores: source.pronunciationScores || base.pronunciationScores,
    gameScores: source.gameScores || base.gameScores,
    achievements: source.achievements || base.achievements,
    ranking: source.ranking || base.ranking,
  };
};

const legacyYesterdayKey = (date = new Date()) => {
  const previous = new Date(date);
  previous.setDate(previous.getDate() - 1);
  return previous.toISOString().slice(0, 10);
};

export const defaultProgress = {
  user: {
    name: 'Learner',
    goal: 'Speak naturally in real situations',
    avatar: 'north',
  },
  xp: 0,
  level: 1,
  streak: 0,
  dailyGoal: 60,
  lastStudyDate: null,
  history: {},
  activities: [],
  favourites: [],
  difficultWords: [],
  flashcards: {},
  pronunciationScores: [],
  gameScores: [],
  achievements: [],
  ranking: [
    { name: 'Maya', xp: 2400 },
    { name: 'Oliver', xp: 1980 },
    { name: 'Ava', xp: 1820 },
  ],
};

export const defaultProfileSettings = {
  variant: '',
  level: 'A1',
  placementComplete: false,
};

const getStorage = () => (typeof globalThis !== 'undefined' && globalThis.localStorage ? globalThis.localStorage : null);

const profileId = () => {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.randomUUID) {
    return `profile-${globalThis.crypto.randomUUID()}`;
  }

  return `profile-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const createProfileRecord = ({ id, name, progress, settings = {}, createdAt, updatedAt } = {}) => {
  const now = new Date().toISOString();
  const nextProgress = mergeProgress(progress);
  return {
    id: id || profileId(),
    createdAt: createdAt || now,
    updatedAt: updatedAt || now,
    settings: { ...defaultProfileSettings, ...settings },
    progress: {
      ...nextProgress,
      user: {
        ...nextProgress.user,
        name: name || nextProgress.user.name || 'Learner',
      },
    },
  };
};

const mergeProfileRecord = (record, index = 0) =>
  createProfileRecord({
    id: record?.id || `profile-${index + 1}`,
    name: record?.progress?.user?.name || record?.name || 'Learner',
    progress: record?.progress,
    settings: record?.settings,
    createdAt: record?.createdAt,
    updatedAt: record?.updatedAt,
  });

const legacySettings = (storage) => ({
  variant: storage?.getItem('ile-variant') || '',
  level: storage?.getItem('ile-level') || 'A1',
  placementComplete: storage?.getItem('ile-placement-complete') === 'true',
});

const loadLegacyProgress = (storage) => {
  try {
    const stored = storage?.getItem(STORAGE_KEY);
    return stored ? mergeProgress(JSON.parse(stored)) : cloneDefaultProgress();
  } catch {
    return cloneDefaultProgress();
  }
};

export const createProfileStore = ({ profiles, activeProfileId } = {}) => {
  const safeProfiles = profiles?.length ? profiles.map(mergeProfileRecord) : [createProfileRecord()];
  const activeId = safeProfiles.some((profile) => profile.id === activeProfileId) ? activeProfileId : safeProfiles[0].id;

  return {
    version: 1,
    activeProfileId: activeId,
    profiles: safeProfiles,
  };
};

export const loadProfileStore = () => {
  const storage = getStorage();
  if (!storage) return createProfileStore();

  try {
    const stored = storage.getItem(PROFILE_STORE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return createProfileStore({
        profiles: parsed.profiles,
        activeProfileId: parsed.activeProfileId,
      });
    }
  } catch {
    // Fall through to legacy migration.
  }

  const legacyProgress = loadLegacyProgress(storage);
  return createProfileStore({
    profiles: [
      createProfileRecord({
        id: 'profile-primary',
        name: legacyProgress.user.name,
        progress: legacyProgress,
        settings: legacySettings(storage),
      }),
    ],
    activeProfileId: 'profile-primary',
  });
};

export const saveProfileStore = (store) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(PROFILE_STORE_KEY, JSON.stringify(createProfileStore(store)));
};

export const getActiveProfile = (store) => store.profiles.find((profile) => profile.id === store.activeProfileId) || store.profiles[0];

export const updateActiveProfile = (store, updater) => {
  const now = new Date().toISOString();
  return {
    ...store,
    profiles: store.profiles.map((profile) => {
      if (profile.id !== store.activeProfileId) return profile;
      const next = updater(profile);
      return { ...next, updatedAt: now };
    }),
  };
};

export const xpToLevel = (xp) => Math.max(1, Math.floor(xp / 250) + 1);

export const loadProgress = () => {
  const store = loadProfileStore();
  return getActiveProfile(store).progress;
};

export const saveProgress = (progress) => {
  const store = loadProfileStore();
  saveProfileStore(updateActiveProfile(store, (profile) => ({ ...profile, progress: mergeProgress(progress) })));
};

export const withActivity = (progress, activity, now = new Date()) => {
  const date = todayKey(now);
  const previousDate = progress.lastStudyDate;
  const localYesterday = yesterdayKey(now);
  const legacyYesterday = legacyYesterdayKey(now);
  const streak =
    previousDate === date ? progress.streak : previousDate === localYesterday || previousDate === legacyYesterday ? progress.streak + 1 : 1;
  const today = progress.history[date] || { xp: 0, activities: 0, minutes: 0 };
  const xp = progress.xp + activity.xp;

  return {
    ...progress,
    xp,
    level: xpToLevel(xp),
    streak,
    lastStudyDate: date,
    activities: [{ id: `${activity.type}-${Date.now()}`, date, ...activity }, ...progress.activities].slice(0, 160),
    history: {
      ...progress.history,
      [date]: {
        xp: today.xp + activity.xp,
        activities: today.activities + 1,
        minutes: today.minutes + (activity.minutes || 4),
      },
    },
  };
};

export const toggleInList = (list, id) => (list.includes(id) ? list.filter((item) => item !== id) : [...list, id]);

export const downloadJson = (filename, payload) => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const clearProgress = () => {
  const storage = getStorage();
  storage?.removeItem(STORAGE_KEY);
  storage?.removeItem(PROFILE_STORE_KEY);
};
