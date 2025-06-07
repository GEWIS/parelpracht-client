import { Component } from "react";
import { withTranslation, WithTranslation } from 'react-i18next';
import { Button, Input, Table } from 'semantic-ui-react';

interface Props extends WithTranslation {
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

class PricingRow extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {

      fields: props.pricing,
    };
  }

  render() {
    const {
      pricing, header, editing, row, updateField, removeRow, t,
    } = this.props;

    if (!editing) {
      return (
        <Table.Row>
          {pricing.map((p) => (header
            ? <Table.HeaderCell key={p}>{p}</Table.HeaderCell>
            : <Table.Cell key={p}>{p}</Table.Cell>))}
        </Table.Row>
      );
    }

    return (
      <Table.Row>
        {pricing.map((p, i) => {
          if (header) {
            return (
              <Table.HeaderCell key={p}>
                <Input
                  fluid
                  onChange={(e) => updateField(row, i, e.target.value)}
                  value={p}
                  placeholder={t('entities.product.insights.placeholderHeader')}
                />
              </Table.HeaderCell>
            );
          }
          return (
            <Table.Cell key={p}>
              <Input
                fluid
                onChange={(e) => updateField(row, i, e.target.value)}
                value={p}
                placeholder={t('entities.product.insights.placeholderValue')}
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

export default withTranslation()(PricingRow);
