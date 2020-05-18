import {Settings} from '../models/prefs';

export const GUESSIT_API_URL = 'https://metaman-guessit.herokuapp.com/';

export const TMDB_API_URL = 'https://api.themoviedb.org/3/';

export const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/';

export const DEFAULT_SETTINGS: Settings = {
  directories: [],
  tmdb: {
    key: 'c73f3083988325a968f198ad0956a3cd',
    language: 'en-US',
    adults: true
  },
  proxy: {
    enable: false,
    protocol: 'http'
  }
};

export const META_EXTENSION = '.metaman';
