import axios from 'axios';
import _ from 'lodash';
import {TMDB_API_URL} from '../common/constants';
import {Collection} from '../models/collection';
import {Movie} from '../models/movie';
import {Page} from '../models/page';
import {Options} from '../models/tmdb';

let options: Options = null;

const client = axios.create({baseURL: TMDB_API_URL});

client.interceptors.request.use(request => _.merge(request, {
  params: {
    api_key: options.key
  }
}));

export function setOptions(opts: Options): void {
  options = opts;
}

export async function searchMovie(query: string, year: number, page: number): Promise<Page> {
  let {data} = await client.get<Page>('/search/movie', {
    params: {
      query, year, page,
      language: options.language,
      include_adult: options.adults
    }
  });
  return data;
}

export async function getMovie(id: number): Promise<Movie> {
  let {data} = await client.get<Movie>(`/movie/${id}`, {
    params: {
      language: options.language,
      append_to_response: 'credits'
    }
  });
  let collection = data.belongs_to_collection as Collection;
  return _.assign(data, {
    belongs_to_collection: collection && await getCollection(collection.id)
  });
}

export async function getCollection(id: number): Promise<Collection> {
  let {data} = await client.get<Collection>(`/collection/${id}`, {
    params: {
      language: options.language
    }
  });
  return data;
}
