import {createReducer, PayloadAction} from '@reduxjs/toolkit';
import actions from '../actions';
import {Page} from '../models/page';
import {Search} from '../models/search';
import {EntityAction, FailureAction} from '../models/store';

const initialState: Search = {
  page: {}
};

export default createReducer(initialState, {
  [actions.metaman.scan.request.type]: () => initialState,
  [actions.search.request.type]: (state, action: EntityAction<number>) => {
    state.wrapper = action.payload.id;
    state.page = {
      status: 'request',
      data: null,
      error: null
    };
  },
  [actions.search.cancel.type]: state => {
    state.page.status = 'cancel';
  },
  [actions.search.success.type]: (state, action: PayloadAction<Page>) => {
    state.page.status = 'success';
    state.page.data = action.payload;
  },
  [actions.search.failure.type]: (state, action: FailureAction) => {
    state.page.status = 'failure';
    state.page.error = action.error;
  }
});
