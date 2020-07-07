import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

class PhoneNumberInput extends Component {
  render() {
    return <h1>A</h1>;
  }
}

PhoneNumberInput.propTypes = {
  onChange: PropTypes.func,
  'data-__field': PropTypes.object,
  value: PropTypes.string
};

export default PhoneNumberInput;
