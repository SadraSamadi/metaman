import {Management} from './management';
import {AsyncState} from './store';
import {Tmdb} from './tmdb';

export interface Preferences {

  settings: AsyncState<Settings, Status>;

  modal: boolean;

}

export interface Settings {

  dirs: string[];

  tmdb: Tmdb;

  man: Management;

  proxy: Proxy;

}

export interface Proxy {

  enable: boolean;

  protocol: 'http' | 'https' | 'socks';

  host?: string;

  port?: number;

}

export type Status = 'init' | 'save' | 'reset' | 'success' | 'failure';
