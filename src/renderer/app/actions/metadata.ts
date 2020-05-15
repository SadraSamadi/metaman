import {createAction} from '@reduxjs/toolkit';
import {failure} from '../common/util';
import {Metadata} from '../models/metadata';
import {EntityPayload} from '../models/store';

export default {
  request: createAction<string>('metadata/request'),
  cancel: createAction<string>('metadata/cancel'),
  success: createAction<EntityPayload<Metadata>>('metadata/success'),
  failure: createAction('metadata/failure', (payload: string, err: Error) => failure(err, payload))
};
