import {createAction} from '@reduxjs/toolkit';
import {failure} from '../common/util';
import {Guess} from '../models/guessit';
import {Managed} from '../models/managed';
import {EntityPayload, Normalized} from '../models/store';
import {Info} from '../models/wrapper';

export default {
  info: createAction<EntityPayload<Info>>('wrappers/info'),
  guess: {
    request: createAction<string>('wrappers/guess/request'),
    cancel: createAction<string>('wrappers/guess/cancel'),
    success: createAction<EntityPayload<Guess>>('wrappers/guess/success'),
    failure: createAction(
      'wrappers/guess/failure',
      (payload: string, err: Error) => failure(err, payload)
    )
  },
  movie: {
    request: createAction<EntityPayload<number>>('wrappers/movie/request'),
    cancel: createAction<string>('wrappers/movie/cancel'),
    success: createAction<EntityPayload<Normalized<number>>>('wrappers/movie/success'),
    failure: createAction(
      'wrappers/movie/failure',
      (payload: string, err: Error) => failure(err, payload)
    )
  },
  scrape: {
    request: createAction<string>('wrappers/scrape/request'),
    cancel: createAction<string>('wrappers/scrape/cancel'),
    success: createAction<string>('wrappers/scrape/success'),
    failure: createAction(
      'wrappers/scrape/failure',
      (payload: string, err: Error) => failure(err, payload)
    )
  },
  meta: {
    request: createAction<string>('wrappers/meta/request'),
    cancel: createAction<string>('wrappers/meta/cancel'),
    success: createAction<EntityPayload<Managed>>('wrappers/meta/success'),
    failure: createAction(
      'wrappers/meta/failure',
      (payload: string, err: Error) => failure(err, payload)
    )
  }
};
