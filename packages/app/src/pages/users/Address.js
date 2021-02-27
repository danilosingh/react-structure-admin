import React, { useState } from 'react';
import { Input, Form, Row, Col, Select } from 'antd';
import {
  api,
  RemoteSelect,
  useCrudEditContext,
  normalizeToSelect
} from 'react-structure-admin';

const Address = () => {
  const [state, setState] = useState({
    lastPostalCode: null,
    loadingAddress: false
  });
  const { form } = useCrudEditContext();
  //   const setAddress = (newAddress) => {
  //     form.setFieldsValue({
  //       address: {
  //         ...newAddress,
  //         city: normalizeToSelect(newAddress.city)
  //       }
  //     });
  //   };
  //   const findAddress = (postalCode) => {
  //     postalCode = postalCode.replace(/[^0-9.]/g, '');
  //     if (state.lastPostalCode === postalCode) {
  //       return;
  //     }
  //     setState({ ...state, lastPostalCode: postalCode, loadingAddress: true });
  //     api.fetch('localizations', { postalCode }).then(({ data }) => {
  //       setState({ ...state, loadingAddress: false });
  //       setAddress(
  //         data
  //           ? data.result
  //           : {
  //               street: null,
  //               number: null,
  //               district: null,
  //               additionalInformation: null,
  //               city: undefined
  //             }
  //       );
  //     });
  //   };
  const handlePostalCodeChange = (sender) => {
    // const postalCode = sender.target.value.replace(/[^0-9.]/g, '');
    // if (postalCode.length === 8) {
    //   findAddress(postalCode);
    // }
  };

  return (
    <>
      <Row>
        <Col span={6}>
          <Form.Item
            name={['address', 'postalCode']}
            label="CEP"
            required
            hasFeedback={state.loadingAddress}
            validateStatus={state.loadingAddress ? 'validating' : undefined}
          >
            <Input onChange={handlePostalCodeChange} />
          </Form.Item>
        </Col>
        <Col span={18}>
          <Form.Item name={['address', 'street']} label="Logradouro" required>
            <Input maxLength={100} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={6}>
          <Form.Item name={['address', 'number']} label="Número" required>
            <Input maxLength={40} />
          </Form.Item>
        </Col>
        <Col span={18}>
          <Form.Item
            name={['address', 'additionalInformation']}
            label="Complemento"
          >
            <Input maxLength={40} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={14}>
          <Form.Item name={['address', 'district']} label="Bairro" required>
            <Input maxLength={100} />
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item
            name={['address', 'city']}
            label="Cidade/Estado"
            rules={[{ required: true }]}
          >
            <RemoteSelect
              resource="cities"
              optionRender={(c) => (
                <Select.Option key={c.key} value={c.key} label={c.label}>
                  {`${c.item.name} - ${c.item.state.toUpperCase()}`}
                </Select.Option>
              )}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};
export default Address;
