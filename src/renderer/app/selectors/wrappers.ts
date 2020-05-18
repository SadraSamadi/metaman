import {selector} from '../common/util';

export const wrappers = selector(state => state.wrappers)();

export const wrapper = selector((state, id: string) => state.wrappers[id]);

export const movie = selector((state, id: number) => state.movies[id]);

export const genre = selector((state, id: number) => state.genres[id]);

export const credit = selector((state, id: number) => state.credits[id]);

export const cast = selector((state, id: string) => state.casts[id]);

export const crew = selector((state, id: string) => state.crews[id]);

export const meta = selector((state, id: string) => state.metadata[id]);
