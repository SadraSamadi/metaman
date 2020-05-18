import {Movie} from './movie';

export interface Page {

  page: number;

  results: Movie[];

  total_results: number;

  total_pages: number;

}
