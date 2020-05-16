import {Empty} from 'antd';
import React, {ReactElement} from 'react';
import {useSelector} from 'react-redux';
import selectors from '../selectors';
import WrapperItem from './wrapper-item';

export default function WrapperList(): ReactElement {

  const {data} = useSelector(selectors.metaman.wrappers);

  return data?.length ? (
    <div className='max-h-full overflow-y-auto'>
      {data.map((wrapper: string) => (
        <WrapperItem key={wrapper} id={wrapper}/>)
      )}
    </div>
  ) : (
    <Empty className='mt-32'/>
  );

}
