import {PayloadAction} from '@reduxjs/toolkit';
import {SagaIterator} from 'redux-saga';
import {call, fork, put, race, select, take} from 'redux-saga/effects';
import actions from '../actions';
import {guess} from '../apis/metaman';
import {Wrapper} from '../models/wrapper';
import selectors from '../selectors';

export default function* (): SagaIterator {
  yield fork(watch);
}

function* watch(): SagaIterator {
  while (true) {
    let action: PayloadAction<string> = yield take(actions.guesses.request);
    yield race([
      call(handle, action.payload),
      take(actions.guesses.cancel)
    ]);
  }
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
