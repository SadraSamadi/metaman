import {createAction} from '@reduxjs/toolkit';
import {failure} from '../common/util';
import {Normalized} from '../models/store';

export default {
  request: createAction('wrappers/request'),
  add: createAction<Normalized<string>>('wrappers/add'),
  cancel: createAction('wrappers/cancel'),
  success: createAction('wrappers/success'),
  failure: createAction('wrappers/failure', (err: Error) => failure(err))
};
