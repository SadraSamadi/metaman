import {Cast} from './cast';
import {Crew} from './crew';
import {Lazy} from './store';

export interface Credit {

  id: number;

  cast: Array<Lazy<Cast>>;

  crew: Array<Lazy<Crew>>;

}
