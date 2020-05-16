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

export default function WrapperDetails(): ReactElement {

  const dispatch = useDispatch<AppDispatch>();
  const selected = useSelector(selectors.metaman.selected);
  const wrapper = useSelector(selectors.wrappers.wrapper(selected));
  const meta = useSelector(selectors.metadata.metadata(wrapper.meta.data as string));
  const search = useSelector(selectors.search.search);
  const onChangeDebounced = useMemo(
    () => _.debounce(onChange, 200),
    [selected]
  );
  const [form] = Form.useForm();
  const page = search.wrapper === selected && search.page;

  useEffect(() => {
    if (wrapper.info)
      form.setFieldsValue(wrapper.info);
    else
      form.resetFields();
  }, [wrapper.info]);

  useEffect(() => {
    if (wrapper.guess.status === 'failure')
      message.error(wrapper.guess.error);
    else if (wrapper.movie.status === 'failure')
      message.error(wrapper.movie.error);
    else if (wrapper.meta.status === 'failure')
      message.error(wrapper.meta.error);
    else if (page?.status === 'failure')
      message.error(page.error);
    else if (page?.status === 'success' && !page.data.results.length)
      message.warn('No results');
  }, [wrapper.guess.status, wrapper.movie.status, wrapper.meta.status, page?.status]);

  function onChange(data: Partial<Guess>): void {
    dispatch(actions.wrappers.info({
      id: selected,
      data
    }));
  }

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

  return (
    <div className='h-full flex flex-col'>
      <div className='flex-none p-4'>
        <div className='mb-4 flex items-center'>
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
                    disabled={!wrapper.info}
                    loading={page?.status === 'request'}>
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
        {wrapper.movie.data && (
          <MovieDetails/>
        )}
      </div>
      <Scrape/>
    </div>
  );

}
