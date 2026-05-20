import { useEffect, useMemo, useRef, useState } from 'react';
import { BarChart3, Brain, Clapperboard, Gamepad2, Languages, Layers3, MessageCircle, Mic2, Repeat2, Search, UserRound } from 'lucide-react';
import { AppShell } from './components/AppShell';
import { ModeGate } from './components/ModeGate';
import { PwaUpdateToast } from './components/UI';
import { cefrLevels } from './data/content';
import { useProgress } from './hooks/useProgress';
import { createTranslator, languageNames, nextLanguage } from './i18n';
import { Dashboard } from './pages/Dashboard';
import { Vocabulary } from './pages/Vocabulary';
import { DualImmersion } from './pages/DualImmersion';
import { PronunciationLab } from './pages/PronunciationLab';
import { Shadowing } from './pages/Shadowing';
import { Flashcards } from './pages/Flashcards';
import { Games } from './pages/Games';
import { NetflixMode } from './pages/NetflixMode';
import { ThinkingMode } from './pages/ThinkingMode';
import { Profile } from './pages/Profile';

const pageDefs = [
  { id: 'dashboard', labelKey: 'nav.dashboard', icon: BarChart3, component: Dashboard },
  { id: 'vocabulary', labelKey: 'nav.vocabulary', icon: Search, component: Vocabulary },
  { id: 'immersion', labelKey: 'nav.immersion', icon: MessageCircle, component: DualImmersion },
  { id: 'pronunciation', labelKey: 'nav.pronunciation', icon: Mic2, component: PronunciationLab },
  { id: 'shadowing', labelKey: 'nav.shadowing', icon: Repeat2, component: Shadowing },
  { id: 'flashcards', labelKey: 'nav.flashcards', icon: Layers3, component: Flashcards },
  { id: 'games', labelKey: 'nav.games', icon: Gamepad2, component: Games },
  { id: 'netflix', labelKey: 'nav.netflix', icon: Clapperboard, component: NetflixMode },
  { id: 'thinking', labelKey: 'nav.thinking', icon: Brain, component: ThinkingMode },
  { id: 'profile', labelKey: 'nav.profile', icon: UserRound, component: Profile },
];

const searchParams = new URLSearchParams(window.location.search);
const demoMode = searchParams.get('demo') === 'readme';
const demoPage = searchParams.get('page');
const initialPage = pageDefs.some((page) => page.id === demoPage) ? demoPage : 'dashboard';
const defaultAccessibility = {
  fontScale: 1,
  highContrast: false,
  reducedMotion: false,
};

const loadAccessibility = () => {
  if (demoMode) return defaultAccessibility;
  try {
    return { ...defaultAccessibility, ...JSON.parse(localStorage.getItem('ile-accessibility') || '{}') };
  } catch {
    return defaultAccessibility;
  }
};

function App() {
  const progressApi = useProgress();
  const activeSettings = progressApi.profileSettings;
  const [activePage, setActivePage] = useState(initialPage);
  const [theme, setTheme] = useState(() => (demoMode ? 'dark' : localStorage.getItem('ile-theme') || 'dark'));
  const [language, setLanguage] = useState(() => (demoMode ? 'en-GB' : localStorage.getItem('ile-language') || 'pt-BR'));
  const [variant, setVariantState] = useState(() => (demoMode ? 'en-GB' : activeSettings.variant || ''));
  const [level, setLevelState] = useState(() => (demoMode ? 'B1+' : activeSettings.level || 'A1'));
  const [placementComplete, setPlacementComplete] = useState(() => activeSettings.placementComplete || demoMode);
  const [accessibility, setAccessibility] = useState(loadAccessibility);
  const [pwaUpdateRegistration, setPwaUpdateRegistration] = useState(null);
  const lastActiveProfileId = useRef(progressApi.activeProfileId);
  const t = useMemo(() => createTranslator(language), [language]);
  const pages = useMemo(() => pageDefs.map((page) => ({ ...page, label: t(page.labelKey) })), [t]);
  const currentPage = pages.find((page) => page.id === activePage) || pages[0];
  const Page = currentPage.component;

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', accessibility.fontScale);
    if (!demoMode) {
      localStorage.setItem('ile-accessibility', JSON.stringify(accessibility));
    }
  }, [accessibility]);

  useEffect(() => {
    if (demoMode) return;
    if (lastActiveProfileId.current === progressApi.activeProfileId) return;
    lastActiveProfileId.current = progressApi.activeProfileId;
    setVariantState(activeSettings.variant || '');
    setLevelState(activeSettings.level || 'A1');
    setPlacementComplete(Boolean(activeSettings.placementComplete));
    setActivePage('dashboard');
  }, [activeSettings.level, activeSettings.placementComplete, activeSettings.variant, progressApi.activeProfileId]);

  useEffect(() => {
    const handlePwaUpdate = (event) => {
      setPwaUpdateRegistration(event.detail?.registration || true);
    };

    window.addEventListener('ile-pwa-update', handlePwaUpdate);
    return () => window.removeEventListener('ile-pwa-update', handlePwaUpdate);
  }, []);

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('ile-theme', next);
      return next;
    });
  };

  const toggleLanguage = () => {
    setLanguage((current) => {
      const next = nextLanguage(current);
      localStorage.setItem('ile-language', next);
      return next;
    });
  };

  const setVariant = (next) => {
    setVariantState(next);
    if (!demoMode) progressApi.updateProfileSettings({ variant: next });
    setActivePage('dashboard');
  };

  const setLevel = (next) => {
    setLevelState(next);
    if (!demoMode) progressApi.updateProfileSettings({ level: next });
  };

  const completePlacement = (recommendedLevel) => {
    setLevelState(recommendedLevel);
    if (!demoMode) progressApi.updateProfileSettings({ level: recommendedLevel, placementComplete: true });
    setPlacementComplete(true);
  };

  const updateAccessibility = (patch) => {
    setAccessibility((current) => ({ ...current, ...patch }));
  };

  const applyPwaUpdate = () => {
    const waitingWorker = pwaUpdateRegistration?.waiting;
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      return;
    }
    window.location.reload();
  };

  const languageAction = {
    value: language === 'en-GB' ? 'EN-GB' : 'PT-BR',
    label: languageNames[nextLanguage(language)],
    icon: Languages,
    onClick: toggleLanguage,
  };

  if (!variant) {
    return (
      <div className="app" data-theme={theme} data-contrast={accessibility.highContrast ? 'more' : 'standard'} data-motion={accessibility.reducedMotion ? 'reduced' : 'full'}>
        <ModeGate
          t={t}
          theme={theme}
          toggleTheme={toggleTheme}
          languageAction={languageAction}
          levels={cefrLevels}
          level={level}
          setLevel={setLevel}
          placementComplete={placementComplete}
          completePlacement={completePlacement}
          chooseVariant={setVariant}
        />
        {pwaUpdateRegistration && (
          <PwaUpdateToast t={t} onReload={applyPwaUpdate} onDismiss={() => setPwaUpdateRegistration(null)} />
        )}
      </div>
    );
  }

  return (
    <div className="app" data-theme={theme} data-contrast={accessibility.highContrast ? 'more' : 'standard'} data-motion={accessibility.reducedMotion ? 'reduced' : 'full'}>
      <AppShell
        pages={pages}
        activePage={activePage}
        setActivePage={setActivePage}
        t={t}
        theme={theme}
        toggleTheme={toggleTheme}
        languageAction={languageAction}
        variant={variant}
        setVariant={setVariant}
        levels={cefrLevels}
        level={level}
        setLevel={setLevel}
        user={progressApi.progress.user}
      >
        <Page
          {...progressApi}
          navigate={setActivePage}
          t={t}
          variant={variant}
          setVariant={setVariant}
          level={level}
          setLevel={setLevel}
          accessibility={accessibility}
          updateAccessibility={updateAccessibility}
        />
      </AppShell>
      {pwaUpdateRegistration && (
        <PwaUpdateToast t={t} onReload={applyPwaUpdate} onDismiss={() => setPwaUpdateRegistration(null)} />
      )}
    </div>
  );
}

export default App;
