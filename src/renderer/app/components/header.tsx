import {SettingOutlined, SyncOutlined} from '@ant-design/icons';
import {Button, message} from 'antd';
import React, {ReactElement, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import actions from '../actions';
import {AppDispatch} from '../models/store';
import selectors from '../selectors';

export default function Header(): ReactElement {

  const dispatch = useDispatch<AppDispatch>();
  const {status, data, error} = useSelector(selectors.metaman.wrappers);

  useEffect(() => {
    switch (status) {
      case 'cancel':
        message.warn(`Found ${data.length} movies`);
        break;
      case 'success':
        message.success(`Found ${data.length} movies`);
        break;
      case 'failure':
        message.error(error);
        break;
    }
  }, [status]);

  function onScan(): void {
    if (status === 'request')
      dispatch(actions.wrappers.cancel());
    else
      dispatch(actions.wrappers.request());
  }

  function onPrefs(): void {
    dispatch(actions.prefs.open());
  }

  return (
    <div className='p-4 flex items-center justify-between'>
      <Button type='link'
              size='large'
              icon={<SyncOutlined spin={status === 'request'}/>}
              onClick={onScan}>
        Scan
      </Button>
      <h2 className='m-0 uppercase'>Metaman</h2>
      <Button type='link'
              size='large'
              icon={<SettingOutlined/>}
              onClick={onPrefs}>
        Preferences
      </Button>
    </div>
  );

}
