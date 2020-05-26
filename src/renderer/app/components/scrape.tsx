import {Button, Card, Empty, Form, Input, InputNumber, Modal, Spin} from 'antd';
import _ from 'lodash';
import {parse} from 'path';
import React, {ReactElement, useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import actions from '../actions';
import {AppDispatch} from '../models/store';
import {Info} from '../models/wrapper';
import selectors from '../selectors';
import {ImageContainer} from './image';

export default function Scrape(props: ScrapeProps): ReactElement {

  const dispatch = useDispatch<AppDispatch>();
  const {path, scrape} = useSelector(selectors.wrappers.wrapper(props.wrapper));
  const name = useMemo(getName, [path]);

  function getName(): string {
    let {name} = parse(path);
    return name;
  }

  function onCancel(): void {
    dispatch(actions.wrappers.scrape.cancel(props.wrapper));
  }

  return (
    <Modal centered
           width={700}
           destroyOnClose
           onCancel={onCancel}
           className='my-4 p-0'
           bodyStyle={{padding: 0}}
           visible={scrape.status === 'request'}
           footer={<Button onClick={onCancel}>Cancel</Button>}
           title={<h4 className='m-0 mr-8 truncate'>{name}</h4>}>
      <Content wrapper={props.wrapper}/>
    </Modal>
  );

}

function Content(props: ContentProps): ReactElement {

  const dispatch = useDispatch<AppDispatch>();
  const {info, guess, movie} = useSelector(selectors.wrappers.wrapper(props.wrapper));
  const page = useSelector(selectors.search.page(props.wrapper));
  const onInfoDebounced = useMemo(() => _.debounce(onInfo, 300), [props.wrapper]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (info)
      form.setFieldsValue(info);
  }, [info]);

  function onInfo(data: Info): void {
    dispatch(actions.wrappers.info({
      id: props.wrapper,
      data
    }));
  }

  function onGuess(): void {
    dispatch(actions.wrappers.guess.request(props.wrapper));
  }

  function onSearch(): void {
    dispatch(actions.search.request({
      id: props.wrapper,
      data: undefined
    }));
  }

  function onMovie(data: number): void {
    dispatch(actions.wrappers.movie.request({
      id: props.wrapper,
      data
    }));
  }

  return (
    <>
      <div className='p-4 flex'>
        <Button type='primary'
                className='mr-4'
                onClick={onGuess}
                loading={guess.status === 'request'}>
          Guess
        </Button>
        <Form form={form} className='flex-1 mr-4' onValuesChange={onInfoDebounced}>
          <div className='flex'>
            <div className='flex-1 mr-4'>
              <Form.Item name='title' className='m-0'>
                <Input placeholder='Title'/>
              </Form.Item>
            </div>
            <Form.Item name='year' className='m-0'>
              <InputNumber placeholder='Year'/>
            </Form.Item>
          </div>
        </Form>
        <Button type='primary'
                onClick={onSearch}
                disabled={!info?.title}
                loading={page?.status === 'request'}>
          Search
        </Button>
      </div>
      <div className='h-px bg-gray-300'/>
      <Spin spinning={movie.status === 'request'}>
        <div style={{height: 500}}>
          {page?.data?.total_results ? (
            <div className='h-full p-4 overflow-y-auto'>
              <div className='grid grid-cols-4 gap-4'>
                {page.data.results.map(result => (
                  <Card hoverable
                        size='small'
                        key={result.id}
                        onClick={() => onMovie(result.id)}
                        cover={<ImageContainer path={result.poster_path} size='w342' className='h-56'/>}>
                    <Card.Meta title={result.release_date} description={result.title}/>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className='h-full flex items-center justify-center'>
              <Empty/>
            </div>
          )}
        </div>
      </Spin>
    </>
  );

}

interface ContentProps {

  wrapper: string;

}

interface ScrapeProps {

  wrapper: string;

}
