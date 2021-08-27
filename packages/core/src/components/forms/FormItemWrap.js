import React from 'react';
import { Form, Tooltip } from 'antd';
import { formartOnlyNumber } from '../../util/formatters';
import { InfoCircleOutlined } from '@ant-design/icons';

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
      whitespace,
      name,
      tooltip,
      tooltipIcon,
      rules = [],
      ...rest
    } = this.props;

    let { validateTrigger } = this.props;

    rules.push({
      required: required
    });

    if (whitespace) {
      rules.push({
        whitespace: true
      });
    }

    if (type === 'phone' || type === 'mobilePhone') {
      if (!validateTrigger) {
        validateTrigger = 'onBlur';
      }
      rules.push({
        validator: (_, value) => {
          const length = type === 'phone' ? 10 : 11;
          const formattedValue = formartOnlyNumber(value);
          if (formattedValue && formattedValue.length != length) {
            return Promise.reject(new Error(`${label ?? name} inválido`));
          }
          return Promise.resolve();
        }
      });
    }

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
      <Form.Item
        label={
          tooltip ? (
            <>
              {label}
              <Tooltip title={tooltip}>
                <InfoCircleOutlined className="gx-form-item-tooltip" />
              </Tooltip>
            </>
          ) : (
            label
          )
        }
        name={name}
        validateTrigger={validateTrigger}
        {...rest}
        rules={rules}
      >
        {control}
      </Form.Item>
    );
  }
}

export default FormItemWrap;
