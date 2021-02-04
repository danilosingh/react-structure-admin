import React from 'react';
import { Form } from 'antd';
import DrawerContainer from './DrawerContainer';
import ResourceErrorAlert from './ResourceErrorAlert';
import { RESOURCE_ACTION_EDIT } from '../store/actions';
import configManager from '../config/configManager';

const DrawerEdit = ({
  children,
  cancelEdit,
  post,
  update,
  visible,
  action,
  data,
  size = 'sm',
  width,
  resource,
  onSubmit,
  onBeforeBinding,
  ...rest
}) => {
  const [editingForm] = Form.useForm();
  
  const submit = () => {
    editingForm.submit();
    editingForm.validateFields().then((values) => {
      let dataToSend = { ...data, ...values };

      if (onSubmit) {
        dataToSend = onSubmit(dataToSend);
        if (!dataToSend) {
          return;
        }
      }

      if (action === RESOURCE_ACTION_EDIT) {
        update(data.id, dataToSend);
      } else {
        post(dataToSend);
      }
    });
  };

  return (
    <DrawerContainer
      width={width}
      size={size}
      resource={resource}
      onOkClick={submit}
      onBackClick={cancelEdit}
      okButtonText="Salvar"
      backButtonText="Cancelar"
      visible={visible}
      {...rest}
    >
      <ResourceErrorAlert resource={resource} />
      {React.cloneElement(children, {
        form: editingForm,
        initialValues: onBeforeBinding ? onBeforeBinding(data) : data,
        ...configManager.getConfig().layout.form
      })}
    </DrawerContainer>
  );
};

export default DrawerEdit;
