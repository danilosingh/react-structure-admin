import React from 'react';
import { Button, Drawer } from 'antd';
import { useFormContext } from './forms/formContext';
import AuditedInfo from './AuditedInfo';

const DrawerForm = ({
  title,
  visible,
  readOnly = false,
  maskClosable = true,
  onOk,
  onCancel,
  okButtonName = 'Salvar',
  auditedInfo,
  children,
  saving,
  beforeSubmit,
  size,
  onAfterCreate,
  onSubmit,
  onAfterUpdate,
  footerLeftRender,
  className = '',
  ...rest
}) => {
  let { form } = rest;
  const { form: contextForm } = useFormContext();
  const width = size && (size.includes('%') || size.includes('px')) ? size : undefined;
  const sizeClass = size && !width ? size : null;

  if (!form) {
    form = contextForm;
  }

  const handleOnSubmit = function handleOnSubmit() {
    if (onSubmit) {
      onSubmit(form);
    } else {
      form.validateFields((err, values) => {
        if (err) {
          return;
        }

        form.resetFields();

        if (beforeSubmit) {
          const handledValues = beforeSubmit(values);
          if (handledValues) {
            values = handledValues;
          }
        }

        if (onOk) {
          if (values.id) {
            onOk(values, onAfterUpdate);
            return;
          }

          onOk(values, onAfterCreate);
        }
      });
    }
  };

  return (
    <Drawer
      width={width}
      className={`gx-drawer-form ${className} ${sizeClass}`}
      title={title}
      onClose={onCancel}
      visible={visible}
      maskClosable={maskClosable}
      bodyStyle={{ paddingBottom: 80 }}
    >
      {children}
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right'
        }}
      >
        {footerLeftRender ? (
          footerLeftRender()
        ) : (
          <AuditedInfo {...auditedInfo} />
        )}

        <div>
          {readOnly ? (
            <Button onClick={onCancel} style={{ marginRight: 8 }}>
              Voltar
            </Button>
          ) : (
            <>
              <Button onClick={onCancel} style={{ marginRight: 8 }}>
                Cancelar
              </Button>
              <Button onClick={handleOnSubmit} type="primary" loading={saving}>
                {okButtonName}
              </Button>
            </>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default DrawerForm;
