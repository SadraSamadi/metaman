import {createReducer} from '@reduxjs/toolkit';
import _ from 'lodash';
import actions from '../actions';
import {Collection} from '../models/collection';
import {Entity, EntityAction, Normalized} from '../models/store';

const initialState: Entity<Collection, number> = {};

export default createReducer(initialState, {
  [actions.metaman.scan.request.type]: () => initialState,
  [actions.wrappers.movie.success.type]: (state, action: EntityAction<Normalized<number>>) => {
    _.assign(state, action.payload.data.entities.collections);
  }
});
