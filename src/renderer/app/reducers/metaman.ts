import {createReducer, PayloadAction} from '@reduxjs/toolkit';
import actions from '../actions';
import {Metaman} from '../models/metaman';
import {FailureAction, NormalizedAction} from '../models/store';

const initialState: Metaman = {
  wrappers: {},
  preview: {}
};

export default createReducer(initialState, {
  [actions.metaman.scan.request.type]: state => {
    state.wrappers = {
      status: 'request',
      data: [],
      error: null
    };
    state.selected = null;
  },
  [actions.metaman.scan.add.type]: (state, action: NormalizedAction<string>) => {
    state.wrappers.data.push(action.payload.result);
  },
  [actions.metaman.scan.cancel.type]: state => {
    state.wrappers.status = 'cancel';
  },
  [actions.metaman.scan.success.type]: state => {
    state.wrappers.status = 'success';
  },
  [actions.metaman.scan.failure.type]: (state, action: FailureAction) => {
    state.wrappers.status = 'failure';
    state.wrappers.error = action.error;
  },
  [actions.metaman.preview.request.type]: state => {
    state.preview.status = 'request';
    state.preview.error = null;
  },
  [actions.metaman.preview.cancel.type]: state => {
    state.preview.status = 'cancel';
  },
  [actions.metaman.preview.success.type]: (state, action: NormalizedAction<string>) => {
    state.preview.status = 'success';
    state.preview.data = action.payload.result;
  },
  [actions.metaman.preview.failure.type]: (state, action: FailureAction) => {
    state.preview.status = 'failure';
    state.preview.error = action.error;
  },
  [actions.metaman.select.type]: (state, action: PayloadAction<string>) => {
    state.selected = action.payload;
  }
});
