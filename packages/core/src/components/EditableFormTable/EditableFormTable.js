import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Table } from 'antd';
import update from 'immutability-helper';
import LinkButton from '../LinkButton';
import ConfirmButton from '../ConfirmButton';
import EditableContext from './EditableContext';
import EditableCell from './EditableCell';

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editingKey: null };

    const { columns, rowKey, editable, removable } = this.props;
    this.rowKey = rowKey;

    this.columns = [
      ...columns,
      {
        key: 'actionEditableTable',
        align: 'right',
        dataIndex: 'operation',
        render: (text, record) => {
          const editing = this.isEditing(record);
          return editing ? (
            <span>
              <EditableContext.Consumer>
                {(form) => (
                  <>
                    <LinkButton
                      iconName="save"
                      onClick={() => this.save(form, rowKey(record))}
                    />
                    <LinkButton
                      iconName="times"
                      onClick={() => this.cancel(rowKey(record))}
                    />
                  </>
                )}
              </EditableContext.Consumer>
            </span>
          ) : (
            <>
              {editable ? (
                <LinkButton
                  iconName="pencil-alt"
                  onClick={() => this.edit(record)}
                />
              ) : null}
              {removable ? (
                <ConfirmButton
                  iconName="trash-alt"
                  message="Deseja excluir?"
                  onConfirm={() => this.remove(rowKey(record))}
                />
              ) : null}
            </>
          );
        }
      }
    ];
  }

  isEditing = (record) => {
    const { editingKey } = this.state;
    return this.rowKey(record) === editingKey;
  };

  cancel = () => {
    const { onCancelEditing } = this.props;

    this.setState({ editingKey: null });
    if (onCancelEditing) {
      onCancelEditing();
    }
  };

  save(form, key) {
    const { dataSource, validateRow, onSaveRow } = this.props;
    form.validateFields((error, row) => {
      if (error) {
        return;
      }

      const index = dataSource.findIndex((item) => key === this.rowKey(item));

      const record = { ...dataSource[index], ...row };

      if (validateRow) {
        const customError = validateRow(record, dataSource);
        if (customError) {
          form.setFields(customError);
          return;
        }
      }

      this.setState({ editingKey: null });
      if (onSaveRow) {
        onSaveRow(
          update(dataSource, {
            $splice: [
              [index, 1],
              [index, 0, record]
            ]
          })
        );
      }
    });
  }

  remove(key) {
    const { dataSource, onChange, onRemove } = this.props;
    const index = dataSource.findIndex((item) => key === this.rowKey(item));

    if (onRemove) {
      onRemove(dataSource[index]);
    } else if (onChange) {
      onChange(
        update(dataSource, {
          $splice: [[index, 1]]
        })
      );
    }
  }

  edit(record) {
    const { onEditing } = this.props;

    if (onEditing) {
      onEditing(record);
      return;
    }

    this.setState({ editingKey: this.rowKey(record) });
  }

  render() {
    const { components: newComponents } = this.props;

    let components = {
      body: {
        cell: EditableCell
      }
    };

    if (newComponents) {
      components = {
        body: { ...components.body, ...newComponents.body }
      };
    }

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          customInput: col.customInput,
          inputType: col.inputType,
          dataIndex: col.dataIndex,
          title: col.title,
          required: col.required ?? false,
          editing: this.isEditing(record),
          rules: col.rules,
          autoFocus: col.autoFocus
        })
      };
    });

    const { form, className, dataSource, showHeader, onRow } = this.props;

    return (
      <EditableContext.Provider value={form}>
        <Table
          className={className}
          components={components}
          rowKey={this.rowKey}
          dataSource={dataSource}
          columns={columns}
          showHeader={showHeader}
          rowClassName="editable-row"
          pagination={false}
          onRow={onRow}
        />
      </EditableContext.Provider>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;
