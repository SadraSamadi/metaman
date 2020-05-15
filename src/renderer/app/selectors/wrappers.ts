import {selector} from '../common/util';

export const wrapper = selector((state, id: string) => state.wrappers[id]);
