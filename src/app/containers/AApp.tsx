import { Route, Switch, withRouter } from 'react-router';
//import { ReduxAsyncConnect, asyncConnect, reducer as reduxAsyncConnect } from 'react-redux-async-connect'
import * as React from 'react'
//import { render } from 'react-dom'
//import { createStore, combineReducers } from 'redux';

import { routes } from '../routes';


const Status = ({ code, children }) => (
  <Route render={({ staticContext }) => {
    if (staticContext)
      staticContext.status = code
    return children
  }}/>
);

const NotFound = () => (
  <Status code={404}>
    <div>
      <h1>Sorry, cannot find that.</h1>
    </div>
  </Status>
);

export const AApp = () => (
  <Switch>
    {routes.map(route => (
      <Route {...route}/>
    ))}
    <Route component={NotFound}/>

  </Switch>
);

//export const AApp = withRouter(App);

  export default AApp;