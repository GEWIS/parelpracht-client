import { MouseEvent, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Button, Dropdown, DropdownItemProps, Modal } from 'semantic-ui-react';
import { RootState } from '../stores/store';
import { fetchTable, setFilterTable } from '../stores/tables/actionCreators';
import { getFilter, isFilterOn } from '../stores/tables/selectors';
import { Tables } from '../stores/tables/tables';
import { ListFilter } from '../stores/tables/tableState';

interface SelfProps {
  options: DropdownItemProps[];

  column: string;
  columnName: string;

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

function ColumnFilter({
  options,
  columnName,
  multiple = true,
  filter,
  filterOn,
  setFilter,
  clearFilter,
  refresh,
}: Props) {
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
      color={filterOn ? 'blue' : undefined}
      onClick={(e) => e.stopPropagation()}
    />
  );

  const close = () => {
    changeOpen(false);
    refresh();
  };

  return (
    <Modal
      open={open}
      onOpen={() => changeOpen(true)}
      onClose={close}
      trigger={trigger}
      size="tiny"
      onClick={(e: MouseEvent<HTMLButtonElement>) => e.stopPropagation()}
    >
      <Modal.Header>{`Filter: ${columnName}`}</Modal.Header>
      <Modal.Content>
        <Dropdown
          placeholder={`Select ${columnName}...`}
          selection
          multiple={multiple}
          search
          button
          clearable
          fluid
          value={multiple ? filter.values : filter.values[0]}
          onChange={(_, data) => {
            if (multiple) {
              setFilter(data.value as string[]);
            } else {
              setFilter([data.value as string]);
            }
          }}
          options={options}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={() => {
            clearFilter();
            close();
          }}
        >
          Clear
        </Button>
        <Button primary onClick={close}>
          Confirm
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

const mapStateToProps = (state: RootState, props: SelfProps) => ({
  filter: getFilter(state, props.table, props.column),
  filterOn: isFilterOn(state, props.table, props.column),
});

const mapDispatchToProps = (dispatch: Dispatch, props: SelfProps) => ({
  setFilter: (values: string[]) => dispatch(setFilterTable(props.table, { column: props.column, values })),
  clearFilter: () => dispatch(setFilterTable(props.table, { column: props.column, values: [] })),
  refresh: () => dispatch(fetchTable(props.table)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ColumnFilter);
