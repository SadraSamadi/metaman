import {createReducer, PayloadAction} from '@reduxjs/toolkit';
import _ from 'lodash';
import actions from '../actions';
import {Guess} from '../models/guessit';
import {Metadata} from '../models/metadata';
import {Entity, EntityAction, FailureAction, Normalized, NormalizedAction} from '../models/store';
import {Wrapper} from '../models/wrapper';

const initialState: Entity<Wrapper> = {};

export default createReducer(initialState, {
  [actions.wrappers.request.type]: () => initialState,
  [actions.wrappers.add.type]: (state, action: NormalizedAction<string>) => {
    _.assign(state, action.payload.entities.wrappers);
  },
  [actions.guesses.request.type]: (state, action: PayloadAction<string>) => {
    let {guess} = state[action.payload];
    guess.status = 'request';
    guess.error = null;
  },
  [actions.guesses.cancel.type]: (state, action: PayloadAction<string>) => {
    let {guess} = state[action.payload];
    guess.status = 'cancel';
  },
  [actions.guesses.success.type]: (state, action: EntityAction<Guess>) => {
    let {id, data} = action.payload;
    let {guess} = state[id];
    guess.status = 'success';
    guess.data = data.id;
  },
  [actions.guesses.failure.type]: (state, action: FailureAction<string>) => {
    let {guess} = state[action.payload];
    guess.status = 'failure';
    guess.error = action.error;
  },
  [actions.movies.request.type]: (state, action: EntityAction<number>) => {
    let {movie} = state[action.payload.id];
    movie.status = 'request';
    movie.error = null;
  },
  [actions.movies.cancel.type]: (state, action: PayloadAction<string>) => {
    let {movie} = state[action.payload];
    movie.status = 'cancel';
  },
  [actions.movies.success.type]: (state, action: EntityAction<Normalized<number>>) => {
    let {id, data} = action.payload;
    let {movie} = state[id];
    movie.status = 'success';
    movie.data = data.result;
  },
  [actions.movies.failure.type]: (state, action: FailureAction<string>) => {
    let {movie} = state[action.payload];
    movie.status = 'failure';
    movie.error = action.error;
  },
  [actions.metadata.request.type]: (state, action: PayloadAction<string>) => {
    let {meta} = state[action.payload];
    meta.status = 'request';
    meta.error = null;
  },
  [actions.metadata.cancel.type]: (state, action: PayloadAction<string>) => {
    let {meta} = state[action.payload];
    meta.status = 'cancel';
  },
  [actions.metadata.success.type]: (state, action: EntityAction<Metadata>) => {
    let {id, data} = action.payload;
    let {meta} = state[id];
    meta.status = 'success';
    meta.data = data.id;
  },
  [actions.metadata.failure.type]: (state, action: FailureAction<string>) => {
    let {movie} = state[action.payload];
    movie.status = 'failure';
    movie.error = action.error;
  }
});
