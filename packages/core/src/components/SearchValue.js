import React, { useEffect, useState } from 'react';
import { Col, Input, Row, Table, Form } from 'antd';
import DrawerForm from './DrawerForm';
import { FormContextProvider, useFormContext } from './forms/formContext';
import { debounce } from 'lodash';
import { api } from '../api';
import configManager from '../config/configManager';

const SearchValue = ({
  allowClear = true,
  searchInputPlaceHolder,
  resource,
  fixedParams = {},
  sorting,
  defaultSorting = true,
  tenant,
  title,
  columns,
  value,
  onChange,
  drawerSize,
  searchForm: SearchForm,
  ...rest
}) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [lastFetchId, setLastFetchId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: configManager.pageSize,
    current: 1,
    showSizeChanger: false,
    showLessItems: true
  });
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();

  if (!columns) {
    columns = [
      {
        title: 'Cód',
        dataIndex: 'id',
        isKey: true
      },
      {
        title: 'Descrição',
        dataIndex: 'description'
      }
    ];
  }

  const idColumn = columns.find((c) => c.isKey) ?? columns[0];

  const onSearch = (value, event) => {
    if (event.currentTarget.classList.contains('anticon-search')) {
      setDrawerVisible(true);
    } else if (allowClear) {
      setValue(null);
    }
  };

  const setValue = (value) => {
    if (onChange) {
      onChange(value);
    }
  };

  const onCancel = () => {
    setDrawerVisible(false);
  };

  const onSelectValue = (row) => {
    let value = row;
    if (Array.isArray(idColumn.dataIndex)) {
      const { dataIndex: idFieldName = [] } = idColumn;
      for (let index = 0; index < idFieldName.length; index++) {
        const fieldName = idFieldName[index];
        value = value[fieldName];
      }
    } else {
      value = row[idColumn.dataIndex];
    }
    setValue(value);
    setDrawerVisible(false);
  };

  const fetchData = () => {
    form.validateFields().then((params) => {
      setLoading(true);
      setLastFetchId(lastFetchId + 1);

      const fetchId = lastFetchId;

      const queryParams = {
        page: pagination.current,
        sorting: sorting,
        ...params,
        ...fixedParams
      };

      api.fetch(resource, queryParams, null, tenant).then((response = {}) => {
        const { data = { result: {} } } = response;

        if (fetchId !== lastFetchId) {
          return;
        }
        const { totalCount = 0, items = [] } = data.result;

        setLoading(false);
        setDataSource(items);
        setPagination({ ...pagination, total: totalCount });
      });
    });
  };

  const handleSubmit = debounce(() => {
    fetchData();
  }, 600);

  const handleSearchFormChange = (e) => {
    form.setFieldsValue({ [e.target.id]: e.target.value });
    handleSubmit();
  };

  const handleTableChange = (tablePagination) => {
    setPagination({ ...pagination, current: tablePagination.current });
  };

  const searchEffect = useEffect(() => {
    if (!drawerVisible) {
      return;
    }
    fetchData();
  }, [drawerVisible, pagination.current]);

  return (
    <>
      <Input.Search
        onSearch={onSearch}
        allowClear={allowClear}
        value={value}
        onChange={onChange}
        {...rest}
      />
      <FormContextProvider>
        <DrawerForm
          size={drawerSize}
          readOnly={true}
          visible={drawerVisible}
          onCancel={onCancel}
          title={title ?? resource}
        >
          <Form form={form}>
            {SearchForm ? (
              <SearchForm onChange={handleSearchFormChange} />
            ) : (
              <Form.Item name="filterText">
                <Input.Search
                  onChange={handleSearchFormChange}
                  placeholder={searchInputPlaceHolder ?? 'Pesquisar...'}
                />
              </Form.Item>
            )}
          </Form>
          <Table
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  onSelectValue(record);
                }
              };
            }}
            rowClassName={"gx-pointer"}
            pagination={pagination}
            onChange={handleTableChange}
            loading={loading}
            rowKey={(record) => record.id}
            dataSource={dataSource}
            columns={columns}
          />
        </DrawerForm>
      </FormContextProvider>
    </>
  );
};

export default SearchValue;
