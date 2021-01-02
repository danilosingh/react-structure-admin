import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Card, Row, Col, Button, Popconfirm, Table } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';
import LinkButton from './LinkButton';
import Filter from './Filter';
import { FormContextProvider, FormContextConsumer } from './forms/formContext';

const ACTION_CREATE = 'ACTION_CREATE';
const ACTION_EDIT = 'ACTION_EDIT';

const InternalCrud = (props) => {
  const [currentAction, setCurrentAction] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [delayedSearch, setDelayedSearch] = useState(null);
  const history = useHistory();

  const {
    data: { items: dataSource, resourceToEdit },
    data,
    pagination,
    headerComponent: HeaderComponent,
    editComponent: EditComponent,
    createComponent: CreateComponent,
    actionsComponent: ActionsComponent,
    filtersComponent: FiltersComponent,
    searchComponent: SearchComponent,
    searchPlaceHolder,
    fetch,
    onBeforeSubmitFilters,
    setQueryParams,
    setCurrent,
    onSearch,
    resource,
    unload,
    children,
    basePath,
    showHeader = true
  } = props;

  useEffect(() => {
    return () => unload();
  }, [unload, resource]);

  if (!data.loaded && !data.loading) {
    fetch();
  }

  const onSearchChange = (e) => {
    if (delayedSearch) {
      clearTimeout(delayedSearch);
    }

    const input = e.target;

    if (onSearch && e.target) {
      setDelayedSearch(setTimeout(() => onSearch(input.value), 600));
      return;
    }

    setDelayedSearch(
      setTimeout(
        () =>
          setQueryParams({
            ...data.queryParams,
            page: 1,
            filterText: input.value
          }),
        600
      )
    );
  };

  const openToCreate = (record = {}) => {
    const { create } = props;
    create(record);
    setCurrentAction(ACTION_CREATE);
  };

  const openToEdit = (record) => {
    const { get } = props;

    if (EditComponent || CreateComponent) {
      get(record.id);
      setCurrentAction(ACTION_EDIT);
    } else {
      history.push(`${basePath}/${record.id}`);
    }
  };

  const closeModal = () => {
    const { cancelEdit } = props;
    cancelEdit();
    setCurrentAction(null);
  };

  const createRecord = (record, onAfterCreate) => {
    const { post } = props;
    post(record, onAfterCreate);
  };

  const editRecord = (record) => {
    const { update } = props;
    update(record.id, record);
  };

  const closeModalAndSave = (newFormFields, onAfterCreate) => {
    if (currentAction === ACTION_EDIT) {
      editRecord({ ...resourceToEdit, ...newFormFields });
    } else {
      createRecord(newFormFields, onAfterCreate);
    }
  };

  const removeRecord = (id) => {
    const { remove } = props;
    remove(id);
  };

  const handleTableChange = (tablePagination) => {
    const { paginationChanged } = props;
    paginationChanged(tablePagination.current);
  };

  const getColumns = () => {
    const { columns } = props;

    if (!columns || !columns.dataColumns) {
      return [];
    }

    return [
      ...columns.dataColumns,
      {
        title: 'Ações',
        key: 'action',
        align: 'right',
        width: '150px',
        render: (text, record) => (
          <span key={record.id}>
            {ActionsComponent && <ActionsComponent record={record} />}
            {!ActionsComponent && (
              <>
                <Button size="small" onClick={() => openToEdit(record)}>
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
      }
    ];
  };

  const getModalTitle = () => {
    return currentAction === ACTION_CREATE ? 'Novo' : 'Editar';
  };

  const isCreate = () => {
    return currentAction === ACTION_CREATE;
  };

  const { menu, title } = props;
  const loading = data ? data.loading : true;
  const columns = getColumns();

  return (
    <>
      {HeaderComponent ? (
        <HeaderComponent
          {...props}
          onSearchChange={onSearchChange}
          openToCreate={openToCreate}
          openToEdit={openToEdit}
          isCreate={isCreate}
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
          {SearchComponent ? (
            <SearchComponent onSearchChange={onSearchChange} />
          ) : (
            <div className="gx-page-heading-search">
              <div className="gx-search-bar gx-lt-icon-search-bar-lg gx-module-search-bar gx-d-none gx-d-sm-block">
                <div className="gx-form-group">
                  <input
                    className="ant-input gx-border-0"
                    type="search"
                    placeholder={searchPlaceHolder ?? 'Pesquisar...'}
                    onChange={onSearchChange}
                  />
                  <span className="gx-search-icon gx-pointer">
                    <i className="icon icon-search" />
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="gx-page-heading-extra">
            {FiltersComponent ? (
              <div className="gx-page-heading-extra-filter">
                <LinkButton
                  iconName="filter"
                  iconColor={showFilter ? '#545454' : '#CCC'}
                  onClick={() => setShowFilter(!showFilter)}
                />
              </div>
            ) : null}

            <div className="gx-page-heading-extra-button">
              <Button type="primary" onClick={() => openToCreate()}>
                <PlusOutlined />
                Novo
              </Button>
            </div>
          </div>
          <Filter
            filtersComponent={FiltersComponent ? <FiltersComponent /> : null}
            setQueryParams={setQueryParams}
            queryParams={data.queryParams}
            showFilter={showFilter}
            onBeforeSubmitFilters={onBeforeSubmitFilters}
          />
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
                  handleTableChange,
                  openToCreate,
                  openToEdit,
                  removeRecord
                })
              )}

              {data.editing && (CreateComponent || EditComponent) && (
                <FormContextProvider>
                  <FormContextConsumer>
                    {(formContext) => {
                      const newProps = {
                        form: formContext.form,
                        data: resourceToEdit,
                        setCurrent: { setCurrent },
                        title: getModalTitle(),
                        visible: data.editing,
                        saving: data.saving,
                        cancelEdit: closeModal,
                        get: openToEdit,
                        handleOk: closeModalAndSave,
                        setQueryParams,
                        resource
                      };
                      return isCreate() && CreateComponent ? (
                        <CreateComponent {...newProps} />
                      ) : (
                        <EditComponent {...newProps} />
                      );
                    }}
                  </FormContextConsumer>
                </FormContextProvider>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default InternalCrud;
