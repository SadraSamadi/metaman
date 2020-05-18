import {PayloadAction} from '@reduxjs/toolkit';
import {denormalize, normalize} from 'normalizr';
import {SagaIterator} from 'redux-saga';
import {call, delay, put, race, select, take, takeEvery} from 'redux-saga/effects';
import actions from '../actions';
import {guess, submit} from '../apis/metaman';
import {getMovie} from '../apis/tmdb';
import * as schemas from '../common/schemas';
import {Movie} from '../models/movie';
import {AppState, EntityAction, EntityPayload, Normalized} from '../models/store';
import {Wrapper} from '../models/wrapper';
import selectors from '../selectors';

export default function* (): SagaIterator {
  yield takeEvery(actions.wrappers.guess.request, requestGuess);
  yield takeEvery(actions.wrappers.movie.request, requestMovie);
  yield takeEvery(actions.wrappers.scrape.request, requestScrape);
  yield takeEvery(actions.wrappers.meta.request, requestMeta);
}

function* requestGuess(action: PayloadAction<string>): SagaIterator {
  yield race([
    call(handleGuess, action.payload),
    call(cancelGuess, action.payload)
  ]);
}

function* handleGuess(payload: string): SagaIterator {
  try {
    let wrapper: Wrapper = yield select(selectors.wrappers.wrapper(payload));
    yield put(actions.wrappers.guess.success({
      id: payload,
      data: yield call(guess, wrapper)
    }));
  } catch (err) {
    yield put(actions.wrappers.guess.failure(payload, err));
  }
}

function* cancelGuess(payload: string): SagaIterator {
  while (true) {
    let action: PayloadAction<string> = yield take(actions.wrappers.guess.cancel);
    if (action.payload === payload)
      break;
  }
}

function* requestMovie(action: EntityAction<number>): SagaIterator {
  yield race([
    call(handleMovie, action.payload),
    call(cancelMovie, action.payload)
  ]);
}

function* handleMovie(payload: EntityPayload<number>): SagaIterator {
  try {
    let movie: Movie = yield call(getMovie, payload.data);
    let normalized: Normalized<number> = yield call(normalize, movie, schemas.movie);
    yield put(actions.wrappers.movie.success({
      id: payload.id,
      data: normalized
    }));
  } catch (err) {
    yield put(actions.wrappers.movie.failure(payload.id, err));
  }
}

function* cancelMovie(payload: EntityPayload<number>): SagaIterator {
  while (true) {
    let action: PayloadAction<string> = yield take(actions.wrappers.movie.cancel);
    if (action.payload === payload.id)
      break;
  }
}

function* requestScrape(action: PayloadAction<string>): SagaIterator {
  yield race([
    call(handleScrape, action.payload),
    call(cancelScrape, action.payload)
  ]);
}

function* handleScrape(payload: string): SagaIterator {
  try {
    let wrapper: Wrapper = yield select(selectors.wrappers.wrapper(payload));
    console.log(wrapper);
    yield delay(10000);
    yield put(actions.wrappers.scrape.success(payload));
  } catch (err) {
    yield put(actions.wrappers.scrape.failure(payload, err));
  }
}

function* cancelScrape(payload: string): SagaIterator {
  while (true) {
    let action: PayloadAction<string> = yield take(actions.wrappers.scrape.cancel);
    if (action.payload === payload)
      break;
  }
}

function* requestMeta(action: PayloadAction<string>): SagaIterator {
  yield race([
    call(handleMeta, action.payload),
    call(cancelMeta, action.payload)
  ]);
}

function* handleMeta(payload: string): SagaIterator {
  try {
    let state: AppState = yield select();
    let wrapper: Wrapper = yield call(denormalize, payload, schemas.wrapper, state);
    yield put(actions.wrappers.meta.success({
      id: payload,
      data: yield call(submit, wrapper)
    }));
  } catch (err) {
    yield put(actions.wrappers.meta.failure(payload, err));
  }
}

function* cancelMeta(payload: string): SagaIterator {
  while (true) {
    let action: PayloadAction<string> = yield take(actions.wrappers.meta.cancel);
    if (action.payload === payload)
      break;
  }
}
