import {CaseReducer, createReducer, PayloadAction} from '@reduxjs/toolkit';
import _ from 'lodash';
import actions from '../actions';
import {Preferences, Settings, Status} from '../models/prefs';
import {FailureAction} from '../models/store';

const initialState: Preferences = {
  settings: {},
  modal: false
};

export default createReducer(initialState, {
  [actions.prefs.init.type]: request('init'),
  [actions.prefs.save.type]: request('save'),
  [actions.prefs.reset.type]: request('reset'),
  [actions.prefs.success.type]: (state, action: PayloadAction<Settings>) => {
    _.merge(state.settings, {
      status: 'success',
      data: action.payload
    });
    state.modal = false;
  },
  [actions.prefs.failure.type]: (state, action: FailureAction) => {
    state.settings.status = 'failure';
    state.settings.error = action.error;
  },
  [actions.prefs.open.type]: state => {
    state.modal = true;
  },
  [actions.prefs.close.type]: state => {
    state.modal = false;
  }
});

function request(status: Status): CaseReducer<Preferences> {
  return state => {
    state.settings.status = status;
    state.settings.error = null;
  };
}
