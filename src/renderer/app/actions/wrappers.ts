import {createAction} from '@reduxjs/toolkit';
import {failure} from '../common/util';
import {EntityPayload, Normalized} from '../models/store';
import {Info} from '../models/wrapper';

export default {
  request: createAction('wrappers/request'),
  add: createAction<Normalized<string>>('wrappers/add'),
  cancel: createAction('wrappers/cancel'),
  success: createAction('wrappers/success'),
  failure: createAction('wrappers/failure', (err: Error) => failure(err)),
  info: createAction<EntityPayload<Info>>('wrappers/info')
};
