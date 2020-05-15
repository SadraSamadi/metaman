import {createAction} from '@reduxjs/toolkit';
import {failure} from '../common/util';
import {Guess} from '../models/guessit';
import {EntityPayload} from '../models/store';

export default {
  request: createAction<string>('guesses/request'),
  cancel: createAction<string>('guesses/cancel'),
  success: createAction<EntityPayload<Guess>>('guesses/success'),
  failure: createAction('guesses/failure', (payload: string, err: Error) => failure(err, payload))
};
