import { injectReducer } from '../../store/reducers';
import PegboardContainer from './containers/PegboardContainer';
import reducerPegboard from './modules/pegboard';
import reducerPegs from './modules/pegs';

/*  Add the reducer to the store on key 'counter'  */

export default (store) => {
  injectReducer(store, { key: 'pegboard', reducer: reducerPegboard });
  injectReducer(store, { key: 'pegs', reducer: reducerPegs });

  return {
    component: PegboardContainer
  }
}
