import {selector} from '../common/util';

export const wrappers = selector(state => state.metaman.wrappers)();

export const selected = selector(state => state.metaman.selected)();
