const appConfig = require('../../../config/main');
import {Middleware, Store, createStore, applyMiddleware, compose} from 'redux';
import {routerMiddleware} from 'react-router-redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import {IStore} from './IStore';
const createLogger = require('redux-logger');

export function configureStore(history : any, initialState?: IStore) : Store<IStore> {

  const middlewares: Middleware[] = [routerMiddleware(history), thunk];

  /** Add Only Dev. Middlewares */
  if (appConfig.env !== 'production' && process.env.BROWSER) {
    const logger = createLogger();
    middlewares.push(logger);
  }

  const composeEnhancers = (appConfig.env !== 'production' && typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  const store: Store < IStore | undefined > = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...middlewares),));

  if (appConfig.env === 'development' && (module as any).hot) {
    (module as any)
      .hot
      .accept('./reducers', () => {
        store.replaceReducer((require('./reducers')));
      });
  }

  return store;
}
