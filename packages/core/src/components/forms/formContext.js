import React, { useContext, createContext, useState } from 'react';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

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

const FormContext = createContext(null);

const FormContextProviderImpl = (props) => {
  const [customItemLayout, setCustomItemLayout] = useState(null);

  const { form, children } = props;
  return (
    <FormContext.Provider
      value={{ form, defaultItemLayout, customItemLayout, setCustomItemLayout }}
    >
      {children}
    </FormContext.Provider>
  );
};

const FormContextProvider = Form.create()(FormContextProviderImpl);

const FormContextConsumer = (props) => {
  const { children } = props;

  return (
    <FormContext.Consumer>
      {(form) => {
        if (!form) {
          throw new Error('Missing FormContextProvider in its parent.');
        }
        return children(form);
      }}
    </FormContext.Consumer>
  );
};

const useFormContext = (throwIsMissing = true) => {
  const value = useContext(FormContext);

  if (!value && throwIsMissing) {
    throw new Error('Missing FormContextProvider in its parent.');
  }

  if (!throwIsMissing && !value) {
    return {};
  }
  
  return value;
};

export {
  FormContext,
  FormContextProvider,
  FormContextConsumer,
  useFormContext,
  FormContextProviderImpl
};
