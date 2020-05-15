import fse from 'fs-extra';
import _ from 'lodash';
import mime from 'mime';
import {join, parse} from 'path';
import * as uuid from 'uuid';
import {META_EXTENSION} from '../common/constants';
import {Guess} from '../models/guessit';
import {Metadata} from '../models/metadata';
import {Movie} from '../models/movie';
import {Wrapper} from '../models/wrapper';
import {guessit} from './guessit';

export async function* scan(dirs: string[]): AsyncGenerator<Wrapper> {
  for (let dir of dirs)
    if (await fse.pathExists(dir))
      yield* _scan(dir);
}

async function* _scan(path: string): AsyncGenerator<Wrapper> {
  let stat = await fse.stat(path);
  if (stat.isFile()) {
    let type = mime.getType(path);
    if (_.startsWith(type, 'video')) {
      let meta = await metadata(path);
      yield {
        id: meta?.id || uuid.v4(),
        path: path,
        guess: {},
        movie: {},
        meta: meta ? {
          status: 'success',
          data: meta,
          error: null
        } : {}
      };
    }
  } else {
    let names = await fse.readdir(path);
    for (let name of names) {
      let child = join(path, name);
      yield* _scan(child);
    }
  }
}

async function metadata(path: string): Promise<Metadata> {
  let {dir, name} = parse(path);
  let file = join(dir, name + META_EXTENSION);
  if (await fse.pathExists(file))
    return fse.readJSON(file);
}

export async function guess(wrapper: Wrapper): Promise<Guess> {
  let data = await guessit(wrapper.path);
  return _.assign(data, {
    id: wrapper.id
  });
}

export async function submit(wrapper: Wrapper): Promise<Metadata> {
  let {dir, base, name} = parse(wrapper.path);
  let movie = wrapper.movie.data as Movie;
  let prev = wrapper.meta.data as Metadata;
  let meta: Metadata = {
    id: wrapper.id,
    tmdb: movie.id,
    update: Date.now(),
    original: prev?.original || base
  };
  let file = join(dir, name + META_EXTENSION);
  await fse.writeJSON(file, meta);
  return meta;
}
