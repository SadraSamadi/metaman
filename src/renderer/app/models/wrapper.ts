import {Guess} from './guessit';
import {Metadata} from './metadata';
import {Movie} from './movie';
import {AsyncState, Lazy} from './store';

export interface Wrapper {

  id: string;

  path: string;

  info?: Info;

  guess: AsyncState<Lazy<Guess>>;

  movie: AsyncState<Lazy<Movie>>;

  meta: AsyncState<Lazy<Metadata>>;

}

export interface Info {

  title: string;

  year: number;

}
