import {grey} from '@ant-design/colors';
import {DownOutlined} from '@ant-design/icons';
import {Button, Card, Divider, Tag} from 'antd';
import _ from 'lodash';
import React, {ReactElement, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import selectors from '../selectors';
import {Image, ImageContainer} from './image';

const size = 6;

export default function MovieDetails(): ReactElement {

  const selected = useSelector(selectors.metaman.selected);
  const wrapper = useSelector(selectors.wrappers.wrapper(selected));
  const movie = useSelector(selectors.movies.movie(wrapper.movie.data as number));
  const credit = useSelector(selectors.credits.credit(movie.credits as number));
  const [casts, setCasts] = useState(0);
  const [crews, setCrews] = useState(0);

  useEffect(() => {
    let {cast, crew} = credit;
    setCasts(cast.length < size ? cast.length : size);
    setCrews(crew.length < size ? crew.length : size);
  }, [credit]);

  function onCasts(): void {
    let rest = credit.cast.length - casts;
    let more = rest < size ? rest : size;
    setCasts(casts + more);
  }

  function onCrews(): void {
    let rest = credit.crew.length - crews;
    let more = rest < size ? rest : size;
    setCrews(crews + more);
  }

  return (
    <>
      <ImageContainer path={movie.backdrop_path} size='w780' className='p-4 flex' tint={0.25}>
        <Image path={movie.poster_path} size='w342' className='rounded shadow'/>
        <div className='ml-4 text-white'>
          <h1 className='text-white'>{movie.title}</h1>
          <h3 className='text-white'>{movie.release_date}</h3>
          <p className='text-justify'>{movie.overview}</p>
          <div className='flex flex-wrap'>
            {movie.genres.map((genre: number) => (
              <GenreTag key={genre} id={genre}/>
            ))}
          </div>
        </div>
      </ImageContainer>
      <div className='px-4 pb-4'>
        <Divider orientation='left'>Cast</Divider>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
          {_.take(credit.cast, casts)
            .map((cast: string) => (
              <CastCard key={cast} id={cast}/>
            ))}
        </div>
        {credit.cast.length > casts && (
          <div className='mt-4 text-center'>
            <Button type='link' icon={<DownOutlined/>} onClick={onCasts}>More</Button>
          </div>
        )}
        <Divider orientation='left'>Crew</Divider>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
          {_.take(credit.crew, crews)
            .map((crew: string) => (
              <CrewCard key={crew} id={crew}/>
            ))}
        </div>
        {credit.crew.length > crews && (
          <div className='mt-4 text-center'>
            <Button type='link' icon={<DownOutlined/>} onClick={onCrews}>More</Button>
          </div>
        )}
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
    <Card size='small'
          cover={<ImageContainer path={cast.profile_path} size='w185' className='h-48'/>}>
      <Card.Meta title={cast.name} description={cast.character}/>
    </Card>
  );

}

function CrewCard(props: CrewCardProps): ReactElement {

  const crew = useSelector(selectors.crews.crew(props.id));

  return (
    <Card size='small'
          cover={<ImageContainer path={crew.profile_path} size='w185' className='h-48'/>}>
      <Card.Meta title={crew.name} description={`${crew.department} - ${crew.job}`}/>
    </Card>
  );

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
