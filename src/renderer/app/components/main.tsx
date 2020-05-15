import {Button, Card, Empty, Space, Tooltip} from 'antd';
import React, {ReactElement} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import actions from '../actions';
import {AppDispatch} from '../models/store';
import selectors from '../selectors';
import {ImageContainer} from './image';
import MovieDetails from './movie-details';

export default function Main(): ReactElement {

  const dispatch = useDispatch<AppDispatch>();
  const selected = useSelector(selectors.metaman.selected);
  const wrapper = useSelector(selectors.wrappers.wrapper(selected));
  const meta = useSelector(selectors.metadata.metadata(wrapper && wrapper.meta.data as string));
  const search = useSelector(selectors.search.search);

  function onGuess(): void {
    dispatch(actions.guesses.request(selected));
  }

  function onSearch(): void {
    dispatch(actions.search.request({
      id: selected,
      data: undefined
    }));
  }

  function onMovie(id: number): void {
    dispatch(actions.movies.request({
      id: selected,
      data: id
    }));
  }

  function onMeta(): void {
    dispatch(actions.metadata.request(selected));
  }

  return wrapper ? (
    <div className='h-full flex flex-col'>
      <div className='flex-none p-4 flex items-center'>
        <Tooltip title={wrapper.path} placement='bottom' className='flex-1 mr-2'>
          <h4 className='m-0 truncate'>{wrapper.path}</h4>
        </Tooltip>
        <Space className='flex-none'>
          <Button type='primary'
                  onClick={onGuess}
                  loading={wrapper.guess.status === 'request'}>
            Guess
          </Button>
          <Button type='primary'
                  onClick={onSearch}
                  disabled={wrapper.guess.status !== 'success'}
                  loading={search.wrapper === selected && search.page.status === 'request'}>
            Search
          </Button>
          <Button type='primary'
                  onClick={onMeta}
                  disabled={wrapper.movie.status !== 'success'}
                  loading={wrapper.meta.status === 'request'}>
            Meta
          </Button>
          <Button type='primary'
                  disabled={!meta}
                  onClick={() => onMovie(meta.tmdb)}
                  loading={wrapper.movie.status === 'request'}>
            Update
          </Button>
        </Space>
      </div>
      <div className='flex-none h-px bg-gray-300'/>
      <div className='flex-1 overflow-y-auto'>
        {search.wrapper === selected && search.page.status === 'success' && (
          <div className='p-4 grid grid-cols-4 gap-4'>
            {search.page.data.results.map(result => (
              <Card hoverable
                    size='small'
                    key={result.id}
                    onClick={() => onMovie(result.id)}
                    cover={<ImageContainer path={result.poster_path} size='w342' className='h-64'/>}>
                <Card.Meta title={result.release_date} description={result.title}/>
              </Card>
            ))
            }
          </div>
        )}
        {wrapper.movie.data && <MovieDetails id={wrapper.movie.data as number}/>}
      </div>
    </div>
  ) : (
    <div className='h-full flex items-center justify-center'>
      <Empty description='No item selected'/>
    </div>
  );

}
