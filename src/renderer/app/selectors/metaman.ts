import {selector} from '../common/util';
import {AsyncState} from '../models/store';

export const wrappers = selector(state => state.metaman.wrappers as AsyncState<string[]>)();

export const selected = selector(state => state.metaman.selected)();
