import React from 'react';
import { Button, Drawer } from 'antd';

const DrawerContainer = ({
  title,
  visible,
  children,
  readOnly = false,
  maskClosable = true,
  onOkClick,
  onBackClick,
  okButtonText = 'Confirmar',
  backButtonText = 'Voltar',
  loading,
  className = '',
  toolbarComponent: ToolbarComponent,
  size,
  ...rest
}) => {
  const width =
    size && (size.includes('%') || size.includes('px')) ? size : undefined;
  const sizeClass = size && !width ? size : null;

  return (
    <Drawer
      width={width}
      className={`gx-drawer-form ${className} ${sizeClass}`}
      title={title}
      onClose={onBackClick}
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
        {ToolbarComponent ? (
          <ToolbarComponent
            {...rest}
            onOkClick={onOkClick}
            okButtonText={okButtonText}
            onBackClick={onBackClick}
            backButtonText={backButtonText}
            loading={loading}
          />
        ) : (
          <div>
            {readOnly ? (
              <Button onClick={onBackClick} style={{ marginRight: 8 }}>
                {backButtonText}
              </Button>
            ) : (
              <>
                <Button onClick={onBackClick} style={{ marginRight: 8 }}>
                  {backButtonText}
                </Button>
                <Button onClick={onOkClick} type="primary" loading={loading}>
                  {okButtonText}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default DrawerContainer;
