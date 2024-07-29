import { Button, Spin } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { useCrud } from '../hooks';
import { generateUUID } from '../util';
import { normalizeToSelect } from '../util/converters';
import RemoteSelect from './RemoteSelect';
import ResourceEdit from './ResourceEdit';
import { isEmpty } from '../util';
import { RESOURCE_ACTION_EDIT } from '../store/actions/resourceActionTypes';

const RemoteSelectCrud = ({
  editComponent: EditComponent,
  resource,
  textPropName,
  initialValues,
  resourceTitle,
  enableEdit = true,
  addEnabled = true,
  onChange,
  value,
  onCreateOrUpdate,
  other,
  ...rest
}) => {
  const {
    create,
    get,
    data: { editing, action, componentKey: stateComponentKey }
  } = useCrud({ resource });

  const [componentKey] = useState(generateUUID());
  const ref = useRef(null);
  const [text, setText] = useState(null);
  const [allowShow, setAllowShow] = useState(true);

  const prepareInitialValues = (text) => {
    initialValues = initialValues ?? {};

    if (textPropName) {
      initialValues = { ...initialValues, [textPropName]: text };
    }

    return initialValues;
  };

  const handleAddClick = () => {
    ref.current.focus();
    ref.current.blur();
    setText(null);
    handleChange({});
    setTimeout(() => {
      create(prepareInitialValues(text), { componentKey });
    }, 500);
  };

  const handleEditClick = () => {
    const { key } = value;
    get(key, { componentKey });
  };

  const notFoundRender = () => {
    return (
      addEnabled &&
      allowShow && (
        <Button
          className="gx-remote-select-crud-add-button"
          onClick={handleAddClick}
        >
          + Adicionar{text ? ` (${text}...)` : ''}
        </Button>
      )
    );
  };

  const customDropdownRender = ({ menu, fetching }) => {
    return (
      <>
        {menu}
        {fetching ? (
          <div className="gx-remote-select-spin">
            <Spin size="default" />
          </div>
        ) : (
          notFoundRender()
        )}
      </>
    );
  };
  const handleChange = (item) => {
    onChange?.(item);
  };

  const handleCreateOrUpdateSuccess = ({ data: result }) => {
    ref.current.reset();
    handleChange(normalizeToSelect(result.result));
    onCreateOrUpdate?.(result.result);
  };

  const handleSearch = (text) => {
    setAllowShow(false);
    setText(text);
  };

  const handleFetched = () => {
    setAllowShow(true);
  };

  const handleDropdownVisibleChange = (visible) => {
    if (!visible) {
      setText(null);
    }
  };

  const EditComponentWrap = useMemo(
    () =>
      ResourceEdit.create(EditComponent, {
        resource,
        title: `${action !== RESOURCE_ACTION_EDIT ? 'Novo ' : 'Editar '} ${
          resourceTitle ? resourceTitle?.toLowerCase() : ''
        }`,
        onCreateOrUpdateSuccess: handleCreateOrUpdateSuccess
      }),
    [stateComponentKey]
  );

  return (
    <span
      className={`gx-remote-select-crud ant-input-affix-wrapper${
        !isEmpty(value) ? ' selected' : ''
      }`}
    >
      <RemoteSelect
        resource={resource}
        onSearch={handleSearch}
        onChange={handleChange}
        onDropdownVisibleChange={handleDropdownVisibleChange}
        customDropdownRender={customDropdownRender}
        onFetched={handleFetched}
        ref={ref}
        value={value}
        {...rest}
      />
      {enableEdit && !isEmpty(value) && (
        <Button className onClick={handleEditClick} icon={<EditOutlined />} />
      )}
      {editing && stateComponentKey === componentKey && <EditComponentWrap />}
    </span>
  );
};

export default RemoteSelectCrud;
