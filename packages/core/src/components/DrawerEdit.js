import React from 'react';
import { Form } from 'antd';
import { useCrud } from '../hooks';
import DrawerContainer from './DrawerContainer';
import ResourceErrorAlert from './ResourceErrorAlert';
import { RESOURCE_ACTION_EDIT } from '../store/actions';

const DrawerEdit = ({ children, size = 'sm', width, resource, ...rest }) => {
  const {
    cancelEdit,
    post,
    update,
    data: { resourceToEdit: data, editing: visible, action },
    saving: loading = false,
    editing
  } = useCrud({ resource });

  const [editingForm] = Form.useForm();
  
  const save = () => {
    editingForm.validateFields().then((values) => {
      console.log({ ...data, ...values });
      if (action === RESOURCE_ACTION_EDIT) {
        update(data.id,{ ...data, ...values });
      } else {
        post(values);
      }
    });
  };

  return (
    <DrawerContainer
      width={width}
      size={size}
      resource={resource}
      onOkClick={save}
      onBackClick={cancelEdit}
      okButtonText="Salvar"
      backButtonText="Cancelar"
      visible={visible}
      {...rest}
    >
      <ResourceErrorAlert resource={resource} />
      {React.cloneElement(children, { form: editingForm, initialValues: data })}
    </DrawerContainer>
  );
};

export default DrawerEdit;
