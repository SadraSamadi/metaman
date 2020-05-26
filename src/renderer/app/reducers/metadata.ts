import {createReducer} from '@reduxjs/toolkit';
import _ from 'lodash';
import actions from '../actions';
import {Meta} from '../models/meta';
import {Metadata} from '../models/metadata';
import {Entity, EntityAction, NormalizedAction} from '../models/store';

const initialState: Entity<Metadata> = {};

export default createReducer(initialState, {
  [actions.metaman.scan.request.type]: () => initialState,
  [actions.metaman.scan.add.type]: (state, action: NormalizedAction<string>) => {
    _.assign(state, action.payload.entities.metadata);
  },
  [actions.wrappers.meta.success.type]: (state, action: EntityAction<Meta>) => {
    let {meta} = action.payload.data;
    state[meta.id] = meta;
  }
});
