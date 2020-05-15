import {combineReducers} from '@reduxjs/toolkit';
import casts from './casts';
import collections from './collections';
import companies from './companies';
import countries from './countries';
import credits from './credits';
import crews from './crews';
import genres from './genres';
import guesses from './guesses';
import languages from './languages';
import metadata from './metadata';
import metaman from './metaman';
import movies from './movies';
import prefs from './prefs';
import search from './search';
import wrappers from './wrappers';

export default combineReducers({
  casts,
  collections,
  companies,
  countries,
  credits,
  crews,
  genres,
  guesses,
  languages,
  metadata,
  metaman,
  movies,
  prefs,
  search,
  wrappers
});
