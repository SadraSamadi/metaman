import {Empty} from 'antd';
import React, {ReactElement} from 'react';
import {useSelector} from 'react-redux';
import selectors from '../selectors';
import {WrapperItem} from './wrapper-item';

export default function WrapperList(): ReactElement {

  const {data} = useSelector(selectors.metaman.wrappers);

  return data?.length ? (
    <div className='max-h-full overflow-y-auto'>
      {data.map((id: string) => (
        <WrapperItem key={id} id={id}/>)
      )}
    </div>
  ) : (
    <Empty className='mt-32'/>
  );

}
