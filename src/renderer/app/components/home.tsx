import React, {ReactElement, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import actions from '../actions';
import {AppDispatch} from '../models/store';
import Header from './header';
import Main from './main';
import WrapperList from './wrapper-list';

export default function Home(): ReactElement {

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(actions.prefs.init());
  }, []);

  return (
    <div className='h-full flex flex-col'>
      <Header className='flex-none'/>
      <div className='flex-none h-px bg-gray-300'/>
      <div className='flex-1 flex overflow-hidden'>
        <WrapperList className='flex-none w-1/4'/>
        <div className='flex-none w-px bg-gray-300'/>
        <Main className='flex-1 overflow-hidden'/>
      </div>
    </div>
  );

}
