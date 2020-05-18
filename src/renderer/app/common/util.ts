import {ParametricSelector, PrepareAction} from '@reduxjs/toolkit';
import {Selector} from 'react-redux';
import {ImageSize} from '../models/image';
import {AppState} from '../models/store';
import {TMDB_IMAGE_URL} from './constants';

export const selector = <R, P = void, S = AppState>(sel: ParametricSelector<S, P, R>):
  (props: P, ...args: any[]) => Selector<S, R> =>
  (props, ...args) => state => sel(state, props, ...args);

export const failure = <P, E = Error>(error: E, payload?: P): ReturnType<PrepareAction<P>> => ({
  payload,
  error: error instanceof Error ? error.message : error
});

export const imageUrl = (path: string, size: ImageSize = 'original'): string => `${TMDB_IMAGE_URL}${size}${path}`;