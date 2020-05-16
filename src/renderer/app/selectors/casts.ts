import {selector} from '../common/util';

export const cast = selector((state, id: string) => state.casts[id]);
