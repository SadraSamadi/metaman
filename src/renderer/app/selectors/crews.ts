import {selector} from '../common/util';

export const crew = selector((state, id: string) => state.crews[id]);
