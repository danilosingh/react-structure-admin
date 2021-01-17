import React from 'react';
import { Input, Col, Row } from 'antd';
import { ModalEdit, FormItem } from 'react-structure-admin';

const CourtEdit = (props) => {
  return (
    <ModalEdit {...props} size="md" showAuditedInfo>
      {(dataSource) => (
        <>
          <Row>
            <Col rows="true" span={16}>
              <FormItem
                name="name"
                label="Nome"
                isRequired
                initialValue={dataSource.name}
                autoFocus
              >
                <Input maxLength={60} />
              </FormItem>
            </Col>
          </Row>
        </>
      )}
    </ModalEdit>
  );
};
export default CourtEdit;
