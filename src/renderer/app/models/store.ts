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

export type NormalizedAction<R> = PayloadAction<Normalized<R>>;

export type Normalized<R> = NormalizedSchema<Entities, R>;

export interface Entities {

  casts: Entity<Cast>;

  collections: Entity<Collection, number>;

  companies: Entity<Company, number>;

  countries: Entity<Country>;

  credits: Entity<Credit, number>;

  crews: Entity<Crew>;

  genres: Entity<Genre, number>;

  guesses: Entity<Guess>;

  languages: Entity<Language>;

  metadata: Entity<Metadata>;

  movies: Entity<Movie, number>;

  wrappers: Entity<Wrapper>;

}

export type Lazy<T, I extends Identifier = string> = I | T;

export type Entity<T, I extends Identifier = string> = { [i in I]: T; };

export type EntityAction<T, I extends Identifier = string> = PayloadAction<EntityPayload<T, I>>;

export type EntityPayload<T, I extends Identifier = string> = { id: I; data: T; };

export type Identifier = string | number;

export type FailureAction<P = void> = PayloadAction<P, string, void, string>;

export type AsyncStatus = 'request' | 'cancel' | 'success' | 'failure';

export interface AsyncState<T, S = AsyncStatus, E = string> {

  status?: S;

  data?: T;

  error?: E;

}
