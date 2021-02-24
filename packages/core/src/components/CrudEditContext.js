import React, { useContext, createContext } from 'react';

const CrudEditContext = createContext(null);

const CrudEditContextProvider = props => {
  const { children, ...rest } = props;
  return (
    <CrudEditContext.Provider value={{ ...rest }}>
      {children}
    </CrudEditContext.Provider>
  );
};

const useCrudEditContext = () => {
  const value = useContext(CrudEditContext);

  if (!value) {
    throw new Error('Missing CrudEditContextProvider in its parent.');
  }
  return value;
};

export { CrudEditContext, CrudEditContextProvider, useCrudEditContext };
