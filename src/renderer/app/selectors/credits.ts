import {selector} from '../common/util';

export const credit = selector((state, id: number) => state.credits[id]);
