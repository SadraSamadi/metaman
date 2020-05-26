import {PayloadAction} from '@reduxjs/toolkit';
import {SagaIterator} from 'redux-saga';
import {call, delay, fork, put, race, select, take} from 'redux-saga/effects';
import actions from '../actions';
import {searchMovie} from '../apis/tmdb';
import {Page} from '../models/page';
import {EntityPayload} from '../models/store';
import {Wrapper} from '../models/wrapper';
import selectors from '../selectors';

export default function* (): SagaIterator {
  yield fork(watch);
}

function* watch(): SagaIterator {
  while (true) {
    let action: PayloadAction<EntityPayload<number>> = yield take(actions.search.request);
    yield race([
      call(handle, action.payload),
      take(actions.search.cancel)
    ]);
  }
}

function* handle(payload: EntityPayload<number>): SagaIterator {
  try {
    let {info}: Wrapper = yield select(selectors.wrappers.wrapper(payload.id));
    yield delay(2000);
    let page: Page = yield call(searchMovie, info.title, info.year, payload.data);
    yield put(actions.search.success(page));
  } catch (err) {
    yield put(actions.search.failure(err));
  }
}
