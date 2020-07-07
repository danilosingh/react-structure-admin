import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { InputNumber, Input } from 'antd';
import EditableContext from './EditableContext';

class EditableCell extends React.Component {
  getInput = (autoFocus = false) => {
    const { inputType, customInput } = this.props;

    if (customInput) {
      return customInput;
    }

    switch (inputType) {
      case 'number':
        return <InputNumber />;
      default:
        return <Input style={{ width: '100%' }} autoFocus={autoFocus} />;
    }
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      required,
      record,
      autoFocus,
      index,
      children,
      rules: customRules,
      ...restProps
    } = this.props;

    let rules = [
      {
        required,
        message: 'Campo é obrigatório.'
      }
    ];

    if (customRules) {
      rules = [...rules, ...customRules];
    }

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            style={{ margin: 0 }}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            {getFieldDecorator(dataIndex, {
              rules,
              initialValue: record[dataIndex]
            })(this.getInput(autoFocus))}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    );
  }
}

export default EditableCell;
