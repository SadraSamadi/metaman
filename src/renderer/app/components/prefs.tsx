import {DeleteOutlined} from '@ant-design/icons';
import {Alert, Button, Form, Input, List, Modal, Select, Switch, Tabs, Tooltip} from 'antd';
import {FormInstance} from 'antd/lib/form';
import {remote} from 'electron';
import _ from 'lodash';
import React, {ReactElement, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import actions from '../actions';
import {AppDispatch} from '../models/store';
import selectors from '../selectors';

export default function Prefs(): ReactElement {

  const prefs = useSelector(selectors.prefs.prefs);
  const dispatch = useDispatch<AppDispatch>();
  const request = _.includes(['init', 'save', 'reset'], prefs.settings.status);
  let form: FormInstance;

  async function onSave(): Promise<void> {
    let value = await form.validateFields();
    let payload = _.assign({}, prefs.settings.data, value);
    dispatch(actions.prefs.save(payload));
  }

  function onCancel(): void {
    if (!request)
      dispatch(actions.prefs.close());
  }

  function onReset(): void {
    dispatch(actions.prefs.reset());
  }

  return (
    <Modal width={700}
           title='Preferences'
           visible={prefs.modal}
           maskClosable={!request}
           closable={!request}
           onCancel={onCancel}
           destroyOnClose
           footer={
             <div className='flex items-center'>
               <Button type='link'
                       disabled={prefs.settings.status === 'save'}
                       loading={prefs.settings.status === 'reset'}
                       onClick={onReset}>
                 Reset Defaults
               </Button>
               <div className='flex-1 mx-2 text-left'>
                 {prefs.settings.status === 'failure' && <Alert type='error' message='Failed' showIcon/>}
               </div>
               <Button disabled={request} onClick={onCancel}>Cancel</Button>
               <Button type='primary'
                       disabled={prefs.settings.status === 'reset'}
                       loading={prefs.settings.status === 'save'}
                       onClick={onSave}>
                 Save
               </Button>
             </div>
           }>
      <Content form={f => form = f}/>
    </Modal>
  );

}

function Content(props: ContentProps): ReactElement {

  const settings = useSelector(selectors.prefs.settings);
  const [form] = Form.useForm();

  props.form(form);

  useEffect(() => {
    form.setFieldsValue(settings);
  }, [settings]);

  async function onAddDir(operation: { add: (dir: string) => void; }): Promise<void> {
    let win = remote.getCurrentWindow();
    let res = await remote.dialog.showOpenDialog(win, {
      properties: ['openDirectory']
    });
    if (res.canceled)
      return;
    let dir = res.filePaths[0];
    let dirs = form.getFieldValue('directories');
    if (!_.includes(dirs, dir))
      operation.add(dir);
  }

  return (
    <Form form={form} labelCol={{span: 6}} wrapperCol={{span: 18}}>
      <Tabs size='small' tabPosition='left'>
        <Tabs.TabPane key='directories' tab='Directories'>
          <Form.List name='directories'>
            {(fields, operation) => (
              <div style={{height: 400}} className='flex flex-col'>
                <div className='flex-1 mb-4 overflow-y-auto'>
                  <List bordered={false}
                        size='small'
                        className='h-full'
                        dataSource={fields}
                        renderItem={field => {
                          let value = form.getFieldValue(['directories', field.name]);
                          return (
                            <List.Item key={field.key}
                                       actions={[
                                         <Button danger
                                                 type='link'
                                                 icon={<DeleteOutlined/>}
                                                 onClick={() => operation.remove(field.name)}/>
                                       ]}>
                              <Tooltip title={value}>
                                <span className='truncate'>{value}</span>
                              </Tooltip>
                            </List.Item>
                          );
                        }}/>
                </div>
                <Button type='dashed' onClick={() => onAddDir(operation)}>
                  Add New Directory
                </Button>
              </div>
            )}
          </Form.List>
        </Tabs.TabPane>
        <Tabs.TabPane key='tmdb' tab='The Movie DB'>
          <div style={{height: 400}}>
            <Form.Item label='API Key'
                       name={['tmdb', 'key']}
                       rules={[{required: true, message: 'Invalid'}]}>
              <Input/>
            </Form.Item>
            <Form.Item label='Language'
                       name={['tmdb', 'language']}
                       rules={[{required: true, pattern: /[a-z]{2}-[A-Z]{2}/, message: 'Invalid'}]}>
              <Select>
                <Select.Option value='en-US'>English</Select.Option>
                <Select.Option value='fa-IR'>Persian</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label='Include Adults'
                       valuePropName='checked'
                       name={['tmdb', 'adults']}>
              <Switch/>
            </Form.Item>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </Form>
  );

}

interface ContentProps {

  form: (instance: FormInstance) => void;

}
