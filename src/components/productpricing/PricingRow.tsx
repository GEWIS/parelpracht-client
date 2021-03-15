import * as React from 'react';
import { Button, Input, Table } from 'semantic-ui-react';

interface Props {
  pricing: string[];
  header: boolean;
  editing: boolean;
  row: number;

  updateField: (row: number, index: number, value: string) => void;
  removeRow: (index: number) => void;
}

interface State {
  fields: string[]
}

class PricingRow extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fields: props.pricing,
    };
  }

  render() {
    const {
      pricing, header, editing, row, updateField, removeRow,
    } = this.props;
    const { fields } = this.state;

    if (!editing) {
      return (
        <Table.Row>
          {pricing.map((p, i) => (header
            ? <Table.HeaderCell key={i.toString()}>{p}</Table.HeaderCell>
            : <Table.Cell key={i.toString()}>{p}</Table.Cell>))}
        </Table.Row>
      );
    }

    return (
      <Table.Row>
        {pricing.map((p, i) => {
          if (header) {
            return (
              <Table.HeaderCell key={i.toString()}>
                <Input
                  fluid
                  onChange={(e) => updateField(row, i, e.target.value)}
                  value={p}
                />
              </Table.HeaderCell>
            );
          }
          return (
            <Table.Cell key={i.toString()}>
              <Input
                fluid
                onChange={(e) => updateField(row, i, e.target.value)}
                value={p}
              />
            </Table.Cell>
          );
        })}
        {editing ? (
          <Table.HeaderCell collapsing>
            <Button
              negative
              onClick={() => removeRow(row)}
              icon="trash"
              size="tiny"
            />
          </Table.HeaderCell>
        ) : null}
      </Table.Row>
    );
  }
}

export default PricingRow;
