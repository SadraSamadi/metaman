import {Empty} from 'antd';
import classNames from 'classnames';
import React, {ReactElement} from 'react';
import {useSelector} from 'react-redux';
import selectors from '../selectors';
import WrapperDetails from './wrapper-details';

export default function Main(props: MainProps): ReactElement {

  const selected = useSelector(selectors.metaman.selected);

  return selected ? (
    <WrapperDetails id={selected} className={props.className}/>
  ) : (
    <div className={classNames('h-full flex items-center justify-center', props.className)}>
      <Empty/>
    </div>
  );

}

interface MainProps {

  className?: string;

}
