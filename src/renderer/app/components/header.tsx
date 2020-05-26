import {SettingOutlined, SyncOutlined} from '@ant-design/icons';
import {Button, message} from 'antd';
import classNames from 'classnames';
import React, {ReactElement, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import actions from '../actions';
import {AppDispatch} from '../models/store';
import selectors from '../selectors';
import Prefs from './prefs';

export default function Header(props: HeaderProps): ReactElement {

  const dispatch = useDispatch<AppDispatch>();
  const {status, data, error} = useSelector(selectors.metaman.wrappers);

  useEffect(() => {
    switch (status) {
      case 'cancel':
        message.warn(`Found ${data.length} videos`);
        break;
      case 'success':
        message.success(`Found ${data.length} videos`);
        break;
      case 'failure':
        message.error(error);
        break;
    }
  }, [status]);

  function onScan(): void {
    if (status === 'request')
      dispatch(actions.metaman.scan.cancel());
    else
      dispatch(actions.metaman.scan.request());
  }

  function onPrefs(): void {
    dispatch(actions.prefs.open());
  }

  return (
    <div className={classNames('p-4 flex items-center justify-between', props.className)}>
      <Button type='link'
              onClick={onScan}
              icon={<SyncOutlined spin={status === 'request'}/>}>
        Scan
      </Button>
      <h2 className='m-0 uppercase'>Metaman</h2>
      <Button type='link'
              onClick={onPrefs}
              icon={<SettingOutlined/>}>
        Preferences
      </Button>
      <Prefs/>
    </div>
  );

}

interface HeaderProps {

  className?: string;

}
