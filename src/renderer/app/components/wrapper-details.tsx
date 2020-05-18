import {Button, Card, message, Space, Tooltip} from 'antd';
import React, {ReactElement, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import actions from '../actions';
import {AppDispatch} from '../models/store';
import selectors from '../selectors';
import {ImageContainer} from './image';
import MovieDetails from './movie-details';
import Scrape from './scrape';

export default function WrapperDetails(props: WrapperDetailsProps): ReactElement {

  const dispatch = useDispatch<AppDispatch>();
  const {path, info, guess, movie, meta} = useSelector(selectors.wrappers.wrapper(props.id));
  const metadata = useSelector(selectors.wrappers.meta(meta.data as string));
  const search = useSelector(selectors.search.search);
  const page = search.wrapper === props.id && search.page;

  useEffect(() => {
    if (guess.status === 'failure')
      message.error(guess.error);
    if (movie.status === 'failure')
      message.error(movie.error);
    if (meta.status === 'failure')
      message.error(meta.error);
    if (page?.status === 'failure')
      message.error(page.error);
    if (page?.status === 'success' && !page.data.results.length)
      message.warn('No results');
  }, [guess.status, movie.status, meta.status, page?.status]);

  function onGuess(): void {
    dispatch(actions.wrappers.guess.request(props.id));
  }

  function onSearch(): void {
    dispatch(actions.search.request({
      id: props.id,
      data: undefined
    }));
  }

  function onMovie(id: number): void {
    dispatch(actions.wrappers.movie.request({
      id: props.id,
      data: id
    }));
  }

  function onScrape(): void {
    dispatch(actions.wrappers.scrape.request(props.id));
  }

  function onMeta(): void {
    dispatch(actions.wrappers.meta.request(props.id));
  }

  return (
    <div className='h-full flex flex-col'>
      <div className='flex-none p-4 flex items-center'>
        <Tooltip placement='bottom' title={path} className='flex-1 mr-2'>
          <h4 className='m-0 truncate'>{path}</h4>
        </Tooltip>
        <Space className='flex-none'>
          <Button type='primary'
                  onClick={onGuess}
                  loading={guess.status === 'request'}>
            Guess
          </Button>
          <Button type='primary'
                  onClick={onSearch}
                  disabled={!info}
                  loading={page?.status === 'request'}>
            Search
          </Button>
          <Button type='primary'
                  onClick={onScrape}>
            Scrape
          </Button>
          <Button type='primary'
                  onClick={onMeta}
                  disabled={movie.status !== 'success'}
                  loading={meta.status === 'request'}>
            Meta
          </Button>
          <Button type='primary'
                  disabled={!metadata}
                  onClick={() => onMovie(metadata.tmdb)}
                  loading={movie.status === 'request'}>
            Movie
          </Button>
        </Space>
      </div>
      <div className='flex-none h-px bg-gray-300'/>
      <div className='flex-1 overflow-y-auto'>
        {page?.status === 'success' && (
          <div className='p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
            {page.data.results.map(result => (
              <Card hoverable
                    size='small'
                    key={result.id}
                    onClick={() => onMovie(result.id)}
                    cover={<ImageContainer path={result.poster_path} size='w342' className='h-64'/>}>
                <Card.Meta title={result.release_date} description={result.title}/>
              </Card>
            ))}
          </div>
        )}
        {movie.data && <MovieDetails id={movie.data as number}/>}
      </div>
      <Scrape wrapper={props.id}/>
    </div>
  );

}

interface WrapperDetailsProps {

  id: string;

}
