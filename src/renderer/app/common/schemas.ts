import {schema} from 'normalizr';
import {Cast} from '../models/cast';
import {Collection} from '../models/collection';
import {Company} from '../models/company';
import {Country} from '../models/country';
import {Credit} from '../models/credit';
import {Crew} from '../models/crew';
import {Genre} from '../models/genre';
import {Guess} from '../models/guessit';
import {Language} from '../models/language';
import {Metadata} from '../models/metadata';
import {Movie} from '../models/movie';
import {Wrapper} from '../models/wrapper';

export const guess = new schema.Entity<Guess>('guesses');

export const language = new schema.Entity<Language>('languages', {}, {
  idAttribute: 'iso_639_1'
});

export const country = new schema.Entity<Country>('countries', {}, {
  idAttribute: 'iso_3166_1'
});

export const company = new schema.Entity<Company>('companies');

export const genre = new schema.Entity<Genre>('genres');

export const cast = new schema.Entity<Cast>('casts', {}, {
  idAttribute: 'credit_id'
});

export const crew = new schema.Entity<Crew>('crews', {}, {
  idAttribute: 'credit_id'
});

export const credit = new schema.Entity<Credit>('credits', {
  cast: [cast],
  crew: [crew]
}, {
  idAttribute: (value: Credit, parent: Movie) => parent.id as any
});

export const collection = new schema.Entity<Collection>('collections');

export const movie = new schema.Entity<Movie>('movies', {
  belongs_to_collection: collection,
  credits: credit,
  genres: [genre],
  production_companies: [company],
  production_countries: [country],
  spoken_languages: [language]
});

export const metadata = new schema.Entity<Metadata>('metadata');

export const wrapper = new schema.Entity<Wrapper>('wrappers', {
  guess: {
    data: guess
  },
  movie: {
    data: movie
  },
  meta: {
    data: metadata
  }
});

company.define({
  parent_company: company
});

collection.define({
  parts: [movie]
});
