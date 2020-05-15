import {selector} from '../common/util';

export const genre = selector((state, id: number) => state.genres[id]);
