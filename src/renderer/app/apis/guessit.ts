import axios from 'axios';
import {basename} from 'path';
import {GUESSIT_API_URL} from '../common/constants';
import {Guess} from '../models/guessit';

const client = axios.create({
  baseURL: GUESSIT_API_URL
});

export async function guessit(path: string): Promise<Guess> {
  let {data} = await client.post('/', {
    filename: basename(path)
  });
  return data;
}
