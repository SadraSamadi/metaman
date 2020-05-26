import {selector} from '../common/util';
import {AsyncState} from '../models/store';

export const wrappers = selector(state => state.metaman.wrappers as AsyncState<string[]>)();

export const selected = selector(state => state.metaman.selected)();

export const wrapper = selector(state => state.wrappers[state.metaman.selected])();
