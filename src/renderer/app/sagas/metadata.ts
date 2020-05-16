import {PayloadAction} from '@reduxjs/toolkit';
import {denormalize} from 'normalizr';
import {SagaIterator} from 'redux-saga';
import {call, put, race, select, take, takeEvery} from 'redux-saga/effects';
import actions from '../actions';
import {submit} from '../apis/metaman';
import * as schemas from '../common/schemas';
import {AppState} from '../models/store';
import {Wrapper} from '../models/wrapper';

export default function* (): SagaIterator {
  yield takeEvery(actions.metadata.request, request);
}

function* request(action: PayloadAction<string>): SagaIterator {
  yield race([
    call(handle, action.payload),
    call(stop, action.payload)
  ]);
}

function* handle(payload: string): SagaIterator {
  try {
    let state: AppState = yield select();
    let wrapper: Wrapper = yield call(denormalize, payload, schemas.wrapper, state);
    yield put(actions.metadata.success({
      id: payload,
      data: yield call(submit, wrapper)
    }));
  } catch (err) {
    yield put(actions.metadata.failure(payload, err));
  }
}

function* stop(payload: string): SagaIterator {
  while (true) {
    let action: PayloadAction<string> = yield take(actions.metadata.cancel);
    if (action.payload === payload)
      break;
  }
}
