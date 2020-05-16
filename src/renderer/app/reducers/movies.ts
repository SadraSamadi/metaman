import {createReducer} from '@reduxjs/toolkit';
import _ from 'lodash';
import actions from '../actions';
import {Movie} from '../models/movie';
import {Entity, EntityAction, Normalized} from '../models/store';

const initialState: Entity<Movie, number> = {};

export default createReducer(initialState, {
  [actions.wrappers.request.type]: () => initialState,
  [actions.movies.success.type]: (state, action: EntityAction<Normalized<number>>) => {
    _.assign(state, action.payload.data.entities.movies);
  }
});
