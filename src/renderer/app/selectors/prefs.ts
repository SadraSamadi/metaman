import {selector} from '../common/util';

export const prefs = selector(state => state.prefs)();

export const settings = selector(state => state.prefs.settings.data)();
