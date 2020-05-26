import {selector} from '../common/util';

export const search = selector(state => state.search)();

export const page = selector((state, wrapper: string) => state.search.wrapper === wrapper && state.search.page);
