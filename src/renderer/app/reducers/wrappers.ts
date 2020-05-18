import {createReducer, PayloadAction} from '@reduxjs/toolkit';
import _ from 'lodash';
import actions from '../actions';
import {Guess} from '../models/guessit';
import {Metadata} from '../models/metadata';
import {Entity, EntityAction, FailureAction, Normalized, NormalizedAction} from '../models/store';
import {Info, Wrapper} from '../models/wrapper';

const initialState: Entity<Wrapper> = {};

export default createReducer(initialState, {
  [actions.metaman.scan.request.type]: () => initialState,
  [actions.metaman.scan.add.type]: (state, action: NormalizedAction<string>) => {
    _.assign(state, action.payload.entities.wrappers);
  },
  [actions.wrappers.info.type]: (state, action: EntityAction<Info>) => {
    let {id, data} = action.payload;
    let wrapper = state[id];
    _.merge(wrapper, {info: data});
  },
  [actions.wrappers.guess.request.type]: (state, action: PayloadAction<string>) => {
    let {guess} = state[action.payload];
    guess.status = 'request';
    guess.error = null;
  },
  [actions.wrappers.guess.cancel.type]: (state, action: PayloadAction<string>) => {
    let {guess} = state[action.payload];
    guess.status = 'cancel';
  },
  [actions.wrappers.guess.success.type]: (state, action: EntityAction<Guess>) => {
    let {id, data} = action.payload;
    let wrapper = state[id];
    _.merge(wrapper, {
      info: {
        title: data.title,
        year: data.year
      }
    });
    wrapper.guess.status = 'success';
    wrapper.guess.data = data.id;
  },
  [actions.wrappers.guess.failure.type]: (state, action: FailureAction<string>) => {
    let {guess} = state[action.payload];
    guess.status = 'failure';
    guess.error = action.error;
  },
  [actions.wrappers.movie.request.type]: (state, action: EntityAction<number>) => {
    let {movie} = state[action.payload.id];
    movie.status = 'request';
    movie.error = null;
  },
  [actions.wrappers.movie.cancel.type]: (state, action: PayloadAction<string>) => {
    let {movie} = state[action.payload];
    movie.status = 'cancel';
  },
  [actions.wrappers.movie.success.type]: (state, action: EntityAction<Normalized<number>>) => {
    let {id, data} = action.payload;
    let {movie} = state[id];
    movie.status = 'success';
    movie.data = data.result;
  },
  [actions.wrappers.movie.failure.type]: (state, action: FailureAction<string>) => {
    let {movie} = state[action.payload];
    movie.status = 'failure';
    movie.error = action.error;
  },
  [actions.wrappers.scrape.request.type]: (state, action: PayloadAction<string>) => {
    let {scrape} = state[action.payload];
    scrape.status = 'request';
    scrape.error = null;
  },
  [actions.wrappers.scrape.cancel.type]: (state, action: PayloadAction<string>) => {
    let {scrape} = state[action.payload];
    scrape.status = 'cancel';
  },
  [actions.wrappers.scrape.success.type]: (state, action: PayloadAction<string>) => {
    let {scrape} = state[action.payload];
    scrape.status = 'success';
  },
  [actions.wrappers.scrape.failure.type]: (state, action: FailureAction<string>) => {
    let {scrape} = state[action.payload];
    scrape.status = 'failure';
    scrape.error = action.error;
  },
  [actions.wrappers.meta.request.type]: (state, action: PayloadAction<string>) => {
    let {meta} = state[action.payload];
    meta.status = 'request';
    meta.error = null;
  },
  [actions.wrappers.meta.cancel.type]: (state, action: PayloadAction<string>) => {
    let {meta} = state[action.payload];
    meta.status = 'cancel';
  },
  [actions.wrappers.meta.success.type]: (state, action: EntityAction<Metadata>) => {
    let {id, data} = action.payload;
    let {meta} = state[id];
    meta.status = 'success';
    meta.data = data.id;
  },
  [actions.wrappers.meta.failure.type]: (state, action: FailureAction<string>) => {
    let {movie} = state[action.payload];
    movie.status = 'failure';
    movie.error = action.error;
  }
});
