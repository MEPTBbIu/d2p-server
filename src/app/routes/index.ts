import * as React from 'react';
import {Route, RouteProps, Switch} from 'react-router';
import {App, Home, About} from '../containers';
import factory from 'redux-devtools';
interface DataGetterInterface<D,P> {
  // new?(): DataGetter<D,P>;
   (params?: P) : D;
}


export type DataGetter<D,P> = ((params?:P) => D) | DataGetterInterface<D, P> ;



interface IData extends Object {
  num? : number;
  str? : string;
}

interface IParams extends Object {
  num?: number
};






interface TypedDataLoaderProps<D,P>  {
  dataLoader?() :DataGetter<D, P>;
}

export function TypedRoute<D extends {},P extends {}>(params?: RouteProps, dLoader?:DataGetter<D,P>): RouteProps&TypedDataLoaderProps<D,P> {
  return { ...params, dataLoader: dLoader ? () => dLoader:undefined }
};


const TestTypedLoader:DataGetter<{ num? : number; str? : string;}, { num?: number} >  = (params?) => ({num : 0,  str : "string", ...params});

export const routes: Array<RouteProps & TypedDataLoaderProps<any,any>>  =
  [

  TypedRoute({
    path: 'about',
    component: About
  }),
  TypedRoute({
    path: '/',
    component: Home,
    exact:true})
  ];


export default routes;

              //(
             // <Route path="/" component={App}>
             //   <Route exact component={Home}/>
             //   <Route path="about" component={About}/>
             // </Route>