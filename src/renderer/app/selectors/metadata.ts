import {selector} from '../common/util';

export const metadata = selector((state, id: string) => state.metadata[id]);
