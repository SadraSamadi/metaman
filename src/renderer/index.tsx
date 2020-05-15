import React from 'react';
import {render} from 'react-dom';
import 'reflect-metadata';
import App from './app';
import './index.css';

const root = document.getElementById('root');

render(<App/>, root);
