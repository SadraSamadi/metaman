import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import {is} from 'electron-util';
import _ from 'lodash';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import reducers from '../reducers';
import sagas from '../sagas';

const defaultMiddleware = getDefaultMiddleware({thunk: false});
const sagaMiddleware = createSagaMiddleware();

export default configureStore({
  reducer: reducers,
  middleware: _.filter([
    ...defaultMiddleware,
    sagaMiddleware,
    is.development && logger
  ])
});

sagaMiddleware.run(sagas);
