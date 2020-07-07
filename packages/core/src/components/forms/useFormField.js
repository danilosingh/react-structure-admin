import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

const useFormField = (form) => {
  const { getFieldDecorator } = form;
  let display;
  return (name, label, { style, wrapperCol, labelCol, ...rest }) => {
    if (rest.isRequired) {
      if (!rest.rules) {
        rest.rules = [];
      }
      rest.rules = [
        ...rest.rules,
        { required: true, message: `${label} é obrigatório` }
      ];
    }

    display = label || name;

    if (rest.useDisplayLabel === false) {
      display = null;
    }

    return (input) => (
      <Form.Item
        label={display}
        labelAlign="left"
        colon={false}
        wrapperCol={wrapperCol}
        labelCol={labelCol}
        style={style}
      >
        {getFieldDecorator(name, { ...rest })(input)}
      </Form.Item>
    );
  };
};

export default useFormField;
