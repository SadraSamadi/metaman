import {createAction} from '@reduxjs/toolkit';
import {failure} from '../common/util';
import {Normalized} from '../models/store';

export default {
  scan: {
    request: createAction('metaman/scan/request'),
    add: createAction<Normalized<string>>('metaman/scan/add'),
    cancel: createAction('metaman/scan/cancel'),
    success: createAction('metaman/scan/success'),
    failure: createAction(
      'metaman/scan/failure',
      (err: Error) => failure(err)
    )
  },
  select: createAction<string>('metaman/select')
};
