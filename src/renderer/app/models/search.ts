import {Page} from './page';
import {AsyncState} from './store';

export interface Search {

  wrapper?: string;

  page: AsyncState<Page>;

}
