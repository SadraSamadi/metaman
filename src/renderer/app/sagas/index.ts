import {SagaIterator} from 'redux-saga';
import {fork} from 'redux-saga/effects';
import metaman from './metaman';
import prefs from './prefs';
import search from './search';
import wrappers from './wrappers';

export default function* (): SagaIterator {
  yield fork(metaman);
  yield fork(prefs);
  yield fork(search);
  yield fork(wrappers);
}
