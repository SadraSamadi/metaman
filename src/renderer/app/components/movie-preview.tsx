import {Card, Spin} from 'antd';
import fse from 'fs-extra';
import query from 'query-string';
import React, {ReactElement, useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';

export default function MoviePreview(props: RouteComponentProps): ReactElement {

  const [data, setData] = useState<string>();

  useEffect(() => {
    (async () => {
      let {file} = query.parse(props.location.search);
      let data = await fse.readFile(file as string, 'utf8');
      setData(data);
    })();
  }, []);

  return (
    <div className='h-full overflow-auto'>
      {data ? (
        <div className='p-4'>
          <Card>
            <code>
              <pre>{data}</pre>
            </code>
          </Card>
        </div>
      ) : (
        <div className='h-full flex items-center justify-center'>
          <Spin size='large'/>
        </div>
      )}
    </div>
  );

}
