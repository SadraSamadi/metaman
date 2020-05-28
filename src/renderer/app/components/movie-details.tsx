import {grey} from '@ant-design/colors';
import {DownOutlined} from '@ant-design/icons';
import {Button, Card, Divider, Tag, Tooltip} from 'antd';
import _ from 'lodash';
import React, {ReactElement, ReactNode, useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import selectors from '../selectors';
import {Image, ImageContainer} from './image';

export default function MovieDetails(props: MovieDetailsProps): ReactElement {

  const movie = useSelector(selectors.wrappers.movie(props.id));
  const collection = useSelector(selectors.wrappers.collection(movie.belongs_to_collection as number));
  const credit = useSelector(selectors.wrappers.credit(movie.credits as number));

  return (
    <>
      <ImageContainer path={movie.backdrop_path} size='w780' className='px-4 py-8 flex' tint={0.25}>
        <Image path={movie.poster_path} size='w342' className='flex-none rounded shadow'/>
        <div className='flex-1 ml-4 text-white'>
          <h1 className='text-white'>{movie.title}</h1>
          <h3 className='text-white'>{movie.release_date}</h3>
          <p className='text-justify'>{movie.overview}</p>
          <div className='flex flex-wrap'>
            {movie.genres.map((genre: number) => <GenreTag key={genre} id={genre}/>)}
          </div>
        </div>
      </ImageContainer>
      <div className='px-4 pb-4'>
        {collection && (
          <Limited title='Collection'
                   list={collection.parts}
                   render={part => (
                     <Card hoverable
                           size='small'
                           key={part.id}
                           cover={<ImageContainer path={part.poster_path} size='w185' className='h-48'/>}>
                       <Card.Meta title={part.release_date} description={part.title}/>
                     </Card>
                   )}/>
        )}
        <Limited title='Cast'
                 list={credit.cast}
                 render={(cast: string) => <CastCard key={cast} id={cast}/>}/>
        <Limited title='Crew'
                 list={credit.crew}
                 render={(crew: string) => <CrewCard key={crew} id={crew}/>}/>
      </div>
    </>
  );

}

function GenreTag(props: GenreTagProps): ReactElement {

  const genre = useSelector(selectors.wrappers.genre(props.id));

  return (
    <Tag className='mr-2 mb-2' color={grey.primary}>
      {genre.name}
    </Tag>
  );

}

const size = 6;

function Limited<T>(props: LimitedProps<T>): ReactElement {

  // TODO: DANGEROUS ZONE

  const [limit, setLimit] = useState(0);
  const list = useMemo(getList, [props.list, limit]);

  useEffect(() => {
    let len = props.list.length;
    setLimit(len < size ? len : size);
  }, [props.list]);

  function getList(): T[] {
    return _.take(props.list, limit);
  }

  function onMore(): void {
    let rest = props.list.length - limit;
    let more = rest < size ? rest : size;
    setLimit(limit + more);
  }

  return (
    <>
      <Divider orientation='left'>{props.title}</Divider>
      <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4'>
        {list.map(props.render)}
      </div>
      {limit < props.list.length && (
        <div className='mt-4 text-center'>
          <Button type='link' onClick={onMore} icon={<DownOutlined/>}>More</Button>
        </div>
      )}
    </>
  );

}

function CastCard(props: CastCardProps): ReactElement {

  const cast = useSelector(selectors.wrappers.cast(props.id));

  return (
    <Card hoverable
          size='small'
          cover={<ImageContainer path={cast.profile_path} size='w185' className='h-48'/>}>
      <Card.Meta description={cast.character}
                 title={
                   <Tooltip placement='bottom' title={cast.name}>
                     <span>{cast.name}</span>
                   </Tooltip>
                 }/>
    </Card>
  );

}

function CrewCard(props: CrewCardProps): ReactElement {

  const crew = useSelector(selectors.wrappers.crew(props.id));

  return (
    <Card hoverable
          size='small'
          cover={<ImageContainer path={crew.profile_path} size='w185' className='h-48'/>}>
      <Card.Meta description={`${crew.department} / ${crew.job}`}
                 title={
                   <Tooltip placement='bottom' title={crew.name}>
                     <span>{crew.name}</span>
                   </Tooltip>
                 }/>
    </Card>
  );

}

interface MovieDetailsProps {

  id: number;

}

export interface GenreTagProps {

  id: number;

}

interface LimitedProps<T> {

  title: string;

  list: T[];

  render: (item: T) => ReactNode;

}

export interface CastCardProps {

  id: string;

}

export interface CrewCardProps {

  id: string;

}
