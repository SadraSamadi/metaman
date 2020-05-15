import {createAction} from '@reduxjs/toolkit';
import {failure} from '../common/util';
import {Settings} from '../models/prefs';

export default {
  init: createAction('prefs/init'),
  save: createAction<Settings>('prefs/save'),
  reset: createAction('prefs/reset'),
  success: createAction<Settings>('prefs/success'),
  failure: createAction('prefs/failure', (err: Error) => failure(err)),
  open: createAction('prefs/open'),
  close: createAction('prefs/close')
};
