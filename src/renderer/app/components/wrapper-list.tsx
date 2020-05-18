import {Empty} from 'antd';
import React, {ReactElement} from 'react';
import {useSelector} from 'react-redux';
import selectors from '../selectors';
import WrapperItem from './wrapper-item';

export default function WrapperList(): ReactElement {

  const {data} = useSelector(selectors.metaman.wrappers);

  return data?.length ? (
    <div className='max-h-full overflow-y-auto'>
      {data.map(wrapper => <WrapperItem key={wrapper} id={wrapper}/>)}
    </div>
  ) : (
    <div className='h-full flex items-center justify-center'>
      <Empty className='mt-32'/>
    </div>
  );

}
