import {AsyncState, Lazy} from './store';
import {Wrapper} from './wrapper';

export interface Metaman {

  wrappers: AsyncState<Lazy<Wrapper>[]>;

  selected?: string;

}
