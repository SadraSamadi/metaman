import download from 'download';
import filenamify from 'filenamify';
import fse from 'fs-extra';
import _ from 'lodash';
import mime from 'mime';
import moment from 'moment';
import {join, parse} from 'path';
import * as uuid from 'uuid';
import {META_EXT, META_VER} from '../common/constants';
import {imageUrl} from '../common/util';
import {Collection} from '../models/collection';
import {Guess} from '../models/guessit';
import {Meta} from '../models/meta';
import {Metadata} from '../models/metadata';
import {Movie} from '../models/movie';
import {Options} from '../models/options';
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
      let meta = await getMeta(path);
      yield {
        id: meta?.id || uuid.v4(),
        path: path,
        guess: {},
        movie: {},
        meta: meta ? {
          status: 'success',
          data: meta,
          error: null
        } : {},
        scrape: {}
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

async function getMeta(path: string): Promise<Metadata> {
  let {dir} = parse(path);
  let file = join(dir, META_EXT);
  if (await fse.pathExists(file))
    return fse.readJSON(file);
}

export async function guess(wrapper: Wrapper): Promise<Guess> {
  let data = await guessit(wrapper.path);
  return _.assign(data, {
    id: wrapper.id
  });
}

export async function meta(wrapper: Wrapper, opts: Options): Promise<Meta> {
  let parsed = parse(wrapper.path);
  let movie = wrapper.movie.data as Movie;
  let metadata = wrapper.meta.data as Metadata;
  let root = await saveCollection(parsed.dir, movie, opts);
  let title = filenamify(movie.title, {replacement: '-'});
  let year = moment(movie.release_date).year();
  let dir = join(root, `[${year}] ${title}`);
  await fse.ensureDir(dir);
  await dlimg(movie.poster_path, dir, 'poster');
  let path = join(dir, `${title} (${year})` + parsed.ext);
  let file = join(dir, META_EXT);
  let meta: Metadata = {
    id: wrapper.id,
    tmdb: movie.id,
    version: META_VER,
    update: Date.now(),
    original: metadata?.original || parsed.base
  };
  let str = JSON.stringify(meta);
  await fse.writeFile(file, str);
  return {path, meta};
}

async function saveCollection(dir: string, movie: Movie, opts: Options): Promise<string> {
  let collection = movie.belongs_to_collection as Collection;
  if (!collection)
    return dir;
  let name = filenamify(collection.name);
  let root = join(dir, name);
  await fse.ensureDir(root);
  await dlimg(collection.poster_path, root, 'poster');
  return root;
}

async function dlimg(path: string, dir: string, name: string): Promise<void> {
  let url = imageUrl(path);
  let {ext} = parse(path);
  await download(url, dir, {
    filename: name + ext
  });
}
