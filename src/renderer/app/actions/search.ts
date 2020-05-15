import {createAction} from '@reduxjs/toolkit';
import {failure} from '../common/util';
import {Page} from '../models/page';
import {EntityPayload} from '../models/store';

export default {
  request: createAction<EntityPayload<number>>('search/request'),
  cancel: createAction('search/cancel'),
  success: createAction<Page>('search/success'),
  failure: createAction('search/failure', (err: Error) => failure(err))
};
