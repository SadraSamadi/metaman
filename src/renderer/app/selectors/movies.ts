import {selector} from '../common/util';

export const movie = selector((state, id: number) => state.movies[id]);
