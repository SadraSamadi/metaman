import {createAction} from '@reduxjs/toolkit';
import {failure} from '../common/util';
import {EntityPayload, Normalized} from '../models/store';

export default {
  request: createAction<EntityPayload<number>>('movies/request'),
  cancel: createAction<string>('movies/cancel'),
  success: createAction<EntityPayload<Normalized<number>>>('movies/success'),
  failure: createAction('movies/failure', (payload: string, err: Error) => failure(err, payload))
};
