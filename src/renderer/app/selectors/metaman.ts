import {selector} from '../common/util';

export const wrappers = selector(state => state.metaman.wrappers)();

export const selected = selector(state => state.metaman.selected)();

export const wrapper = selector(state => state.wrappers[state.metaman.selected])();

export const preview = selector(state => state.metaman.preview)();
