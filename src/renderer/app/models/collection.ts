import {Movie} from './movie';
import {Lazy} from './store';

export interface Collection {

  id: number;

  name: string;

  overview: string;

  poster_path: string;

  backdrop_path: string;

  parts: Array<Lazy<Movie>>;

}
