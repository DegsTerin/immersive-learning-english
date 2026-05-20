import { useMemo, useState } from 'react';
import { Check, Search, Star, Target } from 'lucide-react';
import { filterByLevel, variants, wordBanks } from '../data/content';
import { Badge, SectionHeader, SpeakButton } from '../components/UI';

export function Vocabulary({ progress, recordActivity, toggleFavourite, toggleDifficult, t, variant, level }) {
  const profile = variants[variant];
  const bank = useMemo(() => filterByLevel(wordBanks[variant], level), [variant, level]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedId, setSelectedId] = useState(bank[0].id);

  const categories = useMemo(() => ['all', ...new Set(bank.map((item) => item.category))], [bank]);
  const filtered = useMemo(() => {
    const term = query.toLowerCase().trim();
    return bank
      .filter((item) => category === 'all' || item.category === category)
      .filter((item) => !term || [item.term, item.context, item.category, item.example].join(' ').toLowerCase().includes(term))
      .slice(0, 100);
  }, [bank, category, query]);

  const selected = bank.find((item) => item.id === selectedId) || filtered[0] || bank[0];
  const favourite = progress.favourites.includes(selected.id);
  const difficult = progress.difficultWords.includes(selected.id);

  const complete = () => {
    recordActivity({ type: 'vocabulary', title: selected.term, xp: 10 + selected.difficulty, minutes: 4 });
  };

  return (
    <div className="page-grid browser-layout">
      <section className="panel browser-panel">
        <SectionHeader eyebrow={`${t('vocabulary.eyebrow')} · ${profile.name}`} title={t('vocabulary.title')} />
        <label className="search-box">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('vocabulary.search')} />
        </label>
        <select className="select" value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => <option key={item} value={item}>{item === 'all' ? t('vocabulary.all') : item}</option>)}
        </select>
        <div className="item-list">
          {filtered.map((item) => (
            <button className={selected.id === item.id ? 'active' : ''} key={item.id} type="button" onClick={() => setSelectedId(item.id)}>
              <span>{item.category}</span>
              <strong>{item.term}</strong>
              <small>{item.context} · {item.level}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="panel detail-panel">
        <div className="toolbar">
          <Badge tone="blue">{selected.level}</Badge>
          <Badge tone="mint">{selected.category}</Badge>
          <Badge tone={selected.formality === 'casual' ? 'amber' : 'neutral'}>{selected.formality}</Badge>
        </div>
        <article className={`word-card ${variant === 'en-GB' ? 'uk' : 'us'}`}>
          <span>{profile.name}</span>
          <h2>{selected.term}</h2>
          <SpeakButton text={selected.term} lang={variant} audioId={selected.term} label={t('common.listen')} />
        </article>
        <div className="info-grid">
          <div>
            <span>{t('vocabulary.context')}</span>
            <p>{selected.explanation}</p>
          </div>
          <div>
            <span>{t('vocabulary.example')}</span>
            <p>{selected.example}</p>
          </div>
          <div>
            <span>{t('vocabulary.counterpart')}</span>
            <p>{selected.counterpart}</p>
          </div>
          <div>
            <span>{t('vocabulary.culture')}</span>
            <p>{selected.culture}</p>
          </div>
        </div>
        <div className="action-row">
          <button className="primary-button" type="button" onClick={complete}><Check size={18} />{t('common.studied')}</button>
          <button className="secondary-button" type="button" onClick={() => toggleFavourite(selected.id)}><Star size={18} />{favourite ? t('common.removeFavourite') : t('common.addFavourite')}</button>
          <button className={`secondary-button ${difficult ? 'warning' : ''}`} type="button" onClick={() => toggleDifficult(selected.id)}><Target size={18} />{difficult ? t('common.difficult') : t('common.markDifficult')}</button>
        </div>
      </section>
    </div>
  );
}
