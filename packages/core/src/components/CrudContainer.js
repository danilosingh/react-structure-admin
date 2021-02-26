import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Card, Row, Col, Button, Popconfirm, Table, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';
import { RESOURCE_ACTION_CREATE } from '../store/actions';
import configManager from '../config/configManager';
import { CrudEditContextProvider } from './CrudEditContext';

const CrudEditWrapper = ({
  action,
  editComponent: EditComponent,
  createComponent: CreateComponent,
  ...rest
}) => {
  const [form] = Form.useForm();
  return (
    <CrudEditContextProvider form={form}>
      {action === RESOURCE_ACTION_CREATE && CreateComponent ? (
        <CreateComponent action={action} {...rest} />
      ) : (
        <EditComponent action={action} {...rest} />
      )}
    </CrudEditContextProvider>
  );
};

const CrudContainer = (props) => {
  const [delayedSearch, setDelayedSearch] = useState(null);
  const history = useHistory();

  const {
    data: {
      items: dataSource,
      resourceToEdit,
      action = RESOURCE_ACTION_CREATE,
      editing,
      saving
    },
    data,
    resource,
    fetch,
    unload,
    cancelEdit,
    post,
    update,
    setQueryParams,
    pagination,
    singularTitle,
    headerComponent: HeaderComponent,
    editComponent: EditComponent,
    createComponent: CreateComponent,
    actionsComponent: ActionsComponent,
    filtersComponent: FiltersComponent,
    searchComponent: SearchComponent,
    showActions = true,
    getCustomEditingTitle,
    newButtonText = 'Novo',
    searchPlaceholder,
    onSearch,
    children,
    basePath,
    showHeader = true
  } = props;

  const [searchForm] = Form.useForm();

  useEffect(() => {
    return () => unload();
  }, [unload, resource]);

  if (!data.loaded && !data.loading) {
    fetch();
  }

  const onSearchChange = () => {
    if (delayedSearch) {
      clearTimeout(delayedSearch);
    }

    searchForm.validateFields().then((values) => {
      if (onSearch) {
        setDelayedSearch(setTimeout(() => onSearch(values), 600));
        return;
      }

      setDelayedSearch(
        setTimeout(
          () =>
            setQueryParams({
              ...data.queryParams,
              page: 1,
              ...values
            }),
          600
        )
      );
    });
  };

  const isCreating = () => {
    return action === RESOURCE_ACTION_CREATE;
  };
  const getEditingTitle = () => {
    if (getCustomEditingTitle) {
      return getCustomEditingTitle(action, resourceToEdit);
    }
    let title = isCreating() ? 'Novo' : 'Editar';
    if (
      configManager.getConfig().layout.useSingularTitleOnEdit &&
      singularTitle
    ) {
      title += ' ' + singularTitle.toLowerCase();
    }
    return title;
  };

  const initCreation = (record = {}) => {
    const { create } = props;
    create(record);
  };

  const initEditing = (record) => {
    const { get } = props;

    if (EditComponent || CreateComponent) {
      get(record.id);
    } else {
      history.push(`${basePath}/${record.id}`);
    }
  };

  const removeRecord = (id) => {
    const { remove } = props;
    remove(id);
  };

  const editingRender = () => {
    if (!data.editing || (!CreateComponent && !EditComponent)) {
      return null;
    }

    const editingProps = {
      title: getEditingTitle(),
      resource,
      cancelEdit,
      post,
      update,
      visible: editing,
      saving,
      action,
      data: resourceToEdit,
      createComponent: CreateComponent,
      editComponent: EditComponent
    };
    
    return <CrudEditWrapper {...editingProps} />;
  };

  const handleTableChange = (tablePagination) => {
    const { paginationChanged } = props;
    paginationChanged(tablePagination.current);
  };

  const getColumns = () => {
    const { columns } = props;

    if (!columns) {
      return [];
    }

    const columnsAux = [...columns];

    if (showActions) {
      columnsAux.push({
        title: 'Ações',
        key: 'action',
        align: 'right',
        width: '150px',
        render: (text, record) => (
          <span key={record.id}>
            {ActionsComponent ? (
              <ActionsComponent
                record={record}
                initEditing={initEditing}
                removeRecord={removeRecord}
              />
            ) : (
              <>
                <Button size="small" onClick={() => initEditing(record)}>
                  Editar
                </Button>
                <Popconfirm
                  title="Deseja excluir?"
                  onConfirm={() => removeRecord(record.id)}
                  cancelText="Não"
                  okText="Sim"
                >
                  <Button type="danger" size="small">
                    Excluir
                  </Button>
                </Popconfirm>
              </>
            )}
          </span>
        )
      });
    }

    return columnsAux;
  };

  const { menu, title } = props;
  const loading = data ? data.loading : true;
  const columns = getColumns();

  return (
    <>
      {HeaderComponent ? (
        <HeaderComponent
          {...props}
          searchForm={searchForm}
          onSearchChange={onSearchChange}
          initCreation={initCreation}
          initEditing={initEditing}
          isCreate={isCreating}
        />
      ) : (
        <div className="gx-page-heading">
          <div className="gx-page-heading-title">
            {menu && menu.icon && (
              <span className="ant-avatar ant-avatar-square ant-avatar-icon">
                <FontAwesomeIcon className="icon" icon={menu.icon} />
              </span>
            )}
            {title}
          </div>
          <div className="gx-page-heading-subtile">
            {SearchComponent ? (
              <SearchComponent
                onSearchChange={onSearchChange}
                searchForm={searchForm}
              />
            ) : (
              <div className="gx-page-heading-search">
                <div className="gx-search-bar gx-lt-icon-search-bar-lg gx-module-search-bar gx-d-none gx-d-sm-block">
                  <div className="gx-form-group">
                    <Form form={searchForm}>
                      <Form.Item name="filterText">
                        <Input.Search
                          className="ant-input gx-border-0"
                          placeholder={searchPlaceholder ?? 'Pesquisar...'}
                          onChange={onSearchChange}
                        />
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              </div>
            )}
            <div className="gx-page-heading-toolbar">
              <Button type="primary" onClick={() => initCreation()}>
                <PlusOutlined />
                {newButtonText}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="gx-container-crud">
        <Row>
          <Col span={24}>
            <Card className="gx-card">
              {columns && columns.length > 0 ? (
                <Table
                  loading={loading}
                  rowKey={(record) => record.id}
                  dataSource={dataSource}
                  pagination={pagination}
                  onChange={handleTableChange}
                  columns={columns}
                  showHeader={showHeader}
                />
              ) : (
                React.cloneElement(children, {
                  dataSource,
                  loading,
                  saving,
                  handleTableChange,
                  initCreation,
                  initEditing,
                  removeRecord
                })
              )}
              {editingRender()}
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default CrudContainer;
