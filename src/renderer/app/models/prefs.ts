import {Options} from './options';
import {AsyncState} from './store';
import {Tmdb} from './tmdb';

export interface Preferences {

  settings: AsyncState<Settings, Status>;

  modal: boolean;

}

export interface Settings {

  directories: string[];

  options: Options;

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
