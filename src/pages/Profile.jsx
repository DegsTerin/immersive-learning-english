import { useRef, useState } from 'react';
import { Download, LogIn, Plus, RotateCcw, Save, ShieldCheck, Trash2, Upload, UserRound, Users } from 'lucide-react';
import { cefrLevels, variants } from '../data/content';
import { CalendarHeatmap, LevelSelect, SectionHeader, VariantSelect } from '../components/UI';
import { downloadJson } from '../utils/storage';

export function Profile({
  progress,
  profiles,
  profileStore,
  activeProfileId,
  updateUser,
  updateDailyGoal,
  recordActivity,
  resetProgress,
  createProfile,
  switchProfile,
  deleteProfile,
  importProfiles,
  t,
  variant,
  setVariant,
  level,
  setLevel,
  accessibility,
  updateAccessibility,
}) {
  const [newProfileName, setNewProfileName] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const importInputRef = useRef(null);

  const exportProgress = () => {
    downloadJson(`${progress.user.name || 'learner'}-immersive-learning-progress.json`, progress);
    recordActivity({ type: 'export', title: 'Progress export', xp: 6, minutes: 1 });
  };

  const addProfile = () => {
    createProfile({
      name: newProfileName.trim() || t('profile.defaultNewProfile'),
      settings: { variant, level, placementComplete: true },
    });
    setNewProfileName('');
  };

  const exportProfiles = () => {
    downloadJson('immersive-learning-english-profiles.json', {
      exportedAt: new Date().toISOString(),
      ...profileStore,
    });
    recordActivity({ type: 'export', title: 'Profiles export', xp: 8, minutes: 1 });
  };

  const importProfileFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const payload = JSON.parse(await file.text());
      importProfiles(payload.profileStore || payload);
      setProfileMessage(t('profile.importedProfiles'));
    } catch {
      setProfileMessage(t('profile.importError'));
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div className="page-grid profile-layout">
      <section className="panel profile-card">
        <SectionHeader eyebrow={variants[variant].name} title={t('profile.title')} />
        <div className="profile-avatar"><UserRound size={44} /></div>
        <label>
          {t('profile.name')}
          <input value={progress.user.name} onChange={(event) => updateUser({ name: event.target.value })} />
        </label>
        <LevelSelect levels={cefrLevels} value={level} onChange={setLevel} label={t('common.studyLevel')} />
        <VariantSelect value={variant} onChange={setVariant} label={t('common.studyVariant')} t={t} />
        <label>
          {t('profile.dailyGoal')}
          <input min="20" max="240" step="10" type="number" value={progress.dailyGoal} onChange={(event) => updateDailyGoal(event.target.value)} />
        </label>
        <div className="action-row">
          <button className="primary-button" type="button" onClick={() => recordActivity({ type: 'profile', title: 'Profile saved', xp: 4, minutes: 1 })}><Save size={18} />{t('common.save')}</button>
          <button className="secondary-button" type="button" onClick={exportProgress}><Download size={18} />{t('common.export')}</button>
        </div>
      </section>

      <div className="profile-side-stack">
        <section className="panel">
          <SectionHeader eyebrow={t('profile.profiles')} title={t('profile.profileManager')} />
          <div className="profile-manager">
            <div className="profile-list">
              {profiles.map((profile) => {
                const isActive = profile.id === activeProfileId;
                const studyVariant = profile.settings.variant === 'en-US' ? 'US' : profile.settings.variant === 'en-GB' ? 'UK' : '--';
                return (
                  <article className={`profile-row ${isActive ? 'active' : ''}`} key={profile.id}>
                    <div className="mini-profile-avatar">{profile.progress.user.name?.slice(0, 1) || 'L'}</div>
                    <div>
                      <strong>{profile.progress.user.name || 'Learner'}</strong>
                      <span>{profile.settings.level || 'A1'} · {studyVariant} · {profile.progress.xp} XP</span>
                    </div>
                    <button className="secondary-button" type="button" disabled={isActive} onClick={() => switchProfile(profile.id)}>
                      <LogIn size={17} />
                      {isActive ? t('profile.activeProfile') : t('profile.switchProfile')}
                    </button>
                    <button
                      className="icon-button warning"
                      type="button"
                      disabled={profiles.length <= 1}
                      onClick={() => deleteProfile(profile.id)}
                      aria-label={`${t('profile.deleteProfile')}: ${profile.progress.user.name || 'Learner'}`}
                      title={profiles.length <= 1 ? t('profile.cannotDeleteProfile') : t('profile.deleteProfile')}
                    >
                      <Trash2 size={17} />
                    </button>
                  </article>
                );
              })}
            </div>
            <div className="create-profile-box">
              <Users size={20} />
              <label>
                {t('profile.newProfile')}
                <input value={newProfileName} onChange={(event) => setNewProfileName(event.target.value)} placeholder={t('profile.newProfilePlaceholder')} />
              </label>
            <button className="primary-button" type="button" onClick={addProfile}>
              <Plus size={18} />
              {t('profile.createProfile')}
            </button>
          </div>
          <div className="profile-tools">
            <button className="secondary-button" type="button" onClick={exportProfiles}>
              <Download size={18} />
              {t('profile.exportProfiles')}
            </button>
            <button className="secondary-button" type="button" onClick={() => importInputRef.current?.click()}>
              <Upload size={18} />
              {t('profile.importProfiles')}
            </button>
            <input ref={importInputRef} className="sr-only" type="file" accept="application/json,.json" onChange={importProfileFile} />
          </div>
          {profileMessage && <p className="muted">{profileMessage}</p>}
        </div>
      </section>

        <section className="panel">
          <SectionHeader eyebrow={t('profile.accessibility')} title={t('profile.accessibilityTitle')} />
          <div className="accessibility-panel">
            <label>
              {t('profile.fontSize')}
              <input
                min="0.9"
                max="1.2"
                step="0.05"
                type="range"
                value={accessibility.fontScale}
                onChange={(event) => updateAccessibility({ fontScale: Number(event.target.value) })}
              />
            </label>
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={accessibility.highContrast}
                onChange={(event) => updateAccessibility({ highContrast: event.target.checked })}
              />
              <span>{t('profile.highContrast')}</span>
            </label>
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={accessibility.reducedMotion}
                onChange={(event) => updateAccessibility({ reducedMotion: event.target.checked })}
              />
              <span>{t('profile.reduceMotion')}</span>
            </label>
          </div>
        </section>

        <section className="panel">
          <SectionHeader eyebrow={t('dashboard.calendar')} title={t('dashboard.history')} />
          <CalendarHeatmap history={progress.history} />
          <div className="danger-zone">
            <ShieldCheck size={18} />
            <p>{t('profile.privacy')} {t('profile.isolatedProgress')}</p>
            <button className="secondary-button warning" type="button" onClick={resetProgress}><RotateCcw size={18} />{t('common.reset')}</button>
          </div>
        </section>
      </div>
    </div>
  );
}
