import {Form, Input, InputNumber, Modal} from 'antd';
import _ from 'lodash';
import React, {ReactElement, useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import actions from '../actions';
import {AppDispatch} from '../models/store';
import {Info} from '../models/wrapper';
import selectors from '../selectors';

export default function Scrape(props: ScrapeProps): ReactElement {

  const dispatch = useDispatch<AppDispatch>();
  const {scrape} = useSelector(selectors.wrappers.wrapper(props.wrapper));

  function onCancel(): void {
    dispatch(actions.wrappers.scrape.cancel(props.wrapper));
  }

  function onSuccess(): void {
    dispatch(actions.wrappers.scrape.success(props.wrapper));
  }

  return (
    <Modal width={700}
           destroyOnClose
           onOk={onSuccess}
           onCancel={onCancel}
           title='Scrapping...'
           visible={scrape.status === 'request'}>
      <Content wrapper={props.wrapper}/>
    </Modal>
  );

}

function Content(props: ContentProps): ReactElement {

  const dispatch = useDispatch<AppDispatch>();
  const {info} = useSelector(selectors.wrappers.wrapper(props.wrapper));
  const onInfoDebounced = useMemo(() => _.debounce(onInfo, 300), [props.wrapper]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (info)
      form.setFieldsValue(info);
    else
      form.resetFields();
  }, [info]);

  function onInfo(data: Info): void {
    dispatch(actions.wrappers.info({id: props.wrapper, data}));
  }

  return (
    <div>
      <Form form={form} onValuesChange={onInfoDebounced}>
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
  );

}

interface ContentProps {

  wrapper: string;

}

interface ScrapeProps {

  wrapper: string;

}
