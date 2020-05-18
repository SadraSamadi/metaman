import {createReducer} from '@reduxjs/toolkit';
import actions from '../actions';
import {Guess} from '../models/guessit';
import {Entity, EntityAction} from '../models/store';

const initialState: Entity<Guess> = {};

export default createReducer(initialState, {
  [actions.metaman.scan.request.type]: () => initialState,
  [actions.wrappers.movie.success.type]: (state, action: EntityAction<Guess>) => {
    let guess = action.payload.data;
    state[guess.id] = guess;
  }
});
