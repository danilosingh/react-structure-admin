import React, { useContext, createContext, useState } from 'react';

export const defaultItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
};

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
