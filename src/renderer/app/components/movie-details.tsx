import {grey} from '@ant-design/colors';
import {Card, Divider, Tag, Tooltip} from 'antd';
import _ from 'lodash';
import React, {ReactElement, ReactNode, useMemo} from 'react';
import {useSelector} from 'react-redux';
import selectors from '../selectors';
import {Image, ImageContainer} from './image';

export default function MovieDetails(props: MovieDetailsProps): ReactElement {

  const movie = useSelector(selectors.wrappers.movie(props.id));
  const credit = useSelector(selectors.wrappers.credit(movie.credits as number));

  return (
    <>
      <ImageContainer path={movie.backdrop_path} size='w780' className='p-4 flex' tint={0.25}>
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

function Limited<T>(props: LimitedProps<T>): ReactElement {

  const list = useMemo(() => _.take(props.list, 12), [props.list]);

  return (
    <>
      <Divider orientation='left'>{props.title}</Divider>
      <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4'>
        {list.map(props.render)}
      </div>
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
