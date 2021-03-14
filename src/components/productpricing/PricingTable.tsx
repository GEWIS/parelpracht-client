import React from 'react';
import {
  Button, Table, TextArea, Form,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Client, Partial_PricingParams, ProductPricing } from '../../clients/server.generated';
import PricingRow from './PricingRow';
import PropsButtons from '../PropsButtons';
import { SingleEntities } from '../../stores/single/single';
import ResourceStatus from '../../stores/resourceStatus';
import { fetchSingle } from '../../stores/single/actionCreators';
import { RootState } from '../../stores/store';

interface Props {
  pricing: ProductPricing;
  productId: number;

  fetchProduct: (id: number) => void;
}

interface State {
  pricingData: string[][];
  description: string;

  editing: boolean;
  status: ResourceStatus;
}

class PricingTable extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      pricingData: JSON.parse(props.pricing.data),
      description: props.pricing.description,
      editing: false,
      status: ResourceStatus.FETCHED,
    };
  }

  updateField = (row: number, index: number, value: string) => {
    const { pricingData } = this.state;
    pricingData[row][index] = value;
    this.setState({ pricingData });
  };

  addColumn = () => {
    const { pricingData } = this.state;
    for (let i = 0; i < pricingData.length; i++) {
      pricingData[i].push('');
    }
    this.setState({ pricingData });
  };

  removeColumn = (index: number) => {
    const { pricingData } = this.state;
    for (let i = 0; i < pricingData.length; i++) {
      pricingData[i].splice(index, 1);
    }
    this.setState({ pricingData });
  };

  addRow = () => {
    const { pricingData } = this.state;
    if (pricingData.length === 0) {
      this.setState({ pricingData: [['']] });
    }
    const newArray = [];
    for (let i = 0; i < pricingData[0].length; i++) {
      newArray.push('');
    }
    pricingData.push(newArray);
    this.setState({ pricingData });
  };

  removeRow = (index: number) => {
    const { pricingData } = this.state;
    pricingData.splice(index, 1);
    this.setState({ pricingData });
  };

  edit = () => {
    this.setState({ editing: true });
  };

  save = async () => {
    const { productId, fetchProduct } = this.props;
    const { description, pricingData } = this.state;
    const client = new Client();
    await client.updatePricing(productId, {
      description,
      data: JSON.stringify(pricingData),
    } as Partial_PricingParams);
    fetchProduct(productId);
    this.setState({ editing: false });
  };

  cancel = () => {
    this.setState({ editing: false });
  };

  render() {
    const { pricing } = this.props;
    const {
      pricingData, editing, status, description,
    } = this.state;

    return (
      <>
        <h3>
          Pricing information
          {editing ? (
            <>
              <Button
                primary
                floated="right"
                onClick={this.addRow}
                style={{ marginBottom: '1em' }}
              >
                Add row
              </Button>
              <Button primary floated="right" onClick={this.addColumn}>Add column</Button>
            </>
          ) : null}
          <PropsButtons
            editing={editing}
            canDelete={undefined}
            canSave
            entity={SingleEntities.Product}
            status={status}
            cancel={this.cancel}
            edit={this.edit}
            save={this.save}
            remove={() => {}}
          />
        </h3>
        {editing ? (
          <Form>
            <TextArea
              value={description}
              onChange={(e) => this.setState({ description: e.target.value })}
            />
          </Form>
        ) : <p>{description}</p>}
        <Table compact>
          <Table.Header>
            {pricingData.length > 0 ? (
              <PricingRow
                key="0"
                pricing={pricingData[0]}
                header
                editing={editing}
                row={0}
                updateField={this.updateField}
                removeRow={this.removeRow}
              />
            ) : null}
          </Table.Header>
          <Table.Body>
            {pricingData.map((p, i) => {
              if (i === 0) return null;
              return (
                <PricingRow
                  key={i.toString()}
                  pricing={p}
                  header={false}
                  editing={editing}
                  row={i}
                  updateField={this.updateField}
                  removeRow={this.removeRow}
                />
              );
            })}
          </Table.Body>
          {editing && pricingData.length > 0 ? (
            <Table.Footer>
              <Table.Row>
                {pricingData[0].map((p, i) => (
                  <Table.HeaderCell style={{ textAlign: 'center' }}>
                    <Button
                      negative
                      onClick={() => this.removeColumn(i)}
                      icon="trash"
                      size="tiny"
                    />
                  </Table.HeaderCell>
                ))}
                <Table.HeaderCell />
              </Table.Row>
            </Table.Footer>
          ) : null}
        </Table>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchProduct: (id: number) => dispatch(fetchSingle(SingleEntities.Product, id)),
});

export default connect(null, mapDispatchToProps)(PricingTable);
