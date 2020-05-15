import {selector} from '../common/util';

export const guess = selector((state, id: string) => state.guesses[id]);
