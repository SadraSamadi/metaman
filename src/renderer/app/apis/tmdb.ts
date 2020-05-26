import axios from 'axios';
import _ from 'lodash';
import {TMDB_API_URL} from '../common/constants';
import {Collection} from '../models/collection';
import {Movie} from '../models/movie';
import {Page} from '../models/page';
import {Tmdb} from '../models/tmdb';

let tmdb: Tmdb = null;

const client = axios.create({baseURL: TMDB_API_URL});

client.interceptors.request.use(request => _.merge(request, {
  params: {
    api_key: tmdb.key
  }
}));

export function setTmdb(t: Tmdb): void {
  tmdb = t;
}

export async function searchMovie(query: string, year: number, page: number): Promise<Page> {
  let {data} = await client.get<Page>('/search/movie', {
    params: {
      query, year, page,
      language: tmdb.language,
      include_adult: tmdb.adults
    }
  });
  return data;
}

export async function getMovie(id: number): Promise<Movie> {
  let {data} = await client.get<Movie>(`/movie/${id}`, {
    params: {
      language: tmdb.language,
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
      language: tmdb.language
    }
  });
  return data;
}
