import {Settings} from '../models/prefs';

export const GUESSIT_API_URL = 'https://metaman-guessit.herokuapp.com/';

export const TMDB_API_URL = 'https://api.themoviedb.org/3/';

export const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/';

export const DEFAULT_SETTINGS: Settings = {
  dirs: [],
  tmdb: {
    key: 'c73f3083988325a968f198ad0956a3cd',
    language: 'en-US',
    adults: true
  },
  man: {
    folder: '[${year}] ${title}',
    name: '${title} (${year})',
    backdrop: {
      save: false,
      name: 'backdrop'
    },
    poster: {
      save: true,
      name: 'poster'
    }
  },
  proxy: {
    enable: false,
    protocol: 'http'
  }
};

export const META_EXT = '.metaman';

export const META_VER = 1;
