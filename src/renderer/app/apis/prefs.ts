import ElectronStore from 'electron-store';
import _ from 'lodash';
import {DEFAULT_SETTINGS} from '../common/constants';
import {Settings} from '../models/prefs';

let storage: ElectronStore<Settings> = null;

export function init(): Settings {
  storage = new ElectronStore({
    defaults: DEFAULT_SETTINGS
  });
  return load();
}

export function save(settings: Settings): Settings {
  return storage.store = settings;
}

export function reset(): Settings {
  return save(DEFAULT_SETTINGS);
}

function load(): Settings {
  return _.assign({}, storage.store);
}
