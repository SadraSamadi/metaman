import {normalize} from 'normalizr';
import {SagaIterator} from 'redux-saga';
import {call, fork, put, race, take} from 'redux-saga/effects';
import actions from '../actions';
import {getMovie} from '../apis/tmdb';
import * as schemas from '../common/schemas';
import {Movie} from '../models/movie';
import {EntityAction, EntityPayload, Normalized} from '../models/store';

export default function* (): SagaIterator {
  yield fork(watch);
}

function* watch(): SagaIterator {
  while (true) {
    let action: EntityAction<number> = yield take(actions.movies.request);
    yield race([
      call(handle, action.payload),
      take(actions.movies.cancel)
    ]);
  }
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
