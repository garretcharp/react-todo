import React from 'react';

import { RecoilRoot } from 'recoil';
import { initializeState } from '../helpers/state';
import Todo from './Todo';

const App = () => {
  return (
    <RecoilRoot initializeState={initializeState}>
      <h1>React Todo</h1>
      <Todo />
    </RecoilRoot>
  );
}

export default App;
