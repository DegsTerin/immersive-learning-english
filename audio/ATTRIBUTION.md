# Recorded Audio Attribution

This starter audio pack contains real recorded pronunciation files from Wikimedia Commons. The app uses these files where available and falls back to Web Speech API synthesis for words and phrases that do not yet have local recordings.

## British English

| Term | File | Creator | Licence | Source |
| --- | --- | --- | --- | --- |
| flat | `audio/en-GB/flat.ogg` | Association Shtooka, Judith Franck | CC BY 3.0 US | https://commons.wikimedia.org/wiki/File:En-uk-flat.ogg |

## American English

| Term | File | Creator | Licence | Source |
| --- | --- | --- | --- | --- |
| apartment | `audio/en-US/apartment.ogg` | Dvortygirl | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:En-us-apartment.ogg |
| color | `audio/en-US/color.ogg` | Dvortygirl | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:En-us-color.ogg |
| vacation | `audio/en-US/vacation.ogg` | Dvortygirl | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:En-us-vacation.ogg |

## Adding More Recordings

1. Add the `.ogg`, `.mp3` or `.wav` file under `public/audio/en-GB/` or `public/audio/en-US/`.
2. Register the file in `src/data/audioPacks.js`.
3. Add the attribution line above, including creator, licence and source URL.
4. Add critical offline files to `APP_SHELL` in `public/service-worker.js` when they should be precached.
