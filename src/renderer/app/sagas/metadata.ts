import {PayloadAction} from '@reduxjs/toolkit';
import {denormalize} from 'normalizr';
import {SagaIterator} from 'redux-saga';
import {call, fork, put, race, select, take} from 'redux-saga/effects';
import actions from '../actions';
import {submit} from '../apis/metaman';
import * as schemas from '../common/schemas';
import {Metadata} from '../models/metadata';
import {AppState} from '../models/store';
import {Wrapper} from '../models/wrapper';
import selectors from '../selectors';

export default function* (): SagaIterator {
  yield fork(watch);
}

function* watch(): SagaIterator {
  while (true) {
    let action: PayloadAction<string> = yield take(actions.metadata.request);
    yield race([
      call(handle, action.payload),
      take(actions.metadata.cancel)
    ]);
  }
}

function* handle(payload: string): SagaIterator {
  try {
    let state: AppState = yield select(selectors.root.root);
    let denormalized: Wrapper = yield call(denormalize, payload, schemas.wrapper, state);
    let meta: Metadata = yield call(submit, denormalized);
    yield put(actions.metadata.success({
      id: payload,
      data: meta
    }));
  } catch (err) {
    yield put(actions.metadata.failure(payload, err));
  }
}
