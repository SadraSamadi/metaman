import {createReducer} from '@reduxjs/toolkit';
import _ from 'lodash';
import actions from '../actions';
import {Metadata} from '../models/metadata';
import {Entity, EntityAction, NormalizedAction} from '../models/store';

const initialState: Entity<Metadata> = {};

export default createReducer(initialState, {
  [actions.wrappers.request.type]: () => initialState,
  [actions.wrappers.add.type]: (state, action: NormalizedAction<string>) => {
    _.assign(state, action.payload.entities.metadata);
  },
  [actions.metadata.success.type]: (state, action: EntityAction<Metadata>) => {
    let meta = action.payload.data;
    state[meta.id] = meta;
  }
});
