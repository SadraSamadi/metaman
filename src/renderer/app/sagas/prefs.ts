import {PayloadAction} from '@reduxjs/toolkit';
import {SagaIterator} from 'redux-saga';
import {call, Effect, put, select, takeLatest} from 'redux-saga/effects';
import actions from '../actions';
import {init, reset, save} from '../apis/prefs';
import {setOptions} from '../apis/tmdb';
import {Settings} from '../models/prefs';
import selectors from '../selectors';

export default function* (): SagaIterator {
  yield takeLatest(actions.prefs.init, handleInit);
  yield takeLatest(actions.prefs.save, handleSave);
  yield takeLatest(actions.prefs.reset, handleReset);
  yield takeLatest(actions.prefs.success, handleSuccess);
}

function* handleInit(): SagaIterator {
  let effect = call(init);
  yield call(handle, effect);
}

function* handleSave(action: PayloadAction<Settings>): SagaIterator {
  let effect = call(save, action.payload);
  yield call(handle, effect);
}

function* handleReset(): SagaIterator {
  let effect = call(reset);
  yield call(handle, effect);
}

function* handle(effect: Effect): SagaIterator {
  try {
    let settings: Settings = yield effect;
    yield put(actions.prefs.success(settings));
  } catch (err) {
    yield put(actions.prefs.failure(err));
  }
}

function* handleSuccess(): SagaIterator {
  let settings: Settings = yield select(selectors.prefs.settings);
  yield call(setOptions, settings.tmdb);
}
