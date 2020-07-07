import React from 'react';
import { Table } from 'antd';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import BodyRow from './BodyRow';
import EditableFormTable from '../EditableFormTable/EditableFormTable';

let dragingIndex = -1;

const rowSource = {
  beginDrag: (props) => {
    dragingIndex = props.index;
    return {
      index: props.index
    };
  },

  canDrag: (props) => {
    return props.dragable == null || props.dragable === 'true';
  }
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;

    const hoverIndex = props.index;
    if (dragIndex === hoverIndex) {
      return;
    }

    props.moveRow(dragIndex, hoverIndex);

    monitor.getItem().index = hoverIndex;
  }
};

const BodyRowDrag = (props) => {
  return React.cloneElement(<BodyRow {...props} dragingIndex={dragingIndex} />);
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))(
  DragSource('row', rowSource, (connect) => ({
    connectDragSource: connect.dragSource()
  }))(BodyRowDrag)
);

const DragableBodyRowDisabledDrag = (props) => {
  return <DragableBodyRow {...props} dragable="false" />;
};

export default class DragSortingTable extends React.Component {
  constructor(props) {
    super(props);

    const { move = true } = props;
    this.state = {
      editing: false,
      components: {
        body: {
          row: move ? DragableBodyRow : DragableBodyRowDisabledDrag
        }
      }
    };
  }

  onEditing(record) {
    const { onChangeEdit } = this.props;
    if (onChangeEdit) {
      onChangeEdit(record);
      return;
    }

    this.setState((prevState) => ({
      ...prevState,
      editing: true,
      components: {
        body: {
          row: DragableBodyRowDisabledDrag
        }
      }
    }));
  }

  onSaveRow(record) {
    const { onSaveRow } = this.props;
    if (onSaveRow) {
      onSaveRow(record);
    }

    this.onCancelEditing();
  }

  onCancelEditing() {
    this.setState((prevState) => ({
      ...prevState,
      editing: false,
      components: {
        body: {
          row: DragableBodyRow
        }
      }
    }));
  }

  moveRow = (dragIndex, hoverIndex) => {
    const { dataSource, onChangeSort } = this.props;
    const dragRow = dataSource[dragIndex];
    const data = update(dataSource, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRow]
      ]
    });

    if (onChangeSort) {
      onChangeSort(data);
    }
  };

  handleDoubleClick = (record) => {
    const { onDoubleClick } = this.props;
    if (onDoubleClick) {
      onDoubleClick(record);
    }
  };

  handleRemove = (record) => {
    const { onRemove } = this.props;
    if (onRemove) {
      onRemove(record);
    }
  };

  render() {
    const {
      rowKey,
      columns,
      showHeader = true,
      dataSource,
      validateRow,
      editable = false,
      removable = false,
      move = true,
      onChangeSort,
      onRemove
    } = this.props;
    const { editing, components } = this.state;
    return (
      <DndProvider backend={HTML5Backend}>
        {editable || removable ? (
          <EditableFormTable
            className="gx-table-drag-sorting"
            rowKey={rowKey}
            columns={columns}
            removable={removable}
            editable={editable}
            showHeader={showHeader}
            dataSource={dataSource}
            onRemove={onRemove ? this.handleRemove : undefined}
            onSaveRow={(record) => this.onSaveRow(record)}
            onCancelEditing={() => this.onCancelEditing()}
            onEditing={(record) => this.onEditing(record)}
            isEditing={editing}
            onChange={onChangeSort}
            components={components}
            validateRow={validateRow}
            onRow={(record, index) => ({
              index,
              moveRow: this.moveRow,
              move,
              onDoubleClick: () => this.handleDoubleClick(record)
            })}
          />
        ) : (
          <Table
            className="gx-table-drag-sorting"
            rowKey={rowKey}
            showHeader={showHeader}
            columns={columns}
            dataSource={dataSource}
            components={components}
            pagination={false}
            onRow={(record, index) => ({
              index,
              moveRow: this.moveRow,
              move,
              onDoubleClick: () => this.handleDoubleClick(record)
            })}
          />
        )}
      </DndProvider>
    );
  }
}
