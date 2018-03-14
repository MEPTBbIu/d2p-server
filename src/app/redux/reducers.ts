import { Reducer,combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { IStore } from './IStore';

//const { reducer } = require('redux-connect');

const rootReducer: Reducer<IStore> = combineReducers<IStore>({
  routing: routerReducer,
//  reduxAsyncConnect: reducer,
});

export default rootReducer;