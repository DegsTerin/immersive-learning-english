import { useEffect, useMemo, useState } from 'react';
import { achievements } from '../data/content';
import {
  cloneDefaultProgress,
  createProfileRecord,
  createProfileStore,
  getActiveProfile,
  loadProfileStore,
  mergeProgress,
  saveProfileStore,
  todayKey,
  toggleInList,
  updateActiveProfile,
  withActivity,
} from '../utils/storage';

const unlockAchievements = (progress) => {
  const unlocked = new Set(progress.achievements);
  if (progress.activities.some((item) => item.type === 'immersion')) unlocked.add('first-scene');
  if (progress.streak >= 3) unlocked.add('streak-3');
  if (progress.pronunciationScores.some((item) => item.score >= 85)) unlocked.add('pronunciation-85');
  if (Object.keys(progress.flashcards).length >= 20) unlocked.add('flashcard-20');
  if (progress.activities.some((item) => item.type === 'netflix' && item.score >= 90)) unlocked.add('netflix-90');
  if (progress.activities.some((item) => item.type === 'export')) unlocked.add('exporter');
  return [...unlocked];
};

export const useProgress = () => {
  const [profileStore, setProfileStore] = useState(() => loadProfileStore());
  const activeProfile = getActiveProfile(profileStore);
  const progress = activeProfile.progress;
  const profileSettings = activeProfile.settings;

  useEffect(() => {
    saveProfileStore(profileStore);
  }, [profileStore]);

  const updateProgress = (updater) => {
    setProfileStore((current) =>
      updateActiveProfile(current, (profile) => {
        const nextProgress = typeof updater === 'function' ? updater(profile.progress) : updater;
        return { ...profile, progress: mergeProgress(nextProgress) };
      }),
    );
  };

  const recordActivity = (activity) => {
    updateProgress((current) => {
      const next = withActivity(current, activity);
      return { ...next, achievements: unlockAchievements(next) };
    });
  };

  const updateUser = (patch) => {
    updateProgress((current) => ({ ...current, user: { ...current.user, ...patch } }));
  };

  const updateDailyGoal = (dailyGoal) => {
    updateProgress((current) => ({ ...current, dailyGoal: Number(dailyGoal) || current.dailyGoal }));
  };

  const toggleFavourite = (id) => {
    updateProgress((current) => ({ ...current, favourites: toggleInList(current.favourites, id) }));
  };

  const toggleDifficult = (id) => {
    updateProgress((current) => ({ ...current, difficultWords: toggleInList(current.difficultWords, id) }));
  };

  const updateFlashcard = (id, patch) => {
    updateProgress((current) => ({
      ...current,
      flashcards: {
        ...current.flashcards,
        [id]: {
          reviews: 0,
          interval: 1,
          ease: 2.5,
          nextReview: todayKey(),
          ...(current.flashcards[id] || {}),
          ...patch,
        },
      },
    }));
  };

  const addPronunciationScore = (score) => {
    updateProgress((current) => {
      const next = {
        ...current,
        pronunciationScores: [{ date: todayKey(), ...score }, ...current.pronunciationScores].slice(0, 80),
      };
      return { ...next, achievements: unlockAchievements(next) };
    });
  };

  const addGameScore = (score) => {
    updateProgress((current) => ({
      ...current,
      gameScores: [{ date: todayKey(), ...score }, ...current.gameScores].slice(0, 80),
    }));
  };

  const resetProgress = () => {
    updateProgress((current) => ({
      ...cloneDefaultProgress(),
      user: current.user,
      dailyGoal: current.dailyGoal,
    }));
  };

  const updateProfileSettings = (patch) => {
    setProfileStore((current) =>
      updateActiveProfile(current, (profile) => ({
        ...profile,
        settings: { ...profile.settings, ...patch },
      })),
    );
  };

  const createProfile = ({ name, settings } = {}) => {
    const profile = createProfileRecord({
      name: name || `Learner ${profileStore.profiles.length + 1}`,
      settings: { ...profileSettings, ...settings },
    });
    setProfileStore((current) => ({
      ...current,
      activeProfileId: profile.id,
      profiles: [...current.profiles, profile],
    }));
    return profile.id;
  };

  const switchProfile = (profileId) => {
    setProfileStore((current) => (current.profiles.some((profile) => profile.id === profileId) ? { ...current, activeProfileId: profileId } : current));
  };

  const deleteProfile = (profileId) => {
    setProfileStore((current) => {
      if (current.profiles.length <= 1) return current;
      const profiles = current.profiles.filter((profile) => profile.id !== profileId);
      return {
        ...current,
        profiles,
        activeProfileId: current.activeProfileId === profileId ? profiles[0].id : current.activeProfileId,
      };
    });
  };

  const importProfiles = (payload) => {
    const nextStore = createProfileStore(payload);
    setProfileStore(nextStore);
    return nextStore;
  };

  const unlockedAchievements = useMemo(
    () => achievements.filter((achievement) => progress.achievements.includes(achievement.id)),
    [progress.achievements],
  );

  return {
    progress,
    profileStore,
    profiles: profileStore.profiles,
    activeProfileId: activeProfile.id,
    activeProfile,
    profileSettings,
    unlockedAchievements,
    recordActivity,
    updateUser,
    updateDailyGoal,
    toggleFavourite,
    toggleDifficult,
    updateFlashcard,
    addPronunciationScore,
    addGameScore,
    resetProgress,
    updateProfileSettings,
    createProfile,
    switchProfile,
    deleteProfile,
    importProfiles,
  };
};
