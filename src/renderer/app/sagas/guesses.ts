import {PayloadAction} from '@reduxjs/toolkit';
import {SagaIterator} from 'redux-saga';
import {call, put, race, select, take, takeEvery} from 'redux-saga/effects';
import actions from '../actions';
import {guess} from '../apis/metaman';
import {Wrapper} from '../models/wrapper';
import selectors from '../selectors';

export default function* (): SagaIterator {
  yield takeEvery(actions.guesses.request, request);
}

function* request(action: PayloadAction<string>): SagaIterator {
  yield race([
    call(handle, action.payload),
    call(stop, action.payload)
  ]);
}

function* handle(payload: string): SagaIterator {
  try {
    let wrapper: Wrapper = yield select(selectors.wrappers.wrapper(payload));
    yield put(actions.guesses.success({
      id: payload,
      data: yield call(guess, wrapper)
    }));
  } catch (err) {
    yield put(actions.guesses.failure(payload, err));
  }
}

function* stop(payload: string): SagaIterator {
  while (true) {
    let action: PayloadAction<string> = yield take(actions.guesses.cancel);
    if (action.payload === payload)
      break;
  }
}
