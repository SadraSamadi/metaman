import {grey} from '@ant-design/colors';
import {Card, Divider, Tag, Tooltip} from 'antd';
import _ from 'lodash';
import React, {ReactElement, useMemo} from 'react';
import {useSelector} from 'react-redux';
import selectors from '../selectors';
import {Image, ImageContainer} from './image';

export default function MovieDetails(props: MovieDetailsProps): ReactElement {

  const movie = useSelector(selectors.movies.movie(props.id));
  const credit = useSelector(selectors.credits.credit(movie.credits as number));
  const casts = useMemo(() => _.take(credit.cast as string[], 12), [credit]);
  const crews = useMemo(() => _.take(credit.crew as string[], 12), [credit]);

  return (
    <>
      <ImageContainer path={movie.backdrop_path} size='w780' className='p-4 flex' tint={0.25}>
        <Image path={movie.poster_path} size='w342' className='rounded shadow'/>
        <div className='ml-4 text-white'>
          <h1 className='text-white'>{movie.title}</h1>
          <h3 className='text-white'>{movie.release_date}</h3>
          <p className='text-justify'>{movie.overview}</p>
          <div className='flex flex-wrap'>
            {movie.genres.map((genre: number) => <GenreTag key={genre} id={genre}/>)}
          </div>
        </div>
      </ImageContainer>
      <div className='px-4 pb-4'>
        <Divider orientation='left'>Cast</Divider>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
          {casts.map(cast => <CastCard key={cast} id={cast}/>)}
        </div>
        <Divider orientation='left'>Crew</Divider>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
          {crews.map(crew => <CrewCard key={crew} id={crew}/>)}
        </div>
      </div>
    </>
  );

}

function GenreTag(props: GenreTagProps): ReactElement {

  const genre = useSelector(selectors.genres.genre(props.id));

  return (
    <Tag className='mr-2 mb-2' color={grey.primary}>
      {genre.name}
    </Tag>
  );

}

function CastCard(props: CastCardProps): ReactElement {

  const cast = useSelector(selectors.casts.cast(props.id));

  return (
    <Card size='small' cover={<ImageContainer path={cast.profile_path} size='w185' className='h-48'/>}>
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

  const crew = useSelector(selectors.crews.crew(props.id));

  return (
    <Card size='small' cover={<ImageContainer path={crew.profile_path} size='w185' className='h-48'/>}>
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

export interface CastCardProps {

  id: string;

}

export interface CrewCardProps {

  id: string;

}
