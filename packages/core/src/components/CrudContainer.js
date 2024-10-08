import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Card, Row, Col, Button, Popconfirm, Table, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { RESOURCE_ACTION_CREATE } from '../store/actions';
import configManager from '../config/configManager';
import { CrudEditContextProvider } from './CrudEditContext';
import Pagination from './Pagination';

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
      saving,
      readOnly
    },
    data,
    resource,
    fetch,
    unload,
    cancelEdit,
    post,
    update,
    queryParams,
    setQueryParams,
    pagination,
    singularTitle,
    showActions = true,
    getCustomEditingTitle,
    newButtonText = 'Novo',
    searchPlaceholder,
    onSearch,
    children,
    basePath,
    showHeader = true,
    table = {},
    tableSize,
    headerComponent: HeaderComponent,
    editComponent: EditComponent,
    createComponent: CreateComponent,
    actionsComponent: ActionsComponent,
    searchComponent: SearchComponent
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
      readOnly,
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

  const handlePageChange = (isPrev = false) => {
    const { paginationChanged } = props;

    if (isPrev) {
      paginationChanged(pagination.current - 1);
      return;
    }

    paginationChanged(pagination.current + 1);
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
        render: (text, record) =>
          ActionsComponent ? (
            <ActionsComponent
              record={record}
              initEditing={initEditing}
              removeRecord={removeRecord}
            />
          ) : (
            <span key={record.id}>
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
            </span>
          )
      });
    }

    return columnsAux;
  };

  const { menu, title, showDocumentTitle = true } = props;
  const loading = data ? data.loading : true;
  const columns = getColumns();
  const { size: defaultTableSize } =
    configManager.getConfig().layout.list.table;

  return (
    <>
      {showDocumentTitle && (
        <Helmet>
          <title>{title}</title>
        </Helmet>
      )}
      {HeaderComponent ? (
        <HeaderComponent
          {...props}
          searchForm={searchForm}
          onSearchChange={onSearchChange}
          initCreation={initCreation}
          initEditing={initEditing}
          isCreate={isCreating}
          queryParams={queryParams}
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
                <>
                  <Table
                    {...configManager.getConfig().layout.list.table}
                    {...table}
                    loading={loading}
                    rowKey={(record) => record.id}
                    dataSource={dataSource}
                    pagination={pagination.total == null ? false : pagination}
                    onChange={handleTableChange}
                    columns={columns}
                    showHeader={showHeader}
                    size={tableSize ?? defaultTableSize}
                  />
                  {pagination.total == null && (
                    <Pagination
                      onClickPrev={() => handlePageChange(true)}
                      onClickNext={() => handlePageChange()}
                      pagination={pagination}
                    />
                  )}
                </>
              ) : (
                React.cloneElement(children, {
                  dataSource,
                  loading,
                  saving,
                  pagination,
                  handleTableChange,
                  initCreation,
                  initEditing,
                  removeRecord,
                  readOnly
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
