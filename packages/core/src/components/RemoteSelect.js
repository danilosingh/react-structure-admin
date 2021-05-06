import React, { useEffect } from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { api } from '../api';
import { omit } from '../util';

const { Option } = Select;

const initialState = {
  data: [],
  value: [],
  textSearched: '',
  fetching: false,
  open: false,
  pagination: {
    hasNextPage: true,
    currentPage: 0
  }
};

class RemoteSelect extends React.Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.handleSearch = debounce(this.fetchData, 800);
    this.fethOnMount = props.fethOnMount;
    this.state = { ...initialState };
    this.remoteSelect = React.createRef();
  }

  componentDidMount() {
    if (this.fethOnMount) {
      this.fetchData();
    }
  }

  shouldComponentUpdate(nextProps) {
    const { params } = this.props;
    const { params: nextParams } = nextProps;

    if (
      params !== nextParams &&
      JSON.stringify(params) !== JSON.stringify(nextParams)
    ) {
      this.lastFetchId = 0;
      this.setState((prevState) => ({
        ...prevState,
        ...initialState
      }));
    }

    return true;
  }

  fetchData = (value) => {
    const { pagination } = this.state;
    const {
      resource,
      params = {},
      sorting,
      defaultSorting = true,
      autoFocus,
      tenant,
      onFetching,
      onFetched
    } = this.props;
    if (!pagination.hasNextPage) {
      return;
    }

    onFetching?.(value);

    this.setState({ fetching: true });
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    const queryParams = {
      filterText: value,
      page: pagination.currentPage + 1,
      sorting: sorting || (defaultSorting ? 'Name' : null),
      ...params
    };
    api.fetch(resource, queryParams, null, tenant).then((response = {}) => {
      const { data = { result: {} } } = response;
      if (fetchId !== this.lastFetchId) {
        return;
      }
      onFetched?.(data.result);
      const { totalCount = 0, items = [] } = data.result;
      const newItems = items.map((unit) => ({
        key: `${unit.id}`,
        label: unit.name ?? unit.title,
        item: unit
      }));
      this.setState((prevState) => ({
        ...prevState,
        data:
          queryParams.page === 1 ? newItems : [...prevState.data, ...newItems],
        fetching: false,
        open: this.lastFetchId === 1 ? autoFocus : prevState.open,
        textSearched: value,
        pagination: {
          hasNextPage:
            queryParams.page === 1
              ? newItems.length < totalCount
              : prevState.data.length + newItems.length < totalCount,
          currentPage: queryParams.page
        }
      }));
    });
  };

  filterObjectByKey = (value, key) => {
    return key === String(value.id);
  };

  getObject = (key) => {
    const { data } = this.state;
    const result = data.filter((c) => this.filterObjectByKey(c.item, key));
    if (result.length === 1) {
      return result[0];
    }
    return null;
  };

  onSelect = (object = {}) => {
    const { key } = object;
    const { onSelect } = this.props;
    if (!onSelect || !key) {
      return;
    }
    const objectSelected = this.getObject(key);
    onSelect(objectSelected.item);
  };

  handleOnSearch = (value) => {
    const { onSearch } = this.props;
    onSearch?.(value);
    this.setState({ pagination: { hasNextPage: true, currentPage: 0 } });
    if (this.state.open) {
      this.handleSearch(value);
    } else {
      this.lastFetchId = 0;
    }
  };

  handleClear = () => {
    this.handleOnSearch(null);
  };

  handleDropdownVisibleChange = (visible) => {
    const { onDropdownVisibleChange } = this.props;

    if (visible && this.lastFetchId === 0) {
      this.fetchData();
      return;
    }

    this.setState({ open: visible });
    onDropdownVisibleChange?.(visible);
  };

  handleScroll = (event) => {
    const { textSearched } = this.state;
    const { target } = event;
    if (
      Math.ceil(target.scrollTop + target.offsetHeight) >= target.scrollHeight
    ) {
      this.fetchData(textSearched);
    }
  };

  blur() {
    this.remoteSelect.current.blur();
  }

  focus() {
    this.remoteSelect.current.focus();
  }

  reset() {
    this.lastFetchId = 0;
    this.setState((prevState) => ({
      ...prevState,
      ...initialState
    }));
  }

  render() {
    const { fetching, data, open } = this.state;
    const {
      optionRender,
      placeholder,
      style,
      notFoundContent,
      customDropdownRender
    } = this.props;

    return (
      <>
        <Select
          {...omit(this.props, [
            'customDropdownRender',
            'notFoundContent',
            'onFetched',
            'onFetching',
            'fethOnMount'
          ])}
          showSearch
          labelInValue
          allowClear
          ref={this.remoteSelect}
          onClear={this.handleClear}
          open={open}
          onDropdownVisibleChange={this.handleDropdownVisibleChange}
          onPopupScroll={this.handleScroll}
          filterOption={false}
          notFoundContent={
            fetching ? null : notFoundContent && notFoundContent()
          }
          placeholder={placeholder}
          dropdownRender={(menu) =>
            customDropdownRender ? (
              customDropdownRender({ menu, fetching })
            ) : (
              <>
                {menu}
                {fetching && (
                  <div className="gx-remote-select-spin">
                    <Spin size="default" />
                  </div>
                )}
              </>
            )
          }
          onSearch={this.handleOnSearch}
          onSelect={(item) => this.onSelect(item)}
          onDeselect={() => this.onSelect(undefined)}
          style={style || { width: '100%' }}
        >
          {data.map((d) =>
            optionRender ? (
              optionRender(d)
            ) : (
              <Option key={d.key} value={d.key}>
                {d.label}
              </Option>
            )
          )}
        </Select>
      </>
    );
  }
}
RemoteSelect.defaultProps = { fethOnMount: true };
export default RemoteSelect;
