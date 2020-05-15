import {AsyncState} from './store';
import {Options as Tmdb} from './tmdb';

export interface Preferences {

  settings: AsyncState<Settings, Status>;

  modal: boolean;

}

export interface Settings {

  tmdb: Tmdb;

  directories: Array<string>;

}

export type Status = 'init' | 'save' | 'reset' | 'success' | 'failure';
