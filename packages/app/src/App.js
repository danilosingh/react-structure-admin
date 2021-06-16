import React from 'react';
import logo from './logo.svg';
import CourtList from './courts/CourtList';

import './App.less';

function App() {
  var a = require('react-structure-admin');

  return (
    <div className="App">
      Teste te
      <CourtList path="courts" />
    </div>
  );
}

export default App;
