import classNames from 'classnames';
import React, {CSSProperties, PropsWithChildren, ReactElement} from 'react';
import {imageUrl} from '../common/util';
import {ImageSize} from '../models/image';

export function Image(props: ImageProps): ReactElement {

  return (
    <img alt={props.alt}
         style={props.style}
         className={props.className}
         src={imageUrl(props.path, props.size)}/>
  );

}

export function ImageContainer(props: PropsWithChildren<ImageContainerProps>): ReactElement {

  const tint = props.tint || 0;

  const backgroundImage = `
    linear-gradient(
      rgba(0, 0, 0, ${tint}),
      rgba(0, 0, 0, ${tint})
    ),
    url('${imageUrl(props.path, props.size)}')
  `;

  return (
    <div style={{...props.style, backgroundImage}}
         className={classNames('bg-gray-300 bg-cover bg-center bg-no-repeat', props.className)}>
      {props.children}
    </div>
  );

}

interface ImageProps extends Props {

  alt?: string;

}

interface ImageContainerProps extends Props {

  tint?: number;

}

interface Props {

  path: string;

  size?: ImageSize;

  className?: string;

  style?: CSSProperties;

}
