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
import React, {ReactElement, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import actions from '../actions';
import {AppDispatch} from '../models/store';
import selectors from '../selectors';

export default function WrapperItem(props: WrapperItemProps): ReactElement {

  const dispatch = useDispatch<AppDispatch>();
  const selected = useSelector(selectors.metaman.selected);
  const wrapper = useSelector(selectors.wrappers.wrapper(props.id));
  const movie = useSelector(selectors.movies.movie(wrapper.movie.data as number));
  const meta = useSelector(selectors.metadata.metadata(wrapper.meta.data as string));
  const search = useSelector(selectors.search.search);
  const name = useMemo(getName, [wrapper.info, movie]);
  const update = useMemo(getUpdate, [meta]);
  const page = search.wrapper === wrapper.id && search.page;
  const request = _.includes([
    wrapper.guess.status,
    wrapper.movie.status,
    wrapper.meta.status,
    page?.status
  ], 'request');

  function getName(): string {
    if (movie) {
      let mom = moment(movie.release_date);
      let year = mom.year();
      return `${movie.title} (${year})`;
    } else if (wrapper.info) {
      let {title, year} = wrapper.info;
      return `${title} (${year})`;
    } else {
      let parsed = parse(wrapper.path);
      return parsed.name;
    }
  }

  function getUpdate(): string {
    if (!meta)
      return 'NEVER';
    let mom = moment(meta.update);
    return mom.fromNow();
  }

  function onSelect(): void {
    dispatch(actions.metaman.select(wrapper.id));
  }

  return (
    <div onClick={onSelect}
         className={classNames(
           'cursor-pointer',
           'transition-colors duration-75 ease-out',
           wrapper.id === selected ? 'bg-gray-200' : 'hover:bg-gray-100'
         )}>
      <div className='p-2'>
        <h5 className='m-0 truncate'>{name}</h5>
        <div className='flex items-center justify-between'>
          <div className='mr-2 text-xs text-gray-500'>
            <span className='font-bold'>last update: </span>
            <span>{update}</span>
          </div>
          {(() => {
            if (request)
              return <LoadingOutlined className='text-purple-500'/>;
            else if (wrapper.meta.data)
              return <CheckOutlined className='text-green-500'/>;
            else if (wrapper.movie.data)
              return <IssuesCloseOutlined className='text-blue-500'/>;
            else if (page?.data?.results?.length)
              return <ClockCircleOutlined className='text-yellow-500'/>;
            else if (wrapper.info)
              return <ExclamationCircleOutlined className='text-orange-500'/>;
            return <WarningOutlined className='text-red-500'/>;
          })()}
        </div>
      </div>
    </div>
  );

}

interface WrapperItemProps {

  id: string;

}
