import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Label } from 'semantic-ui-react';
import {
  ActivityType,
  Contract,
  ProductInstance,
  ProductInstanceParams,
  ProductSummary,
} from '../../clients/server.generated';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';
import { getSummary } from '../../stores/summaries/selectors';
import { SummaryCollections } from '../../stores/summaries/summaries';
import PropsButtons from '../PropsButtons';
import ProductSelector from './ProductSelector';
import { SingleEntities } from '../../stores/single/single';

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
  comments?: string;
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
      comments: productInstance.details,
    };
  };

  toParams = (): ProductInstanceParams => {
    return new ProductInstanceParams({
      productId: this.state.productId,
      basePrice: parseInt(this.state.basePrice, 10) * 100,
      discount: parseInt(this.state.discount, 10) * 100,
      comments: this.state.comments,
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

  deleteButtonActive() {
    if (this.props.create) {
      return undefined;
    }
    return !(this.props.contract.activities
      .filter((a) => a.type === ActivityType.STATUS).length > 1
      || this.props.productInstance.activities
        .filter((a) => a.type === ActivityType.STATUS).length > 1
      || this.props.productInstance.invoiceId === undefined);
  }

  render() {
    const {
      editing,
      basePrice,
      discount,
      comments,
      productId,
    } = this.state;

    return (
      <>
        <h2>
          {this.props.create ? 'New Product Instance' : 'Details'}

          <PropsButtons
            editing={editing}
            canDelete={this.deleteButtonActive()}
            entity={SingleEntities.Product}
            status={this.props.status}
            cancel={this.cancel}
            edit={this.edit}
            save={this.save}
            remove={this.remove}
          />
        </h2>

        <Form style={{ marginTop: '2em' }}>
          <Form.Group widths="equal">
            <Form.Field
              disabled={!editing}
            >
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-product-dropdown">Product</label>
              <ProductSelector
                id="form-assigned-to-selector"
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
              <label htmlFor="form-input-comments">
                Details
              </label>
              <Input
                id="form-delivery-spec-english"
                value={comments}
                onChange={
                  (e) => this.setState({ comments: e.target.value })
                }
                placeholder="Details"
                fluid
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              disabled={!editing}
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
            >
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-Discount">
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
                value={parseInt(basePrice, 10) - parseInt(discount, 10)}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  // eslint-disable-next-line no-restricted-globals
                  const value = isNaN(parseInt(e.target.value, 10)) ? 0
                    : parseInt(e.target.value, 10);
                  this.setState({
                    discount: (parseInt(basePrice, 10) - value).toString(),
                  });
                }}
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
