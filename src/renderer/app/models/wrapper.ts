import {Guess} from './guessit';
import {Metadata} from './metadata';
import {Movie} from './movie';
import {AsyncState, Lazy} from './store';

export interface Wrapper {

  id: string;

  path: string;

  guess: AsyncState<Lazy<Guess>>;

  movie: AsyncState<Lazy<Movie>>;

  meta: AsyncState<Lazy<Metadata>>;

}
