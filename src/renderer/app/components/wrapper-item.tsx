import {
  CheckOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  IssuesCloseOutlined,
  LoadingOutlined,
  WarningOutlined
} from '@ant-design/icons';
import classNames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import {parse} from 'path';
import React, {ReactElement, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import actions from '../actions';
import {AppDispatch} from '../models/store';
import selectors from '../selectors';

export function WrapperItem(props: WrapperItemProps): ReactElement {

  const dispatch = useDispatch<AppDispatch>();
  const wrapper = useSelector(selectors.wrappers.wrapper(props.id));
  const guess = useSelector(selectors.guesses.guess(wrapper.guess.data as string));
  const movie = useSelector(selectors.movies.movie(wrapper.movie.data as number));
  const meta = useSelector(selectors.metadata.metadata(wrapper.meta.data as string));
  const selected = useSelector(selectors.metaman.selected);
  const search = useSelector(selectors.search.search);
  const [name, setName] = useState<string>();
  const [update, setUpdate] = useState<string>();

  useEffect(() => {
    if (movie) {
      let year = moment(movie.release_date)
        .year();
      setName(`${movie.title} (${year})`);
    } else if (guess) {
      setName(`${guess.title} (${guess.year})`);
    } else {
      let parsed = parse(wrapper.path);
      setName(parsed.name);
    }
  }, [guess, movie]);

  useEffect(() => {
    if (meta) {
      let now = Date.now();
      let dur = moment.duration(meta.update - now)
        .humanize(true);
      setUpdate(dur);
    } else {
      setUpdate('NEVER');
    }
  }, [meta]);

  function onSelect(): void {
    dispatch(actions.metaman.select(props.id));
  }

  return (
    <div onClick={onSelect}
         className={classNames(
           'hover:bg-gray-100 cursor-pointer',
           'transition-colors duration-75 ease-out',
           {'bg-gray-100': props.id === selected}
         )}>
      <div className='p-2'>
        <h5 className={classNames('m-0 truncate', {'font-bold': props.id === selected})}>{name}</h5>
        <div className='flex items-center justify-between'>
          <div className='text-xs text-gray-400'>
            <span className='font-bold'>last update: </span>
            <span>{update}</span>
          </div>
          <div>
            {(() => {
              let request = _.includes([
                wrapper.guess.status,
                wrapper.movie.status,
                wrapper.meta.status
              ], 'request');
              if (request || search.wrapper === props.id && search.page.status === 'request')
                return <LoadingOutlined className='ml-2 text-purple-500'/>;
              else if (wrapper.meta.data)
                return <CheckOutlined className='ml-2 text-green-500'/>;
              else if (wrapper.movie.data)
                return <IssuesCloseOutlined className='ml-2 text-blue-500'/>;
              else if (search.wrapper === props.id && search.page.data)
                return <ClockCircleOutlined className='ml-2 text-yellow-500'/>;
              else if (wrapper.guess.data)
                return <ExclamationCircleOutlined className='ml-2 text-orange-500'/>;
              else
                return <WarningOutlined className='ml-2 text-red-500'/>;
            })()}
          </div>
        </div>
      </div>
      <div className='h-px bg-gray-200'/>
    </div>
  );

}

interface WrapperItemProps {

  id: string;

}
