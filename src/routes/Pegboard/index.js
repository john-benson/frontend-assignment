import { injectReducer } from '../../store/reducers'
import PegboardContainer from './containers/PegboardContainer';
import pegboardReducer from './modules/pegboard';
import pegsReducer from './modules/pegs';


// Sync route definition
export default (store) => {
  injectReducer(store, { key: 'pegboard', reducer: pegboardReducer });
  injectReducer(store, { key: 'pegs', reducer: pegsReducer });

  return {
    component: PegboardContainer
  };
}
