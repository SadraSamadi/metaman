import {Guess} from './guessit';
import {Metadata} from './metadata';
import {Movie} from './movie';
import {AsyncState, Lazy} from './store';

export interface Wrapper {

  id: string;

  path: string;

  info?: Info;

  guess: AsyncState<Lazy<Guess>>;

  movie: AsyncState<Lazy<Movie, number>>;

  meta: AsyncState<Lazy<Metadata>>;

  scrape: AsyncState<void>;

}

export interface Info {

  title: string;

  year: number;

}
