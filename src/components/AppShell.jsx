import { Languages, Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { LevelSelect, VariantSwitch } from './UI';

export function AppShell({
  children,
  pages,
  activePage,
  setActivePage,
  t,
  theme,
  toggleTheme,
  languageAction,
  variant,
  setVariant,
  levels,
  level,
  setLevel,
  user,
}) {
  const [open, setOpen] = useState(false);
  const ThemeIcon = theme === 'dark' ? Sun : Moon;
  const themeLabel = theme === 'dark' ? t('common.lightMode') : t('common.darkMode');

  const navigate = (page) => {
    setActivePage(page);
    setOpen(false);
  };

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'open' : ''}`} id="app-sidebar">
        <div className="brand">
          <div className="brand-mark">ILE</div>
          <div>
            <strong>Immersive</strong>
            <span>Learning English</span>
          </div>
        </div>
        <nav className="nav-list" aria-label={t('common.mainNavigation')}>
          {pages.map((page) => {
            const Icon = page.icon;
            return (
              <button
                className={activePage === page.id ? 'active' : ''}
                key={page.id}
                type="button"
                aria-current={activePage === page.id ? 'page' : undefined}
                onClick={() => navigate(page.id)}
              >
                <Icon size={18} />
                <span>{page.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="profile-chip">
          <div className="avatar">{user.name?.slice(0, 1) || 'L'}</div>
          <div>
            <strong>{user.name || 'Learner'}</strong>
            <span>{level} · {variant === 'en-GB' ? 'UK' : 'US'}</span>
          </div>
        </div>
      </aside>

      <div className="mobile-bar">
        <button
          className="icon-button mobile-menu-button"
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-controls="app-sidebar"
          aria-expanded={open}
          aria-label={open ? t('common.closeMenu') : t('common.openMenu')}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <strong className="mobile-title">
          <span>Immersive</span>
          <span>Learning English</span>
        </strong>
        <div className="mobile-controls" aria-label={t('common.quickControls')}>
          <LevelSelect levels={levels} value={level} onChange={setLevel} label={t('common.studyLevel')} compact />
          <VariantSwitch value={variant} onChange={setVariant} t={t} />
          <button className="icon-button mobile-control" type="button" onClick={languageAction.onClick} title={languageAction.label} aria-label={languageAction.label}>
            <Languages size={18} />
          </button>
          <button className="icon-button mobile-control" type="button" onClick={toggleTheme} title={themeLabel} aria-label={themeLabel}>
            <ThemeIcon size={18} />
          </button>
        </div>
      </div>

      <main className="main">
        <header className="topbar">
          <div>
            <span className="eyebrow">{t('appName')}</span>
            <h1>{t('appSubtitle')}</h1>
          </div>
          <div className="top-actions">
            <LevelSelect levels={levels} value={level} onChange={setLevel} label={t('common.studyLevel')} showLabel={false} />
            <VariantSwitch value={variant} onChange={setVariant} t={t} />
            <button className="ghost-button" type="button" onClick={languageAction.onClick}>
              <Languages size={18} />
              {languageAction.value}
            </button>
            <button className="ghost-button" type="button" onClick={toggleTheme}>
              <ThemeIcon size={18} />
              {themeLabel}
            </button>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
