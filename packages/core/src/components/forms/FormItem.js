import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { FormContextConsumer } from './formContext';

class FormItem extends React.Component {
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
      isRequired = false,
      initialValue,
      label,
      name,
      visible,
      type,
      children,
      autoFocus,
      useDisplayLabel = true,
      ...rest
    } = this.props;

    const { rules = [] } = this.props;

    const displayLabel = label || name;

    rules.push({
      required: isRequired,
      message: `${displayLabel} é obrigatório`
    });

    if (type === 'email') {
      rules.push({ type: 'email', message: 'E-mail inválido' });
    }

    const parent = this;
    const input = React.cloneElement(
      children,
      autoFocus
        ? {
            ref: (node) => {
              parent.ref = node;
            }
          }
        : {}
    );

    return visible === false ? null : (
      <FormContextConsumer>
        {(context) => (
          <Form.Item label={useDisplayLabel ? displayLabel : null} {...rest}>
            {context.form.getFieldDecorator(name, {
              initialValue,
              rules
            })(input)}
          </Form.Item>
        )}
      </FormContextConsumer>
    );
  }
}

export default FormItem;
