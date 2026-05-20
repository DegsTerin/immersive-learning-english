export const recordedAudioPacks = [
  {
    id: 'wikimedia-shtooka-uk-flat',
    variant: 'en-GB',
    term: 'flat',
    type: 'word',
    src: 'audio/en-GB/flat.ogg',
    title: 'En-uk-flat.ogg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:En-uk-flat.ogg',
    creator: 'Association Shtooka, Judith Franck',
    licence: 'CC BY 3.0 US',
  },
  {
    id: 'wikimedia-us-apartment',
    variant: 'en-US',
    term: 'apartment',
    type: 'word',
    src: 'audio/en-US/apartment.ogg',
    title: 'En-us-apartment.ogg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:En-us-apartment.ogg',
    creator: 'Dvortygirl',
    licence: 'CC BY-SA 3.0',
  },
  {
    id: 'wikimedia-us-color',
    variant: 'en-US',
    term: 'color',
    type: 'word',
    src: 'audio/en-US/color.ogg',
    title: 'En-us-color.ogg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:En-us-color.ogg',
    creator: 'Dvortygirl',
    licence: 'CC BY-SA 3.0',
  },
  {
    id: 'wikimedia-us-vacation',
    variant: 'en-US',
    term: 'vacation',
    type: 'word',
    src: 'audio/en-US/vacation.ogg',
    title: 'En-us-vacation.ogg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:En-us-vacation.ogg',
    creator: 'Dvortygirl',
    licence: 'CC BY-SA 3.0',
  },
];

const normaliseAudioLookup = (value) =>
  value
    .toLowerCase()
    .replace(/[^\w\s'-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const publicAssetUrl = (src) => {
  const base = import.meta.env?.BASE_URL || './';
  return `${base.endsWith('/') ? base : `${base}/`}${src}`;
};

export const findRecordedAudio = ({ variant, text, audioId, fallbackTerms = [] }) => {
  const candidates = [audioId, text, ...fallbackTerms].filter(Boolean).map(normaliseAudioLookup);
  const pack = recordedAudioPacks.find((item) => item.variant === variant && candidates.includes(normaliseAudioLookup(item.term)));

  return pack ? { ...pack, url: publicAssetUrl(pack.src) } : null;
};
