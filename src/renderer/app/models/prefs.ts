import {AsyncState} from './store';
import {Options as Tmdb} from './tmdb';

export interface Preferences {

  settings: AsyncState<Settings, Status>;

  modal: boolean;

}

export interface Settings {

  directories: string[];

  tmdb: Tmdb;

  proxy: Proxy;

}

export type Status = 'init' | 'save' | 'reset' | 'success' | 'failure';

export interface Proxy {

  enable: boolean;

  protocol: 'http' | 'https' | 'socks';

  host?: string;

  port?: number;

}
