import {Button, Card, Form, Input, InputNumber, message, Space, Tooltip} from 'antd';
import _ from 'lodash';
import React, {ReactElement, useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import actions from '../actions';
import {Guess} from '../models/guessit';
import {AppDispatch} from '../models/store';
import selectors from '../selectors';
import {ImageContainer} from './image';
import MovieDetails from './movie-details';
import Scrape from './scrape';

export default function WrapperDetails(props: WrapperDetailsProps): ReactElement {

  const dispatch = useDispatch<AppDispatch>();
  const {path, info, guess, movie, meta} = useSelector(selectors.wrappers.wrapper(props.id));
  const metadata = useSelector(selectors.metadata.metadata(meta.data as string));
  const search = useSelector(selectors.search.search);
  const onChangeDebounced = useMemo(() => _.debounce(onChange, 300), [props.id]);
  const [form] = Form.useForm();
  const page = search.wrapper === props.id && search.page;

  useEffect(() => {
    if (info)
      form.setFieldsValue(info);
    else
      form.resetFields();
  }, [info]);

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

  function onChange(data: Guess): void {
    dispatch(actions.wrappers.info({id: props.id, data}));
  }

  function onGuess(): void {
    dispatch(actions.guesses.request(props.id));
  }

  function onSearch(): void {
    dispatch(actions.search.request({
      id: props.id,
      data: undefined
    }));
  }

  function onMovie(id: number): void {
    dispatch(actions.movies.request({
      id: props.id,
      data: id
    }));
  }

  function onMeta(): void {
    dispatch(actions.metadata.request(props.id));
  }

  return (
    <div className='h-full flex flex-col'>
      <div className='flex-none p-4'>
        <div className='mb-4 flex items-center'>
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
        <Form form={form} onValuesChange={onChangeDebounced}>
          <div className='w-full flex'>
            <div className='flex-1 mr-4'>
              <Form.Item name='title' className='m-0'>
                <Input placeholder='Title'/>
              </Form.Item>
            </div>
            <div className='flex-none'>
              <Form.Item name='year' className='m-0'>
                <InputNumber placeholder='Year'/>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
      <div className='flex-none h-px bg-gray-300'/>
      <div className='flex-1 overflow-y-auto'>
        {page?.status === 'success' && (
          <div className='p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
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
      <Scrape/>
    </div>
  );

}

interface WrapperDetailsProps {

  id: string;

}
