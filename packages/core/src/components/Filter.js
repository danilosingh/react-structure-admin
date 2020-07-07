import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { debounce } from 'lodash';

const Filter = ({
  form,
  setQueryParams,
  onBeforeSubmitFilters,
  filtersComponent,
  showFilter,
  queryParams = {}
}) => {
  const handleSubmit = debounce(() => {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const params = onBeforeSubmitFilters
        ? onBeforeSubmitFilters(values)
        : values;

      setQueryParams({ ...queryParams, ...params });
    });
  }, 500);

  const handleChange = () => {
    handleSubmit();
  };

  return showFilter ? (
    <div className="gx-filter-heading">
      <div className="gx-filter-heading-extra">
        {filtersComponent &&
          React.cloneElement(filtersComponent, {
            form,
            handleChange
          })}
      </div>
    </div>
  ) : null;
};

export default Form.create({ name: 'filter' })(Filter);
