import {SagaIterator} from 'redux-saga';
import {fork} from 'redux-saga/effects';
import guesses from './guesses';
import metadata from './metadata';
import movies from './movies';
import prefs from './prefs';
import search from './search';
import wrappers from './wrappers';

export default function* (): SagaIterator {
  yield fork(guesses);
  yield fork(metadata);
  yield fork(movies);
  yield fork(prefs);
  yield fork(search);
  yield fork(wrappers);
}
