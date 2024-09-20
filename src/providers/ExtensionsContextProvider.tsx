import React, { Dispatch, PropsWithChildren } from 'react';
import { ExtensionActions } from './actions';
import { extensionsReducer, initState, State } from './reducers';

type Context = {
  state: State;
  dispatch: Dispatch<ExtensionActions>;
};

const ExtensionsContext = React.createContext<Context>({
  state: initState,
  dispatch: () => undefined
});

export const ExtensionsContextProvider: React.FC<PropsWithChildren> = ({ children }): React.ReactElement => {
  const [context, setContext] = React.useReducer(extensionsReducer, initState);

  return <ExtensionsContext.Provider value={{ state: context, dispatch: setContext }}>{children}</ExtensionsContext.Provider>
};

export const useExtensionsContext = () => {
  return React.useContext(ExtensionsContext);
};