import React from 'react';
import {render} from 'react-dom';
import App from './app';
import './index.css';

window['react'] = {};

const root = document.getElementById('root');

render(<App/>, root);
