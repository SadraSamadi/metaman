import React, {ReactElement} from 'react';
import {Provider} from 'react-redux';
import {HashRouter, Redirect, Route, Switch} from 'react-router-dom';
import store from './common/store';
import Home from './components/home';
import MoviePreview from './components/movie-preview';

export default function App(): ReactElement {

  return (
    <Provider store={store}>
      <HashRouter>
        <div className='w-screen h-screen overflow-hidden select-none'>
          <Switch>
            <Redirect exact from='/' to='/home'/>
            <Route path='/home' component={Home}/>
            <Route path='/movie' component={MoviePreview}/>
          </Switch>
        </div>
      </HashRouter>
    </Provider>
  );

}
