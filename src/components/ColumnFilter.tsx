import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Button, Dropdown, DropdownItemProps, Modal,
} from 'semantic-ui-react';
import { RootState } from '../stores/store';
import { fetchTable, setFilterTable } from '../stores/tables/actionCreators';
import { getFilter, isFilterOn } from '../stores/tables/selectors';
import { Tables } from '../stores/tables/tables';
import { ListFilter } from '../stores/tables/tableState';

interface SelfProps {
  options: DropdownItemProps[];
  // eslint-disable-next-line react/no-unused-prop-types
  column: string;
  columnName: string;
  // eslint-disable-next-line react/no-unused-prop-types
  table: Tables;
}

interface Props extends SelfProps {
  multiple?: boolean;

  filter: ListFilter;
  filterOn: boolean;

  setFilter: (values: string[]) => void;
  clearFilter: () => void;
  refresh: () => void;
}

function ColumnFilter(props: Props) {
  const [open, changeOpen] = useState(false);
  const trigger = (
    <Button
      icon="filter"
      className="filter"
      floated="right"
      style={{
        margin: '-8px -6px',
        float: 'right',
        padding: '11px',
      }}
      color={props.filterOn ? 'blue' : undefined}
      onClick={(e: any) => e.stopPropagation()}
    />
  );

  const close = () => {
    changeOpen(false);
    props.refresh();
  };

  return (
    <Modal
      open={open}
      onOpen={() => changeOpen(true)}
      onClose={close}
      trigger={trigger}
      size="tiny"
      onClick={(e: any) => e.stopPropagation()}
    >
      <Modal.Header>{`Filter: ${props.columnName}`}</Modal.Header>
      <Modal.Content>
        <Dropdown
          placeholder={`Select ${props.columnName}...`}
          selection
          multiple={props.multiple}
          search
          button
          clearable
          fluid
          value={props.multiple ? props.filter.values : props.filter.values[0]}
          onChange={(e, data) => {
            if (props.multiple) {
              props.setFilter(data.value as string[]);
            } else {
              props.setFilter([data.value as string]);
            }
          }}
          options={props.options}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => { props.clearFilter(); close(); }}>Clear</Button>
        <Button primary onClick={close}>Confirm</Button>
      </Modal.Actions>
    </Modal>
  );
}

const mapStateToProps = (state: RootState, props: SelfProps) => ({
  filter: getFilter(state, props.table, props.column),
  filterOn: isFilterOn(state, props.table, props.column),
});

const mapDispatchToProps = (dispatch: Dispatch, props: SelfProps) => ({
  setFilter: (values: string[]) => dispatch(setFilterTable(
    props.table,
    { column: props.column, values },
  )),
  clearFilter: () => dispatch(setFilterTable(
    props.table,
    { column: props.column, values: [] },
  )),
  refresh: () => dispatch(fetchTable(props.table)),
});

ColumnFilter.defaultProps = {
  multiple: true,
};

export default connect(mapStateToProps, mapDispatchToProps)(ColumnFilter);
