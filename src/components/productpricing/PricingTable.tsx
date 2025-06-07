import { Component } from "react";
import {
  Button, Table, TextArea, Form,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Client, Partial_PricingParams_, ProductPricing } from '../../clients/server.generated';
import PropsButtons from '../PropsButtons';
import { SingleEntities } from '../../stores/single/single';
import ResourceStatus from '../../stores/resourceStatus';
import { fetchSingle } from '../../stores/single/actionCreators';
import PricingRow from './PricingRow';

interface Props extends WithTranslation {
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

class PricingTable extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      pricingData: props.pricing.data,
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
    } else {
      const newArray = [];
      for (let i = 0; i < pricingData[0].length; i++) {
        newArray.push('');
      }
      pricingData.push(newArray);
      this.setState({ pricingData });
    }
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
      data: pricingData,
    } as Partial_PricingParams_);
    fetchProduct(productId);
    this.setState({ editing: false });
  };

  cancel = () => {
    this.setState({ editing: false });
  };

  remove = async () => {
    const { productId, fetchProduct } = this.props;
    const client = new Client();
    await client.deletePricing(productId);
    fetchProduct(productId);
  };

  render() {
    const {
      pricingData, editing, status, description,
    } = this.state;
    const { t } = this.props;

    return (
      <>
        <h3>
          {t('entities.product.insights.header')}
          {editing ? (
            <>
              <Button
                primary
                floated="right"
                onClick={this.addRow}
                style={{ marginTop: '-0.5em' }}
              >
                {t('entities.product.insights.addRow')}
              </Button>
              <Button primary floated="right" onClick={this.addColumn} style={{ marginTop: '-0.5em' }}>{t('entities.product.insights.addColumn')}</Button>
            </>
          ) : null}
          <PropsButtons
            editing={editing}
            canEdit
            canDelete
            canSave
            entity={SingleEntities.Product}
            status={status}
            cancel={this.cancel}
            edit={this.edit}
            save={this.save}
            remove={this.remove}
            style={{ marginTop: '-0.5em' }}
          />
        </h3>
        {editing ? (
          <Form>
            <TextArea
              value={description}
              placeholder={t('entities.product.insights.addDescription')}
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
                  key={p.toString()}
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
                  <Table.HeaderCell key={p} style={{ textAlign: 'center' }}>
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

export default withTranslation()(connect(null, mapDispatchToProps)(PricingTable));
