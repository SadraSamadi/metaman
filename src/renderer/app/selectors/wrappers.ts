import {selector} from '../common/util';

export const wrappers = selector(state => state.wrappers)();

export const wrapper = selector((state, id: string) => state.wrappers[id]);
