import {AsyncState} from './store';

export interface Metaman {

  wrappers: AsyncState<string[]>;

  selected?: string;

  preview: AsyncState<string>;

}
