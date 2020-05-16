import {Collection} from './collection';
import {Company} from './company';
import {Country} from './country';
import {Credit} from './credit';
import {Genre} from './genre';
import {Language} from './language';
import {Lazy} from './store';

export interface Movie {

  adult: boolean;

  backdrop_path: string;

  belongs_to_collection: Lazy<Collection, number>;

  budget: number;

  credits: Lazy<Credit, number>;

  genre_ids: Array<number>;

  genres: Array<Lazy<Genre, number>>;

  homepage: string;

  id: number;

  imdb_id: string;

  original_language: string;

  original_title: string;

  overview: string;

  popularity: number;

  poster_path: string;

  production_companies: Array<Lazy<Company, number>>;

  production_countries: Array<Lazy<Country>>;

  release_date: string;

  revenue: number;

  runtime: number;

  spoken_languages: Array<Lazy<Language>>;

  status: 'Rumored' | 'Planned' | 'In Production' | 'Post Production' | 'Released' | 'Canceled';

  tagline: string;

  title: string;

  video: boolean;

  vote_average: number;

  vote_count: number;

}
