import {Cast} from './cast';
import {Crew} from './crew';
import {Lazy} from './store';

export interface Credit {

  id: number;

  cast: Lazy<Cast>[];

  crew: Lazy<Crew>[];

}
