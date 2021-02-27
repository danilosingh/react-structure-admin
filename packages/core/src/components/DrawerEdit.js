import React from 'react';
import DrawerContainer from './DrawerContainer';
import ResourceErrorAlert from './ResourceErrorAlert';
import { RESOURCE_ACTION_EDIT } from '../store/actions';
import configManager from '../config/configManager';
import { useCrudEditContext } from './CrudEditContext';

const DrawerEdit = ({
  children,
  cancelEdit,
  post,
  update,
  visible,
  action,
  data,
  size = 'sm',
  resource,
  submit,
  onSubmit,
  onBeforeBinding,
  ...rest
}) => {
  const { form: editingForm } = useCrudEditContext();

  const handleSubmit = () => {
    if (!action) {
      action = data.id ? RESOURCE_ACTION_EDIT : RESOURCE_ACTION_CREATE;
    }

    editingForm.validateFields().then((values) => {
      let dataToSend = { ...data, ...values };

      if (onSubmit) {
        dataToSend = onSubmit(dataToSend);
        if (!dataToSend) {
          return;
        }
      }

      if (submit) {
        submit(values, action);
      } else {
        if (action === RESOURCE_ACTION_EDIT) {
          update(data.id, dataToSend);
        } else {
          post(dataToSend);
        }
      }
    });
  };

  return (
    <DrawerContainer
      size={size}
      resource={resource}
      onOkClick={handleSubmit}
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
