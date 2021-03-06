import {DeleteOutlined, InfoCircleOutlined} from '@ant-design/icons/lib';
import {Alert, Button, Empty, Form, Input, InputNumber, Modal, Select, Switch, Tabs, Tooltip} from 'antd';
import {FormInstance} from 'antd/lib/form';
import classNames from 'classnames';
import {remote, shell} from 'electron';
import _ from 'lodash';
import React, {forwardRef, ReactElement, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import actions from '../actions';
import {Settings, Status} from '../models/prefs';
import {AppDispatch} from '../models/store';
import selectors from '../selectors';

const height = 500;

export default function Prefs(): ReactElement {

  const dispatch = useDispatch<AppDispatch>();
  const {settings, modal} = useSelector(selectors.prefs.prefs);
  const form = useRef<FormInstance>();
  const request = _.includes<Status>(['init', 'save', 'reset'], settings.status);

  async function onSave(): Promise<void> {
    let value = await form.current.validateFields();
    dispatch(actions.prefs.save(value as Settings));
  }

  function onCancel(): void {
    dispatch(actions.prefs.close());
  }

  function onReset(): void {
    dispatch(actions.prefs.reset());
  }

  return (
    <Modal centered
           width={700}
           destroyOnClose
           visible={modal}
           title='Preferences'
           closable={!request}
           onCancel={onCancel}
           className='my-4 p-0'
           maskClosable={!request}
           bodyStyle={{padding: 0}}
           footer={
             <div className='flex items-center'>
               <Button type='link'
                       onClick={onReset}
                       loading={settings.status === 'reset'}
                       disabled={settings.status === 'save'}>
                 Reset Defaults
               </Button>
               <div className='flex-1 mx-2 text-left'>
                 {settings.status === 'failure' && (
                   <Alert type='error' showIcon message={settings.error}/>
                 )}
               </div>
               <Button disabled={request} onClick={onCancel}>Cancel</Button>
               <Button type='primary'
                       onClick={onSave}
                       loading={settings.status === 'save'}
                       disabled={settings.status === 'reset'}>
                 Save
               </Button>
             </div>
           }>
      <PrefsForm ref={form} settings={settings.data}/>
    </Modal>
  );

}

const PrefsForm = forwardRef<FormInstance, PrefsFormProps>((props, ref) => {

  const [form] = Form.useForm();

  async function onAddDir(operation: Operation<string>): Promise<void> {
    let win = remote.getCurrentWindow();
    let res = await remote.dialog.showOpenDialog(win, {
      properties: ['openDirectory']
    });
    if (res.canceled)
      return;
    let dir = res.filePaths[0];
    let dirs = form.getFieldValue('dirs');
    if (!_.includes(dirs, dir))
      operation.add(dir);
  }

  return (
    <Form ref={ref}
          form={form}
          labelCol={{span: 6}}
          wrapperCol={{span: 18}}
          initialValues={props.settings}>
      <Tabs size='small' tabPosition='left'>
        <Tabs.TabPane key='dirs' tab='Directories'>
          <Form.List name='dirs'>
            {(fields, operation) => (
              <div style={{height}} className='flex flex-col'>
                <div className='flex-1 p-4 overflow-y-auto'>
                  {fields.length ? (
                    fields.map(field => {
                      let dir = form.getFieldValue(['dirs', field.name]);
                      return (
                        <div key={field.key}
                             className={classNames(
                               'px-4 py-2 flex items-center',
                               'transition-colors duration-100 ease-out hover:bg-gray-100'
                             )}>
                          <Tooltip placement='bottom' className='flex-1 mr-4' title={dir}>
                            <span className='truncate'>{dir}</span>
                          </Tooltip>
                          <Button danger
                                  type='link'
                                  icon={<DeleteOutlined/>}
                                  onClick={() => operation.remove(field.name)}/>
                        </div>
                      );
                    })
                  ) : (
                    <div className='h-full flex items-center justify-center'>
                      <Empty/>
                    </div>
                  )}
                </div>
                <div className='p-4'>
                  <Button type='dashed' onClick={() => onAddDir(operation)} block>
                    Add New Directory
                  </Button>
                </div>
              </div>
            )}
          </Form.List>
        </Tabs.TabPane>
        <Tabs.TabPane key='tmdb' tab='The Movie DB'>
          <div style={{height}} className='p-4'>
            <Form.Item name={['tmdb', 'key']} label='API Key' rules={[{required: true}]}>
              <Input/>
            </Form.Item>
            <Form.Item name={['tmdb', 'language']} label='Language'>
              <Select>
                <Select.Option value='en-US'>English</Select.Option>
                <Select.Option value='fa-IR'>Persian</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item valuePropName='checked' name={['tmdb', 'adults']} label='Include Adults'>
              <Switch/>
            </Form.Item>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane key='man' tab='Management'>
          <div style={{height}} className='p-4 overflow-y-auto'>
            {(() => {
              let suffix = (
                <Tooltip title={
                  <>
                    <p className='m-0'>$&#123;title&#125; - Movie title</p>
                    <p className='m-0'>$&#123;year&#125; - Movie release year</p>
                  </>
                }>
                  <InfoCircleOutlined/>
                </Tooltip>
              );
              return (
                <>
                  <Form.Item label='Folder Name'
                             name={['man', 'folder']}>
                    <Input suffix={suffix}/>
                  </Form.Item>
                  <Form.Item label='Movie Name'
                             name={['man', 'name']}>
                    <Input suffix={suffix}/>
                  </Form.Item>
                  <Form.Item valuePropName='checked'
                             label='Save Backdrop'
                             name={['man', 'backdrop', 'save']}>
                    <Switch/>
                  </Form.Item>
                  <Form.Item label='Backdrop Name'
                             name={['man', 'backdrop', 'name']}>
                    <Input suffix={suffix}/>
                  </Form.Item>
                  <Form.Item valuePropName='checked'
                             label='Save Poster'
                             name={['man', 'poster', 'save']}>
                    <Switch/>
                  </Form.Item>
                  <Form.Item label='Poster Name'
                             name={['man', 'poster', 'name']}>
                    <Input suffix={suffix}/>
                  </Form.Item>
                </>
              );
            })()}
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane key='proxy' tab='Proxy'>
          <div style={{height}} className='p-4'>
            <Form.Item valuePropName='checked' name={['proxy', 'enable']} label='Enable'>
              <Switch/>
            </Form.Item>
            <Form.Item name={['proxy', 'protocol']} label='Protocol'>
              <Select>
                <Select.Option value='http'>HTTP</Select.Option>
                <Select.Option value='https'>HTTPS</Select.Option>
                <Select.Option value='socks'>SOCKS</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name={['proxy', 'host']} label='Host'>
              <Input/>
            </Form.Item>
            <Form.Item name={['proxy', 'port']} label='Port' rules={[{type: 'number', min: 0, max: 65535}]}>
              <InputNumber/>
            </Form.Item>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane key='about' tab='About'>
          <div style={{height}} className='px-4 pb-4 flex flex-col items-center justify-center'>
            <h2 className='m-0'>Metaman</h2>
            <h2>(Metadata Manager)</h2>
            <h4>
              <span className='font-bold'>Version: </span>
              <span>1.0.0</span>
            </h4>
            <h4>
              <span className='font-bold'>Developer: </span>
              <span>Sadra Samadi</span>
            </h4>
            <h4>
              <span className='font-bold'>E-Mail: </span>
              <a onClick={() => shell.openExternal('mailto:sadra.smd@gmail.com')}>sadra.smd@gmail.com</a>
            </h4>
            <h4>
              <span className='font-bold'>Powered By: </span>
              <a onClick={() => shell.openExternal('https://themoviedb.org/')}>The Movie DB</a>
            </h4>
            <h5>Copyright &copy; 2020</h5>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </Form>
  );

});

interface PrefsFormProps {

  settings: Settings;

}

interface Operation<T> {

  add: (value: T) => void;

  remove: (index: number) => void;

  move: (from: number, to: number) => void;

}
