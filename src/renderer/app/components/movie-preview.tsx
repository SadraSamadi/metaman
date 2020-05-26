import {Alert, Spin} from 'antd';
import query from 'query-string';
import React, {ReactElement, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RouteComponentProps} from 'react-router';
import actions from '../actions';
import {AppDispatch} from '../models/store';
import selectors from '../selectors';
import WrapperDetails from './wrapper-details';

export default function MoviePreview(props: RouteComponentProps): ReactElement {

  const dispatch = useDispatch<AppDispatch>();
  const prefs = useSelector(selectors.prefs.prefs);
  const {status, data, error} = useSelector(selectors.metaman.preview);

  useEffect(() => {
    if (prefs.settings.status === 'success') {
      let {file} = query.parse(props.location.search);
      dispatch(actions.metaman.preview.request(file as string));
    }
  }, [prefs.settings.status]);

  switch (status) {
    case 'success':
      return (
        <WrapperDetails className='overflow-hidden' id={data}/>
      );
    case 'failure':
      return (
        <div className='h-full flex items-center justify-center'>
          <Alert type='error' showIcon message='Failed' description={error}/>
        </div>
      );
    default:
      return (
        <div className='h-full flex items-center justify-center'>
          <Spin size='large'/>
        </div>
      );
  }

}
