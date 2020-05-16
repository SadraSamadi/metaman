import {PayloadAction} from '@reduxjs/toolkit';
import {normalize} from 'normalizr';
import {SagaIterator} from 'redux-saga';
import {call, put, race, take, takeEvery} from 'redux-saga/effects';
import actions from '../actions';
import {getMovie} from '../apis/tmdb';
import * as schemas from '../common/schemas';
import {Movie} from '../models/movie';
import {EntityAction, EntityPayload, Normalized} from '../models/store';

export default function* (): SagaIterator {
  yield takeEvery(actions.movies.request, request);
}

function* request(action: EntityAction<number>): SagaIterator {
  yield race([
    call(handle, action.payload),
    call(stop, action.payload)
  ]);
}

function* handle(payload: EntityPayload<number>): SagaIterator {
  try {
    let movie: Movie = yield call(getMovie, payload.data);
    let normalized: Normalized<number> = yield call(normalize, movie, schemas.movie);
    yield put(actions.movies.success({
      id: payload.id,
      data: normalized
    }));
  } catch (err) {
    yield put(actions.movies.failure(payload.id as string, err));
  }
}

function* stop(payload: EntityPayload<number>): SagaIterator {
  while (true) {
    let action: PayloadAction<string> = yield take(actions.movies.cancel);
    if (action.payload === payload.id)
      break;
  }
}
