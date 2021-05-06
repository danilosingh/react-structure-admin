import { Button, Spin } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { EditOutlined } from '@ant-design/icons';

import { useCrud } from '../hooks';
import { normalizeToSelect } from '../util/converters';
import RemoteSelect from './RemoteSelect';
import ResourceEdit from './ResourceEdit';
import { isEmpty } from '../util';
import { RESOURCE_ACTION_EDIT } from '../store/actions/resourceActionTypes';

const RemoteSelectCrud = ({
  editComponent: EditComponent,
  resource,
  textPropName,
  onChange,
  resourceTitle,
  enableEdit = true,
  value,
  ...rest
}) => {
  const {
    create,
    get,
    data: { editing, action }
  } = useCrud({ resource });

  const ref = useRef(null);
  const [text, setText] = useState(null);
  const [allowShow, setAllowShow] = useState(true);
  const [showButtonEdit, setShowButtonEdit] = useState(
    enableEdit && !isEmpty(value)
  );
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAddClick = () => {
    ref.current.focus();
    ref.current.blur();
    setText(null);
    handleChange({});
    setTimeout(() => {
      create(textPropName ? { [textPropName]: text } : {});
    }, 500);
  };

  const handleEditClick = () => {
    const { key } = selectedItem;
    get(key);
  };

  const notFoundRender = () => {
    return (
      allowShow && (
        <Button style={{ marginLeft: '10px' }} onClick={handleAddClick}>
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
    setSelectedItem(item);
    setShowButtonEdit(!isEmpty(item));
  };

  const handleCreateOrUpdateSuccess = ({ data: result }) => {
    ref.current.reset();
    handleChange(normalizeToSelect(result.result));
  };

  const handleSearch = (value) => {
    setAllowShow(false);
    setText(value);
  };

  const handleFetched = () => {
    setAllowShow(true);
  };

  const handleDropdownVisibleChange = (visible) => {
    if (!visible) {
      setText(null);
    }
  };

  const EditComponentWrap = useMemo(() =>
    ResourceEdit.create(EditComponent, {
      resource,
      title: `${action !== RESOURCE_ACTION_EDIT ? 'Novo ' : 'Editar '} ${
        resourceTitle ? resourceTitle?.toLowerCase() : ''
      }`,
      onCreateOrUpdateSuccess: handleCreateOrUpdateSuccess
    })
  );

  return (
    <span
      className={`gx-remote-select-crud ant-input-affix-wrapper${
        !isEmpty(selectedItem) ? ' selected' : ''
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
      {showButtonEdit && selectedItem && (
        <Button className onClick={handleEditClick} icon={<EditOutlined />} />
      )}
      {editing && <EditComponentWrap />}
    </span>
  );
};

export default RemoteSelectCrud;
