import {createReducer, PayloadAction} from '@reduxjs/toolkit';
import actions from '../actions';
import {Metaman} from '../models/metaman';
import {FailureAction, NormalizedAction} from '../models/store';

const initialState: Metaman = {
  wrappers: {}
};

export default createReducer(initialState, {
  [actions.wrappers.request.type]: state => {
    state.wrappers.status = 'request';
    state.wrappers.data = [];
    state.wrappers.error = null;
    state.selected = null;
  },
  [actions.wrappers.add.type]: (state, action: NormalizedAction<string>) => {
    state.wrappers.data.push(action.payload.result);
  },
  [actions.wrappers.cancel.type]: state => {
    state.wrappers.status = 'cancel';
  },
  [actions.wrappers.success.type]: state => {
    state.wrappers.status = 'success';
  },
  [actions.wrappers.failure.type]: (state, action: FailureAction) => {
    state.wrappers.status = 'failure';
    state.wrappers.error = action.error;
  },
  [actions.metaman.select.type]: (state, action: PayloadAction<string>) => {
    state.selected = action.payload;
  }
});
