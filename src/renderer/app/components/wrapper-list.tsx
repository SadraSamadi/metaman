import {Empty} from 'antd';
import classNames from 'classnames';
import React, {ReactElement} from 'react';
import {useSelector} from 'react-redux';
import selectors from '../selectors';
import WrapperItem from './wrapper-item';

export default function WrapperList(props: WrapperListProps): ReactElement {

  const {data} = useSelector(selectors.metaman.wrappers);

  return data?.length ? (
    <div className={classNames('h-full overflow-y-auto', props.className)}>
      {data.map(wrapper => <WrapperItem key={wrapper} id={wrapper}/>)}
    </div>
  ) : (
    <div className={classNames('h-full flex items-center justify-center', props.className)}>
      <Empty/>
    </div>
  );

}

interface WrapperListProps {

  className?: string;

}
