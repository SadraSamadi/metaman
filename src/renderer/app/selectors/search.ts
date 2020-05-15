import {selector} from '../common/util';

export const search = selector(state => state.search)();

export const wrapper = selector(state => state.search.wrapper)();

export const page = selector(state => state.search.page)();
