import React, {ReactElement, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import actions from '../actions';
import {AppDispatch} from '../models/store';
import Header from './header';
import Main from './main';
import Prefs from './prefs';
import WrapperList from './wrapper-list';

export default function Home(): ReactElement {

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(actions.prefs.init());
  }, []);

  return (
    <div className='h-full flex flex-col'>
      <div className='flex-none'>
        <Header/>
      </div>
      <div className='flex-none h-px bg-gray-300'/>
      <div className='flex-1 flex overflow-hidden'>
        <div className='flex-none w-1/4'>
          <WrapperList/>
        </div>
        <div className='flex-none w-px bg-gray-300'/>
        <div className='flex-1 overflow-hidden'>
          <Main/>
        </div>
      </div>
      <Prefs/>
    </div>
  );

}
