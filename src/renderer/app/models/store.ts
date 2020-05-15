import {PayloadAction} from '@reduxjs/toolkit';
import {NormalizedSchema} from 'normalizr';
import store from '../common/store';
import {Cast} from './cast';
import {Collection} from './collection';
import {Company} from './company';
import {Country} from './country';
import {Credit} from './credit';
import {Crew} from './crew';
import {Genre} from './genre';
import {Guess} from './guessit';
import {Language} from './language';
import {Metadata} from './metadata';
import {Movie} from './movie';
import {Wrapper} from './wrapper';

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type NormalizedAction<T> = PayloadAction<Normalized<T>>;

export type Normalized<T> = NormalizedSchema<Entities, T>;

export interface Entities {

  casts: Entity<Cast>;

  collections: Entity<Collection>;

  companies: Entity<Company>;

  countries: Entity<Country>;

  credits: Entity<Credit>;

  crews: Entity<Crew>;

  genres: Entity<Genre>;

  guesses: Entity<Guess>;

  languages: Entity<Language>;

  metadata: Entity<Metadata>;

  movies: Entity<Movie>;

  wrappers: Entity<Wrapper>;

}

export type Lazy<T> = Identifier | T;

export type Entity<T> = { [i in Identifier]: T; };

export type EntityAction<T> = PayloadAction<EntityPayload<T>>;

export type EntityPayload<T> = { id: Identifier; data: T; };

export type Identifier = string | number;

export type FailureAction<P = void> = PayloadAction<P, string, void, string>;

export type AsyncStatus = 'request' | 'cancel' | 'success' | 'failure';

export interface AsyncState<T, S = AsyncStatus, E = string> {

  status?: S;

  data?: T;

  error?: E;

}
