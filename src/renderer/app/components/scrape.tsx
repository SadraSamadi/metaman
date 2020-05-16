import {Modal} from 'antd';
import React, {ReactElement} from 'react';

export default function Scrape(): ReactElement {

  return (
    <Modal width={700}
           visible={false}
           title='Scrapping...'>
      <Content/>
    </Modal>
  );

}

function Content(): ReactElement {

  return (
    <div>
      <p>Hello, World!</p>
    </div>
  );

}
