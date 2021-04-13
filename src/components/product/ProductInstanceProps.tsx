import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Label } from 'semantic-ui-react';
import {
  ActivityType,
  Contract,
  ContractStatus,
  ProductInstance,
  ProductInstanceParams,
  ProductSummary,
  Roles,
} from '../../clients/server.generated';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';
import { getSummary } from '../../stores/summaries/selectors';
import { SummaryCollections } from '../../stores/summaries/summaries';
import PropsButtons from '../PropsButtons';
import ProductSelector from './ProductSelector';
import { SingleEntities } from '../../stores/single/single';
import AuthorizationComponent from '../AuthorizationComponent';
import { getLastStatus } from '../../helpers/activity';

interface Props {
  create?: boolean;
  onCancel?: () => void;

  contract: Contract;
  productInstance: ProductInstance;
  status: ResourceStatus;

  saveProductInstance: (productInstance: ProductInstanceParams) => void;
  createProductInstance: (productInstance: ProductInstanceParams) => void;
  removeProductInstance: () => void;
  getBasePrice: (id: number) => number;
}

interface State {
  editing: boolean;

  productId: number;
  basePrice: string;
  discount: string;
  details?: string;
}

class ProductInstanceProps extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      editing: props.create ?? false,
      ...this.extractState(props),
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.status === ResourceStatus.SAVING
      && this.props.status === ResourceStatus.FETCHED) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ editing: false });
    }
  }

  extractState = (props: Props) => {
    const { productInstance } = props;
    return {
      productId: productInstance.productId,
      basePrice: (productInstance.basePrice / 100).toString(),
      discount: (productInstance.discount / 100).toString(),
      details: productInstance.details,
    };
  };

  toParams = (): ProductInstanceParams => {
    return new ProductInstanceParams({
      productId: this.state.productId,
      basePrice: Math.round(parseFloat(this.state.basePrice.replace(',', '.')) * 100),
      discount: Math.round(parseFloat(this.state.discount.replace(',', '.')) * 100),
      details: this.state.details,
    });
  };

  edit = () => {
    this.setState({ editing: true, ...this.extractState(this.props) });
  };

  cancel = () => {
    if (!this.props.create) {
      this.setState({ editing: false, ...this.extractState(this.props) });
    } else if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  save = () => {
    if (this.props.create) {
      this.props.createProductInstance(this.toParams());
    } else {
      this.props.saveProductInstance(this.toParams());
    }
  };

  remove = () => {
    if (!this.props.create && this.props.removeProductInstance) {
      this.props.removeProductInstance();
    }
  };

  propsHaveErrors = (): boolean => {
    const { productId, basePrice, discount } = this.state;
    return (
      productId < 0
      || Number.isNaN(Math.round(parseFloat(basePrice.replace(',', '.')) * 100))
      || Number.isNaN(Math.round(parseFloat(discount.replace(',', '.')) * 100))
    );
  };

  deleteButtonActive = () => {
    if (this.props.create) {
      return undefined;
    }
    return !(this.props.contract.activities
      .filter((a) => a.type === ActivityType.STATUS).length > 1
      || this.props.productInstance.activities
        .filter((a) => a.type === ActivityType.STATUS).length > 1
      || this.props.productInstance.invoiceId === undefined);
  };

  EditButtonActive = () => {
    if (this.props.create) {
      return undefined;
    }
    const status = getLastStatus(this.props.contract.activities
      .filter((a) => a.type === ActivityType.STATUS));
    return !(status!.subType === ContractStatus.CONFIRMED
       || status!.subType === ContractStatus.FINISHED
        || status!.subType === ContractStatus.CANCELLED);
  };

  render() {
    const {
      editing,
      basePrice,
      discount,
      details,
      productId,
    } = this.state;
    const { productInstance } = this.props;

    return (
      <>
        <h2>
          {this.props.create ? 'New Product Instance' : 'Details'}

          <AuthorizationComponent roles={[Roles.ADMIN, Roles.GENERAL]} notFound={false}>
            <PropsButtons
              editing={editing}
              canEdit={this.EditButtonActive()}
              canDelete={this.deleteButtonActive()}
              canSave={!this.propsHaveErrors()}
              entity={SingleEntities.Product}
              status={this.props.status}
              cancel={this.cancel}
              edit={this.edit}
              save={this.save}
              remove={this.remove}
            />
          </AuthorizationComponent>
        </h2>

        <Form style={{ marginTop: '2em' }}>
          <Form.Group widths="equal">
            <Form.Field
              disabled={!editing || productInstance.id >= 0}
            >
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-product-dropdown">Product</label>
              <ProductSelector
                id="form-product-dropdown"
                value={productId}
                onChange={(id: string) => {
                  if (id === '') {
                    this.setState({
                      productId: -1,
                      basePrice: '0',
                    });
                  } else {
                    this.setState({
                      productId: parseInt(id, 10),
                      basePrice: (this.props.getBasePrice(parseInt(id, 10)) / 100).toString(),
                    });
                  }
                }}
                clearable
                fluid
              />
            </Form.Field>
            <Form.Field disabled={!editing}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-details">
                Details
              </label>
              <Input
                id="form-input-details"
                value={details}
                onChange={
                  (e) => this.setState({ details: e.target.value })
                }
                placeholder="Details"
                fluid
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              disabled={!editing}
              error={Number.isNaN(Math.round(parseFloat(this.state.basePrice.replace(',', '.')) * 100))}
              value={parseFloat(basePrice.replace(',', '.')).toFixed(2)}
            >
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-base-price">
                Base Price
              </label>
              <Input
                labelPosition="left"
                id="form-input-base-price"
                value={basePrice}
                onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                  basePrice: e.target.value,
                })}
                fluid
              >
                <Label basic>€</Label>
                <input />
              </Input>
            </Form.Field>
            <Form.Field
              disabled={!editing}
              error={Number.isNaN(Math.round(parseFloat(this.state.discount.replace(',', '.')) * 100))}
            >
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-discount">
                Discount
              </label>
              <Input
                labelPosition="left"
                id="form-input-discount"
                value={discount}
                onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                  discount: e.target.value,
                })}
                fluid
              >
                <Label basic>€</Label>
                <input />
              </Input>
            </Form.Field>
            <Form.Field
              disabled={!editing}
            >
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-real-price">
                Real price
              </label>
              <Input
                labelPosition="left"
                id="form-input-real-price"
                value={(parseFloat(basePrice.replace(',', '.')) - parseFloat(discount.replace(',', '.'))).toFixed(2)}
                fluid
              >
                <Label basic>€</Label>
                <input />
              </Input>
            </Form.Field>
          </Form.Group>
        </Form>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  options: state.summaries.Products.options,
  getBasePrice: (id: number) => getSummary<ProductSummary>(state,
    SummaryCollections.Products, id).targetPrice,
});

export default connect(mapStateToProps)(ProductInstanceProps);
