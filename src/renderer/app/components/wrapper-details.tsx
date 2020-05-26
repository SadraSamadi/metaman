import {Button, Empty, Space, Tooltip} from 'antd';
import classNames from 'classnames';
import {parse} from 'path';
import React, {ReactElement, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import actions from '../actions';
import {AppDispatch} from '../models/store';
import selectors from '../selectors';
import MovieDetails from './movie-details';
import Scrape from './scrape';

export default function WrapperDetails(props: WrapperDetailsProps): ReactElement {

  const dispatch = useDispatch<AppDispatch>();
  const {path, movie, meta} = useSelector(selectors.wrappers.wrapper(props.id));
  const metadata = useSelector(selectors.wrappers.meta(meta.data as string));
  const name = useMemo(getName, [path]);

  function getName(): string {
    let {name} = parse(path);
    return name;
  }

  function onScrape(): void {
    dispatch(actions.wrappers.scrape.request(props.id));
  }

  function onMeta(): void {
    dispatch(actions.wrappers.meta.request(props.id));
  }

  function onMovie(): void {
    dispatch(actions.wrappers.movie.request({
      id: props.id,
      data: metadata.tmdb
    }));
  }

  return (
    <div className={classNames('h-full flex flex-col', props.className)}>
      <div className='flex-none p-4 flex items-center'>
        <Tooltip placement='bottom' title={path} className='flex-1 mr-2'>
          <h4 className='m-0 truncate'>{name}</h4>
        </Tooltip>
        <Space>
          <Button type='primary' onClick={onScrape}>Scrape</Button>
          <Button type='primary'
                  onClick={onMeta}
                  loading={meta.status === 'request'}
                  disabled={meta.status === 'success' || movie.status !== 'success'}>
            Manage
          </Button>
          <Button type='primary'
                  onClick={onMovie}
                  disabled={!metadata}
                  loading={movie.status === 'request'}>
            Movie
          </Button>
        </Space>
      </div>
      <div className='flex-none h-px bg-gray-300'/>
      <div className='flex-1 overflow-y-auto'>
        {movie.data ? (
          <MovieDetails id={movie.data as number}/>
        ) : (
          <div className='h-full flex items-center justify-center'>
            <Empty/>
          </div>
        )}
      </div>
      <Scrape wrapper={props.id}/>
    </div>
  );

}

interface WrapperDetailsProps {

  id: string;

  className?: string;

}
