import {Spin} from 'antd';
import fse from 'fs-extra';
import query from 'query-string';
import React, {ReactElement, useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';
import {getMovie} from '../apis/tmdb';
import {Metadata} from '../models/metadata';

export default function MoviePreview(props: RouteComponentProps): ReactElement {

  const [data, setData] = useState<string>();

  useEffect(() => {
    (async () => {
      let {file} = query.parse(props.location.search);
      let data = await fse.readFile(file as string, 'urf8');
      let meta: Metadata = JSON.parse(data);
      let movie = await getMovie(meta.tmdb);
      let str = JSON.stringify(movie, null, 2);
      setData(str);
    })();
  }, []);

  return data ? (
    <div className='whitespace-pre-wrap overflow-y-auto'>
      {data}
    </div>
  ) : (
    <div className='h-full flex items-center justify-center'>
      <Spin size='large'/>
    </div>
  );

}
