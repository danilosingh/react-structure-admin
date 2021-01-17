import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { formartDateTimeUTC } from '../util/formatters';
import { isNullOrEmpty } from '../util';
import ResourceErrorAlert from './ResourceErrorAlert';
import DrawerForm from './DrawerForm';
import { Button } from 'antd';

const defaultFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
};

const ModalEdit = (props) => {
  const {
    children,
    beforeSubmit,
    visible,
    cancelEdit,
    handleOk,
    title,
    readOnly,
    onSubmit,
    closable,
    width,
    resource,
    saving,
    formItemLayout = defaultFormItemLayout,
    initialValues,
    onAfterCreate,
    onAfterUpdate,
    showAuditedInfo = false,
    labelAlign = 'left',
    size
  } = props;
  let auditInfo = null;
  let { data } = props;

  if (initialValues) {
    data = { ...initialValues, ...data };
  }

  if (showAuditedInfo && data) {
    auditInfo = {};
    const {
      creationTime,
      lastModificationTime,
      lastModifierId,
      creatorId,
      dateLastAccess
    } = data;

    if (!isNullOrEmpty(creatorId, 'guid')) {
      auditInfo.creatorId = creatorId;
    }

    if (!isNullOrEmpty(creationTime, 'date')) {
      auditInfo.creationTime = formartDateTimeUTC(creationTime);
    }

    if (lastModificationTime) {
      auditInfo.lastModificationTime = formartDateTimeUTC(
        lastModificationTime
      );
    }

    if (lastModifierId) {
      auditInfo.lastModifierId = lastModifierId;
    }

    if (dateLastAccess) {
      auditInfo.dateLastAccess = formartDateTimeUTC(dateLastAccess);
    }
  }

  return (
    <DrawerForm
      width={width}
      size={size || 'sm'}
      title={title}
      onAfterCreate={onAfterCreate}
      onAfterUpdate={onAfterUpdate}
      visible={visible}
      closable={closable}
      readOnly={readOnly}
      onSubmit={onSubmit}
      auditInfo={auditInfo}
      onCancel={cancelEdit}
      onOk={handleOk}
      beforeSubmit={beforeSubmit}
      saving={saving}
    >
    
      <Form labelAlign={labelAlign} colon={false} {...formItemLayout}>
        <ResourceErrorAlert resource={resource} />
        {children(data)}
      </Form>
    </DrawerForm>
  );
};

export default ModalEdit;
