import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PROFILE_STORE_KEY,
  createProfileRecord,
  createProfileStore,
  defaultProgress,
  getActiveProfile,
  loadProfileStore,
  saveProfileStore,
  updateActiveProfile,
} from '../src/utils/storage.js';

const installStorage = () => {
  const map = new Map();
  globalThis.localStorage = {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    clear: () => map.clear(),
  };
  return map;
};

test('legacy progress is migrated into the primary local profile', () => {
  const storage = installStorage();
  storage.set('immersive-learning-english-progress', JSON.stringify({
    ...defaultProgress,
    user: { ...defaultProgress.user, name: 'Bruno' },
    xp: 320,
  }));
  storage.set('ile-variant', 'en-GB');
  storage.set('ile-level', 'B1+');
  storage.set('ile-placement-complete', 'true');

  const store = loadProfileStore();
  const active = getActiveProfile(store);

  assert.equal(store.activeProfileId, 'profile-primary');
  assert.equal(store.profiles.length, 1);
  assert.equal(active.progress.user.name, 'Bruno');
  assert.equal(active.progress.xp, 320);
  assert.deepEqual(active.settings, { variant: 'en-GB', level: 'B1+', placementComplete: true });
});

test('profile store keeps an active profile and normalises profile data', () => {
  installStorage();
  const first = createProfileRecord({ id: 'profile-a', name: 'Alice', settings: { variant: 'en-GB', level: 'A2' } });
  const second = createProfileRecord({ id: 'profile-b', name: 'Ben', settings: { variant: 'en-US', level: 'C1' } });
  const store = createProfileStore({ profiles: [first, second], activeProfileId: 'missing-profile' });

  assert.equal(store.activeProfileId, 'profile-a');
  assert.equal(store.profiles[0].progress.user.name, 'Alice');
  assert.equal(store.profiles[1].settings.level, 'C1');
});

test('active profile updates do not leak into other local profiles', () => {
  installStorage();
  const store = createProfileStore({
    profiles: [
      createProfileRecord({ id: 'profile-a', name: 'Alice', progress: { xp: 10 } }),
      createProfileRecord({ id: 'profile-b', name: 'Ben', progress: { xp: 90 } }),
    ],
    activeProfileId: 'profile-b',
  });

  const updated = updateActiveProfile(store, (profile) => ({
    ...profile,
    progress: { ...profile.progress, xp: profile.progress.xp + 50 },
    settings: { ...profile.settings, level: 'B2+' },
  }));

  assert.equal(updated.profiles.find((profile) => profile.id === 'profile-a').progress.xp, 10);
  assert.equal(updated.profiles.find((profile) => profile.id === 'profile-b').progress.xp, 140);
  assert.equal(getActiveProfile(updated).settings.level, 'B2+');
});

test('saving the profile store persists all learner profiles locally', () => {
  const storage = installStorage();
  const store = createProfileStore({
    profiles: [
      createProfileRecord({ id: 'profile-a', name: 'Alice' }),
      createProfileRecord({ id: 'profile-b', name: 'Ben' }),
    ],
    activeProfileId: 'profile-b',
  });

  saveProfileStore(store);
  const persisted = JSON.parse(storage.get(PROFILE_STORE_KEY));

  assert.equal(persisted.activeProfileId, 'profile-b');
  assert.equal(persisted.profiles.length, 2);
});

test('exported profile snapshots can be imported back into a normalised store', () => {
  installStorage();
  const exported = {
    exportedAt: '2026-05-20T00:00:00.000Z',
    activeProfileId: 'profile-b',
    profiles: [
      createProfileRecord({ id: 'profile-a', name: 'Alice', settings: { variant: 'en-GB', level: 'A2' } }),
      createProfileRecord({ id: 'profile-b', name: 'Ben', settings: { variant: 'en-US', level: 'B2' } }),
    ],
  };

  const imported = createProfileStore(exported);

  assert.equal(imported.activeProfileId, 'profile-b');
  assert.equal(getActiveProfile(imported).progress.user.name, 'Ben');
  assert.equal(getActiveProfile(imported).settings.variant, 'en-US');
});
