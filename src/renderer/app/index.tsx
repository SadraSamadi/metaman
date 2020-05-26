import React, {ReactElement, useEffect} from 'react';
import {Provider, useDispatch} from 'react-redux';
import {HashRouter, Redirect, Route, Switch} from 'react-router-dom';
import actions from './actions';
import store from './common/store';
import Home from './components/home';
import MoviePreview from './components/movie-preview';
import {AppDispatch} from './models/store';

export default function App(): ReactElement {

  return (
    <Provider store={store}>
      <Container/>
    </Provider>
  );

}

function Container(): ReactElement {

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(actions.prefs.init());
  }, []);

  return (
    <HashRouter>
      <div className='w-screen h-screen'>
        <Switch>
          <Redirect exact from='/' to='/home'/>
          <Route path='/home' component={Home}/>
          <Route path='/movie' component={MoviePreview}/>
        </Switch>
      </div>
    </HashRouter>
  );

}
