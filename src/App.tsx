import React from 'react';
import './App.css';
import { ExtensionsWrapper } from './components/ExtensionsWrapper';
import { ExtensionsContextProvider } from './providers/ExtensionsContextProvider';

const App: React.FC = () => {
  return (
    <div className="App">
      <ExtensionsContextProvider>
        <ExtensionsWrapper />
      </ExtensionsContextProvider>
    </div>
  );
}

export default App;
