import React from 'react';
import { Form } from 'antd';

class FormItemWrap extends React.Component {
  constructor(props) {
    super(props);
    this.ref = null;
  }

  componentDidMount() {
    if (this.ref) {
      setTimeout(() => this.ref.focus(), 100);
    }
  }

  render() {
    const {
      required = false,
      label,
      visible,
      type,
      children,
      autoFocus,
      ...rest
    } = this.props;

    const { rules = [] } = this.props;

    rules.push({
      required: required
    });

    if (type === 'email') {
      rules.push({ type: 'email', message: 'E-mail inválido' });
    }

    const parent = this;
    const control = autoFocus
      ? React.cloneElement(children, {
          ref: (node) => {
            parent.ref = node;
          }
        })
      : children;

    return visible === false ? null : (
      <Form.Item label={label} {...rest} rules={rules}>
        {control}
      </Form.Item>
    );
  }
}

export default FormItemWrap;
