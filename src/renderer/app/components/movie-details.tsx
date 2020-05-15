import {Tag} from 'antd';
import React, {ReactElement} from 'react';
import {useSelector} from 'react-redux';
import selectors from '../selectors';
import {Image, ImageContainer} from './image';

export default function MovieDetails(props: MovieDetailsProps): ReactElement {

  const movie = useSelector(selectors.movies.movie(props.id));

  return (
    <div>
      <ImageContainer path={movie.backdrop_path} size='w780' className='p-4 flex' tint={0.5}>
        <Image path={movie.poster_path} size='w342' className='rounded shadow'
               />
        <div className='ml-4'>
          <h1 className='text-white'>{movie.title}</h1>
          <h3 className='text-white'>{movie.release_date}</h3>
          <p className='text-justify text-white'>{movie.overview}</p>
          <div className='flex flex-wrap'>
            {movie.genres.map((genre: number) => (
              <GenreTag key={genre} id={genre}/>
            ))}
          </div>
        </div>
      </ImageContainer>
    </div>
  );

}

function GenreTag(props: GenreTagProps): ReactElement {

  const genre = useSelector(selectors.genres.genre(props.id));

  return (
    <Tag className='mr-2 mb-2 bg-gray-400'>
      {genre.name}
    </Tag>
  );

}

export interface MovieDetailsProps {

  id: number;

}

export interface GenreTagProps {

  id: number;

}
