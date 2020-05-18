import _ from 'lodash';
import {normalize} from 'normalizr';
import {END, eventChannel, EventChannel, SagaIterator} from 'redux-saga';
import {call, fork, put, race, select, take, takeMaybe} from 'redux-saga/effects';
import actions from '../actions';
import {scan} from '../apis/metaman';
import * as schemas from '../common/schemas';
import {Settings} from '../models/prefs';
import {Normalized} from '../models/store';
import {Wrapper} from '../models/wrapper';
import selectors from '../selectors';

export default function* (): SagaIterator {
  yield fork(watchScan);
}

function* watchScan(): SagaIterator {
  while (true) {
    yield take(actions.metaman.scan.request);
    yield race([
      call(handleScan),
      take(actions.metaman.scan.cancel)
    ]);
  }
}

function* handleScan(): SagaIterator {
  let {directories}: Settings = yield select(selectors.prefs.settings);
  let chan: EventChannel<Wrapper> = yield call(scanChannel, directories);
  try {
    while (true) {
      let wrapper: Wrapper = yield takeMaybe(chan);
      if (_.eq(wrapper, END))
        break;
      let normalized: Normalized<string> = yield call(normalize, wrapper, schemas.wrapper);
      yield put(actions.metaman.scan.add(normalized));
    }
    yield put(actions.metaman.scan.success());
  } catch (err) {
    yield put(actions.metaman.scan.failure(err));
  } finally {
    chan.close();
  }
}

function scanChannel(dirs: string[]): EventChannel<Wrapper> {
  return eventChannel(emit => {
    let closed = false;
    (async () => {
      try {
        for await (let wrapper of scan(dirs)) {
          if (closed)
            break;
          emit(wrapper);
        }
        if (!closed)
          emit(END);
      } catch (err) {
        emit(err);
      }
    })();
    return () => closed = true;
  });
}
