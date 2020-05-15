import classNames from 'classnames';
import React, {CSSProperties, PropsWithChildren, ReactElement} from 'react';
import {TMDB_IMAGE_URL} from '../common/constants';

export function Image(props: ImageProps): ReactElement {

  return (
    <img className={props.className}
         style={props.style}
         src={getUrl(props.path, props.size)}
         alt={props.alt}/>
  );

}

export function ImageContainer(props: PropsWithChildren<ImageProps>): ReactElement {

  return (
    <div className={classNames('bg-gray-300 bg-cover bg-center bg-no-repeat', props.className)}
         style={{
           ...props.style,
           backgroundImage: `
            linear-gradient(
              rgba(0, 0, 0, ${props.tint || 0}),
              rgba(0, 0, 0, ${props.tint || 0})
            ),
            url("${getUrl(props.path, props.size)}")
           `
         }}>
      {props.children}
    </div>
  );

}

function getUrl(path: string, size = 'original'): string {
  return `${TMDB_IMAGE_URL}${size}${path}`;
}

interface ImageProps {

  className?: string;

  style?: CSSProperties;

  tint?: number;

  path: string;

  size?: 'original' | string;

  alt?: string;

}
