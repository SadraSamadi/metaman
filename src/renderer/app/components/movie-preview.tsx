import {Spin} from 'antd';
import fse from 'fs-extra';
import query from 'query-string';
import React, {ReactElement, useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';

export default function MoviePreview(props: RouteComponentProps): ReactElement {

  const [data, setData] = useState<string>();

  useEffect(() => {
    (async () => {
      let {file} = query.parse(props.location.search);
      let data = await fse.readJSON(file as string);
      let str = JSON.stringify(data, null, 2);
      setData(str);
    })();
  }, []);

  return data ? (
    <div className='whitespace-pre-wrap overflow-y-auto'>
      {data}
    </div>
  ) : (
    <div className='h-full flex items-center justify-center'>
      <Spin size='large'/>
    </div>
  );

}
