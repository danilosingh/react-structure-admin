import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
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
  updateFormOnDataChanged = true,
  onDataChanged,
  onValuesChange,
  showConfirmDataLoss = true,
  ...rest
}) => {
  const { form: editingForm } = useCrudEditContext();
  const [modified, setModified] = useState(false);

  useEffect(() => {
    var dataChanged = onBeforeBinding ? onBeforeBinding(data) : data;
    if (updateFormOnDataChanged) {
      editingForm.setFieldsValue(dataChanged);
    }
    if (onDataChanged) {
      onDataChanged(dataChanged);
    }
  }, [updateFormOnDataChanged, data]);

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

  const handleValuesChange = (changedValues, allValues) => {    
    onValuesChange?.(changedValues, allValues);
    setModified(true);
  };

  const handleBackClick = () => {
    if (showConfirmDataLoss && modified) {
      Modal.confirm({
        title: 'As modifições serão descartadas. Deseja sair sem salvar?',
        icon: <ExclamationCircleOutlined />,
        okText: 'Sair',
        cancelText: 'Cancelar',
        onOk() {
          cancelEdit();
        }
      });
    } else {
      cancelEdit();
    }
  };

  return (
    <DrawerContainer
      size={size}
      resource={resource}
      onOkClick={handleSubmit}
      onBackClick={handleBackClick}
      okButtonText="Salvar"
      backButtonText="Cancelar"
      visible={visible}
      {...rest}
    >
      <ResourceErrorAlert resource={resource} />
      {React.cloneElement(children, {
        form: editingForm,
        onValuesChange: handleValuesChange,
        initialValues: !updateFormOnDataChanged
          ? onBeforeBinding
            ? onBeforeBinding(data)
            : data
          : undefined,
        ...configManager.getConfig().layout.form
      })}
    </DrawerContainer>
  );
};

export default DrawerEdit;
