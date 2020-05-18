import {createReducer} from '@reduxjs/toolkit';
import _ from 'lodash';
import actions from '../actions';
import {Credit} from '../models/credit';
import {Entity, EntityAction, Normalized} from '../models/store';

const initialState: Entity<Credit, number> = {};

export default createReducer(initialState, {
  [actions.wrappers.request.type]: () => initialState,
  [actions.movies.success.type]: (state, action: EntityAction<Normalized<number>>) => {
    _.assign(state, action.payload.data.entities.credits);
  }
});