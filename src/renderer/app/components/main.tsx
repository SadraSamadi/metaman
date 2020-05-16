import {Empty} from 'antd';
import React, {ReactElement} from 'react';
import {useSelector} from 'react-redux';
import selectors from '../selectors';
import WrapperDetails from './wrapper-details';

export default function Main(): ReactElement {

  const selected = useSelector(selectors.metaman.selected);

  return selected ? (
    <WrapperDetails/>
  ) : (
    <div className='h-full flex items-center justify-center'>
      <Empty/>
    </div>
  );

}
