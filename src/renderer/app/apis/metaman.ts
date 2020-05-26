import download from 'download';
import filenamify from 'filenamify';
import fse from 'fs-extra';
import _ from 'lodash';
import mime from 'mime';
import moment from 'moment';
import {basename, dirname, extname, join} from 'path';
import * as uuid from 'uuid';
import {META_EXT, META_VER} from '../common/constants';
import {imageUrl} from '../common/util';
import {Guess} from '../models/guessit';
import {Managed} from '../models/managed';
import {Management} from '../models/management';
import {Metadata} from '../models/metadata';
import {Movie} from '../models/movie';
import {Wrapper} from '../models/wrapper';
import {guessit} from './guessit';

export async function* scan(dirs: string[]): AsyncGenerator<Wrapper> {
  for (let dir of dirs)
    if (await fse.pathExists(dir))
      yield* _scan(dir);
}

async function* _scan(dir: string): AsyncGenerator<Wrapper> {
  let names = await fse.readdir(dir);
  // TODO: Handle more complex cases
  if (_.includes(names, META_EXT)) {
    let path = join(dir, META_EXT);
    yield fromMeta(path, dir);
  } else {
    for (let name of names) {
      let child = join(dir, name);
      let stat = await fse.stat(child);
      if (stat.isFile()) {
        let type = mime.getType(child);
        if (_.startsWith(type, 'video'))
          yield fromVideo(child);
      } else if (stat.isDirectory()) {
        yield* _scan(child);
      }
    }
  }
}

export async function fromVideo(path: string): Promise<Wrapper> {
  return {
    path,
    id: uuid.v4(),
    guess: {},
    movie: {},
    scrape: {},
    meta: {}
  };
}

export async function fromMeta(path: string, dir = dirname(path)): Promise<Wrapper> {
  let meta = await getMeta(path);
  return {
    id: meta.id,
    path: join(dir, meta.video),
    guess: {},
    movie: {},
    scrape: {},
    meta: {
      status: 'success',
      data: meta,
      error: null
    }
  };
}

async function getMeta(path: string): Promise<Metadata> {
  // TODO: Validate schema
  let data = await fse.readFile(path, 'utf8');
  return JSON.parse(data);
}

export async function guess(wrapper: Wrapper): Promise<Guess> {
  let data = await guessit(wrapper.path);
  return _.assign(data, {id: wrapper.id});
}

export async function manage(wrapper: Wrapper, man: Management): Promise<Managed> {
  // TODO: Add save collection option
  // TODO: Add update option
  let movie = wrapper.movie.data as Movie;
  let params = {
    title: movie.title,
    year: moment(movie.release_date).year()
  };
  let meta: Metadata = {
    id: wrapper.id,
    version: META_VER,
    update: Date.now(),
    tmdb: movie.id,
    original: basename(wrapper.path),
    video: format(man.name, params) + extname(wrapper.path),
    backdrop: null,
    poster: null
  };
  let dir = join(
    dirname(wrapper.path),
    format(man.folder, params)
  );
  await fse.mkdir(dir);
  if (man.backdrop.save && movie.backdrop_path) {
    meta.backdrop = format(man.backdrop.name, params) + extname(movie.backdrop_path);
    await dlimg(movie.backdrop_path, dir, meta.backdrop);
  }
  if (man.poster.save && movie.poster_path) {
    meta.poster = format(man.poster.name, params) + extname(movie.poster_path);
    await dlimg(movie.poster_path, dir, meta.poster);
  }
  let path = join(dir, meta.video);
  await fse.move(wrapper.path, path);
  await fse.writeFile(
    join(dir, META_EXT),
    JSON.stringify(meta),
    'utf8'
  );
  return {path, meta};
}

function format(template: string, params: object): string {
  let parser = _.template(template);
  let parsed = parser(params);
  return filenamify(parsed);
}

async function dlimg(path: string, dir: string, filename: string): Promise<void> {
  let url = imageUrl(path);
  await download(url, dir, {filename});
}
